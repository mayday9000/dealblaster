import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';

interface AuthGateProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function AuthGate({ children, fallback }: AuthGateProps) {
  const { session, loading } = useSession();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <>
        {fallback || (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <p className="mb-4">Please sign in to continue</p>
              <Link 
                to="/auth" 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Sign in
              </Link>
            </div>
          </div>
        )}
      </>
    );
  }

  return <>{children}</>;
}
