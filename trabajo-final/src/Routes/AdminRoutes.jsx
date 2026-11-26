import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from '../Hooks/useAuth';
import Loader from '../Components/Shared/Loader';
import AdminLayout from '../Components/Admin/AdminLayout';
import { AdminProvider } from '../Context/AdminContext';
import Products from '../Pages/Admin/Products/Products';
import ProductForm from '../Pages/Admin/ProductForm/ProductForm';
import Discounts from '../Pages/Admin/Discounts/Discounts';
import Inventory from '../Pages/Admin/Inventory/Inventory';
import Orders from '../Pages/Admin/Orders/Orders';
import Team from '../Pages/Admin/Team/Team';

const AdminRoutes = () => {
  const { user, isAdmin, isOwner, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <AdminProvider>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="pedidos" replace />} />
          <Route path="uniformes" element={<Products />} />
          <Route path="uniformes/nuevo" element={<ProductForm />} />
          <Route path="uniformes/:id" element={<ProductForm />} />
          <Route path="pedidos" element={<Orders />} />
          <Route path="inventario" element={<Inventory />} />
          <Route path="descuentos" element={<Discounts />} />
          <Route path="equipo" element={isOwner ? <Team /> : <Navigate to="/admin/pedidos" replace />} />
          <Route path="*" element={<Navigate to="uniformes" replace />} />
        </Route>
      </Routes>
    </AdminProvider>
  );
};

export default AdminRoutes;
