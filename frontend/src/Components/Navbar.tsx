import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import {
  Heart, User, ShoppingCart, Menu, ChevronDown, Search
} from 'lucide-react';

const Navbar = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const categories = [
    'All', 'Figures', 'Manga', 'Apparel', 'Art Prints', 'Cosplay',
  ];

  const navLinks = [
    { to: '/figures',       label: 'Figures & Statues' },
    { to: '/manga',         label: 'Manga & Books' },
    { to: '/apparel',       label: 'Apparel' },
    { to: '/collectibles',  label: 'Collectibles & Art' },
    { to: '/posters',       label: 'Posters & Prints' },
    { to: '/cosplay',       label: 'Cosplay' },
    { to: '/accessories',   label: 'Accessories' },
    { to: '/home-decor',    label: 'Home & Decor' },
  ];

  return (
    <nav className="font-nunito">

      {/* ── Announcement Bar ── */}
      <div className="bg-red-700 text-white text-center text-xs font-semibold tracking-wide py-1.5 px-4">
        <span className="opacity-85 mx-3">
          FREE SHIPPING on orders over <span className="text-yellow-300 font-bold">$49</span>
        </span>
        <span className="opacity-40">|</span>
        <span className="opacity-85 mx-3">NEW SEASON DROPS every Friday</span>
        <span className="opacity-40">|</span>
        <span className="opacity-85 mx-3">
          Use code <span className="text-yellow-300 font-bold">OTAKU15</span> for 15% off
        </span>
      </div>

      {/* ── Top Utility Bar ── */}
      <div className="bg-[#0d1220] border-b border-[#1e2a3a] px-6 py-1.5 flex justify-end items-center gap-4">
        {['Help Center', 'Track Order', 'Sell on Animarket'].map((link, i) => (
          <span key={i} className="flex items-center gap-4">
            <a href="#" className="text-[#9aa5b4] text-xs hover:text-red-500 transition-colors">
              {link}
            </a>
            <span className="text-[#2a3547] text-xs">|</span>
          </span>
        ))}
        <a href="#" className="text-[#9aa5b4] text-xs hover:text-red-500 transition-colors">Sign In</a>
        <span className="text-[#2a3547] text-xs">|</span>
        <a href="#" className="text-[#9aa5b4] text-xs hover:text-red-500 transition-colors">Register</a>
      </div>

      {/* ── Main Bar ── */}
      <div className="bg-[#111827] px-6 py-3 flex items-center gap-4">

        {/* Brand Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center font-cinzel font-black text-xl text-white">
            A
          </div>
          <div className="font-cinzel font-bold text-xl leading-none">
            <div className="text-white tracking-wide">ANI</div>
            <div className="text-red-500 tracking-wide">MARKET</div>
          </div>
        </NavLink>

        {/* Browse Button */}
        <button className="flex items-center gap-1.5 bg-[#1e2a3a] text-[#9aa5b4] border border-[#2a3a4e] rounded-lg px-3.5 py-2.5 text-sm font-semibold whitespace-nowrap shrink-0 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200">
          <Menu size={15} />
          Browse
          <ChevronDown size={13} className="mt-0.5" />
        </button>

        {/* Search Bar */}
        <div className="flex flex-1 border-2 border-red-600 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-red-500/30 min-w-0">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anime figures, manga, cosplay..."
            className="flex-1 bg-[#1a2332] text-slate-200 placeholder-slate-600 px-4 py-2.5 text-sm focus:outline-none min-w-0"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-red-600 text-white border-l border-white/20 px-3 py-2.5 text-sm font-semibold cursor-pointer focus:outline-none shrink-0"
          >
            {categories.map((c) => (
              <option key={c} value={c} className="bg-[#1a2332] text-slate-200">{c}</option>
            ))}
          </select>
          <button className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 text-sm font-bold transition-colors shrink-0 flex items-center gap-2">
            <Search size={15} />
            Search
          </button>
        </div>

        {/* Icon Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Saved */}
          <NavLink to="/saved" className="relative flex flex-col items-center gap-0.5 p-2 rounded-lg text-[#9aa5b4] hover:text-red-500 hover:bg-[#1e2a3a] transition-all">
            <Heart size={20} />
            <span className="text-[10px] font-semibold">Saved</span>
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-[#111827]">3</span>
          </NavLink>

          {/* Account */}
          <NavLink to="/account" className="flex flex-col items-center gap-0.5 p-2 rounded-lg text-[#9aa5b4] hover:text-red-500 hover:bg-[#1e2a3a] transition-all">
            <User size={20} />
            <span className="text-[10px] font-semibold">Account</span>
          </NavLink>

          {/* Cart */}
          <NavLink to="/cart" className="relative flex flex-col items-center gap-0.5 p-2 rounded-lg text-[#9aa5b4] hover:text-red-500 hover:bg-[#1e2a3a] transition-all">
            <ShoppingCart size={20} />
            <span className="text-[10px] font-semibold">Cart</span>
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-[#111827]">5</span>
          </NavLink>
        </div>
      </div>

      {/* ── Category Nav Bar ── */}
      <div className="bg-[#0f172a] border-t border-[#1e2a3a] border-b-2 border-b-red-600 px-6 flex items-stretch overflow-x-auto scrollbar-none">

        {/* Home */}
        <NavLink
          to="/" end
          className={({ isActive }) =>
            `flex items-center gap-1.5 text-xs font-bold px-3.5 py-2.5 whitespace-nowrap border-b-[3px] -mb-0.5 transition-all ${
              isActive
                ? 'text-red-500 border-red-500 bg-red-500/5'
                : 'text-[#9aa5b4] border-transparent hover:text-white hover:border-red-500 hover:bg-red-500/5'
            }`
          }
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          Home
        </NavLink>

        {/* Saved */}
        <NavLink
          to="/saved"
          className={({ isActive }) =>
            `flex items-center gap-1.5 text-xs font-bold px-3.5 py-2.5 whitespace-nowrap border-b-[3px] -mb-0.5 transition-all ${
              isActive
                ? 'text-red-500 border-red-500'
                : 'text-[#9aa5b4] border-transparent hover:text-white hover:border-red-500 hover:bg-red-500/5'
            }`
          }
        >
          <Heart size={12} className="fill-red-500 text-red-500" />
          Saved
        </NavLink>

        {/* Category Links */}
        {navLinks.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `text-xs font-bold px-3.5 py-2.5 whitespace-nowrap border-b-[3px] -mb-0.5 transition-all ${
                isActive
                  ? 'text-red-500 border-red-500 bg-red-500/5'
                  : 'text-[#9aa5b4] border-transparent hover:text-white hover:border-red-500 hover:bg-red-500/5'
              }`
            }
          >
            {label}
          </NavLink>
        ))}

        {/* Deals — Gold accent */}
        <NavLink
          to="/deals"
          className={({ isActive }) =>
            `text-xs font-bold px-3.5 py-2.5 whitespace-nowrap border-b-[3px] -mb-0.5 transition-all ${
              isActive
                ? 'text-yellow-400 border-yellow-400'
                : 'text-yellow-500 border-transparent hover:text-yellow-300 hover:border-yellow-400'
            }`
          }
        >
          Deals
        </NavLink>

        {/* Sell */}
        <NavLink
          to="/sell"
          className={({ isActive }) =>
            `text-xs font-bold px-3.5 py-2.5 whitespace-nowrap border-b-[3px] -mb-0.5 transition-all ${
              isActive
                ? 'text-red-500 border-red-500'
                : 'text-[#9aa5b4] border-transparent hover:text-white hover:border-red-500 hover:bg-red-500/5'
            }`
          }
        >
          Sell
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;