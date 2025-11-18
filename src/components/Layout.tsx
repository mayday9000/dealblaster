import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import dealblasterLogo from '@/assets/dealblaster-logo.png';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { session, user, loading } = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out successfully",
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-black border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Logo */}
            <Link to="/" className="flex items-center">
              <img src={dealblasterLogo} alt="DealBlaster" className="h-8" />
            </Link>

            {/* Right side - Navigation */}
            <div className="flex items-center gap-4">
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : session ? (
                <>
                  <Link
                    to="/"
                    className="hidden sm:inline-flex text-sm text-white hover:text-primary transition-colors"
                  >
                    Home
                  </Link>
                  <Link
                    to="/app"
                    className="text-sm text-white hover:text-primary transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/my-properties"
                    className="hidden sm:inline-flex text-sm text-white hover:text-primary transition-colors"
                  >
                    My Properties
                  </Link>
                  <Link
                    to="/contact-info"
                    className="hidden sm:inline-flex text-sm text-white hover:text-primary transition-colors"
                  >
                    Contact Info
                  </Link>
                  <span className="hidden md:inline-flex text-xs text-gray-400">
                    {user?.email}
                  </span>
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    to="/"
                    className="hidden sm:inline-flex text-sm text-white hover:text-primary transition-colors"
                  >
                    Home
                  </Link>
                  <Button
                    onClick={() => navigate('/login')}
                    size="sm"
                    className="bg-primary text-white hover:bg-primary/90"
                  >
                    Log in
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main>{children}</main>
    </div>
  );
}
