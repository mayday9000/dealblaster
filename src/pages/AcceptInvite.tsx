import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/hooks/useSession';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Layout } from '@/components/Layout';
import { z } from 'zod';

const passwordSchema = z.object({
  password: z.string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(255, { message: "Password must be less than 255 characters" }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function AcceptInvite() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { session, loading: sessionLoading } = useSession();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // If not loading and no session, redirect to login
    if (!sessionLoading && !session) {
      navigate('/login', { replace: true });
    }
  }, [session, sessionLoading, navigate]);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    const validation = passwordSchema.safeParse({ password, confirmPassword });
    
    if (!validation.success) {
      const firstError = validation.error.errors[0];
      toast({
        title: "Invalid input",
        description: firstError.message,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: validation.data.password,
      });

      if (error) throw error;

      toast({
        title: "Password set",
        description: "Your password has been set successfully.",
      });
      
      navigate('/app', { replace: true });
    } catch (error: any) {
      toast({
        title: "Failed to set password",
        description: error.message ?? "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (sessionLoading) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <p className="text-gray-400">Checking your invite link…</p>
        </div>
      </Layout>
    );
  }

  // If no session after loading, the useEffect will redirect
  if (!session) {
    return null;
  }

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Set your password</h1>
              <p className="text-sm text-gray-400">
                You've accepted your DealBlaster invite for{' '}
                <span className="font-medium text-white">{session.user.email}</span>.
                Create a password to secure your account.
              </p>
            </div>

            <form onSubmit={handleSetPassword} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-xs font-medium text-gray-300 mb-2">
                  New password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="bg-input"
                  autoComplete="new-password"
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-300 mb-2">
                  Confirm password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="bg-input"
                  autoComplete="new-password"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl"
                disabled={loading}
              >
                {loading ? 'Setting password...' : 'Save password & continue'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
