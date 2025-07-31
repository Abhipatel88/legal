import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isHRManager: boolean;
  userRole: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  isAdmin: false,
  isHRManager: false,
  userRole: null,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isHRManager, setIsHRManager] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        // Defer the role fetching to prevent blocking
        setTimeout(() => {
          fetchUserRole(session.user.id);
        }, 0);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer the role fetching to prevent blocking
          setTimeout(() => {
            fetchUserRole(session.user.id);
          }, 0);
        } else {
          setUserRole(null);
          setIsAdmin(false);
          setIsHRManager(false);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      // Use the new security definer function to get user role
      const { data: roleData, error: roleError } = await (supabase as any)
        .rpc('get_current_user_role');

      if (roleError) {
        console.error('Error fetching user role:', roleError);
        // Default to Employee role if there's an error
        const defaultRole: string = 'Employee';
        setUserRole(defaultRole);
        setIsAdmin(false);
        setIsHRManager(false);
        return;
      }

      const roleName: string = roleData || 'Employee';
      console.log('User role found:', roleName);
      setUserRole(roleName);
      setIsAdmin(roleName === 'Admin');
      setIsHRManager(roleName === 'HR Manager' || roleName === 'Admin');
    } catch (error) {
      console.error('Error fetching user role:', error);
      // Default to Employee role if there's an error
      const defaultRole: string = 'Employee';
      setUserRole(defaultRole);
      setIsAdmin(false);
      setIsHRManager(false);
    }
  };

  const validateInput = (input: string): string => {
    return input.trim().replace(/[<>]/g, '');
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Input validation
      const sanitizedEmail = validateInput(email);
      const sanitizedPassword = validateInput(password);

      if (!sanitizedEmail || !sanitizedPassword) {
        return { error: { message: 'Email and password are required' } };
      }

      if (!validateEmail(sanitizedEmail)) {
        return { error: { message: 'Please enter a valid email address' } };
      }

      if (sanitizedPassword.length < 6) {
        return { error: { message: 'Password must be at least 6 characters' } };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail.toLowerCase(),
        password: sanitizedPassword,
      });

      if (error) {
        console.error('Sign in error:', error);
        return { error };
      }

      // Check user profile status after successful authentication
      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('is_active, is_deleted')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          await supabase.auth.signOut();
          return { error: { message: 'Unable to verify user account status' } };
        }

        if (!profile.is_active) {
          await supabase.auth.signOut();
          return { error: { message: 'Your account has been deactivated. Please contact administrator.' } };
        }

        if (profile.is_deleted) {
          await supabase.auth.signOut();
          return { error: { message: 'Your account has been deleted. Please contact administrator.' } };
        }
      }

      return { error: null };
    } catch (error) {
      console.error('Sign in catch error:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      // Input validation
      const sanitizedEmail = validateInput(email);
      const sanitizedPassword = validateInput(password);

      if (!sanitizedEmail || !sanitizedPassword) {
        return { error: { message: 'Email and password are required' } };
      }

      if (!validateEmail(sanitizedEmail)) {
        return { error: { message: 'Please enter a valid email address' } };
      }

      if (sanitizedPassword.length < 6) {
        return { error: { message: 'Password must be at least 6 characters' } };
      }

      // Validate password strength
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
      if (!passwordRegex.test(sanitizedPassword)) {
        return { 
          error: { 
            message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' 
          } 
        };
      }

      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: sanitizedEmail.toLowerCase(),
        password: sanitizedPassword,
        options: {
          data: userData,
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        console.error('Sign up error:', error);
        return { error };
      }

      // Log successful signup for audit purposes
      if (data.user) {
        console.log('User signed up successfully:', data.user.email);
        // Note: The user_role assignment is handled by the database trigger
      }

      return { error: null };
    } catch (error) {
      console.error('Sign up catch error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      } else {
        console.log('User signed out successfully');
      }
    } catch (error) {
      console.error('Sign out catch error:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin,
    isHRManager,
    userRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
