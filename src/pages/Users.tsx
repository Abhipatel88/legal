import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Plus, Search, Edit, Trash2, Eye, MoreHorizontal } from "lucide-react"
import { Layout } from "@/components/Layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  first_name: string
  last_name: string
  personal_email: string
  phone: string
  is_active: boolean
  created_at: string
  user_roles: {
    roles: {
      name: string
    }
  }[]
  employees: {
    employee_code: string
    company_email: string
  } | null
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          id,
          first_name,
          last_name,
          personal_email,
          phone,
          is_active,
          created_at
        `)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Fetch user roles and employees separately to avoid complex joins
      const userIds = data?.map(user => user.id) || []
      
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          roles (
            name
          )
        `)
        .in('user_id', userIds)
        .eq('is_active', true)

      const { data: employees, error: employeesError } = await supabase
        .from('employees')
        .select(`
          user_id,
          employee_code,
          company_email
        `)
        .in('user_id', userIds)
        .eq('is_active', true)

      if (rolesError) throw rolesError
      if (employeesError) throw employeesError

      // Combine the data
      const combinedData = data?.map(user => ({
        ...user,
        user_roles: userRoles?.filter(role => role.user_id === user.id) || [],
        employees: employees?.find(emp => emp.user_id === user.id) || null
      })) || []

      setUsers(combinedData)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user =>
    user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.personal_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.employees?.employee_code?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleView = (user: User) => {
    setSelectedUser(user)
    setViewDialogOpen(true)
  }

  const handleEdit = (userId: string) => {
    navigate(`/users/edit/${userId}`)
  }

  const handleDelete = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const { error } = await supabase
          .from('user_profiles')
          .update({ is_deleted: true })
          .eq('id', userId)
        
        if (error) throw error
        
        toast({
          title: "Success",
          description: "User deleted successfully",
        })
        fetchUsers()
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete user",
          variant: "destructive",
        })
      }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading users...</div>
      </div>
    )
  }

  return (
    <Layout>
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Users</h1>
            <p className="text-muted-foreground">Manage user accounts and roles</p>
          </div>
          <Link to="/users/add">
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </Link>
        </div>

      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Mobile Card View */}
          <div className="block md:hidden">
            {filteredUsers.map((user) => (
              <div key={user.id} className="border-b p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{user.first_name} {user.last_name}</h3>
                    <p className="text-sm text-muted-foreground">{user.personal_email}</p>
                    {user.employees?.company_email && (
                      <p className="text-sm text-muted-foreground">{user.employees.company_email}</p>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(user)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(user.id)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(user.id)} className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex flex-wrap gap-2">
                  {user.user_roles.map((userRole, index) => (
                    <Badge key={index} variant="secondary">
                      {userRole.roles.name}
                    </Badge>
                  ))}
                  <Badge variant={user.is_active ? "default" : "secondary"}>
                    {user.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                {user.employees?.employee_code && (
                  <p className="text-sm">Code: {user.employees.employee_code}</p>
                )}
                {user.phone && (
                  <p className="text-sm">Phone: {user.phone}</p>
                )}
              </div>
            ))}
            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No users found
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Employee Code</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.first_name} {user.last_name}
                    </TableCell>
                    <TableCell>
                      <div>
                        {user.personal_email && (
                          <div className="text-sm">{user.personal_email}</div>
                        )}
                        {user.employees?.company_email && (
                          <div className="text-sm text-muted-foreground">
                            {user.employees.company_email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{user.phone || '-'}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.user_roles.map((userRole, index) => (
                          <Badge key={index} variant="secondary">
                            {userRole.roles.name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{user.employees?.employee_code || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={user.is_active ? "default" : "secondary"}>
                        {user.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleView(user)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(user.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View User Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <p className="text-sm text-muted-foreground">
                    {selectedUser.first_name} {selectedUser.last_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Personal Email</label>
                  <p className="text-sm text-muted-foreground">
                    {selectedUser.personal_email || '-'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Company Email</label>
                  <p className="text-sm text-muted-foreground">
                    {selectedUser.employees?.company_email || '-'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <p className="text-sm text-muted-foreground">
                    {selectedUser.phone || '-'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Employee Code</label>
                  <p className="text-sm text-muted-foreground">
                    {selectedUser.employees?.employee_code || '-'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <div className="mt-1">
                    <Badge variant={selectedUser.is_active ? "default" : "secondary"}>
                      {selectedUser.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Roles</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedUser.user_roles.map((userRole, index) => (
                    <Badge key={index} variant="secondary">
                      {userRole.roles.name}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Created At</label>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedUser.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </Layout>
  )
}