
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { AlertTriangle } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireHR?: boolean;
  requiredRole?: string;
}

export const ProtectedRoute = ({ 
  children, 
  requireAdmin = false, 
  requireHR = false,
  requiredRole 
}: ProtectedRouteProps) => {
  const { user, loading, isAdmin, isHRManager, userRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    // Save the attempted location for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check specific role requirement
  if (requiredRole && userRole !== requiredRole) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You need the "{requiredRole}" role to access this page.
          </p>
          <p className="text-sm text-gray-500">
            Current role: {userRole || 'No role assigned'}
          </p>
        </div>
      </div>
    );
  }

  // Check admin requirement
  if (requireAdmin && !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 mb-2">Admin Access Required</h2>
          <p className="text-gray-600 mb-4">
            You don't have administrator privileges to access this page.
          </p>
          <p className="text-sm text-gray-500">
            Contact your system administrator for access.
          </p>
        </div>
      </div>
    );
  }

  // Check HR requirement
  if (requireHR && !isHRManager) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 mb-2">HR Access Required</h2>
          <p className="text-gray-600 mb-4">
            You don't have HR management privileges to access this page.
          </p>
          <p className="text-sm text-gray-500">
            Contact your HR department for access.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
