import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Heart,
  User,
  ShoppingCart,
  Menu,
  ChevronDown,
  Search,
  Tag,
  RotateCcw,
  Truck,
} from 'lucide-react';
import { useTheme } from '../Contexts/ThemeContext';
import { useCart } from '../Contexts/CartContext';
import { MdDarkMode } from 'react-icons/md';
import { FaSun } from 'react-icons/fa';
import { GrAnnounce } from 'react-icons/gr';
import { IoLocationOutline } from 'react-icons/io5';
import { SiContributorcovenant } from 'react-icons/si';
import { HiUserGroup } from 'react-icons/hi2';
import { SiWechat } from 'react-icons/si';
import { SiKingstontechnology } from 'react-icons/si';
import { useNavigate } from 'react-router-dom';

const slides = [
  {
    icon: <Tag size={15} />,
    text: (
      <>
        🎉 <strong>First purchase?</strong> Enjoy an exclusive{' '}
        <span className="text-[var(--highlight)] font-extrabold">
          20% OFF
        </span>{' '}
        — automatically applied at checkout!
      </>
    ),
  },
  {
    icon: <RotateCcw size={15} />,
    text: (
      <>
        💰 <strong>Loyalty reward:</strong> Get{' '}
        <span className="text-[var(--highlight)] font-extrabold">
          10% cashback
        </span>{' '}
        credited to your wallet within{' '}
        <span className="text-[var(--highlight)] font-extrabold">
          3 months
        </span>{' '}
        of your first order!
      </>
    ),
  },
  {
    icon: <Truck size={15} />,
    text: (
      <>
        🚚 <strong>FREE SHIPPING</strong> on orders over{' '}
        <span className="text-[var(--highlight)] font-extrabold">
          $49
        </span>{' '}
        • New drops every Friday • Code{' '}
        <span className="text-[var(--highlight)] font-extrabold">
          OTAKU15
        </span>{' '}
        = 15% OFF
      </>
    ),
  },
];

const SlidingBanner = () => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true);

      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
        setAnimating(false);
      }, 400);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#0f1923] via-[#1a2535] to-[#0f1923] text-white text-center text-xs py-2.5 tracking-wide select-none">
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--highlight)] to-transparent opacity-60" />
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-40" />

      <div
        key={current}
        style={{
          animation: animating
            ? 'slideOut 0.4s ease forwards'
            : 'slideIn 0.45s cubic-bezier(0.22,1,0.36,1) forwards',
        }}
        className="flex items-center justify-center gap-2 px-4"
      >
        <span className="text-[var(--highlight)]">
          {slides[current].icon}
        </span>

        <span className="text-[var(--text-secondary)]">
          {slides[current].text}
        </span>
      </div>

      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1.5">
        {slides.map((_, i) => {
          return (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-4 h-1.5 bg-[var(--highlight)]'
                  : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'
              }`}
            />
          );
        })}
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideOut {
          from {
            opacity: 1;
            transform: translateY(0);
          }

          to {
            opacity: 0;
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
};

const Navbar = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const { theme, toggleTheme } = useTheme();
  const { cartCount, cartTotal, likeCount } = useCart();
  const navigate = useNavigate();   // Fixed declaration

  const categories = [
    'All',
    'Cows',
    'Goats',
    'Horses',
    'Pigs',
    'Chicken',
    'Sheep',
  ];

  const utilityLinks = [
    'Help Center',
    'Track Order',
    'Sell on Animarket',
  ];

  const navLinks = [
    {
      to: '/promotions',
      label: 'Promotions',
      icon: <GrAnnounce size={15} />,
    },
    {
      to: '/contact-us',
      label: 'Contact Us',
      icon: <SiWechat size={15} />,
    },
    {
      to: '/location',
      label: 'Location',
      icon: <IoLocationOutline size={15} />,
    },
    {
      to: '/our-partnership',
      label: 'Partnership',
      icon: <SiContributorcovenant size={15} />,
    },
    {
      to: '/about-us',
      label: 'About Us',
      icon: <HiUserGroup size={15} />,
    },
    {
      to: '/our-services',
      label: 'Services',
      icon: <SiKingstontechnology size={15} />,
    },
  ];

  return (
    <nav className="font-nunito sticky top-0 z-50 bg-[var(--bg)] border-b border-[var(--border)]">
      <SlidingBanner />

      {/* Utility Bar */}
      <div className="bg-[var(--surface)] px-6 py-2 flex justify-end items-center gap-6 text-xs border-b border-[var(--border)]">
        {utilityLinks.map((text) => {
          return (
            <a
              key={text}
              href="#"
              className="text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
            >
              {text}
            </a>
          );
        })}

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors font-medium"
          >
            Sign In
          </button>

          <span className="text-[var(--border)]">|</span>

          <a
            onClick={() => navigate('/register')}  
            className="bg-[var(--primary)] hover:bg-[var(--secondary)] text-white text-xs font-semibold px-3 py-2 rounded-md transition-colors cursor-pointer"
          >
            Register
          </a>
        </div>
      </div>

      {/* Main Bar */}
      <div className="bg-[var(--surface-container)] px-6 py-3.5 flex items-center gap-5">
        <NavLink to="/" className="flex-shrink-0">
          <img
            src="/images/brand.png"
            alt="Animarket"
            className="h-14 w-auto"
          />
        </NavLink>

        <button className="flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--secondary)] text-white px-5 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg shrink-0">
          <Menu size={18} />
          Browse
          <ChevronDown size={14} />
        </button>

        {/* Search */}
        <div className="flex-1 max-w-2xl">
          <div className="flex border-2 border-[var(--primary)] rounded-2xl overflow-hidden bg-[var(--surface)] shadow-sm">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search animals, locations, breeders..."
              className="flex-1 bg-transparent px-5 py-3 text-sm placeholder-[var(--text-secondary)] focus:outline-none text-[var(--text)]"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-[var(--surface-container)] text-[var(--text)] border-l border-[var(--border)] px-3 py-3 text-sm font-medium focus:outline-none cursor-pointer"
            >
              {categories.map((cat) => {
                return (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                );
              })}
            </select>

            <button className="bg-[var(--primary)] hover:bg-[var(--secondary)] px-6 text-white font-semibold flex items-center gap-2 transition-colors">
              <Search size={18} />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl hover:bg-[var(--surface)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text)]"
            title="Toggle Theme"
          >
            {theme === 'dark' ? (
              <MdDarkMode size={22} />
            ) : (
              <FaSun size={22} />
            )}
          </button>

          <select className="bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded-xl px-2.5 py-2.5 text-sm font-medium focus:outline-none cursor-pointer">
            <option value="en">EN</option>
            <option value="es">ES</option>
            <option value="fr">FR</option>
            <option value="rw">RW</option>
          </select>

          <NavLink
            to="/wishlist"
            title={
              likeCount > 0
                ? `${likeCount} saved item${likeCount > 1 ? 's' : ''}`
                : 'Wishlist'
            }
            className="relative p-2.5 text-[var(--text-secondary)] hover:text-red-400 hover:bg-[var(--surface)] rounded-xl transition-all"
          >
            <Heart size={22} />

            {likeCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-[var(--surface-container)]">
                {likeCount}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/account"
            className="p-2.5 text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface)] rounded-xl transition-all"
          >
            <User size={22} />
          </NavLink>

          <NavLink
            to="/cart"
            title={
              cartCount > 0
                ? `${cartCount} item${cartCount > 1 ? 's' : ''} — $${
                    cartTotal + cartCount * 75
                  } total`
                : 'Cart is empty'
            }
            className="relative p-2.5 text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface)] rounded-xl transition-all flex flex-col items-center"
          >
            <ShoppingCart size={22} />

            <span className="absolute -top-0.5 -right-0.5 bg-[var(--sale)] text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-[var(--surface-container)]">
              {cartCount}
            </span>

            <span className="text-[9px] mt-0.5 font-semibold tracking-tight">
              Cart
            </span>
          </NavLink>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="bg-[var(--surface)] border-t border-[var(--border)] px-6 flex items-center overflow-x-auto scrollbar-none">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              isActive
                ? 'text-[var(--primary)] border-[var(--primary)] bg-[var(--primary)]/10'
                : 'text-[var(--text-secondary)] hover:text-[var(--text)] border-transparent hover:border-[var(--primary)]/30 hover:bg-[var(--primary)]/5'
            }`
          }
        >
          <span className="w-2 h-2 rounded-full bg-[var(--primary)] shrink-0" />
          Home
        </NavLink>

        {navLinks.map(({ to, label, icon }) => {
          return (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'text-[var(--primary)] border-[var(--primary)] bg-[var(--primary)]/10'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text)] border-transparent hover:border-[var(--primary)]/30 hover:bg-[var(--primary)]/5'
                }`
              }
            >
              <span className="shrink-0 opacity-80">{icon}</span>
              {label}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;