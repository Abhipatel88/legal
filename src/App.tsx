
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import Departments from "./pages/masters/Departments";
import Shifts from "./pages/masters/Shifts";
import Holidays from "./pages/masters/Holidays";
import LeaveTypes from "./pages/masters/LeaveTypes";
import Roles from "./pages/masters/Roles";
import Permissions from "./pages/masters/Permissions";
import WorkWeeks from "./pages/masters/WorkWeeks";
import CompanySettings from "./pages/settings/CompanySettings";
import SmtpSettings from "./pages/settings/SmtpSettings";
import Users from "./pages/Users";
import AddUser from "./pages/AddUser";
import EditUser from "./pages/EditUser";
import Employees from "./pages/Employees";
import AddEmployee from "./pages/AddEmployee";
import EditEmployee from "./pages/EditEmployee";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/masters/departments" 
              element={
                <ProtectedRoute>
                  <Departments />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/masters/shifts" 
              element={
                <ProtectedRoute>
                  <Shifts />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/masters/holidays" 
              element={
                <ProtectedRoute>
                  <Holidays />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/masters/leave-types" 
              element={
                <ProtectedRoute>
                  <LeaveTypes />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/masters/roles" 
              element={
                <ProtectedRoute>
                  <Roles />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/masters/permissions" 
              element={
                <ProtectedRoute>
                  <Permissions />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/masters/work-weeks" 
              element={
                <ProtectedRoute>
                  <WorkWeeks />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings/company" 
              element={
                <ProtectedRoute>
                  <CompanySettings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings/smtp" 
              element={
                <ProtectedRoute>
                  <SmtpSettings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/users" 
              element={
                <ProtectedRoute>
                  <Users />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/users/add" 
              element={
                <ProtectedRoute>
                  <AddUser />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/users/edit/:id" 
              element={
                <ProtectedRoute>
                  <EditUser />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/employees" 
              element={
                <ProtectedRoute>
                  <Employees />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/employees/add" 
              element={
                <ProtectedRoute>
                  <AddEmployee />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/employees/edit/:id" 
              element={
                <ProtectedRoute>
                  <EditEmployee />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
