import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import {
  Heart,
  User,
  ShoppingCart,
  Menu,
  ChevronDown,
  Search,
} from 'lucide-react';
import { useTheme } from '../Contexts/ThemeContext';
import { MdDarkMode } from "react-icons/md";
import { FaSun } from "react-icons/fa";

const Navbar = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const { theme, toggleTheme } = useTheme();

  const categories = ['All', 'Cows', 'Goats', 'Horses', 'Pigs', 'Chicken', 'Sheep'];

  const navLinks = [
    { to: '/promotions', label: 'Promotions' },
    { to: '/contact-us', label: 'Contact Us' },
    { to: '/location', label: 'Location' },
    { to: '/our-partnership', label: 'Partnership' },
    { to: '/about-us', label: 'About Us' },
    { to: '/our-services', label: 'Services' },
  ];

  return (
    <nav className="font-nunito sticky top-0 z-50 bg-[var(--bg)] border-b border-[var(--border)]">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-[var(--surface)] to-[#1E232B] text-[var(--text)] text-center text-xs py-1.5 tracking-wide">
        FREE SHIPPING on orders over <span className="text-[var(--highlight)] font-bold">$49</span> •
        NEW DROPS every Friday • Use code <span className="text-[var(--highlight)] font-bold">OTAKU15</span> for 15% OFF
      </div>

      {/* Secondary Bar */}
      <div className="bg-[var(--surface)] px-6 py-2 flex justify-end items-center gap-6 text-sm border-b border-[var(--border)]">
        {['Help Center', 'Track Order', 'Sell on Animarket'].map((text) => (
          <a key={text} href="#" className="text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors">
            {text}
          </a>
        ))}
        <div className="flex items-center gap-4">
          <a href="#" className="text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors">Sign In</a>
          <span className="text-[var(--border)]">|</span>
          <a href="#" className="text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors">Register</a>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-[var(--surface-container)] px-6 py-4 flex items-center gap-6">
        {/* Logo */}
        <NavLink to="/" className="flex-shrink-0">
          <img src="/images/brand.png" alt="Animarket" className="h-16 w-auto" />
        </NavLink>

        {/* Browse Button */}
        <button className="flex items-center gap-2 bg-[var(--surface)] hover:bg-[#252B35] text-[var(--text)] border border-[var(--border)] hover:border-[var(--primary)] px-5 py-3 rounded-xl font-semibold transition-all duration-200">
          <Menu size={20} />
          Browse
          <ChevronDown size={16} />
        </button>

        {/* Search Bar - Minimized Width */}
        <div className="flex-1 max-w-2xl mx-4">
          <div className="flex border-2 border-[var(--primary)] rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-[var(--primary)]/30 bg-[var(--surface)]">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search animals, locations, breeders..."
              className="flex-1 bg-transparent px-5 py-3.5 text-sm placeholder-[var(--text-secondary)] focus:outline-none text-[var(--text)]"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-[var(--surface-container)] text-[var(--text)] border-l border-[var(--border)] px-4 py-3.5 text-sm font-medium focus:outline-none cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <button className="bg-[var(--primary)] hover:bg-[var(--secondary)] px-7 text-white font-semibold flex items-center gap-2 transition-colors">
              <Search size={20} />
              Search
            </button>
          </div>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-3 rounded-xl hover:bg-[var(--surface)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text)]"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <MdDarkMode size={24} /> : <FaSun size={24} />}
          </button>

          {/* Language Selector */}
          <select className="bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded-xl px-3 py-3 text-sm font-medium focus:outline-none cursor-pointer">
            <option value="en">EN</option>
            <option value="es">ES</option>
            <option value="fr">FR</option>
            <option value="rw">RW</option>
          </select>

          {/* Wishlist */}
          <NavLink
            to="/wishlist"
            className="p-3 text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface)] rounded-xl transition-all"
          >
            <Heart size={24} />
          </NavLink>

          {/* Account */}
          <NavLink
            to="/account"
            className="p-3 text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface)] rounded-xl transition-all"
          >
            <User size={24} />
          </NavLink>

          {/* Cart */}
          <NavLink
            to="/cart"
            className="relative p-3 text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface)] rounded-xl transition-all flex flex-col items-center"
          >
            <ShoppingCart size={24} />
            <span className="absolute -top-1 -right-1 bg-[var(--sale)] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[var(--surface-container)]">
              5
            </span>
            <span className="text-[10px] mt-0.5 font-medium">Cart</span>
          </NavLink>
        </div>
      </div>

      <div className="bg-[var(--surface)] border-t border-[var(--border)] px-6 flex items-center overflow-x-auto scrollbar-none">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              isActive
                ? 'text-[var(--primary)] border-[var(--primary)] bg-[var(--primary)]/10'
                : 'text-[var(--text-secondary)] hover:text-[var(--text)] border-transparent hover:border-[var(--primary)]/30'
            }`
          }
        >
          <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />
          Home
        </NavLink>

        {navLinks.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `px-6 py-4 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'text-[var(--primary)] border-[var(--primary)] bg-[var(--primary)]/10'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text)] border-transparent hover:border-[var(--primary)]/30'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;