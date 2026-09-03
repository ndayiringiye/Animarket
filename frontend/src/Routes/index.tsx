import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from "../Components/Home/HeroSection";
import About from '../Pages/About';
import Contact from '../Pages/Contact';
import LoginPages from '../Pages/Auths/LoginPages';
import ForgotPassword from '../Pages/Auths/ForgotPassword';
import ResetPassword from '../Pages/Auths/ResetPassword';
import Layout from '../Components/Layout';
import DashboardPage from '../Pages/Dashboards/HotelDashboard';
import CustomerDashboard from '../Pages/Dashboards/Buying/CustomerDashboard';
import HotelDashboard from "../Pages/Dashboards/HotelDashboard"
import VeterinaryRequests from "../Pages/Dashboards/VeterinaryRequests";
import FarmerDashboard from "../Pages/Dashboards/Farmer/FarmerDashboard";
import AgentDashboard from "../Pages/Dashboards/AgentDashboard";
import AdminDashboard from "../Pages/Dashboards/AdminDashboard";

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
        </Route>
        {/* Customer Dashboard standalone */}
        <Route path="/dashboard/buying" element={<CustomerDashboard />} />
        <Route path="/dashboard/hotel" element={<HotelDashboard />} />
        <Route path="/product/farmer" element={<FarmerDashboard />} />
        <Route path="/agent/animal" element={<AgentDashboard />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/dashboard/veterinary" element={<VeterinaryRequests />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;