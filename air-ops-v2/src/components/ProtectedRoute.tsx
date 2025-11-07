import React from "react";
import { Navigate, useLocation } from "react-router";
import { useSession } from "@/app/providers";
import { canAccessRoute } from "@/utils/permissions";
import LinearProgress from "@mui/material/LinearProgress";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute component that checks user authentication and permissions
 * before allowing access to a route
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { session, loading } = useSession();
  const location = useLocation();

  // Show loading while checking session
  if (loading) {
    return (
      <div style={{ width: "100%" }}>
        <LinearProgress />
      </div>
    );
  }

  // Allow landing page and login without auth
  if (location.pathname === "/" || location.pathname === "/login") {
    // If user is logged in and tries to access login page, redirect to dashboard
    if (session && location.pathname === "/login") {
      return <Navigate to="/app" replace />;
    }
    // Allow access to landing and login pages
    return <>{children}</>;
  }

  // All other routes require authentication
  if (!session) {
    const redirectTo = `/login?callbackUrl=${encodeURIComponent(location.pathname)}`;
    return <Navigate to={redirectTo} replace />;
  }

  // Check permissions for internal routes
  const hasAccess = canAccessRoute(session, location.pathname);

  if (!hasAccess) {
    // User doesn't have permission, redirect to dashboard
    // You could also show an error message here
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
};
