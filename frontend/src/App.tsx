import AppRoutes from './Routes';
import { ThemeProvider } from './Contexts/ThemeContext';
import { CartProvider } from './Contexts/CartContext';
import { AuthProvider } from '../src/Contexts/AuthContext';
import { HotelAuthProvider } from '../src/Contexts/HotelAuthContext';

const App = () => {
  return (
    <AuthProvider>
      <HotelAuthProvider>
        <ThemeProvider>
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </ThemeProvider>
      </HotelAuthProvider>
    </AuthProvider>
  );
};

export default App;