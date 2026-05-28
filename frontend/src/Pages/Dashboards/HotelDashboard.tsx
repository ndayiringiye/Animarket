'use client';

import { useState } from "react";

// ── Icons ─────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 16, className = "", viewBox = "0 0 24 24", stroke = true }) => (
  <svg width={size} height={size} viewBox={viewBox} fill={stroke ? "none" : "currentColor"}
    stroke={stroke ? "currentColor" : "none"} strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" className={className}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const icons = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  Animals: "M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16M1 21h22",
  bookings: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  guests: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  finance: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  reports: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  settings: "M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
  search: "M11 19A8 8 0 1 0 11 3a8 8 0 0 0 0 16zM21 21l-4.35-4.35",
  plus: "M12 5v14M5 12h14",
  arrowUp: "M18 15l-6-6-6 6",
  arrowDown: "M6 9l6 6 6-6",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6",
  edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  trash: "M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6",
  filter: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  map: "M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4zM8 2v16M16 6v16",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  building: "M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18zM6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2M10 6h4M10 10h4M10 14h4M10 18h4",
  creditCard: "M1 4h22v16H1zM1 10h22",
  moon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
  sun: "M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 5a7 7 0 1 0 0 14A7 7 0 0 0 12 5z",
};

// ── Reusable Components ───────────────────────────────────────────────────────
const Badge = ({ children, color = "green" }) => {
  const map = {
    green: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
    yellow: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20",
    red: "bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/20",
    blue: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/20",
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${map[color]}`}>{children}</span>;
};

const StatCard = ({ label, value, change, positive, icon, color }) => {
  const colorMap = {
    green: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400" },
    amber: { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400" },
    blue: { bg: "bg-sky-500/10", text: "text-sky-600 dark:text-sky-400" },
    purple: { bg: "bg-violet-500/10", text: "text-violet-600 dark:text-violet-400" },
  };
  const c = colorMap[color] || colorMap.green;

  return (
    <div className="rounded-2xl p-5 flex flex-col gap-3 transition-all border bg-white dark:bg-[#16191f] border-gray-200 dark:border-white/[0.07] hover:border-gray-300 dark:hover:border-white/[0.13]">
      <div className="flex items-center justify-between">
        <span className="text-gray-500 dark:text-[#94a3b8] text-sm font-medium">{label}</span>
        <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center ${c.text}`}>
          <Icon d={icon} size={16} />
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white font-['Sora']">{value}</div>
        <div className={`text-xs mt-1 flex items-center gap-1 ${positive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
          <Icon d={positive ? icons.arrowUp : icons.arrowDown} size={12} />
          {change} vs last month
        </div>
      </div>
      <div className="flex gap-1 items-end h-8">
        {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
          <div key={i} className={`flex-1 rounded-sm ${i === 6 ? "bg-emerald-500" : "bg-gray-200 dark:bg-white/10"}`} style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
};

// Mock Data
const properties = [
  { id: 1, name: "Grand Azure Resort", location: "Bali, Indonesia", type: "Resort", status: "active", rooms: 120, revenue: "$8.2K", occupancy: 91, rating: 4.9, img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80", tags: ["Pool", "Spa", "Restaurant"] },
  { id: 2, name: "L'Hôtel Boutique", location: "Paris, France", type: "Boutique", status: "active", rooms: 34, revenue: "$4.5K", occupancy: 88, rating: 4.8, img: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80", tags: ["Bar", "Gym", "Concierge"] },
  { id: 3, name: "The Regent Tower", location: "Dubai, UAE", type: "Luxury", status: "maintenance", rooms: 280, revenue: "$18K", occupancy: 76, rating: 4.7, img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80", tags: ["Rooftop", "Pool", "Spa"] },
  { id: 4, name: "Sakura City Hotel", location: "Tokyo, Japan", type: "Business", status: "active", rooms: 90, revenue: "$6.1K", occupancy: 94, rating: 4.6, img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80", tags: ["WiFi", "Gym", "Lounge"] },
  { id: 5, name: "Cape Shore Retreat", location: "Cape Town, SA", type: "Resort", status: "active", rooms: 60, revenue: "$3.8K", occupancy: 82, rating: 4.5, img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80", tags: ["Beach", "Bar", "Yoga"] },
  { id: 6, name: "Nordic Fjord Lodge", location: "Bergen, Norway", type: "Boutique", status: "inactive", rooms: 22, revenue: "$1.2K", occupancy: 55, rating: 4.3, img: "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=400&q=80", tags: ["Fireplace", "Sauna"] },
];

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: icons.dashboard },
  { id: "properties", label: "Properties", icon: icons.properties },
  { id: "bookings", label: "Bookings", icon: icons.bookings },
  { id: "guests", label: "Guests", icon: icons.guests },
  { id: "finance", label: "Agreements", icon: icons.finance },
  { id: "reports", label: "Reports", icon: icons.reports },
  { id: "settings", label: "Settings", icon: icons.settings },
];

// Sidebar
const Sidebar = ({ active, setActive }) => (
  <aside className="w-[220px] min-h-screen bg-white dark:bg-[#0f1117] border-r border-gray-200 dark:border-white/[0.06] flex flex-col pt-6 pb-6 shrink-0">
    <div className="px-6 mb-8 flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
        <Icon d={icons.building} size={16} className="text-white" />
      </div>
      <span className="font-['Sora'] font-bold text-gray-900 dark:text-white text-lg">LuxHosp</span>
    </div>

    <div className="px-4 mb-6">
      <button onClick={() => setActive("properties")} className="w-full flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl py-2.5 px-4 transition-all">
        <Icon d={icons.plus} size={14} /> New Property
      </button>
    </div>

    <nav className="flex-1 flex flex-col gap-0.5 px-3">
      {navItems.map(n => (
        <button
          key={n.id}
          onClick={() => setActive(n.id)}
          className={`flex items-center gap-3 text-sm px-3 py-2.5 rounded-xl w-full text-left transition-all ${
            active === n.id
              ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 font-semibold"
              : "text-gray-600 dark:text-[#94a3b8] hover:bg-gray-100 dark:hover:bg-white/[0.05] hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <Icon d={n.icon} size={16} />
          {n.label}
        </button>
      ))}
    </nav>

    <div className="px-4 mt-4 pt-4 border-t border-gray-200 dark:border-white/[0.06] flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-xs font-bold text-white">JS</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">James Sterling</p>
        <p className="text-[10px] text-gray-500 dark:text-[#94a3b8] truncate">Admin</p>
      </div>
      <Icon d={icons.logout} size={14} className="text-gray-400 dark:text-[#94a3b8] hover:text-gray-600 dark:hover:text-white cursor-pointer" />
    </div>
  </aside>
);

// Topbar
const Topbar = ({ title, subtitle, darkMode, setDarkMode }) => (
  <div className="h-16 flex items-center justify-between px-8 border-b border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#0c0e12] shrink-0">
    <div>
      <h1 className="text-lg font-bold text-gray-900 dark:text-white font-['Sora']">{title}</h1>
      {subtitle && <p className="text-xs text-gray-500 dark:text-[#94a3b8]">{subtitle}</p>}
    </div>

    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#16191f] border border-gray-200 dark:border-white/[0.07] rounded-xl px-3 py-2">
        <Icon d={icons.search} size={14} className="text-gray-400 dark:text-[#94a3b8]" />
        <input placeholder="Search properties, guests…" className="bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-[#94a3b8] outline-none w-48" />
      </div>

      <button onClick={() => setDarkMode(!darkMode)} className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-[#16191f] border border-gray-200 dark:border-white/[0.07] flex items-center justify-center text-gray-500 dark:text-[#94a3b8] hover:text-gray-700 dark:hover:text-white transition-all">
        <Icon d={darkMode ? icons.sun : icons.moon} size={16} />
      </button>

      <div className="relative">
        <button className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-[#16191f] border border-gray-200 dark:border-white/[0.07] flex items-center justify-center text-gray-500 dark:text-[#94a3b8] hover:text-gray-700 dark:hover:text-white transition-all">
          <Icon d={icons.bell} size={16} />
        </button>
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 border border-white dark:border-[#0c0e12]" />
      </div>

      <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl px-4 py-2 transition-all">
        <Icon d={icons.plus} size={14} /> Quick Action
      </button>
    </div>
  </div>
);

// ── Pages ─────────────────────────────────────────────────────────────────────
const DashboardPage = () => (
  <div className="p-8 flex flex-col gap-6 overflow-y-auto bg-gray-50 dark:bg-[#0c0e12]">
    <div className="grid grid-cols-4 gap-5">
      <StatCard label="Total Revenue" value="$2.4M" change="+12.5%" positive icon={icons.creditCard} color="green" />
      <StatCard label="Active Bookings" value="1,842" change="+8.3%" positive icon={icons.bookings} color="blue" />
      <StatCard label="Avg. Room Rate" value="$480K" change="-2.1%" positive={false} icon={icons.bed} color="amber" />
      <StatCard label="Properties" value="312" change="+4.7%" positive icon={icons.building} color="purple" />
    </div>
  </div>
);

const PropertiesPage = () => {
  const [view, setView] = useState("grid");
  const [filter, setFilter] = useState({ location: "All Locations", status: "All Status", type: "All Types" });

  return (
    <div className="p-8 overflow-y-auto bg-gray-50 dark:bg-[#0c0e12]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900 dark:text-white font-bold text-xl font-['Sora']">Property Portfolio</h2>
          <p className="text-xs text-gray-500 dark:text-[#94a3b8] mt-0.5">Managing 54 prime hotel destinations globally</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setView("grid")} className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${view==="grid" ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400" : "bg-white dark:bg-[#16191f] border-gray-200 dark:border-white/[0.07] text-gray-500 dark:text-[#94a3b8]"}`}>
            <Icon d={icons.grid} size={16} />
          </button>
          <button onClick={() => setView("list")} className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${view==="list" ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400" : "bg-white dark:bg-[#16191f] border-gray-200 dark:border-white/[0.07] text-gray-500 dark:text-[#94a3b8]"}`}>
            <Icon d={icons.list} size={16} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        {[
          ["location", ["All Locations","Asia","Europe","Middle East","Africa"]],
          ["status", ["All Status","Active","Inactive","Maintenance"]],
          ["type", ["All Types","Resort","Boutique","Luxury","Business"]]
        ].map(([key, opts]) => (
          <select key={key} value={filter[key]} onChange={e => setFilter(f => ({...f, [key]: e.target.value}))}
            className="bg-white dark:bg-[#16191f] border border-gray-200 dark:border-white/[0.07] text-gray-600 dark:text-[#94a3b8] text-sm rounded-xl px-3 py-2 outline-none">
            {opts.map(o => <option key={o}>{o}</option>)}
          </select>
        ))}
        <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl px-4 py-2 transition-all">
          <Icon d={icons.filter} size={14} /> Apply Filters
        </button>
      </div>

      {/* GRID VIEW */}
      {view === "grid" ? (
        <div className="grid grid-cols-3 gap-5">
          {properties.map(p => (
            <div key={p.id} className="bg-white dark:bg-[#16191f] border border-gray-200 dark:border-white/[0.07] rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all group">
              <div className="relative h-44 overflow-hidden">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-3 left-3">
                  <Badge color={p.status==="active"?"green":p.status==="maintenance"?"yellow":"red"}>{p.status}</Badge>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-gray-900 dark:text-white font-semibold font-['Sora'] text-sm">{p.name}</h3>
                <p className="text-xs text-gray-500 dark:text-[#94a3b8] mt-0.5 flex items-center gap-1">
                  <Icon d={icons.map} size={11} />{p.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white dark:bg-[#16191f] border border-gray-200 dark:border-white/[0.07] rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/[0.07]">
                {["Property","Location","Type","Rooms","Revenue","Occupancy","Status","Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-gray-500 dark:text-[#94a3b8] text-xs font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {properties.map(p => (
                <tr key={p.id} className="border-b border-gray-100 dark:border-white/[0.05] hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img src={p.img} className="w-9 h-9 rounded-lg object-cover" alt={p.name} />
                      <span className="text-gray-900 dark:text-white font-semibold text-xs">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-600 dark:text-[#94a3b8] text-xs">{p.location}</td>
                  <td className="px-5 py-4 text-gray-600 dark:text-[#94a3b8] text-xs">{p.type}</td>
                  <td className="px-5 py-4 text-gray-900 dark:text-white text-xs font-semibold">{p.rooms}</td>
                  <td className="px-5 py-4 text-emerald-600 dark:text-emerald-400 text-xs font-bold">{p.revenue}</td>
                  <td className="px-5 py-4 text-gray-900 dark:text-white text-xs">{p.occupancy}%</td>
                  <td className="px-5 py-4"><Badge color={p.status==="active"?"green":p.status==="maintenance"?"yellow":"red"}>{p.status}</Badge></td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <button className="w-7 h-7 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center"><Icon d={icons.eye} size={12} /></button>
                      <button className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-white/[0.05] hover:bg-gray-200 dark:hover:bg-white/[0.08] text-gray-500 dark:text-[#94a3b8] flex items-center justify-center"><Icon d={icons.edit} size={12} /></button>
                      <button className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-white/[0.05] hover:bg-red-500/15 text-gray-500 dark:text-[#94a3b8] hover:text-red-500 flex items-center justify-center"><Icon d={icons.trash} size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const FinancePage = () => (
  <div className="p-8 overflow-y-auto bg-gray-50 dark:bg-[#0c0e12]">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Finance & Agreements</h1>
  </div>
);

const PlaceholderPage = ({ title }) => (
  <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-16 bg-gray-50 dark:bg-[#0c0e12]">
    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
      <Icon d={icons.building} size={28} />
    </div>
    <h2 className="text-xl font-bold text-gray-900 dark:text-white font-['Sora']">{title}</h2>
    <p className="text-gray-500 dark:text-[#94a3b8] text-sm max-w-xs">This section is under construction. Check back soon.</p>
  </div>
);

const pageMeta = {
  dashboard: { title: "Executive Analytics", subtitle: "Real-time overview of your hotel operating portfolio" },
  properties: { title: "Property Portfolio", subtitle: "Managing 54 prime hotel destinations globally" },
  bookings: { title: "Bookings", subtitle: "Manage reservations and availability" },
  guests: { title: "Guests", subtitle: "Guest profiles and history" },
  finance: { title: "Agreements & Financials", subtitle: "Contracts and transaction overview" },
  reports: { title: "Reports", subtitle: "Analytics and performance reports" },
  settings: { title: "Settings", subtitle: "System configuration" },
};

// Root
const HotelDashboard = () => {
  const [active, setActive] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(true);
  const meta = pageMeta[active] || { title: active, subtitle: "" };

  const renderPage = () => {
    if (active === "dashboard") return <DashboardPage />;
    if (active === "properties") return <PropertiesPage />;
    if (active === "finance") return <FinancePage />;
    return <PlaceholderPage title={meta.title} />;
  };

  return (
    <div className={`flex min-h-screen font-['Inter'] transition-colors ${darkMode ? 'dark' : ''} bg-gray-50 dark:bg-[#0c0e12]`}>
      <Sidebar active={active} setActive={setActive} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title={meta.title} subtitle={meta.subtitle} darkMode={darkMode} setDarkMode={setDarkMode} />
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default HotelDashboard;