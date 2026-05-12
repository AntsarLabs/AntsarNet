import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store';
import { useTrackOnlineStatus } from '@/features/live/hooks';

interface ProtectedRouteProps {
  redirectTo?: string;
}

/**
 * Layout route for React Router v6.
 * Usage in <Routes>:
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/discover" element={<DiscoverPage />} />
 *     ...
 *   </Route>
 */
export function ProtectedRoute({ redirectTo = '/auth' }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  // Initialize the live status (heartbeat and real-time sync)
  useTrackOnlineStatus();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-pink-500 border-t-transparent animate-spin" />
          <span className="text-slate-400 text-sm font-medium">Loading…</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Preserve the attempted URL so we can redirect back after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Render nested routes
  return <Outlet />;
}
