import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Guards routes like /dashboard. While the initial silent-refresh check
// (in AuthContext) is still running, we show nothing rather than
// bouncing the user to /login prematurely.
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="center-message">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
