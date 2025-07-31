import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Layout } from "@/components/Layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface EmployeeData {
  id: string
  employee_code: string
  company_email: string
  employment_status: string
  is_active: boolean
  user_profiles: {
    first_name: string
    last_name: string
    middle_name: string
    personal_email: string
    phone: string
    date_of_birth: string
    gender: string
    city: string
    state: string
    address: string
    pincode: string
  }
}

export default function EditEmployee() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [employee, setEmployee] = useState<EmployeeData | null>(null)
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    personal_email: "",
    phone: "",
    date_of_birth: "",
    gender: "",
    city: "",
    state: "",
    address: "",
    pincode: "",
    company_email: "",
    employment_status: "",
    is_active: true
  })

  useEffect(() => {
    if (id) {
      fetchEmployee()
    }
  }, [id])

  const fetchEmployee = async () => {
    try {
      const { data: employeeData, error } = await supabase
        .from('employees')
        .select(`
          id,
          employee_code,
          company_email,
          employment_status,
          is_active,
          user_id
        `)
        .eq('id', id)
        .single()

      if (error) throw error

      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', employeeData.user_id)
        .single()

      if (profileError) throw profileError

      const combinedData = {
        ...employeeData,
        user_profiles: profileData
      }

      setEmployee(combinedData)
      setFormData({
        first_name: profileData.first_name || "",
        middle_name: profileData.middle_name || "",
        last_name: profileData.last_name || "",
        personal_email: profileData.personal_email || "",
        phone: profileData.phone || "",
        date_of_birth: profileData.date_of_birth || "",
        gender: profileData.gender || "",
        city: profileData.city || "",
        state: profileData.state || "",
        address: profileData.address || "",
        pincode: profileData.pincode || "",
        company_email: employeeData.company_email || "",
        employment_status: employeeData.employment_status || "",
        is_active: employeeData.is_active
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch employee details",
        variant: "destructive",
      })
      navigate('/employees')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (!employee) return

      // Update user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          first_name: formData.first_name,
          middle_name: formData.middle_name || null,
          last_name: formData.last_name,
          personal_email: formData.personal_email,
          phone: formData.phone || null,
          date_of_birth: formData.date_of_birth || null,
          gender: formData.gender || null,
          city: formData.city || null,
          state: formData.state || null,
          address: formData.address || null,
          pincode: formData.pincode || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', employee.user_profiles.id)

      if (profileError) throw profileError

      // Update employee record
      const { error: employeeError } = await supabase
        .from('employees')
        .update({
          company_email: formData.company_email,
          employment_status: formData.employment_status,
          is_active: formData.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (employeeError) throw employeeError

      toast({
        title: "Success",
        description: "Employee updated successfully",
      })
      navigate('/employees')
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update employee",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </Layout>
    )
  }

  if (!employee) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p>Employee not found</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <Button variant="ghost" onClick={() => navigate('/employees')} className="self-start">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Employees
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Edit Employee</h1>
            <p className="text-muted-foreground">Update employee information</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-4 md:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">First Name *</Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name *</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="middle_name">Middle Name</Label>
                  <Input
                    id="middle_name"
                    value={formData.middle_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, middle_name: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="personal_email">Personal Email *</Label>
                  <Input
                    id="personal_email"
                    type="email"
                    value={formData.personal_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, personal_email: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Address & Employment Details */}
            <Card>
              <CardHeader>
                <CardTitle>Address & Employment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="company_email">Company Email</Label>
                  <Input
                    id="company_email"
                    type="email"
                    value={formData.company_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, company_email: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="employment_status">Employment Status</Label>
                  <Select value={formData.employment_status} onValueChange={(value) => setFormData(prev => ({ ...prev, employment_status: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="terminated">Terminated</SelectItem>
                      <SelectItem value="on_leave">On Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => navigate('/employees')}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  )
}