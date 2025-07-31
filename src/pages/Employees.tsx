import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Plus, Search, Edit, Trash2, Eye, MoreHorizontal } from "lucide-react"
import { Layout } from "@/components/Layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface Employee {
  id: string
  employee_code: string
  company_email: string
  hire_date: string
  employment_status: string
  is_active: boolean
  created_at: string
  user_profiles: {
    first_name: string
    last_name: string
    personal_email: string
    phone: string
  }
  departments: {
    name: string
  } | null
  designations: {
    title: string
  } | null
}

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      const { data: employeeData, error } = await supabase
        .from('employees')
        .select(`
          id,
          user_id,
          employee_code,
          company_email,
          hire_date,
          employment_status,
          is_active,
          created_at,
          department_id,
          designation_id
        `)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Get user IDs
      const userIds = employeeData?.map(emp => emp.user_id) || []
      
      // Fetch user profiles
      const { data: profiles } = await supabase
        .from('user_profiles')
        .select('id, first_name, last_name, personal_email, phone')
        .in('id', userIds)

      // Fetch departments
      const departmentIds = employeeData?.map(emp => emp.department_id).filter(Boolean) || []
      const { data: departments } = departmentIds.length > 0 ? await supabase
        .from('departments')
        .select('id, name')
        .in('id', departmentIds) : { data: [] }

      // Fetch designations
      const designationIds = employeeData?.map(emp => emp.designation_id).filter(Boolean) || []
      const { data: designations } = designationIds.length > 0 ? await supabase
        .from('designations')
        .select('id, title')
        .in('id', designationIds) : { data: [] }

      // Combine data
      const combinedData = employeeData?.map(employee => ({
        ...employee,
        user_profiles: profiles?.find(p => p.id === employee.user_id) || {
          first_name: '',
          last_name: '',
          personal_email: '',
          phone: ''
        },
        departments: departments?.find(d => d.id === employee.department_id) || null,
        designations: designations?.find(d => d.id === employee.designation_id) || null
      })) || []

      setEmployees(combinedData)
    } catch (error) {
      console.error('Error fetching employees:', error)
      toast({
        title: "Error",
        description: "Failed to fetch employees",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredEmployees = employees.filter(employee =>
    employee.user_profiles.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.user_profiles.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.employee_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.company_email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleView = (employee: Employee) => {
    setSelectedEmployee(employee)
    setViewDialogOpen(true)
  }

  const handleEdit = (employeeId: string) => {
    navigate(`/employees/edit/${employeeId}`)
  }

  const handleDelete = async (employeeId: string) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      try {
        const { error } = await supabase
          .from('employees')
          .update({ is_deleted: true })
          .eq('id', employeeId)
        
        if (error) throw error
        
        toast({
          title: "Success",
          description: "Employee deleted successfully",
        })
        fetchEmployees()
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete employee",
          variant: "destructive",
        })
      }
    }
  }

  const handleToggleStatus = async (employeeId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('employees')
        .update({ is_active: !currentStatus })
        .eq('id', employeeId)
      
      if (error) throw error
      
      toast({
        title: "Success",
        description: `Employee ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      })
      fetchEmployees()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update employee status",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading employees...</div>
      </div>
    )
  }

  return (
    <Layout>
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Employees</h1>
            <p className="text-muted-foreground">Manage employee records</p>
          </div>
          <Link to="/employees/add">
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Employee List</CardTitle>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Mobile Card View */}
            <div className="block md:hidden">
              {filteredEmployees.map((employee) => (
                <div key={employee.id} className="border-b p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{employee.user_profiles.first_name} {employee.user_profiles.last_name}</h3>
                      <p className="text-sm text-muted-foreground">{employee.company_email}</p>
                      <p className="text-sm text-muted-foreground">Code: {employee.employee_code}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(employee)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(employee.id)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(employee.id)} className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={employee.is_active}
                        onCheckedChange={() => handleToggleStatus(employee.id, employee.is_active)}
                        size="sm"
                      />
                      <span className="text-sm">{employee.is_active ? "Active" : "Inactive"}</span>
                    </div>
                    <Badge variant="outline">
                      {employee.employment_status}
                    </Badge>
                  </div>
                  {employee.departments && (
                    <p className="text-sm">Department: {employee.departments.name}</p>
                  )}
                  {employee.designations && (
                    <p className="text-sm">Designation: {employee.designations.title}</p>
                  )}
                </div>
              ))}
              {filteredEmployees.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No employees found
                </div>
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Employee Code</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">
                        {employee.user_profiles.first_name} {employee.user_profiles.last_name}
                      </TableCell>
                      <TableCell>{employee.employee_code}</TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">{employee.company_email}</div>
                          {employee.user_profiles.personal_email && (
                            <div className="text-sm text-muted-foreground">
                              {employee.user_profiles.personal_email}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{employee.departments?.name || '-'}</TableCell>
                      <TableCell>{employee.designations?.title || '-'}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2 items-center">
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={employee.is_active}
                              onCheckedChange={() => handleToggleStatus(employee.id, employee.is_active)}
                              size="sm"
                            />
                            <span className="text-sm">{employee.is_active ? "Active" : "Inactive"}</span>
                          </div>
                          <Badge variant="outline">
                            {employee.employment_status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleView(employee)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(employee.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(employee.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredEmployees.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No employees found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* View Employee Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Employee Details</DialogTitle>
            </DialogHeader>
            {selectedEmployee && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <p className="text-sm text-muted-foreground">
                      {selectedEmployee.user_profiles.first_name} {selectedEmployee.user_profiles.last_name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Employee Code</label>
                    <p className="text-sm text-muted-foreground">
                      {selectedEmployee.employee_code}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Company Email</label>
                    <p className="text-sm text-muted-foreground">
                      {selectedEmployee.company_email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Personal Email</label>
                    <p className="text-sm text-muted-foreground">
                      {selectedEmployee.user_profiles.personal_email || '-'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <p className="text-sm text-muted-foreground">
                      {selectedEmployee.user_profiles.phone || '-'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Hire Date</label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedEmployee.hire_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Department</label>
                    <p className="text-sm text-muted-foreground">
                      {selectedEmployee.departments?.name || '-'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Designation</label>
                    <p className="text-sm text-muted-foreground">
                      {selectedEmployee.designations?.title || '-'}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <div className="flex gap-2 mt-1">
                    <Badge variant={selectedEmployee.is_active ? "default" : "secondary"}>
                      {selectedEmployee.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline">
                      {selectedEmployee.employment_status}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  )
}