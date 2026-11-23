import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from '../Hooks/useAuth';
import Loader from '../Components/Shared/Loader';
import MyOrders from '../Pages/MyOrders/MyOrders';

const UserRoutes = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  return (
    <Routes>
      <Route index element={<MyOrders />} />
    </Routes>
  );
};

export default UserRoutes;
