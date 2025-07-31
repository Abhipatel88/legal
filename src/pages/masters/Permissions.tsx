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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Permission {
  id: string;
  name: string;
  module: string;
  can_view: boolean;
  can_add: boolean;
  can_edit: boolean;
  can_delete: boolean;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export default function Permissions() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    module: "",
    can_view: false,
    can_add: false,
    can_edit: false,
    can_delete: false,
    description: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('permissions')
        .select('*')
        .eq('is_deleted', false)
        .order('module', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      setPermissions(data || []);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch permissions",
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
      
      if (editingPermission) {
        const { error } = await (supabase as any)
          .from('permissions')
          .update({
            name: formData.name,
            module: formData.module,
            can_view: formData.can_view,
            can_add: formData.can_add,
            can_edit: formData.can_edit,
            can_delete: formData.can_delete,
            description: formData.description,
            updated_at: new Date().toISOString(),
            updated_by: user?.id,
          })
          .eq('id', editingPermission.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Permission updated successfully",
        });
      } else {
        const { error } = await (supabase as any)
          .from('permissions')
          .insert([{
            name: formData.name,
            module: formData.module,
            can_view: formData.can_view,
            can_add: formData.can_add,
            can_edit: formData.can_edit,
            can_delete: formData.can_delete,
            description: formData.description,
            created_by: user?.id,
          }]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Permission created successfully",
        });
      }

      setIsDialogOpen(false);
      setEditingPermission(null);
      setFormData({ 
        name: "", 
        module: "", 
        can_view: false, 
        can_add: false, 
        can_edit: false, 
        can_delete: false, 
        description: "" 
      });
      fetchPermissions();
    } catch (error: any) {
      console.error('Error saving permission:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save permission",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (permission: Permission) => {
    setEditingPermission(permission);
    setFormData({
      name: permission.name,
      module: permission.module,
      can_view: permission.can_view,
      can_add: permission.can_add,
      can_edit: permission.can_edit,
      can_delete: permission.can_delete,
      description: permission.description || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this permission?")) return;

    try {
      const { error } = await (supabase as any)
        .from('permissions')
        .update({ is_deleted: true })
        .eq('id', id);

      if (error) throw error;
      toast({
        title: "Success",
        description: "Permission deleted successfully",
      });
      fetchPermissions();
    } catch (error: any) {
      console.error('Error deleting permission:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete permission",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Permissions</h1>
            <p className="text-muted-foreground">Manage system permissions</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="w-full sm:w-auto"
                onClick={() => {
                  setEditingPermission(null);
                  setFormData({
                    name: "",
                    module: "",
                    can_view: false,
                    can_add: false,
                    can_edit: false,
                    can_delete: false,
                    description: ""
                  });
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Permission
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingPermission ? "Edit Permission" : "Add Permission"}
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
                  <Label htmlFor="module">Module *</Label>
                  <Input
                    id="module"
                    value={formData.module}
                    onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label>Actions</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="can_view"
                        checked={formData.can_view}
                        onCheckedChange={(checked) => setFormData({ ...formData, can_view: checked === true })}
                      />
                      <Label htmlFor="can_view">View</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="can_add"
                        checked={formData.can_add}
                        onCheckedChange={(checked) => setFormData({ ...formData, can_add: checked === true })}
                      />
                      <Label htmlFor="can_add">Add</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="can_edit"
                        checked={formData.can_edit}
                        onCheckedChange={(checked) => setFormData({ ...formData, can_edit: checked === true })}
                      />
                      <Label htmlFor="can_edit">Edit</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="can_delete"
                        checked={formData.can_delete}
                        onCheckedChange={(checked) => setFormData({ ...formData, can_delete: checked === true })}
                      />
                      <Label htmlFor="can_delete">Delete</Label>
                    </div>
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
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingPermission ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Permissions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6">Loading...</div>
            ) : (
              <>
                {/* Mobile Card View */}
                <div className="block lg:hidden">
                  {permissions.map((permission) => (
                    <div key={permission.id} className="border-b p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{permission.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Module: {permission.module}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(permission)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(permission.id)} className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">View:</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            permission.can_view
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                          }`}>
                            {permission.can_view ? '✓' : '✗'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Add:</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            permission.can_add
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                          }`}>
                            {permission.can_add ? '✓' : '✗'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Edit:</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            permission.can_edit
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                          }`}>
                            {permission.can_edit ? '✓' : '✗'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Delete:</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            permission.can_delete
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                          }`}>
                            {permission.can_delete ? '✓' : '✗'}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          permission.is_active
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}>
                          {permission.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  ))}
                  {permissions.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No permissions found
                    </div>
                  )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Module</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>View</TableHead>
                        <TableHead>Add</TableHead>
                        <TableHead>Edit</TableHead>
                        <TableHead>Delete</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {permissions.map((permission) => (
                        <TableRow key={permission.id}>
                          <TableCell className="font-medium">{permission.module}</TableCell>
                          <TableCell>{permission.name}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              permission.can_view
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                            }`}>
                              {permission.can_view ? '✓' : '✗'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              permission.can_add
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                            }`}>
                              {permission.can_add ? '✓' : '✗'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              permission.can_edit
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                            }`}>
                              {permission.can_edit ? '✓' : '✗'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              permission.can_delete
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                            }`}>
                              {permission.can_delete ? '✓' : '✗'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              permission.is_active
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                            }`}>
                              {permission.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(permission)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(permission.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {permissions.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            No permissions found
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