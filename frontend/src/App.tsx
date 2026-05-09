import AppRoutes from './Routes';
import { ThemeProvider } from './Contexts/ThemeContext';

const App = () => {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
};

export default App;
