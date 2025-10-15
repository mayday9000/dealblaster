import { Link } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function Header() {
  const { session, loading } = useSession();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You've been signed out successfully",
      });
    }
  };

  if (loading) {
    return null;
  }

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-lg font-semibold">
          Property Flyer Generator
        </Link>
        <div className="flex items-center gap-2">
          {session ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {session.user.email}
              </span>
              <Button onClick={handleSignOut} variant="outline" size="sm">
                Sign out
              </Button>
            </>
          ) : (
            <Button asChild variant="outline" size="sm">
              <Link to="/auth">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
