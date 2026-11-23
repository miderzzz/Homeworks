import { Route, Routes } from 'react-router-dom';
import ClientLayout from '../Components/Shared/ClientLayout';
import UserRoutes from './UserRoutes';
import AdminRoutes from './AdminRoutes';
import Index from '../Pages/Index/Index';
import Catalog from '../Pages/Catalog/Catalog';
import ProductDetail from '../Pages/ProductDetail/ProductDetail';
import Cart from '../Pages/Cart/Cart';
import Checkout from '../Pages/Checkout/Checkout';
import Confirmation from '../Pages/Confirmation/Confirmation';
import Login from '../Pages/Login/Login';
import Register from '../Pages/Register/Register';
import NotFound from '../Pages/NotFound/NotFound';

const AppRoutes = () => (
  <Routes>
    <Route element={<ClientLayout />}>
      <Route index element={<Index />} />
      <Route path="catalogo/:league?/:team?/:version?" element={<Catalog />} />
      <Route path="producto/:id" element={<ProductDetail />} />
      <Route path="carrito" element={<Cart />} />
      <Route path="checkout" element={<Checkout />} />
      <Route path="confirmacion/:code" element={<Confirmation />} />
      <Route path="login" element={<Login />} />
      <Route path="registro" element={<Register />} />
      <Route path="mis-pedidos/*" element={<UserRoutes />} />
      <Route path="*" element={<NotFound />} />
    </Route>
    <Route path="admin/*" element={<AdminRoutes />} />
  </Routes>
);

export default AppRoutes;
