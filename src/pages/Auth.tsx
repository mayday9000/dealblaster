import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/hooks/useSession';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { isInIframe } from '@/utils/iframeDetection';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [isInValidIframe, setIsInValidIframe] = useState<boolean | null>(null);
  const { session } = useSession();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we're in an iframe
    const inIframe = isInIframe();
    setIsInValidIframe(inIframe);
    console.log('Iframe detected:', inIframe);
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if we're in a valid iframe BEFORE sending magic link
    if (!isInValidIframe) {
      toast({
        title: "Access Restricted",
        description: "This authentication system is only available through authorized platforms.",
        variant: "destructive",
      });
      return;
    }
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      setMagicLinkSent(true);
      toast({
        title: "Check your email",
        description: "We sent you a magic link to sign in",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send magic link",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // If NOT in iframe, show "paid product" message
  if (isInValidIframe === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full mx-auto p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">🔒 Access Restricted</h1>
            <p className="text-muted-foreground mb-6">
              This is a premium product available exclusively through authorized platforms.
            </p>
            <p className="text-sm text-muted-foreground">
              If you're a client looking to view a property, please use the link provided to you.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If checking iframe status, show loading
  if (isInValidIframe === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full mx-auto p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">You're signed in</h1>
            <p className="text-muted-foreground mb-6">
              Signed in as {session.user.email}
            </p>
            <Button onClick={() => navigate('/')}>
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-auto p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Sign In</h1>
          <p className="text-muted-foreground">
            Enter your email to receive a magic link
          </p>
        </div>

        {magicLinkSent ? (
          <div className="bg-muted p-6 rounded-lg text-center">
            <h2 className="text-xl font-semibold mb-2">Check your email</h2>
            <p className="text-muted-foreground mb-4">
              We sent a magic link to <strong>{email}</strong>
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Click the link in your email to sign in. Make sure to open it in a top-level browser tab.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setMagicLinkSent(false)}
              className="mt-2"
            >
              Try another email
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Magic Link'}
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
