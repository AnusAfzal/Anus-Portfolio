import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, isAdmin, loading, isConfigured } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="admin-loading-screen" role="status" aria-label="Loading authentication">
        <div className="admin-spinner" />
        <p className="admin-loading-text font-mono">Verifying credentials...</p>
      </div>
    );
  }

  if (!isConfigured) {
    return <Navigate to="/admin/login" state={{ error: "Supabase credentials are not configured in .env" }} replace />;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
