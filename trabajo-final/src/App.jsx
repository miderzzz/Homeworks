import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';
import { CatalogProvider } from './Context/CatalogContext';
import { CartProvider } from './Context/CartContext';
import AppRoutes from './Routes/AppRoutes';

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <CatalogProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </CatalogProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
