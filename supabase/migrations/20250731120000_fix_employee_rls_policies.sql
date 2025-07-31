-- Fix RLS policies for employee-related tables
-- Add missing INSERT, UPDATE, DELETE policies

-- Employee Bank Details Policies
CREATE POLICY "HR can insert bank details" ON public.employee_bank_details
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      JOIN public.roles r ON ur.role_id = r.id 
      WHERE ur.user_id = auth.uid() 
      AND r.name IN ('HR Manager', 'Admin', 'Finance Manager') 
      AND ur.is_active = true
    )
  );

CREATE POLICY "HR can update bank details" ON public.employee_bank_details
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      JOIN public.roles r ON ur.role_id = r.id 
      WHERE ur.user_id = auth.uid() 
      AND r.name IN ('HR Manager', 'Admin', 'Finance Manager') 
      AND ur.is_active = true
    )
  );

CREATE POLICY "Users can update their own bank details" ON public.employee_bank_details
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.employees e 
      WHERE e.id = employee_id AND e.user_id = auth.uid()
    )
  );

-- Employee Shifts Policies
CREATE POLICY "HR can insert employee shifts" ON public.employee_shifts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      JOIN public.roles r ON ur.role_id = r.id 
      WHERE ur.user_id = auth.uid() 
      AND r.name IN ('HR Manager', 'Admin') 
      AND ur.is_active = true
    )
  );

CREATE POLICY "HR can update employee shifts" ON public.employee_shifts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      JOIN public.roles r ON ur.role_id = r.id 
      WHERE ur.user_id = auth.uid() 
      AND r.name IN ('HR Manager', 'Admin') 
      AND ur.is_active = true
    )
  );

-- Employee Documents Policies
CREATE POLICY "HR can insert employee documents" ON public.employee_documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      JOIN public.roles r ON ur.role_id = r.id 
      WHERE ur.user_id = auth.uid() 
      AND r.name IN ('HR Manager', 'Admin') 
      AND ur.is_active = true
    )
  );

CREATE POLICY "Users can insert their own documents" ON public.employee_documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees e 
      WHERE e.id = employee_id AND e.user_id = auth.uid()
    )
  );

CREATE POLICY "HR can update employee documents" ON public.employee_documents
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      JOIN public.roles r ON ur.role_id = r.id 
      WHERE ur.user_id = auth.uid() 
      AND r.name IN ('HR Manager', 'Admin') 
      AND ur.is_active = true
    )
  );

CREATE POLICY "Users can update their own documents" ON public.employee_documents
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.employees e 
      WHERE e.id = employee_id AND e.user_id = auth.uid()
    )
  );

-- User Roles Policies (for role assignment)
CREATE POLICY "HR can insert user roles" ON public.user_roles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      JOIN public.roles r ON ur.role_id = r.id 
      WHERE ur.user_id = auth.uid() 
      AND r.name IN ('HR Manager', 'Admin') 
      AND ur.is_active = true
    )
  );

CREATE POLICY "HR can update user roles" ON public.user_roles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      JOIN public.roles r ON ur.role_id = r.id 
      WHERE ur.user_id = auth.uid() 
      AND r.name IN ('HR Manager', 'Admin') 
      AND ur.is_active = true
    )
  );

CREATE POLICY "HR can delete user roles" ON public.user_roles
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      JOIN public.roles r ON ur.role_id = r.id 
      WHERE ur.user_id = auth.uid() 
      AND r.name IN ('HR Manager', 'Admin') 
      AND ur.is_active = true
    )
  );
