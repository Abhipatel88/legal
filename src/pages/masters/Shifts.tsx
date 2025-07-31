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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Shift {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  break_duration: number;
  grace_period: number;
  is_active: boolean;
  created_at: string;
}

export default function Shifts() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    start_time: "",
    end_time: "",
    break_duration: 0,
    grace_period: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('shifts')
        .select('*')
        .eq('is_deleted', false)
        .order('name');

      if (error) throw error;
      setShifts(data || []);
    } catch (error) {
      console.error('Error fetching shifts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch shifts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingShift) {
        const { error } = await (supabase as any)
          .from('shifts')
          .update({
            name: formData.name,
            start_time: formData.start_time,
            end_time: formData.end_time,
            break_duration: formData.break_duration,
            grace_period: formData.grace_period,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingShift.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Shift updated successfully",
        });
      } else {
        const { error } = await (supabase as any)
          .from('shifts')
          .insert([{
            name: formData.name,
            start_time: formData.start_time,
            end_time: formData.end_time,
            break_duration: formData.break_duration,
            grace_period: formData.grace_period,
          }]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Shift created successfully",
        });
      }

      setIsDialogOpen(false);
      setEditingShift(null);
      setFormData({ name: "", start_time: "", end_time: "", break_duration: 0, grace_period: 0 });
      fetchShifts();
    } catch (error: any) {
      console.error('Error saving shift:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save shift",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (shift: Shift) => {
    setEditingShift(shift);
    setFormData({
      name: shift.name,
      start_time: shift.start_time,
      end_time: shift.end_time,
      break_duration: shift.break_duration || 0,
      grace_period: shift.grace_period || 0,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this shift?")) return;

    try {
      const { error } = await (supabase as any)
        .from('shifts')
        .update({ is_deleted: true })
        .eq('id', id);

      if (error) throw error;
      toast({
        title: "Success",
        description: "Shift deleted successfully",
      });
      fetchShifts();
    } catch (error: any) {
      console.error('Error deleting shift:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete shift",
        variant: "destructive",
      });
    }
  };

  const formatTime = (time: string) => {
    if (!time) return '';
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Layout>
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Shifts</h1>
            <p className="text-muted-foreground">Manage work shifts and schedules</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="w-full sm:w-auto"
                onClick={() => {
                  setEditingShift(null);
                  setFormData({ name: "", start_time: "", end_time: "", break_duration: 0, grace_period: 0 });
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Shift
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingShift ? "Edit Shift" : "Add Shift"}
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_time">Start Time *</Label>
                    <Input
                      id="start_time"
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_time">End Time *</Label>
                    <Input
                      id="end_time"
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="break_duration">Break Duration (minutes)</Label>
                    <Input
                      id="break_duration"
                      type="number"
                      value={formData.break_duration}
                      onChange={(e) => setFormData({ ...formData, break_duration: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="grace_period">Grace Period (minutes)</Label>
                    <Input
                      id="grace_period"
                      type="number"
                      value={formData.grace_period}
                      onChange={(e) => setFormData({ ...formData, grace_period: parseInt(e.target.value) || 0 })}
                    />
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
                    {editingShift ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Shifts</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6">Loading...</div>
            ) : (
              <>
                {/* Mobile Card View */}
                <div className="block lg:hidden">
                  {shifts.map((shift) => (
                    <div key={shift.id} className="border-b p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{shift.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {formatTime(shift.start_time)} - {formatTime(shift.end_time)}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(shift)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(shift.id)} className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Break: </span>
                          {shift.break_duration} mins
                        </div>
                        <div>
                          <span className="text-muted-foreground">Grace: </span>
                          {shift.grace_period} mins
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          shift.is_active
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}>
                          {shift.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  ))}
                  {shifts.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No shifts found
                    </div>
                  )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Start Time</TableHead>
                        <TableHead>End Time</TableHead>
                        <TableHead>Break Duration</TableHead>
                        <TableHead>Grace Period</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {shifts.map((shift) => (
                        <TableRow key={shift.id}>
                          <TableCell className="font-medium">{shift.name}</TableCell>
                          <TableCell>{formatTime(shift.start_time)}</TableCell>
                          <TableCell>{formatTime(shift.end_time)}</TableCell>
                          <TableCell>{shift.break_duration} mins</TableCell>
                          <TableCell>{shift.grace_period} mins</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              shift.is_active
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                            }`}>
                              {shift.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(shift)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(shift.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {shifts.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            No shifts found
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