import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Eye, EyeOff, ChevronLeft, ChevronRight, User, Briefcase, Clock, CreditCard, FileText, Check } from "lucide-react"
import { Layout } from "@/components/Layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

// Step definitions
const STEPS = [
  { id: 1, title: "Personal Details", icon: User, description: "Basic personal information" },
  { id: 2, title: "Employment Details", icon: Briefcase, description: "Job and department information" },
  { id: 3, title: "Shift & Schedule", icon: Clock, description: "Work schedule and shifts (optional)" },
  { id: 4, title: "Bank Details", icon: CreditCard, description: "Banking information (optional)" },
  { id: 5, title: "Documents", icon: FileText, description: "Upload documents (optional)" },
  { id: 6, title: "Review", icon: Check, description: "Review and submit" }
]

export default function AddEmployee() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  // Master data states
  const [departments, setDepartments] = useState([])
  const [designations, setDesignations] = useState([])
  const [shifts, setShifts] = useState([])
  const [workWeeks, setWorkWeeks] = useState([])
  const [roles, setRoles] = useState([])

  // Form data for user_profiles table
  const [personalData, setPersonalData] = useState({
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
    biometric_code: "",
  })

  // Form data for employees table
  const [employmentData, setEmploymentData] = useState({
    employee_code: "",
    company_email: "",
    work_phone: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    department_id: "",
    designation_id: "",
    hire_date: "",
    employment_status: "active",
    onboarding_status: "pending",
    profile_picture_url: "",
    password: "",
    role_id: "",
  })

  // Form data for employee_shifts table
  const [shiftData, setShiftData] = useState({
    shift_id: "",
    work_week_id: "",
  })

  // Form data for employee_bank_details table
  const [bankData, setBankData] = useState({
    bank_name: "",
    account_holder_name: "",
    account_number: "",
    ifsc_code: "",
    branch_name: "",
    is_primary: true,
  })

  // Form data for employee_documents table
  const [documentsData, setDocumentsData] = useState({
    documents: []
  })

  // Load master data on component mount
  useEffect(() => {
    loadMasterData()
    generateEmployeeCode()
  }, [])

  const loadMasterData = async () => {
    try {
      // Load departments
      const { data: deptData } = await supabase
        .from('departments')
        .select('id, name, code')
        .eq('is_active', true)
        .eq('is_deleted', false)
        .order('name')

      // Load designations
      const { data: desigData } = await supabase
        .from('designations')
        .select('id, title, code, department_id')
        .eq('is_active', true)
        .eq('is_deleted', false)
        .order('title')

      // Load shifts
      const { data: shiftData } = await supabase
        .from('shifts')
        .select('id, name, start_time, end_time')
        .eq('is_active', true)
        .eq('is_deleted', false)
        .order('name')

      // Load work weeks
      const { data: workWeekData } = await supabase
        .from('work_weeks')
        .select('id, name, monday, tuesday, wednesday, thursday, friday, saturday, sunday')
        .eq('is_active', true)
        .eq('is_deleted', false)
        .order('name')

      // Load roles
      const { data: roleData } = await supabase
        .from('roles')
        .select('id, name, description')
        .eq('is_active', true)
        .eq('is_deleted', false)
        .order('name')

      setDepartments(deptData || [])
      setDesignations(desigData || [])
      setShifts(shiftData || [])
      setWorkWeeks(workWeekData || [])
      setRoles(roleData || [])
    } catch (error) {
      console.error('Error loading master data:', error)
      toast({
        title: "Error",
        description: "Failed to load master data",
        variant: "destructive",
      })
    }
  }

  // Generate random password
  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
    let password = ""
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setEmploymentData(prev => ({ ...prev, password }))
  }

  // Generate unique employee code
  const generateEmployeeCode = async () => {
    try {
      let code = ''
      let isUnique = false
      let attempts = 0
      const maxAttempts = 10

      while (!isUnique && attempts < maxAttempts) {
        // Generate code with current year + sequential number approach
        const year = new Date().getFullYear().toString().slice(-2)
        const timestamp = Date.now().toString().slice(-6)
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
        code = `EMP${year}${timestamp}${random}`

        // Check if code already exists
        const { data: existingEmployee, error } = await supabase
          .from('employees')
          .select('employee_code')
          .eq('employee_code', code)
          .maybeSingle()

        if (error) {
          console.error('Error checking employee code:', error)
          break
        } else if (!existingEmployee) {
          // No rows returned - code is unique
          isUnique = true
        } else {
          // Code exists, try again
          attempts++
        }
      }

      if (isUnique) {
        setEmploymentData(prev => ({ ...prev, employee_code: code }))
        return code
      } else {
        throw new Error('Unable to generate unique employee code')
      }
    } catch (error) {
      console.error('Error generating employee code:', error)
      toast({
        title: "Error",
        description: "Failed to generate employee code. Please enter manually.",
        variant: "destructive",
      })
    }
  }

  // Step navigation functions
  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (step: number) => {
    setCurrentStep(step)
  }

  // Validation functions for each step
  const validateStep = (step: number) => {
    switch (step) {
      case 1: // Personal Details
        return personalData.first_name && personalData.last_name && personalData.personal_email
      case 2: // Employment Details
        return employmentData.company_email && employmentData.department_id && employmentData.hire_date && employmentData.password
      case 3: // Shift & Schedule (Optional)
        return true // Optional - can be set later
      case 4: // Bank Details (Optional)
        return true // Optional - can be set later
      case 5: // Documents (Optional)
        return true // Optional step
      default:
        return true
    }
  }

  const canProceedToNext = () => {
    return validateStep(currentStep)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate all required fields
      if (!personalData.first_name || !personalData.last_name || !personalData.personal_email) {
        toast({
          title: "Error",
          description: "Please fill in all required personal details",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      if (!employmentData.company_email || !employmentData.department_id || !employmentData.hire_date || !employmentData.password) {
        toast({
          title: "Error",
          description: "Please fill in all required employment details",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: personalData.personal_email,
        password: employmentData.password,
        options: {
          data: {
            first_name: personalData.first_name,
            last_name: personalData.last_name,
          }
        }
      })

      if (authError) throw authError
      if (!authData.user) throw new Error("Failed to create user")

      const userId = authData.user.id

      // Wait a moment for the trigger to create the profile
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Update user profile with additional data (profile was created by trigger)
      const profileUpdateData: any = {
        middle_name: personalData.middle_name || null,
        phone: personalData.phone || null,
        date_of_birth: personalData.date_of_birth || null,
        city: personalData.city || null,
        state: personalData.state || null,
        address: personalData.address || null,
        pincode: personalData.pincode || null,
        biometric_code: personalData.biometric_code || null,
      }

      if (personalData.gender && ['male', 'female', 'other'].includes(personalData.gender)) {
        profileUpdateData.gender = personalData.gender
      }

      const { error: profileError } = await supabase
        .from('user_profiles')
        .update(profileUpdateData)
        .eq('id', userId)

      if (profileError) throw profileError

      // Ensure we have a unique employee code
      let finalEmployeeCode = employmentData.employee_code
      if (!finalEmployeeCode) {
        // Generate a fallback code if none exists
        const timestamp = Date.now().toString()
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
        finalEmployeeCode = `EMP${timestamp}${random}`
      }

      // Double-check uniqueness before creating employee
      const { data: existingEmployee } = await supabase
        .from('employees')
        .select('employee_code')
        .eq('employee_code', finalEmployeeCode)
        .maybeSingle()

      if (existingEmployee) {
        // If code exists, generate a new unique one
        const timestamp = Date.now().toString()
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
        finalEmployeeCode = `EMP${timestamp}${random}`
      }

      // Create employee record
      const { data: employeeData, error: employeeError } = await supabase
        .from('employees')
        .insert({
          user_id: userId,
          employee_code: finalEmployeeCode,
          company_email: employmentData.company_email,
          work_phone: employmentData.work_phone || null,
          emergency_contact_name: employmentData.emergency_contact_name || null,
          emergency_contact_phone: employmentData.emergency_contact_phone || null,
          department_id: employmentData.department_id,
          designation_id: employmentData.designation_id || null,
          hire_date: employmentData.hire_date,
          employment_status: employmentData.employment_status,
          onboarding_status: employmentData.onboarding_status,
          profile_picture_url: employmentData.profile_picture_url || null,
        })
        .select()
        .single()

      if (employeeError) throw employeeError
      if (!employeeData) throw new Error("Failed to create employee record")

      const employeeId = employeeData.id

      // Create employee shift assignment if provided
      if (shiftData.shift_id && shiftData.work_week_id) {
        const { error: shiftError } = await supabase
          .from('employee_shifts')
          .insert({
            employee_id: employeeId,
            shift_id: shiftData.shift_id,
            work_week_id: shiftData.work_week_id,
          })

        if (shiftError) throw shiftError
      }

      // Create bank details if provided (skip if RLS policy prevents it)
      if (bankData.bank_name && bankData.account_holder_name && bankData.account_number && bankData.ifsc_code) {
        try {
          const { error: bankError } = await supabase
            .from('employee_bank_details')
            .insert({
              employee_id: employeeId,
              bank_name: bankData.bank_name,
              account_holder_name: bankData.account_holder_name,
              account_number: bankData.account_number,
              ifsc_code: bankData.ifsc_code,
              branch_name: bankData.branch_name || null,
              is_primary: bankData.is_primary,
            })

          if (bankError) {
            console.warn('Bank details could not be inserted due to RLS policy:', bankError)
            // Don't throw error - bank details can be added later
          }
        } catch (error) {
          console.warn('Bank details insertion failed:', error)
          // Continue with employee creation
        }
      }

      // Create document records if provided (skip if RLS policy prevents it)
      if (documentsData.documents && documentsData.documents.length > 0) {
        try {
          const documentInserts = documentsData.documents.map((doc: any) => ({
            employee_id: employeeId,
            document_type: doc.type,
            file_url: doc.url,
            remarks: doc.remarks || null,
          }))

          const { error: documentsError } = await supabase
            .from('employee_documents')
            .insert(documentInserts)

          if (documentsError) {
            console.warn('Documents could not be inserted due to RLS policy:', documentsError)
            // Don't throw error - documents can be added later
          }
        } catch (error) {
          console.warn('Documents insertion failed:', error)
          // Continue with employee creation
        }
      }

      // Assign role to user if provided
      if (employmentData.role_id) {
        try {
          // First, try to update existing role assignment (from trigger)
          const { data: existingRoles } = await supabase
            .from('user_roles')
            .select('id, role_id')
            .eq('user_id', userId)
            .eq('is_active', true)

          if (existingRoles && existingRoles.length > 0) {
            // Update the existing role assignment
            const { error: updateError } = await supabase
              .from('user_roles')
              .update({
                role_id: employmentData.role_id,
                updated_at: new Date().toISOString()
              })
              .eq('user_id', userId)
              .eq('is_active', true)

            if (updateError) {
              console.warn('Could not update existing role, trying to insert new one:', updateError)

              // If update fails, try to insert new role
              const { error: insertError } = await supabase
                .from('user_roles')
                .insert({
                  user_id: userId,
                  role_id: employmentData.role_id,
                })

              if (insertError && !insertError.message.includes('duplicate key')) {
                console.warn('Role assignment failed:', insertError)
              }
            }
          } else {
            // No existing roles, create new one
            const { error: userRoleError } = await supabase
              .from('user_roles')
              .insert({
                user_id: userId,
                role_id: employmentData.role_id,
              })

            if (userRoleError && !userRoleError.message.includes('duplicate key')) {
              console.warn('Role assignment failed:', userRoleError)
            }
          }
        } catch (error) {
          console.warn('Role assignment process failed:', error)
          // Don't throw error - user creation should succeed even if role assignment fails
        }
      }

      toast({
        title: "Success",
        description: "Employee created successfully! You can add bank details and documents later if needed.",
      })

      navigate('/employees')
    } catch (error: any) {
      console.error('Error creating employee:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to create employee",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
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
            <h1 className="text-2xl md:text-3xl font-bold">Add New Employee</h1>
            <p className="text-muted-foreground">Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1]?.description}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full">
          <Progress value={(currentStep / STEPS.length) * 100} className="w-full" />
        </div>

        {/* Step Indicator */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4">
          {STEPS.map((step, index) => {
            const StepIcon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id
            const isAccessible = index === 0 || validateStep(index)

            return (
              <div
                key={step.id}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : isCompleted
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    : isAccessible
                    ? 'bg-muted hover:bg-muted/80'
                    : 'bg-muted/50 text-muted-foreground cursor-not-allowed'
                }`}
                onClick={() => isAccessible && goToStep(step.id)}
              >
                <StepIcon className="h-4 w-4" />
                <span className="text-sm font-medium hidden sm:block">{step.title}</span>
                <span className="text-sm font-medium sm:hidden">{step.id}</span>
              </div>
            )
          })}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Personal Details */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">First Name *</Label>
                    <Input
                      id="first_name"
                      value={personalData.first_name}
                      onChange={(e) => setPersonalData(prev => ({ ...prev, first_name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name *</Label>
                    <Input
                      id="last_name"
                      value={personalData.last_name}
                      onChange={(e) => setPersonalData(prev => ({ ...prev, last_name: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="middle_name">Middle Name</Label>
                  <Input
                    id="middle_name"
                    value={personalData.middle_name}
                    onChange={(e) => setPersonalData(prev => ({ ...prev, middle_name: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="personal_email">Personal Email *</Label>
                    <Input
                      id="personal_email"
                      type="email"
                      value={personalData.personal_email}
                      onChange={(e) => setPersonalData(prev => ({ ...prev, personal_email: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={personalData.phone}
                      onChange={(e) => setPersonalData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={personalData.date_of_birth}
                      onChange={(e) => setPersonalData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={personalData.gender} onValueChange={(value) => setPersonalData(prev => ({ ...prev, gender: value }))}>
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
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={personalData.address}
                    onChange={(e) => setPersonalData(prev => ({ ...prev, address: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={personalData.city}
                      onChange={(e) => setPersonalData(prev => ({ ...prev, city: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={personalData.state}
                      onChange={(e) => setPersonalData(prev => ({ ...prev, state: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      value={personalData.pincode}
                      onChange={(e) => setPersonalData(prev => ({ ...prev, pincode: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="biometric_code">Biometric Code</Label>
                  <Input
                    id="biometric_code"
                    value={personalData.biometric_code}
                    onChange={(e) => setPersonalData(prev => ({ ...prev, biometric_code: e.target.value }))}
                    placeholder="Optional biometric identifier"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Employment Details */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Employment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="employee_code">Employee Code *</Label>
                    <div className="flex gap-2">
                      <Input
                        id="employee_code"
                        value={employmentData.employee_code}
                        onChange={(e) => setEmploymentData(prev => ({ ...prev, employee_code: e.target.value }))}
                        required
                      />
                      <Button type="button" variant="outline" onClick={generateEmployeeCode}>
                        Generate
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="company_email">Company Email *</Label>
                    <Input
                      id="company_email"
                      type="email"
                      value={employmentData.company_email}
                      onChange={(e) => setEmploymentData(prev => ({ ...prev, company_email: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="department_id">Department *</Label>
                    <Select value={employmentData.department_id} onValueChange={(value) => setEmploymentData(prev => ({ ...prev, department_id: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept: any) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name} {dept.code && `(${dept.code})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="designation_id">Designation</Label>
                    <Select value={employmentData.designation_id} onValueChange={(value) => setEmploymentData(prev => ({ ...prev, designation_id: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select designation" />
                      </SelectTrigger>
                      <SelectContent>
                        {designations
                          .filter((desig: any) => !employmentData.department_id || desig.department_id === employmentData.department_id)
                          .map((desig: any) => (
                            <SelectItem key={desig.id} value={desig.id}>
                              {desig.title} {desig.code && `(${desig.code})`}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hire_date">Hire Date *</Label>
                    <Input
                      id="hire_date"
                      type="date"
                      value={employmentData.hire_date}
                      onChange={(e) => setEmploymentData(prev => ({ ...prev, hire_date: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="work_phone">Work Phone</Label>
                    <Input
                      id="work_phone"
                      value={employmentData.work_phone}
                      onChange={(e) => setEmploymentData(prev => ({ ...prev, work_phone: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
                    <Input
                      id="emergency_contact_name"
                      value={employmentData.emergency_contact_name}
                      onChange={(e) => setEmploymentData(prev => ({ ...prev, emergency_contact_name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
                    <Input
                      id="emergency_contact_phone"
                      value={employmentData.emergency_contact_phone}
                      onChange={(e) => setEmploymentData(prev => ({ ...prev, emergency_contact_phone: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="employment_status">Employment Status</Label>
                    <Select value={employmentData.employment_status} onValueChange={(value) => setEmploymentData(prev => ({ ...prev, employment_status: value }))}>
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
                  <div>
                    <Label htmlFor="role_id">Role</Label>
                    <Select value={employmentData.role_id} onValueChange={(value) => setEmploymentData(prev => ({ ...prev, role_id: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role: any) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="password">Password *</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={employmentData.password}
                        onChange={(e) => setEmploymentData(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <Button type="button" variant="outline" onClick={generatePassword}>
                      Generate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Shift & Schedule */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Shift & Schedule
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Optional: Assign work shifts and schedules. This can be set up later if needed.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="shift_id">Shift *</Label>
                    <Select value={shiftData.shift_id} onValueChange={(value) => setShiftData(prev => ({ ...prev, shift_id: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select shift" />
                      </SelectTrigger>
                      <SelectContent>
                        {shifts.map((shift: any) => (
                          <SelectItem key={shift.id} value={shift.id}>
                            {shift.name} ({shift.start_time} - {shift.end_time})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="work_week_id">Work Week *</Label>
                    <Select value={shiftData.work_week_id} onValueChange={(value) => setShiftData(prev => ({ ...prev, work_week_id: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select work week" />
                      </SelectTrigger>
                      <SelectContent>
                        {workWeeks.map((workWeek: any) => (
                          <SelectItem key={workWeek.id} value={workWeek.id}>
                            {workWeek.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Display selected work week details */}
                {shiftData.work_week_id && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Work Week Details:</h4>
                    {(() => {
                      const selectedWorkWeek = workWeeks.find((ww: any) => ww.id === shiftData.work_week_id)
                      if (!selectedWorkWeek) return null

                      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
                      const workDays = days.filter(day => selectedWorkWeek[day.toLowerCase()])

                      return (
                        <div className="flex flex-wrap gap-2">
                          {days.map(day => (
                            <Badge
                              key={day}
                              variant={selectedWorkWeek[day.toLowerCase()] ? "default" : "secondary"}
                            >
                              {day}
                            </Badge>
                          ))}
                        </div>
                      )
                    })()}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 4: Bank Details */}
          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Bank Details
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Optional: Add banking information for payroll. This can be added later if needed.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bank_name">Bank Name *</Label>
                    <Input
                      id="bank_name"
                      value={bankData.bank_name}
                      onChange={(e) => setBankData(prev => ({ ...prev, bank_name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="account_holder_name">Account Holder Name *</Label>
                    <Input
                      id="account_holder_name"
                      value={bankData.account_holder_name}
                      onChange={(e) => setBankData(prev => ({ ...prev, account_holder_name: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="account_number">Account Number *</Label>
                    <Input
                      id="account_number"
                      value={bankData.account_number}
                      onChange={(e) => setBankData(prev => ({ ...prev, account_number: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="ifsc_code">IFSC Code *</Label>
                    <Input
                      id="ifsc_code"
                      value={bankData.ifsc_code}
                      onChange={(e) => setBankData(prev => ({ ...prev, ifsc_code: e.target.value.toUpperCase() }))}
                      placeholder="e.g., SBIN0001234"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="branch_name">Branch Name</Label>
                  <Input
                    id="branch_name"
                    value={bankData.branch_name}
                    onChange={(e) => setBankData(prev => ({ ...prev, branch_name: e.target.value }))}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_primary"
                    checked={bankData.is_primary}
                    onCheckedChange={(checked) => setBankData(prev => ({ ...prev, is_primary: checked as boolean }))}
                  />
                  <Label htmlFor="is_primary">Set as primary bank account</Label>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 5: Documents */}
          {currentStep === 5 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground mb-4">
                  Upload required documents for the employee. This step is optional and can be completed later.
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Document Types</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {['Resume', 'ID Proof', 'Address Proof', 'Educational Certificate', 'Experience Letter', 'Photo'].map((docType) => (
                        <Badge key={docType} variant="outline" className="justify-center p-2">
                          {docType}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Document upload functionality will be implemented here.
                      <br />
                      For now, documents can be uploaded after employee creation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 6: Review */}
          {currentStep === 6 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  Review & Submit
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Details Summary */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Personal Details</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Name:</span> {personalData.first_name} {personalData.middle_name} {personalData.last_name}</div>
                      <div><span className="font-medium">Email:</span> {personalData.personal_email}</div>
                      <div><span className="font-medium">Phone:</span> {personalData.phone || 'Not provided'}</div>
                      <div><span className="font-medium">Date of Birth:</span> {personalData.date_of_birth || 'Not provided'}</div>
                      <div><span className="font-medium">Gender:</span> {personalData.gender || 'Not provided'}</div>
                    </div>
                  </div>

                  {/* Employment Details Summary */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Employment Details</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Employee Code:</span> {employmentData.employee_code}</div>
                      <div><span className="font-medium">Company Email:</span> {employmentData.company_email}</div>
                      <div><span className="font-medium">Department:</span> {departments.find((d: any) => d.id === employmentData.department_id)?.name || 'Not selected'}</div>
                      <div><span className="font-medium">Designation:</span> {designations.find((d: any) => d.id === employmentData.designation_id)?.title || 'Not selected'}</div>
                      <div><span className="font-medium">Hire Date:</span> {employmentData.hire_date}</div>
                    </div>
                  </div>

                  {/* Shift Details Summary */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Shift & Schedule</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Shift:</span> {shifts.find((s: any) => s.id === shiftData.shift_id)?.name || 'Not selected'}</div>
                      <div><span className="font-medium">Work Week:</span> {workWeeks.find((w: any) => w.id === shiftData.work_week_id)?.name || 'Not selected'}</div>
                    </div>
                  </div>

                  {/* Bank Details Summary */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Bank Details</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Bank:</span> {bankData.bank_name || 'Not provided'}</div>
                      <div><span className="font-medium">Account Holder:</span> {bankData.account_holder_name || 'Not provided'}</div>
                      <div><span className="font-medium">Account Number:</span> {bankData.account_number ? `****${bankData.account_number.slice(-4)}` : 'Not provided'}</div>
                      <div><span className="font-medium">IFSC Code:</span> {bankData.ifsc_code || 'Not provided'}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <div>
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => navigate('/employees')}>
                Cancel
              </Button>

              {currentStep < STEPS.length ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!canProceedToNext()}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Employee"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </Layout>
  )
}