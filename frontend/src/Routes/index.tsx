import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from "../Components/Home/HeroSection";
import About from '../Pages/About';
import Contact from '../Pages/Contact';
import LoginPages from '../Pages/Auths/LoginPages';
import ForgotPassword from '../Pages/Auths/ForgotPassword';
import ResetPassword from '../Pages/Auths/ResetPassword';
import Layout from '../Components/Layout';
import DashboardPage from '../Pages/Dashboards/HotelDashboard';
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* All pages wrapped inside Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<LoginPages />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="dashboard" element={<DashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;