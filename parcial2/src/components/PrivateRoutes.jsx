import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../provider/AuthContext";

function PrivateRoutes() {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <p>Cargando...</p>
  return user ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoutes;