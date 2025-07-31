import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import SignUpForm from '@/components/auth/SignUpForm';

const Signup = () => {
  const { signUp, user, loading } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    return password.length >= 8 && passwordRegex.test(password);
  };

  const sanitizeInput = (input: string): string => {
    return input.trim().replace(/[<>]/g, '');
  };

  const handleSubmit = async (firstName: string, lastName: string, email: string, password: string) => {
    setError('');
    setSuccess('');

    // Input validation
    const sanitizedFirstName = sanitizeInput(firstName);
    const sanitizedLastName = sanitizeInput(lastName);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);

    if (!sanitizedFirstName || !sanitizedLastName || !sanitizedEmail || !sanitizedPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (sanitizedFirstName.length < 2) {
      setError('First name must be at least 2 characters long');
      return;
    }

    if (sanitizedLastName.length < 2) {
      setError('Last name must be at least 2 characters long');
      return;
    }

    if (!validateEmail(sanitizedEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!validatePassword(sanitizedPassword)) {
      setError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character');
      return;
    }

    setIsLoading(true);

    try {
      const { error: authError } = await signUp(
        sanitizedEmail, 
        sanitizedPassword,
        {
          first_name: sanitizedFirstName,
          last_name: sanitizedLastName,
        }
      );
      
      if (authError) {
        // Provide user-friendly error messages
        if (authError.message.includes('User already registered')) {
          setError('An account with this email already exists. Please try signing in instead.');
        } else if (authError.message.includes('Password should be at least')) {
          setError('Password must be at least 6 characters long.');
        } else {
          setError(authError.message || 'An error occurred during signup.');
        }
      } else {
        setSuccess('Account created successfully! Please check your email to confirm your account, then you can sign in.');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AuthLayout>
      <SignUpForm 
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
        success={success}
      />
    </AuthLayout>
  );
};

export default Signup;
