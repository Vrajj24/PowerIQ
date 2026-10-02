import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-paper">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-line border-t-accent rounded-full animate-spin" />
          <p className="text-muted text-xs tracking-wider animate-pulse uppercase font-semibold">Opening your energy workspace...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

