import { Loader } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { authUser } = useAuthStore();




  if (!authUser) return <Navigate to="/login" replace />;

  return children;
};
export default ProtectedRoute;