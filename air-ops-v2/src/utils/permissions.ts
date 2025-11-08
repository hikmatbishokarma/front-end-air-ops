import { ISession } from "@/app/providers/SessionContext";

/**
 * Extract resource names from user permissions
 */
export const getUserResources = (session: ISession | null): string[] => {
  if (!session?.user?.permissions) return [];
  return session.user.permissions.map((item: any) => item.resource);
};

/**
 * Check if user has access to a specific resource/route
 */
export const hasPermission = (
  session: ISession | null,
  resource: string
): boolean => {
  if (!session?.user?.permissions) return false;
  const resources = getUserResources(session);
  return resources.includes(resource);
};

/**
 * Map route path to resource name
 * This maps the URL path to the permission resource name
 */
export const getResourceFromPath = (pathname: string): string => {
  // Remove leading slash and split
  const path = pathname.replace(/^\//, "").split("/").filter(Boolean);

  // Handle /app routes
  if (path[0] === "app") {
    // Remove 'app' prefix
    path.shift();
  }

  // Get the first segment (main resource) after /app
  const resource = path[0] || "";

  // Handle nested routes like admin/aircraft, admin/airports, etc.
  if (path.length > 1) {
    // For nested routes like admin/aircraft, check if user has "admin" permission
    // or the specific nested resource
    if (resource === "admin") {
      // For admin routes, check admin permission
      return "admin";
    }
    if (resource === "settings") {
      // For settings routes, check settings permission
      return "settings";
    }
    if (resource === "quotes" && (path[1] === "edit" || path[1] === "create")) {
      // For quote edit/create, check quotes permission
      return "quotes";
    }
  }

  // Map special cases
  const resourceMap: Record<string, string> = {
    "": "", // Dashboard - empty string (accessible to all logged-in users)
    "quotes": "quotes",
    "operations": "operations",
    "security": "security",
    "library": "library",
    "camo": "camo",
    "engineering": "engineering",
    "crew": "crew",
    "training-sales": "training-sales",
    "manuals": "manuals",
    "accounts": "accounts",
    "audit": "audit",
    "admin": "admin",
    "settings": "settings",
    "trip-confirmation": "operations", // Map to operations
    "staff-leave": "operations", // Map to operations
    "trip-detail": "operations", // Map to operations
    "sales-confirmation-preview": "quotes", // Map to quotes
    "passenger-detail": "quotes", // Map to quotes
  };

  return resourceMap[resource] || resource;
};

/**
 * Check if user can access a route based on pathname
 */
export const canAccessRoute = (
  session: ISession | null,
  pathname: string
): boolean => {
  // Allow landing page and login
  if (pathname === "/" || pathname === "/login") {
    return true;
  }

  // Require session for all other routes
  if (!session) {
    return false;
  }

  // Dashboard is accessible to all logged-in users
  if (pathname === "/app" || pathname === "/app/") {
    return true;
  }

  // Get resource from path
  const resource = getResourceFromPath(pathname);

  // If resource is empty (dashboard), allow access
  if (!resource) {
    return true;
  }

  // Check if resource is in admin or settings (these have children)
  if (resource === "admin" || resource === "settings") {
    // For parent routes, check if user has any child permission
    const resources = getUserResources(session);
    // Check if user has any permission starting with the parent
    return resources.some((r) => r.startsWith(resource));
  }

  // Check direct permission
  return hasPermission(session, resource);
};
