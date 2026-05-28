import AppRoutes from './Routes';
import { ThemeProvider } from './Contexts/ThemeContext';
import { CartProvider } from './Contexts/CartContext';

const App = () => {
  return (
    <ThemeProvider>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </ThemeProvider>
  );
};

export default App;