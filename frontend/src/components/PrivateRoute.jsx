import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ allowedRoles }) => {
  const { authUser,token } = useAuth();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  const role = authUser?.role; // Expecting 'doctor' or 'patient'
  if (!allowedRoles.includes(role))
    return <Navigate to="/unauthorized" replace />;

  return <Outlet />; // This renders the nested routes inside the private route
};

export default PrivateRoute;
