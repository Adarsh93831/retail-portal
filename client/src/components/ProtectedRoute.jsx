import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/authStore";
import Spinner from "./Spinner";

/**
 * ProtectedRoute Component
 * Restricts route access to authenticated users and optional role checks.
 * Props: { requiredRole?: String }
 */
const ProtectedRoute = ({ requiredRole }) => {
  const { user, isLoggedIn, isLoading } = useAuthStore();

  if (isLoading) {
    return <Spinner label="Checking session..." />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
