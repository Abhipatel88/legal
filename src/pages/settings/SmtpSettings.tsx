import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SmtpSettings {
  id: string;
  host: string;
  port: number;
  username: string;
  password: string;
  encryption: string;
  from_email: string;
  from_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export default function SmtpSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    host: "",
    port: 587,
    username: "",
    password: "",
    encryption: "tls",
    from_email: "",
    from_name: "",
  });
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSmtpSettings();
  }, []);

  const fetchSmtpSettings = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('smtp_settings')
        .select('*')
        .eq('is_deleted', false)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setSettingsId(data.id);
        setFormData({
          host: data.host || "",
          port: data.port || 587,
          username: data.username || "",
          password: data.password || "",
          encryption: data.encryption || "tls",
          from_email: data.from_email || "",
          from_name: data.from_name || "",
        });
      }
    } catch (error) {
      console.error('Error fetching SMTP settings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch SMTP settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (settingsId) {
        // Update existing settings
        const { error } = await (supabase as any)
          .from('smtp_settings')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
            updated_by: user?.id,
          })
          .eq('id', settingsId);

        if (error) throw error;
      } else {
        // Deactivate any existing settings first
        await (supabase as any)
          .from('smtp_settings')
          .update({ is_active: false })
          .eq('is_active', true);

        // Create new settings
        const { data, error } = await (supabase as any)
          .from('smtp_settings')
          .insert([{
            ...formData,
            created_by: user?.id,
          }])
          .select('id')
          .single();

        if (error) throw error;
        setSettingsId(data.id);
      }

      toast({
        title: "Success",
        description: "SMTP settings saved successfully",
      });
    } catch (error: any) {
      console.error('Error saving SMTP settings:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save SMTP settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const testSmtpConnection = async () => {
    try {
      setSaving(true);
      // You would implement the actual SMTP test here
      // For now, just show a success message
      toast({
        title: "Test Email",
        description: "SMTP connection test is not implemented yet",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to test SMTP connection",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div>Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 p-4 md:p-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">SMTP Settings</h1>
          <p className="text-muted-foreground">Configure email server settings</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Email Server Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="host">SMTP Host *</Label>
                  <Input
                    id="host"
                    value={formData.host}
                    onChange={(e) => handleInputChange('host', e.target.value)}
                    placeholder="smtp.gmail.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="port">Port *</Label>
                  <Input
                    id="port"
                    type="number"
                    value={formData.port}
                    onChange={(e) => handleInputChange('port', parseInt(e.target.value) || 587)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="encryption">Encryption</Label>
                  <Select 
                    value={formData.encryption} 
                    onValueChange={(value) => handleInputChange('encryption', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="ssl">SSL</SelectItem>
                      <SelectItem value="tls">TLS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="from_email">From Email *</Label>
                  <Input
                    id="from_email"
                    type="email"
                    value={formData.from_email}
                    onChange={(e) => handleInputChange('from_email', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="from_name">From Name</Label>
                  <Input
                    id="from_name"
                    value={formData.from_name}
                    onChange={(e) => handleInputChange('from_name', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={testSmtpConnection}
                  disabled={saving}
                >
                  Test Connection
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </Layout>
  );
}