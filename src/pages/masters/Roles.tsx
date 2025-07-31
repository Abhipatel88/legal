import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Shield, MoreHorizontal } from "lucide-react";
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

interface Role {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

interface Permission {
  id: string;
  name: string;
  module: string;
  can_view: boolean;
  can_add: boolean;
  can_edit: boolean;
  can_delete: boolean;
}

export default function Roles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [rolePermissions, setRolePermissions] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('roles')
        .select('*')
        .eq('is_deleted', false)
        .order('name');

      if (error) throw error;
      setRoles(data || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast({
        title: "Error",
        description: "Failed to fetch roles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
    }
  };

  const fetchRolePermissions = async (roleId: string) => {
    try {
      const { data, error } = await (supabase as any)
        .from('role_permissions')
        .select('permission_id')
        .eq('role_id', roleId)
        .eq('is_active', true);

      if (error) throw error;
      setRolePermissions(data?.map((rp: any) => rp.permission_id) || []);
    } catch (error) {
      console.error('Error fetching role permissions:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingRole) {
        const { data: { user } } = await supabase.auth.getUser();
        const { error } = await (supabase as any)
          .from('roles')
          .update({
            name: formData.name,
            description: formData.description,
            updated_at: new Date().toISOString(),
            updated_by: user?.id,
          })
          .eq('id', editingRole.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Role updated successfully",
        });
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        const { error } = await (supabase as any)
          .from('roles')
          .insert([{
            name: formData.name,
            description: formData.description,
            created_by: user?.id,
          }]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Role created successfully",
        });
      }

      setIsDialogOpen(false);
      setEditingRole(null);
      setFormData({ name: "", description: "" });
      fetchRoles();
    } catch (error: any) {
      console.error('Error saving role:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save role",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this role?")) return;

    try {
      const { error } = await (supabase as any)
        .from('roles')
        .update({ is_deleted: true })
        .eq('id', id);

      if (error) throw error;
      toast({
        title: "Success",
        description: "Role deleted successfully",
      });
      fetchRoles();
    } catch (error: any) {
      console.error('Error deleting role:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete role",
        variant: "destructive",
      });
    }
  };

  const handleManagePermissions = async (role: Role) => {
    setSelectedRole(role);
    await fetchRolePermissions(role.id);
    setIsPermissionDialogOpen(true);
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setRolePermissions([...rolePermissions, permissionId]);
    } else {
      setRolePermissions(rolePermissions.filter(id => id !== permissionId));
    }
  };

  const handleSavePermissions = async () => {
    if (!selectedRole) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // First, deactivate all existing role permissions
      await (supabase as any)
        .from('role_permissions')
        .update({ is_active: false })
        .eq('role_id', selectedRole.id);

      // Then, insert/activate selected permissions
      if (rolePermissions.length > 0) {
        const rolePermissionData = rolePermissions.map(permissionId => ({
          role_id: selectedRole.id,
          permission_id: permissionId,
          is_active: true,
          created_by: user?.id,
        }));

        const { error } = await (supabase as any)
          .from('role_permissions')
          .upsert(rolePermissionData, {
            onConflict: 'role_id,permission_id'
          });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Role permissions updated successfully",
      });
      setIsPermissionDialogOpen(false);
    } catch (error: any) {
      console.error('Error saving permissions:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save permissions",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Roles</h1>
            <p className="text-muted-foreground">Manage user roles and permissions</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="w-full sm:w-auto"
                onClick={() => {
                  setEditingRole(null);
                  setFormData({ name: "", description: "" });
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Role
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingRole ? "Edit Role" : "Add Role"}
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
                    {editingRole ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Roles</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6">Loading...</div>
            ) : (
              <>
                {/* Mobile Card View */}
                <div className="block lg:hidden">
                  {roles.map((role) => (
                    <div key={role.id} className="border-b p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{role.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {role.description || 'No description'}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(role)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleManagePermissions(role)}>
                              <Shield className="h-4 w-4 mr-2" />
                              Permissions
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(role.id)} className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          role.is_active
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}>
                          {role.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(role.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  {roles.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No roles found
                    </div>
                  )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {roles.map((role) => (
                        <TableRow key={role.id}>
                          <TableCell className="font-medium">{role.name}</TableCell>
                          <TableCell>{role.description}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              role.is_active
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                            }`}>
                              {role.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </TableCell>
                          <TableCell>
                            {new Date(role.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(role)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleManagePermissions(role)}
                              >
                                <Shield className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(role.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {roles.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            No roles found
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

        {/* Permissions Dialog */}
        <Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                Manage Permissions for {selectedRole?.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {permissions.reduce((groups: any, permission) => {
                if (!groups[permission.module]) {
                  groups[permission.module] = [];
                }
                groups[permission.module].push(permission);
                return groups;
              }, {}) && Object.entries(permissions.reduce((groups: any, permission) => {
                if (!groups[permission.module]) {
                  groups[permission.module] = [];
                }
                groups[permission.module].push(permission);
                return groups;
              }, {})).map(([module, modulePermissions]: [string, any[]]) => (
                <div key={module} className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase">
                    {module}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {modulePermissions.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={permission.id}
                          checked={rolePermissions.includes(permission.id)}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(permission.id, checked === true)
                          }
                        />
                        <Label htmlFor={permission.id} className="text-sm">
                          {permission.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPermissionDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSavePermissions}>
                Save Permissions
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}