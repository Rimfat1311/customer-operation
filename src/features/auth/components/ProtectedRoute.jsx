import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Guards protected routes by checking live authentication state from AuthContext.
 * Optionally restricts access by role (e.g., CALL_CENTER, DRIVER).
 */
export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect unauthorized traffic to login, saving the original path history
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Role mismatch: send user to an authorized fallback view
    return <Navigate to="/dashboard/search-customers" replace />;
  }

  return children;
}
