import { NavLink } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All Categories');

  return (
    <nav className="bg-white border-b border-gray-200">
      {/* ── Top Row: Logo + Search ── */}
      <div className="flex items-center gap-3 px-4 py-2">

        {/* Brand */}
        <NavLink to="/" className="flex items-center shrink-0">
          <span className="text-2xl font-bold tracking-tight">
            <span className="text-blue-600">Ani</span>
            <span className="text-red-500">mar</span>
            <span className="text-yellow-400">ket</span>
          </span>
        </NavLink>

        {/* Browse by category */}
        <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-blue-600 whitespace-nowrap shrink-0 px-2 py-1 rounded hover:bg-gray-100 transition-colors">
          Browse by category
          <svg className="w-3.5 h-3.5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Search Bar */}
        <div className="flex flex-1 border-2 border-gray-800 rounded overflow-hidden">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for anything"
            className="flex-1 px-4 py-2 text-sm text-gray-700 placeholder-gray-400 bg-white focus:outline-none"
          />

          {/* Category Selector */}
          <div className="flex items-center border-l border-gray-300 bg-gray-50">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="text-sm text-gray-600 px-3 py-2 bg-transparent focus:outline-none cursor-pointer"
            >
              <option>All Categories</option>
              <option>Figures & Merch</option>
              <option>Manga & Books</option>
              <option>Apparel</option>
              <option>Collectibles</option>
              <option>Art Prints</option>
            </select>
          </div>

          {/* Search Button */}
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 text-sm transition-colors">
            Search
          </button>
        </div>

        {/* Advanced */}
        <a href="#" className="text-sm text-gray-500 hover:text-blue-600 shrink-0 hover:underline">
          Advanced
        </a>
      </div>

      {/* ── Bottom Row: Category Nav ── */}
      <div className="border-t border-gray-100">
        <div className="flex items-center gap-0.5 px-4 overflow-x-auto scrollbar-none">
          {[
            { to: '/', label: 'Home', end: true },
          ].map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `text-sm font-medium px-3 py-2.5 whitespace-nowrap border-b-2 transition-colors ${
                  isActive
                    ? 'border-gray-800 text-gray-900'
                    : 'border-transparent text-gray-600 hover:text-blue-600'
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          {/* Saved (with heart icon) */}
          <NavLink
            to="/saved"
            className={({ isActive }) =>
              `flex items-center gap-1 text-sm px-3 py-2.5 whitespace-nowrap border-b-2 transition-colors ${
                isActive
                  ? 'border-gray-800 text-gray-900'
                  : 'border-transparent text-gray-600 hover:text-blue-600'
              }`
            }
          >
            <Heart className="w-3.5 h-3.5 fill-red-400 text-red-400" />
            Saved
          </NavLink>

          {/* Category links */}
          {[
            { to: '/figures',      label: 'Figures & Merch' },
            { to: '/manga',        label: 'Manga & Books' },
            { to: '/apparel',      label: 'Apparel' },
            { to: '/collectibles', label: 'Collectibles & Art' },
            { to: '/posters',      label: 'Posters' },
            { to: '/cosplay',      label: 'Cosplay' },
            { to: '/accessories',  label: 'Accessories' },
            { to: '/home-decor',   label: 'Home & Decor' },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `text-sm px-3 py-2.5 whitespace-nowrap border-b-2 transition-colors ${
                  isActive
                    ? 'border-gray-800 text-gray-900 font-medium'
                    : 'border-transparent text-gray-600 hover:text-blue-600'
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          {/* Deals (accent) */}
          <NavLink
            to="/deals"
            className={({ isActive }) =>
              `text-sm font-semibold px-3 py-2.5 whitespace-nowrap border-b-2 transition-colors ${
                isActive
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-orange-500 hover:text-orange-600'
              }`
            }
          >
            Deals
          </NavLink>

          {/* Sell */}
          <NavLink
            to="/sell"
            className={({ isActive }) =>
              `text-sm px-3 py-2.5 whitespace-nowrap border-b-2 transition-colors ${
                isActive
                  ? 'border-gray-800 text-gray-900 font-medium'
                  : 'border-transparent text-gray-600 hover:text-blue-600'
              }`
            }
          >
            Sell
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;