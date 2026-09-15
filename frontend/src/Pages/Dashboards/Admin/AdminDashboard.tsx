import React from 'react';
import { 
  LayoutDashboard, BarChart3, Wallet, Users, FileText, Calendar, Settings, LifeBuoy, 
  Search, Bell, Moon, ChevronDown, ArrowUpRight, ArrowDownRight, Filter, Plus, MoreVertical,
  CheckCircle2, AlertCircle, ShoppingCart, RefreshCw, Laptop, Headphones, Watch, Camera,
  ShieldCheck, UserCheck, Beef, QrCode, DollarSign, Handshake, Stethoscope, Building2,
  MessageSquare, AlertTriangle, Lock, SlidersHorizontal, ChevronRight
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';

// --- Mock Data (Adapted for AniMarket) ---

const transactionVolumeData = [
  { name: 'Jan', volume: 4000, escrow: 2400 },
  { name: 'Feb', volume: 3000, escrow: 1398 },
  { name: 'Mar', volume: 2000, escrow: 9800 },
  { name: 'Apr', volume: 2780, escrow: 3908 },
  { name: 'May', volume: 1890, escrow: 4800 },
  { name: 'Jun', volume: 2390, escrow: 3800 },
  { name: 'Jul', volume: 3490, escrow: 4300 },
];

const platformActivityData = [
  { name: 'Jan', users: 40, animals: 24 }, { name: 'Feb', users: 30, animals: 13 },
  { name: 'Mar', users: 60, animals: 98 }, { name: 'Apr', users: 45, animals: 39 },
  { name: 'May', users: 70, animals: 48 }, { name: 'Jun', users: 50, animals: 38 },
  { name: 'Jul', users: 80, animals: 43 }, { name: 'Aug', users: 55, animals: 48 },
  { name: 'Sep', users: 65, animals: 38 }, { name: 'Oct', users: 40, animals: 43 },
  { name: 'Nov', users: 60, animals: 48 }, { name: 'Dec', users: 75, animals: 55 },
];

const platformBreakdownData = [
  { name: 'Farmers', value: 400, color: 'var(--primary)' },
  { name: 'Customers', value: 300, color: 'var(--success)' },
  { name: 'Hotels', value: 150, color: 'var(--warning)' },
  { name: 'Vets', value: 80, color: 'var(--sale)' },
];

const farmerRegData = [
  { name: 'Jan', value: 40 }, { name: 'Feb', value: 30 }, { name: 'Mar', value: 60 },
  { name: 'Apr', value: 45 }, { name: 'May', value: 70 }, { name: 'Jun', value: 50 },
  { name: 'Jul', value: 80 }, { name: 'Aug', value: 55 }, { name: 'Sep', value: 65 },
];

const animalListingData = [
  { name: 'Jan', value: 20 }, { name: 'Feb', value: 40 }, { name: 'Mar', value: 30 },
  { name: 'Apr', value: 50 }, { name: 'May', value: 40 }, { name: 'Jun', value: 60 },
  { name: 'Jul', value: 50 }, { name: 'Aug', value: 70 }, { name: 'Sep', value: 60 },
];

const pendingVerifications = [
  { id: 1, name: 'Green Valley Farms', type: 'Farmer Account', date: '10:00 AM', status: 'Pending', icon: UserCheck },
  { id: 2, name: 'Angus Bull #A-102', type: 'Animal Listing', date: '09:30 AM', status: 'Pending', icon: Beef },
  { id: 3, name: 'Grand Plaza Hotel', type: 'Hotel Account', date: '09:15 AM', status: 'Pending', icon: Building2 },
  { id: 4, name: 'Dr. Sarah Smith', type: 'Veterinarian', date: '08:45 AM', status: 'Pending', icon: Stethoscope },
  { id: 5, name: 'Holstein Cow #C-405', type: 'Animal Listing', date: '08:30 AM', status: 'Pending', icon: Beef },
];

// --- Sub Components ---

const SidebarItem = ({ icon: Icon, label, active = false, badge, hasSubmenu = false }: { icon: any, label: string, active?: boolean, badge?: string, hasSubmenu?: boolean }) => (
  <div className={`flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors ${
    active 
      ? 'bg-[var(--primary)] text-white border-l-4 border-[var(--accent)]' 
      : 'text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--glass-hover)]'
  }`}>
    <div className="flex items-center gap-3">
      <Icon size={16} />
      <span className="text-xs font-medium">{label}</span>
    </div>
    <div className="flex items-center gap-1">
      {badge && <span className="bg-[var(--primary)] text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">{badge}</span>}
      {hasSubmenu && <ChevronRight size={14} className="opacity-50" />}
    </div>
  </div>
);

const StatCard = ({ title, value, change, isPositive, icon: Icon }: any) => (
  <div className="bg-[#f8fafc] p-5 rounded-lg shadow-[var(--shadow)] border border-[var(--border)] flex flex-col justify-between">
    <div className="flex justify-between items-start mb-4">
      <span className="text-[var(--text-secondary)] text-xs font-medium">{title}</span>
      <div className="p-2 bg-[var(--glass)] rounded-md text-[var(--primary)]">
        <Icon size={18} />
      </div>
    </div>
    <div>
      <h3 className="text-2xl font-bold text-[var(--text)] mb-1">{value}</h3>
      <div className="flex items-center text-xs gap-1">
        <span className={`flex items-center ${isPositive ? 'text-[var(--success)]' : 'text-[var(--sale)]'}`}>
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {change}
        </span>
        <span className="text-[var(--text-secondary)]">Since last month</span>
      </div>
    </div>
  </div>
);

// --- Main Layout ---

const AdminDashboard = () => {
  return (
    <div className="flex h-screen bg-[var(--bg)] font-sans text-[var(--text)] overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#10b981] flex flex-col flex-shrink-0 border-r border-[var(--border)]">
        <div className="h-16 flex items-center px-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-2 text-[var(--text)] font-bold text-xl tracking-tight">
            <span className="text-[var(--primary)] text-2xl"></span> AniMarket
          </div>
        </div>
        
        <div className="flex-1  hover:overflow-y-auto bg-[#059669] py-4 custom-scrollbar">
          <div className="px-4 mb-2 text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Main</div>
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
          
          <div className="px-4 mt-6 mb-2 text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">User Management</div>
          <SidebarItem icon={Users} label="Manage Farmers" hasSubmenu />
          <SidebarItem icon={Users} label="Manage Customers" hasSubmenu />
          <SidebarItem icon={Building2} label="Manage Hotels" hasSubmenu />
          <SidebarItem icon={Stethoscope} label="Manage Vets" hasSubmenu />
          <SidebarItem icon={ShieldCheck} label="Roles & Permissions" />
          
          <div className="px-4 mt-6 mb-2 text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Livestock & Verification</div>
          <SidebarItem icon={Beef} label="All Livestock" hasSubmenu />
          <SidebarItem icon={QrCode} label="Animal Passports" hasSubmenu />
          <SidebarItem icon={FileText} label="Ownership Docs" badge="12" />
          <SidebarItem icon={CheckCircle2} label="Pending Verifications" badge="8" />
          
          <div className="px-4 mt-6 mb-2 text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Transactions & Agreements</div>
          <SidebarItem icon={DollarSign} label="All Transactions" />
          <SidebarItem icon={Handshake} label="Agreements" />
          <SidebarItem icon={AlertTriangle} label="Disputes" badge="3" />
          
          <div className="px-4 mt-6 mb-2 text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">System & Settings</div>
          <SidebarItem icon={Stethoscope} label="Veterinary Records" />
          <SidebarItem icon={MessageSquare} label="Communication" />
          <SidebarItem icon={BarChart3} label="Reports & Analytics" />
          <SidebarItem icon={Lock} label="Security & Logs" />
          <SidebarItem icon={SlidersHorizontal} label="Platform Settings" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header */}
        <header className="h-16 bg-[#10b981] border-b border-[var(--border)] flex items-center justify-between px-6 flex-shrink-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            <h1 className="text-lg font-bold text-[var(--text)]">Admin Overview</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={16} />
              <input 
                type="text" 
                placeholder="Search users, animals, transactions..." 
                className="pl-9 pr-4 py-1.5 bg-[var(--surface-container)] rounded-md text-sm border-none focus:ring-2 focus:ring-[var(--primary)] outline-none w-72 text-[var(--text)] placeholder-[var(--text-secondary)]"
              />
            </div>
            
            <div className="flex items-center gap-4 text-[var(--text-secondary)] text-sm">
               <div className="flex items-center gap-2 cursor-pointer border-r pr-4 border-[var(--border)]">
                 <img src="https://flagcdn.com/w20/gb.png" alt="UK" className="w-5 rounded-sm" />
                 <span className="font-medium text-[var(--text)]">English</span>
                 <ChevronDown size={14} />
               </div>
               <button className="hover:text-[var(--primary)] transition-colors relative">
                 <Bell size={18} />
                 <span className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--sale)] rounded-full border-2 border-[var(--surface)]"></span>
               </button>
               <button className="hover:text-[var(--primary)] transition-colors"><Moon size={18} /></button>
               <button className="hover:text-[var(--primary)] transition-colors"><Settings size={18} /></button>
               <div className="flex items-center gap-2 cursor-pointer border-l pl-4 border-[var(--border)]">
                  <div className="w-8 h-8 rounded-full bg-[var(--surface-container)] flex items-center justify-center text-[var(--primary)] text-xs font-bold">AD</div>
                  <div className="hidden lg:block">
                    <p className="text-xs font-bold text-[var(--text)] leading-none">Admin User</p>
                    <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">Super Admin</p>
                  </div>
                  <ChevronDown size={14} />
               </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#f8fafc]">
          
          {/* Top Controls */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-[var(--text-secondary)]">Platform Status: <span className="text-[var(--success)] font-medium">All systems operational</span></div>
            <div className="flex items-center gap-3">
              <button className="px-3 py-1.5 bg-[#f8fafc] border border-[var(--border)] rounded text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--glass-hover)]">Today</button>
              <button className="p-1.5 bg-[var(--primary)] text-white rounded hover:bg-[var(--secondary)]"><Plus size={16} /></button>
              <button className="p-1.5 bg-[var(--surface-container)] text-[var(--text-secondary)] rounded hover:bg-[var(--glass-hover)]"><MoreVertical size={16} /></button>
            </div>
          </div>

          {/* Stats Row - KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard title="Total Users" value="12,854" change="+5.02%" isPositive={true} icon={Users} />
            <StatCard title="Total Livestock" value="8,543" change="+2.08%" isPositive={true} icon={Beef} />
            <StatCard title="Pending Verifications" value="142" change="-12.0%" isPositive={false} icon={ShieldCheck} />
            <StatCard title="Total Transactions" value="$2.4M" change="+18.56%" isPositive={true} icon={DollarSign} />
          </div>

          {/* Middle Row - Farmers, Animals, Platform Activity */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-6">
            
            {/* Farmer Registrations */}
            <div className="xl:col-span-1 bg-[#f8fafc] p-5 rounded-lg shadow-[var(--shadow)] border border-[var(--border)] flex flex-col justify-between">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-bold text-[var(--text)] uppercase">Farmer Regs</h3>
                  <button className="text-[10px] border border-[var(--border)] px-2 py-1 rounded text-[var(--text-secondary)] hover:bg-[var(--glass-hover)]">Details</button>
               </div>
               <div className="h-32 w-full mb-2">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={farmerRegData}>
                     <Bar dataKey="value" fill="var(--primary)" radius={[2, 2, 0, 0]} barSize={8} />
                   </BarChart>
                 </ResponsiveContainer>
               </div>
               <div className="flex justify-between items-end border-t border-[var(--border)] pt-3">
                 <div>
                   <p className="text-xl font-bold text-[var(--text)]">3,254</p>
                   <p className="text-[10px] text-[var(--text-secondary)]">Last Month <span className="text-[var(--success)] font-medium">+5.02%</span></p>
                 </div>
               </div>
            </div>

            {/* Animal Listings */}
            <div className="xl:col-span-1 bg-[#f8fafc] p-5 rounded-lg shadow-[var(--shadow)] border border-[var(--border)] flex flex-col justify-between">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-bold text-[var(--text)] uppercase">Animal Listings</h3>
                  <button className="text-[10px] border border-[var(--border)] px-2 py-1 rounded text-[var(--text-secondary)] hover:bg-[var(--glass-hover)]">View Report</button>
               </div>
               <div className="h-32 w-full mb-2">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={animalListingData}>
                     <Bar dataKey="value" fill="var(--primary)" radius={[2, 2, 0, 0]} barSize={8} />
                   </BarChart>
                 </ResponsiveContainer>
               </div>
               <div className="flex justify-between items-end border-t border-[var(--border)] pt-3">
                 <div>
                   <p className="text-xl font-bold text-[var(--text)]">8,543</p>
                   <p className="text-[10px] text-[var(--text-secondary)]">Last Month <span className="text-[var(--sale)] font-medium">-1.08%</span></p>
                 </div>
               </div>
            </div>

            {/* Platform Activity */}
            <div className="xl:col-span-2 bg-[#f8fafc] p-5 rounded-lg shadow-[var(--shadow)] border border-[var(--border)]">
               <h3 className="text-xs font-bold text-[var(--text)] uppercase mb-4">Platform Activity (Users vs Animals)</h3>
               <div className="h-48 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={platformActivityData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                     <XAxis dataKey="name" tick={{fontSize: 10, fill: 'var(--text-secondary)'}} axisLine={false} tickLine={false} />
                     <YAxis tick={{fontSize: 10, fill: 'var(--text-secondary)'}} axisLine={false} tickLine={false} />
                     <Tooltip cursor={{fill: 'var(--glass)'}} contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }} />
                     <Bar dataKey="users" fill="var(--primary)" radius={[2, 2, 0, 0]} barSize={8} />
                     <Bar dataKey="animals" fill="var(--success)" radius={[2, 2, 0, 0]} barSize={8} />
                   </BarChart>
                 </ResponsiveContainer>
               </div>
            </div>
          </div>

          {/* Transaction Volume & Region */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            {/* Transaction Volume Chart */}
            <div className="xl:col-span-2 bg-[#f8fafc] p-5 rounded-lg shadow-[var(--shadow)] border border-[var(--border)]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-bold text-[var(--text)] uppercase">Transaction Volume</h3>
                <div className="flex gap-4 text-[10px]">
                   <div className="flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span>
                     <span className="text-[var(--text-secondary)]">Marketplace <span className="text-[var(--text)] font-bold">$58,254</span></span>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-[var(--success)]"></span>
                     <span className="text-[var(--text-secondary)]">Escrow <span className="text-[var(--text)] font-bold">$29,524</span></span>
                   </div>
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={transactionVolumeData}>
                    <defs>
                      <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorEscrow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--success)" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: 'var(--text-secondary)'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: 'var(--text-secondary)'}} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }} />
                    <Area type="monotone" dataKey="volume" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorVolume)" />
                    <Area type="monotone" dataKey="escrow" stroke="var(--success)" strokeWidth={2} fillOpacity={1} fill="url(#colorEscrow)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Livestock by Region */}
            <div className="xl:col-span-1 bg-[#f8fafc] p-5 rounded-lg shadow-[var(--shadow)] border border-[var(--border)] flex flex-col">
               <h3 className="text-xs font-bold text-[var(--text)] uppercase mb-4">Livestock by Region</h3>
               
               {/* Map Placeholder */}
               <div className="w-full h-32 bg-[var(--surface-container)] rounded mb-4 relative overflow-hidden flex items-center justify-center border border-[var(--border)]">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(var(--primary) 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                  <span className="text-[var(--text-secondary)] text-xs z-10 font-medium">Regional Heatmap</span>
                  {/* Mock Pins */}
                  <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[var(--primary)] rounded-full border-2 border-[var(--surface)] shadow"></div>
                  <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-[var(--primary)] rounded-full border-2 border-[var(--surface)] shadow"></div>
                  <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-[var(--primary)] rounded-full border-2 border-[var(--surface)] shadow"></div>
               </div>

               <div className="space-y-4 flex-1">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5"><span className="text-[var(--text-secondary)] font-medium">Northern Region</span> <span className="text-[var(--text)] font-bold">2,450</span></div>
                    <div className="w-full bg-[var(--surface-container)] h-1 rounded-full overflow-hidden"><div className="bg-[var(--primary)] h-full w-[72%] rounded-full"></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1.5"><span className="text-[var(--text-secondary)] font-medium">Southern Region</span> <span className="text-[var(--text)] font-bold">1,890</span></div>
                    <div className="w-full bg-[var(--surface-container)] h-1 rounded-full overflow-hidden"><div className="bg-[var(--primary)] h-full w-[39%] rounded-full"></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1.5"><span className="text-[var(--text-secondary)] font-medium">Eastern Region</span> <span className="text-[var(--text)] font-bold">1,250</span></div>
                    <div className="w-full bg-[var(--surface-container)] h-1 rounded-full overflow-hidden"><div className="bg-[var(--primary)] h-full w-[25%] rounded-full"></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1.5"><span className="text-[var(--text-secondary)] font-medium">Western Region</span> <span className="text-[var(--text)] font-bold">2,953</span></div>
                    <div className="w-full bg-[var(--surface-container)] h-1 rounded-full overflow-hidden"><div className="bg-[var(--primary)] h-full w-[61%] rounded-full"></div></div>
                  </div>
               </div>
            </div>
          </div>

          {/* Bottom Row: Pending Verifications, Platform Breakdown, Recent Alerts */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            
            {/* Pending Verifications Table */}
            <div className="xl:col-span-2 bg-[#f8fafc] rounded-lg shadow-[var(--shadow)] border border-[var(--border)] overflow-hidden">
               <div className="p-4 border-b border-[var(--border)] flex justify-between items-center">
                 <h3 className="text-xs font-bold text-[var(--text)] uppercase">Pending Verifications</h3>
                 <button className="flex items-center gap-1 text-[10px] text-[var(--text-secondary)] border border-[var(--border)] px-2 py-1 rounded hover:bg-[var(--glass-hover)] font-medium">
                   <Filter size={10} /> Filter
                 </button>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm whitespace-nowrap">
                   <thead className="bg-[var(--surface-container)] text-[var(--text-secondary)] text-[10px] uppercase font-bold">
                     <tr>
                       <th className="px-4 py-3">Entity Name</th>
                       <th className="px-4 py-3">Type</th>
                       <th className="px-4 py-3">Time</th>
                       <th className="px-4 py-3 text-right">Action</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-[var(--border)]">
                     {pendingVerifications.map((item) => (
                       <tr key={item.id} className="hover:bg-[var(--glass-hover)] transition-colors">
                         <td className="px-4 py-3">
                           <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded bg-[var(--surface-container)] flex items-center justify-center text-[var(--primary)] shrink-0">
                               <item.icon size={16} />
                             </div>
                             <div>
                               <div className="font-medium text-[var(--text)]">{item.name}</div>
                               <div className="text-[10px] text-[var(--text-secondary)]">ID: #00{item.id}</div>
                             </div>
                           </div>
                         </td>
                         <td className="px-4 py-3 text-[var(--text-secondary)] text-xs">{item.type}</td>
                         <td className="px-4 py-3 text-[var(--text-secondary)] text-xs">{item.date}</td>
                         <td className="px-4 py-3 text-right">
                           <button className="text-[10px] bg-[var(--primary)] text-white px-2 py-1 rounded hover:bg-[var(--secondary)]">Review</button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>

            {/* Platform Breakdown (Pie Chart) */}
            <div className="xl:col-span-1 bg-[#f8fafc] p-5 rounded-lg shadow-[var(--shadow)] border border-[var(--border)] flex flex-col">
              <h3 className="text-xs font-bold text-[var(--text)] uppercase mb-4">Platform Breakdown</h3>
              <div className="h-40 w-full relative mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={platformBreakdownData} 
                      innerRadius={50} 
                      outerRadius={70} 
                      paddingAngle={5} 
                      dataKey="value"
                    >
                      {platformBreakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] text-[var(--text-secondary)] uppercase font-bold">Total</span>
                  <span className="text-lg font-bold text-[var(--text)]">12,854</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                {platformBreakdownData.map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-[var(--text-secondary)]">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Alerts & Disputes */}
            <div className="xl:col-span-1 bg-[#f8fafc] p-5 rounded-lg shadow-[var(--shadow)] border border-[var(--border)]">
              <h3 className="text-xs font-bold text-[var(--text)] uppercase mb-4">Recent Alerts & Disputes</h3>
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[var(--border)] before:to-transparent">
                
                <div className="relative flex items-start gap-3">
                  <div 
                    className="w-4 h-4 rounded-full border-2 border-[var(--surface)] flex items-center justify-center shrink-0 mt-0.5 z-10"
                    style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
                  >
                    <AlertTriangle size={10} className="text-[var(--sale)]" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-secondary)] leading-snug">
                      <span className="font-bold text-[var(--text)]">Ownership Dispute</span> - Farmer John vs Buyer Mike over Cow #C-405
                    </p>
                    <span className="text-[10px] text-[var(--text-secondary)] mt-1 block">10:00 AM</span>
                  </div>
                </div>

                <div className="relative flex items-start gap-3">
                  <div 
                    className="w-4 h-4 rounded-full border-2 border-[var(--surface)] flex items-center justify-center shrink-0 mt-0.5 z-10"
                    style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)' }}
                  >
                    <AlertCircle size={10} className="text-[var(--warning)]" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-secondary)] leading-snug">
                      <span className="font-bold text-[var(--text)]">Payment Failed</span> - Transaction #TRX-9821 for Angus Bull
                    </p>
                    <span className="text-[10px] text-[var(--text-secondary)] mt-1 block">09:30 AM</span>
                  </div>
                </div>

                <div className="relative flex items-start gap-3">
                  <div 
                    className="w-4 h-4 rounded-full border-2 border-[var(--surface)] flex items-center justify-center shrink-0 mt-0.5 z-10"
                    style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)' }}
                  >
                    <ShieldCheck size={10} className="text-[var(--primary)]" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-secondary)] leading-snug">
                      <span className="font-bold text-[var(--text)]">Verification Approved</span> - Vet Dr. Sarah Smith account verified
                    </p>
                    <span className="text-[10px] text-[var(--text-secondary)] mt-1 block">09:15 AM</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

          <div className="h-6"></div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;