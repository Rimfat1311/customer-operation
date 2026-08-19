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
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Normalize role string for safe matching
  const rawRole = String(user?.role || user?.profile?.role || '').trim().toUpperCase();
  
  // Standardize call center/agent role names to CUSTOMER_CENTER
  const userRole = (rawRole === 'AGENT' || rawRole === 'CALL_CENTER' || rawRole === 'CUSTOMER CENTER' || rawRole === 'CUSTOMER_CENTER')
    ? 'CUSTOMER_CENTER'
    : rawRole;

  // Normalize allowedRoles array
  const normalizedAllowedRoles = allowedRoles.map(r => {
    const upper = String(r).toUpperCase();
    return (upper === 'AGENT' || upper === 'CALL_CENTER' || upper === 'CUSTOMER CENTER' || upper === 'CUSTOMER_CENTER')
      ? 'CUSTOMER_CENTER'
      : upper;
  });

  if (allowedRoles.length > 0 && !normalizedAllowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard/search-customers" replace />;
  }

  return children;
}
