import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Settings, MoreHorizontal } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LeaveType {
  id: string;
  name: string;
  code: string;
  days_allowed: number;
  carry_forward: boolean;
  salary_payable: boolean;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

interface LeaveAccrualRule {
  id: string;
  leave_type_id: string;
  rule_type: string;
  accrual_value: number;
  frequency_days: number | null;
  frequency_months: number | null;
  max_days_per_year: number | null;
  applicable_after_days: number;
  apply_to_probation: boolean;
  min_working_days: number | null;
  min_attendance_required: number | null;
  custom_conditions: any;
  notes: string | null;
}

export default function LeaveTypes() {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLeaveType, setEditingLeaveType] = useState<LeaveType | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    days_allowed: 0,
    carry_forward: false,
    salary_payable: true,
    description: "",
    // Accrual rule fields integrated
    rule_type: "monthly",
    accrual_value: 0,
    frequency_days: null as number | null,
    frequency_months: 1,
    max_days_per_year: null as number | null,
    applicable_after_days: 0,
    apply_to_probation: true,
    min_working_days: null as number | null,
    min_attendance_required: null as number | null,
    custom_conditions: null as any,
    notes: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const fetchLeaveTypes = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('leave_types')
        .select('*')
        .eq('is_deleted', false)
        .order('name');

      if (error) throw error;
      setLeaveTypes(data || []);
    } catch (error) {
      console.error('Error fetching leave types:', error);
      toast({
        title: "Error",
        description: "Failed to fetch leave types",
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
      
      if (editingLeaveType) {
        // Update leave type
        const { error: leaveTypeError } = await (supabase as any)
          .from('leave_types')
          .update({
            name: formData.name,
            code: formData.code,
            days_allowed: formData.days_allowed,
            carry_forward: formData.carry_forward,
            salary_payable: formData.salary_payable,
            description: formData.description,
            updated_at: new Date().toISOString(),
            updated_by: user?.id,
          })
          .eq('id', editingLeaveType.id);

        if (leaveTypeError) throw leaveTypeError;

        // Check if accrual rule exists
        const { data: existingRule } = await (supabase as any)
          .from('leave_accrual_rules')
          .select('id')
          .eq('leave_type_id', editingLeaveType.id)
          .is('deleted_at', null)
          .single();

        if (existingRule) {
          // Update existing rule
          const { error: accrualError } = await (supabase as any)
            .from('leave_accrual_rules')
            .update({
              rule_type: formData.rule_type,
              accrual_value: formData.accrual_value,
              frequency_days: formData.frequency_days,
              frequency_months: formData.frequency_months,
              max_days_per_year: formData.max_days_per_year,
              applicable_after_days: formData.applicable_after_days,
              apply_to_probation: formData.apply_to_probation,
              min_working_days: formData.min_working_days,
              min_attendance_required: formData.min_attendance_required,
              custom_conditions: formData.custom_conditions,
              notes: formData.notes,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existingRule.id);

          if (accrualError) {
            console.error('Accrual rule update error:', accrualError);
            throw accrualError;
          }
        } else {
          // Create new accrual rule
          const { error: accrualError } = await (supabase as any)
            .from('leave_accrual_rules')
            .insert([{
              leave_type_id: editingLeaveType.id,
              rule_type: formData.rule_type,
              accrual_value: formData.accrual_value,
              frequency_days: formData.frequency_days,
              frequency_months: formData.frequency_months,
              max_days_per_year: formData.max_days_per_year,
              applicable_after_days: formData.applicable_after_days,
              apply_to_probation: formData.apply_to_probation,
              min_working_days: formData.min_working_days,
              min_attendance_required: formData.min_attendance_required,
              custom_conditions: formData.custom_conditions,
              notes: formData.notes,
            }]);

          if (accrualError) {
            console.error('Accrual rule insert error:', accrualError);
            throw accrualError;
          }
        }

        toast({
          title: "Success",
          description: "Leave type updated successfully",
        });
      } else {
        // Create new leave type
        const { data: newLeaveType, error: leaveTypeError } = await (supabase as any)
          .from('leave_types')
          .insert([{
            name: formData.name,
            code: formData.code,
            days_allowed: formData.days_allowed,
            carry_forward: formData.carry_forward,
            salary_payable: formData.salary_payable,
            description: formData.description,
            created_by: user?.id,
          }])
          .select()
          .single();

        if (leaveTypeError) throw leaveTypeError;

        // Always create accrual rule for new leave type
        const { error: accrualError } = await (supabase as any)
          .from('leave_accrual_rules')
          .insert([{
            leave_type_id: newLeaveType.id,
            rule_type: formData.rule_type,
            accrual_value: formData.accrual_value,
            frequency_days: formData.frequency_days,
            frequency_months: formData.frequency_months,
            max_days_per_year: formData.max_days_per_year,
            applicable_after_days: formData.applicable_after_days,
            apply_to_probation: formData.apply_to_probation,
            min_working_days: formData.min_working_days,
            min_attendance_required: formData.min_attendance_required,
            custom_conditions: formData.custom_conditions,
            notes: formData.notes,
          }]);

        if (accrualError) {
          console.error('Accrual rule error:', accrualError);
          throw accrualError;
        }

        toast({
          title: "Success",
          description: "Leave type created successfully",
        });
      }

      resetForm();
      setIsDialogOpen(false);
      setEditingLeaveType(null);
      fetchLeaveTypes();
    } catch (error: any) {
      console.error('Error saving leave type:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save leave type",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({ 
      name: "", 
      code: "", 
      days_allowed: 0, 
      carry_forward: false, 
      salary_payable: true, 
      description: "",
      rule_type: "monthly",
      accrual_value: 0,
      frequency_days: null,
      frequency_months: 1,
      max_days_per_year: null,
      applicable_after_days: 0,
      apply_to_probation: true,
      min_working_days: null,
      min_attendance_required: null,
      custom_conditions: null,
      notes: "",
    });
  };

  const handleEdit = async (leaveType: LeaveType) => {
    setEditingLeaveType(leaveType);
    
    // Fetch existing accrual rule for this leave type
    const { data: accrualRule } = await (supabase as any)
      .from('leave_accrual_rules')
      .select('*')
      .eq('leave_type_id', leaveType.id)
      .is('deleted_at', null)
      .single();

    setFormData({
      name: leaveType.name,
      code: leaveType.code || "",
      days_allowed: leaveType.days_allowed || 0,
      carry_forward: leaveType.carry_forward || false,
      salary_payable: leaveType.salary_payable || true,
      description: leaveType.description || "",
      // Populate accrual rule data if exists
      rule_type: accrualRule?.rule_type || "monthly",
      accrual_value: accrualRule?.accrual_value || 0,
      frequency_days: accrualRule?.frequency_days || null,
      frequency_months: accrualRule?.frequency_months || 1,
      max_days_per_year: accrualRule?.max_days_per_year || null,
      applicable_after_days: accrualRule?.applicable_after_days || 0,
      apply_to_probation: accrualRule?.apply_to_probation ?? true,
      min_working_days: accrualRule?.min_working_days || null,
      min_attendance_required: accrualRule?.min_attendance_required || null,
      custom_conditions: accrualRule?.custom_conditions || null,
      notes: accrualRule?.notes || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this leave type?")) return;

    try {
      const { error } = await (supabase as any)
        .from('leave_types')
        .update({ is_deleted: true })
        .eq('id', id);

      if (error) throw error;
      toast({
        title: "Success",
        description: "Leave type deleted successfully",
      });
      fetchLeaveTypes();
    } catch (error: any) {
      console.error('Error deleting leave type:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete leave type",
        variant: "destructive",
      });
    }
  };



  return (
    <Layout>
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Leave Types</h1>
            <p className="text-muted-foreground">Manage different types of leaves</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="w-full sm:w-auto"
                onClick={() => {
                  setEditingLeaveType(null);
                  resetForm();
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Leave Type
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingLeaveType ? "Edit Leave Type" : "Add Leave Type"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic">Basic Information</TabsTrigger>
                    <TabsTrigger value="accrual">Accrual Rules</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
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
                        <Label htmlFor="code">Code</Label>
                        <Input
                          id="code"
                          value={formData.code}
                          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="days_allowed">Days Allowed</Label>
                      <Input
                        id="days_allowed"
                        type="number"
                        value={formData.days_allowed}
                        onChange={(e) => setFormData({ ...formData, days_allowed: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="carry_forward"
                          checked={formData.carry_forward}
                          onCheckedChange={(checked) => setFormData({ ...formData, carry_forward: checked === true })}
                        />
                        <Label htmlFor="carry_forward">Allow Carry Forward</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="salary_payable"
                          checked={formData.salary_payable}
                          onCheckedChange={(checked) => setFormData({ ...formData, salary_payable: checked === true })}
                        />
                        <Label htmlFor="salary_payable">Salary Payable</Label>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="accrual" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="rule_type">Rule Type</Label>
                        <Select 
                          value={formData.rule_type} 
                          onValueChange={(value) => setFormData({ ...formData, rule_type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="accrual_value">Accrual Value (Days)</Label>
                        <Input
                          id="accrual_value"
                          type="number"
                          step="0.1"
                          value={formData.accrual_value}
                          onChange={(e) => setFormData({ ...formData, accrual_value: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="frequency_months">Frequency (Months)</Label>
                        <Input
                          id="frequency_months"
                          type="number"
                          value={formData.frequency_months || ""}
                          onChange={(e) => setFormData({ ...formData, frequency_months: parseInt(e.target.value) || null })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="frequency_days">Frequency (Days)</Label>
                        <Input
                          id="frequency_days"
                          type="number"
                          value={formData.frequency_days || ""}
                          onChange={(e) => setFormData({ ...formData, frequency_days: parseInt(e.target.value) || null })}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="max_days_per_year">Max Days Per Year</Label>
                        <Input
                          id="max_days_per_year"
                          type="number"
                          value={formData.max_days_per_year || ""}
                          onChange={(e) => setFormData({ ...formData, max_days_per_year: parseInt(e.target.value) || null })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="applicable_after_days">Applicable After Days</Label>
                        <Input
                          id="applicable_after_days"
                          type="number"
                          value={formData.applicable_after_days}
                          onChange={(e) => setFormData({ ...formData, applicable_after_days: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="min_working_days">Min Working Days</Label>
                        <Input
                          id="min_working_days"
                          type="number"
                          value={formData.min_working_days || ""}
                          onChange={(e) => setFormData({ ...formData, min_working_days: parseInt(e.target.value) || null })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="min_attendance_required">Min Attendance Required (%)</Label>
                        <Input
                          id="min_attendance_required"
                          type="number"
                          value={formData.min_attendance_required || ""}
                          onChange={(e) => setFormData({ ...formData, min_attendance_required: parseInt(e.target.value) || null })}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="apply_to_probation"
                        checked={formData.apply_to_probation}
                        onCheckedChange={(checked) => setFormData({ ...formData, apply_to_probation: checked === true })}
                      />
                      <Label htmlFor="apply_to_probation">Apply to Probation Period</Label>
                    </div>
                    
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Additional conditions or notes for this accrual rule"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingLeaveType ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Leave Types</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6">Loading...</div>
            ) : (
              <>
                {/* Mobile Card View */}
                <div className="block lg:hidden">
                  {leaveTypes.map((leaveType) => (
                    <div key={leaveType.id} className="border-b p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{leaveType.name}</h3>
                          <p className="text-sm text-muted-foreground">Code: {leaveType.code}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(leaveType)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(leaveType.id)} className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Days Allowed: </span>
                          {leaveType.days_allowed}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Status: </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            leaveType.is_active
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          }`}>
                            {leaveType.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Carry Forward: </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            leaveType.carry_forward
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                          }`}>
                            {leaveType.carry_forward ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Salary Payable: </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            leaveType.salary_payable
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          }`}>
                            {leaveType.salary_payable ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {leaveTypes.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No leave types found
                    </div>
                  )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Days Allowed</TableHead>
                        <TableHead>Carry Forward</TableHead>
                        <TableHead>Salary Payable</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaveTypes.map((leaveType) => (
                        <TableRow key={leaveType.id}>
                          <TableCell className="font-medium">{leaveType.name}</TableCell>
                          <TableCell>{leaveType.code}</TableCell>
                          <TableCell>{leaveType.days_allowed}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              leaveType.carry_forward
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                            }`}>
                              {leaveType.carry_forward ? 'Yes' : 'No'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              leaveType.salary_payable
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                            }`}>
                              {leaveType.salary_payable ? 'Yes' : 'No'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              leaveType.is_active
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                            }`}>
                              {leaveType.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(leaveType)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(leaveType.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {leaveTypes.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            No leave types found
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