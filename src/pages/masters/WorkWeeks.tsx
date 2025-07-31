import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface WorkWeek {
  id: string;
  name: string;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
  
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export default function WorkWeeks() {
  const [workWeeks, setWorkWeeks] = useState<WorkWeek[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWorkWeek, setEditingWorkWeek] = useState<WorkWeek | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchWorkWeeks();
  }, []);

  const fetchWorkWeeks = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('work_weeks')
        .select('*')
        .eq('is_deleted', false)
        .order('name');

      if (error) throw error;
      setWorkWeeks(data || []);
    } catch (error) {
      console.error('Error fetching work weeks:', error);
      toast({
        title: "Error",
        description: "Failed to fetch work weeks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (editingWorkWeek) {
        const { error } = await (supabase as any)
          .from('work_weeks')
          .update({
            name: formData.name,
            monday: formData.monday,
            tuesday: formData.tuesday,
            wednesday: formData.wednesday,
            thursday: formData.thursday,
            friday: formData.friday,
            saturday: formData.saturday,
            sunday: formData.sunday,
            updated_at: new Date().toISOString(),
            updated_by: user?.id,
          })
          .eq('id', editingWorkWeek.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Work week updated successfully",
        });
      } else {
        const { error } = await (supabase as any)
          .from('work_weeks')
          .insert([{
            name: formData.name,
            monday: formData.monday,
            tuesday: formData.tuesday,
            wednesday: formData.wednesday,
            thursday: formData.thursday,
            friday: formData.friday,
            saturday: formData.saturday,
            sunday: formData.sunday,
            created_by: user?.id,
          }]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Work week created successfully",
        });
      }

      setIsDialogOpen(false);
      setEditingWorkWeek(null);
      setFormData({ 
        name: "", 
        monday: true, 
        tuesday: true, 
        wednesday: true, 
        thursday: true, 
        friday: true, 
        saturday: false, 
        sunday: false 
      });
      fetchWorkWeeks();
    } catch (error: any) {
      console.error('Error saving work week:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save work week",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (workWeek: WorkWeek) => {
    setEditingWorkWeek(workWeek);
    setFormData({
      name: workWeek.name,
      monday: workWeek.monday,
      tuesday: workWeek.tuesday,
      wednesday: workWeek.wednesday,
      thursday: workWeek.thursday,
      friday: workWeek.friday,
      saturday: workWeek.saturday,
      sunday: workWeek.sunday,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this work week?")) return;

    try {
      const { error } = await (supabase as any)
        .from('work_weeks')
        .update({ is_deleted: true })
        .eq('id', id);

      if (error) throw error;
      toast({
        title: "Success",
        description: "Work week deleted successfully",
      });
      fetchWorkWeeks();
    } catch (error: any) {
      console.error('Error deleting work week:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete work week",
        variant: "destructive",
      });
    }
  };

  const getDaysString = (workWeek: WorkWeek) => {
    const days = [];
    if (workWeek.monday) days.push('Mon');
    if (workWeek.tuesday) days.push('Tue');
    if (workWeek.wednesday) days.push('Wed');
    if (workWeek.thursday) days.push('Thu');
    if (workWeek.friday) days.push('Fri');
    if (workWeek.saturday) days.push('Sat');
    if (workWeek.sunday) days.push('Sun');
    return days.join(', ');
  };

  return (
    <Layout>
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Work Weeks</h1>
            <p className="text-muted-foreground">Manage work week patterns</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="w-full sm:w-auto"
                onClick={() => {
                  setEditingWorkWeek(null);
                  setFormData({
                    name: "",
                    monday: true,
                    tuesday: true,
                    wednesday: true,
                    thursday: true,
                    friday: true,
                    saturday: false,
                    sunday: false
                  });
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Work Week
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingWorkWeek ? "Edit Work Week" : "Add Work Week"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Working Days</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {[
                      { key: 'monday', label: 'Monday' },
                      { key: 'tuesday', label: 'Tuesday' },
                      { key: 'wednesday', label: 'Wednesday' },
                      { key: 'thursday', label: 'Thursday' },
                      { key: 'friday', label: 'Friday' },
                      { key: 'saturday', label: 'Saturday' },
                      { key: 'sunday', label: 'Sunday' },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={key}
                          checked={formData[key as keyof typeof formData] as boolean}
                          onCheckedChange={(checked) => 
                            setFormData({ ...formData, [key]: checked === true })
                          }
                        />
                        <Label htmlFor={key}>{label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingWorkWeek ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Work Weeks</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6">Loading...</div>
            ) : (
              <>
                {/* Mobile Card View */}
                <div className="block md:hidden">
                  {workWeeks.map((workWeek) => (
                    <div key={workWeek.id} className="border-b p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{workWeek.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {getDaysString(workWeek)}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(workWeek)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(workWeek.id)} className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          workWeek.is_active
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}>
                          {workWeek.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  ))}
                  {workWeeks.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No work weeks found
                    </div>
                  )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Working Days</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {workWeeks.map((workWeek) => (
                        <TableRow key={workWeek.id}>
                          <TableCell className="font-medium">{workWeek.name}</TableCell>
                          <TableCell>{getDaysString(workWeek)}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              workWeek.is_active
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                            }`}>
                              {workWeek.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(workWeek)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(workWeek.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {workWeeks.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8">
                            No work weeks found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}