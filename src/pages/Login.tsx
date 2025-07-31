import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import SignInForm from '@/components/auth/SignInForm';

const Login = () => {
  const { signIn, user, loading } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  if (user) {
    return <Navigate to={from} replace />;
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const sanitizeInput = (input: string): string => {
    return input.trim().replace(/[<>]/g, '');
  };

  const handleSubmit = async (email: string, password: string) => {
    setError('');

    // Rate limiting - block after 5 failed attempts
    if (attemptCount >= 5) {
      setError('Too many failed attempts. Please wait before trying again.');
      return;
    }

    // Input validation
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);

    if (!sanitizedEmail || !sanitizedPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(sanitizedEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    if (sanitizedPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const { error: authError } = await signIn(sanitizedEmail, sanitizedPassword);
      
      if (authError) {
        setAttemptCount(prev => prev + 1);
        
        // Provide user-friendly error messages
        if (authError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials.');
        } else if (authError.message.includes('Email not confirmed')) {
          setError('Please check your email and confirm your account before signing in.');
        } else if (authError.message.includes('Too many requests')) {
          setError('Too many login attempts. Please wait before trying again.');
        } else {
          setError(authError.message || 'An error occurred during sign in.');
        }
      } else {
        // Reset attempt count on successful login
        setAttemptCount(0);
      }
    } catch (error) {
      console.error('Login error:', error);
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
      <SignInForm 
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
      />
    </AuthLayout>
  );
};

export default Login;
