import { Navigate } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";

const getRedirectPath = (role?: string) => {
  switch (role) {
    case "provider":
      return "/provider/dashboard";
    case "admin":
      return "/admin/dashboard";
    case "super-admin":
      return "/super-admin/dashboard";
    case "customer":
    default:
      return "/account/settings";
  }
};

const PublicOnlyRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={getRedirectPath(user?.role)} replace />;
  }

  return children;
};

export default PublicOnlyRoute;
