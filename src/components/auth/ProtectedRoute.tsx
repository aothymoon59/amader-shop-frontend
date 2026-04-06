import { Navigate, useLocation } from "react-router-dom";

import { useAuth, type UserRole } from "@/context/AuthContext";

const getLoginPath = (role: UserRole) =>
  role === "admin" || role === "super-admin" ? "/admin/login" : "/login";

const ProtectedRoute = ({
  allowedRoles,
  children,
}: {
  allowedRoles: UserRole[];
  children: JSX.Element;
}) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to={getLoginPath(allowedRoles[0])} replace state={{ from: location.pathname }} />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={getLoginPath(allowedRoles[0])} replace />;
  }

  return children;
};

export default ProtectedRoute;
