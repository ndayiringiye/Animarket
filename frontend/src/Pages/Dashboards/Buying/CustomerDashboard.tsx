import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  DollarSign, 
  Calendar, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  TrendingUp,
  PawPrint,
  MoreHorizontal,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../../Contexts/AuthContext';

// --- Types ---

type Booking = {
  _id: string;
  bookingNumber?: string;
  animal?: { name?: string } | string | null;
  price?: number;
  negotiatedPrice?: number;
  currency?: string;
  status?: string;
  createdAt?: string;
};

type Animal = {
  _id: string;
  name?: string;
  type?: string;
  price?: number;
  images?: string[];
};

type Meeting = {
  _id: string;
  title?: string;
  meetingDate?: string;
  status?: string;
};

// --- Helper Components & Functions ---

const StatusBadge: React.FC<{ status?: string }> = ({ status }) => {
  const normalizedStatus = status?.toLowerCase() || 'unknown';
  
  const config: Record<string, { color: string, icon: React.ReactNode }> = {
    completed: { 
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20', 
      icon: <CheckCircle2 className="w-3 h-3" /> 
    },
    pending: { 
      color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20', 
      icon: <Clock className="w-3 h-3" /> 
    },
    cancelled: { 
      color: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20', 
      icon: <XCircle className="w-3 h-3" /> 
    },
    confirmed: { 
      color: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20', 
      icon: <CheckCircle2 className="w-3 h-3" /> 
    },
    default: { 
      color: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20', 
      icon: <AlertCircle className="w-3 h-3" /> 
    }
  };

  const { color, icon } = config[normalizedStatus] || config.default;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${color}`}>
      {icon}
      {status || 'Unknown'}
    </span>
  );
};

const StatCard: React.FC<{ 
  label: string; 
  value: string | number; 
  description: string; 
  icon: React.ReactNode;
  trend?: string;
}> = ({ label, value, description, icon, trend }) => (
  <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:shadow-lg hover:shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-none">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</p>
        <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{value}</p>
      </div>
      <div className="rounded-xl bg-slate-50 p-2.5 text-slate-600 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-indigo-500/10 dark:group-hover:text-indigo-400">
        {icon}
      </div>
    </div>
    <div className="mt-4 flex items-center gap-2">
      {trend && (
        <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <TrendingUp className="w-3 h-3" /> {trend}
        </span>
      )}
      <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  </div>
);

const SectionHeader: React.FC<{ 
  title: string; 
  subtitle: string; 
  action?: React.ReactNode 
}> = ({ title, subtitle, action }) => (
  <div className="flex items-center justify-between mb-6">
    <div>
      <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
    </div>
    {action}
  </div>
);


const CustomerDashboard: React.FC = () => {
  const { user, loading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSpend = useMemo(() => 
    bookings.reduce((sum, b) => sum + (b.negotiatedPrice ?? b.price ?? 0), 0),
    [bookings]
  );

  const upcomingMeetingsCount = useMemo(() => 
    meetings.filter(m => m.status?.toLowerCase() !== 'completed').length,
    [meetings]
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      setError(null);
      try {
        const [bookingsResp, animalsResp, meetingsResp] = await Promise.all([
          axios.get('http://localhost:4000/api/bookings/my-bookings'),
          axios.get('http://localhost:4000/api/animal/animals'),
          axios.get('http://localhost:4000/api/meeting')
        ]);

        const normalize = (payload: any) => Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
        
        setBookings(normalize(bookingsResp.data));
        setAnimals(normalize(animalsResp.data));
        setMeetings(normalize(meetingsResp.data));
      } catch (err: any) {
        console.error('Dashboard data fetch error:', err);
        setError(err?.response?.data?.message || err.message || 'Unable to load dashboard data. Please try again later.');
      } finally {
        setLoadingData(false);
      }
    };

    if (!loading && user) fetchData();
  }, [user, loading]);

  const formatCurrency = (val: number, currency = 'USD') => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(val);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-indigo-100 selection:text-indigo-700 dark:bg-[#020617] dark:text-slate-200">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <header className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Customer Overview</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
            </h1>
            <p className="max-w-2xl text-base text-slate-500 dark:text-slate-400">
              Your command center for managing livestock acquisitions, scheduling expert consultations, and tracking market trends.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:w-[600px]">
            <StatCard 
              label="Active Orders" 
              value={bookings.length} 
              description="Total processed" 
              icon={<ShoppingBag className="w-5 h-5" />}
            />
            <StatCard 
              label="Investment" 
              value={formatCurrency(totalSpend)} 
              description="Lifetime spend" 
              icon={<DollarSign className="w-5 h-5" />}
              trend="+12%"
            />
            <StatCard 
              label="Schedule" 
              value={upcomingMeetingsCount} 
              description="Pending meetings" 
              icon={<Calendar className="w-5 h-5" />}
            />
          </div>
        </header>

        {error && (
          <div className="mb-8 flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800 dark:border-rose-500/20 dark:bg-rose-950/30 dark:text-rose-300">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="grid gap-8 xl:grid-cols-3">
          
          {/* Main Content Column */}
          <div className="xl:col-span-2 space-y-8">
            
            {/* Recent Bookings Section */}
            <section className="rounded-3xl border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="p-6 pb-2">
                <SectionHeader 
                  title="Recent Acquisitions" 
                  subtitle="Detailed log of your latest animal bookings and status updates."
                  action={
                    <button className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
                      View All <ArrowRight className="w-4 h-4" />
                    </button>
                  }
                />
              </div>

              <div className="px-6 pb-6">
                {loadingData ? (
                  <div className="flex h-48 flex-col items-center justify-center gap-3 text-slate-400">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
                    <p className="text-sm font-medium">Synchronizing records...</p>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-12 dark:border-slate-800 dark:bg-slate-950/30">
                    <ShoppingBag className="mb-4 h-12 w-12 text-slate-300 dark:text-slate-700" />
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">No bookings yet</p>
                    <p className="mt-1 text-sm text-slate-500">Your recent animal purchases will appear here.</p>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
                        <tr>
                          <th className="px-4 py-3">Identifier</th>
                          <th className="px-4 py-3">Animal</th>
                          <th className="px-4 py-3">Amount</th>
                          <th className="px-4 py-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {bookings.slice(0, 5).map((booking) => (
                          <tr key={booking._id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                            <td className="px-4 py-4">
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-900 dark:text-white">
                                  #{booking.bookingNumber?.slice(-6) || booking._id.slice(-6)}
                                </span>
                                <span className="text-xs text-slate-500">
                                  {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span className="text-sm font-medium">
                                {typeof booking.animal === 'object' ? booking.animal?.name : (booking.animal || 'Livestock')}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                                {formatCurrency(booking.negotiatedPrice ?? booking.price ?? 0, booking.currency)}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <StatusBadge status={booking.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>

            {/* Two Column Grid for Animals and Meetings */}
            <div className="grid gap-8 md:grid-cols-2">
              
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <SectionHeader 
                  title="Live Market" 
                  subtitle="Newest listings available."
                  action={<button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><ExternalLink className="w-4 h-4" /></button>}
                />
                <div className="space-y-4">
                  {animals.slice(0, 3).map((animal) => (
                    <div key={animal._id} className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-3 transition-all hover:border-indigo-200 hover:bg-white dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-indigo-500/30">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400">
                        <PawPrint className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="truncate text-sm font-bold text-slate-900 dark:text-white">{animal.name}</h4>
                        <p className="text-xs text-slate-500">{animal.type || 'Livestock'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(animal.price ?? 0)}</p>
                        <p className="text-[10px] font-medium uppercase text-emerald-600 dark:text-emerald-400">Available</p>
                      </div>
                    </div>
                  ))}
                  {animals.length === 0 && <p className="text-center py-6 text-sm text-slate-500">No active listings.</p>}
                </div>
              </section>

              {/* Upcoming Meetings */}
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <SectionHeader 
                  title="Consultations" 
                  subtitle="Your scheduled sessions."
                  action={<button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><MoreHorizontal className="w-4 h-4" /></button>}
                />
                <div className="space-y-4">
                  {meetings.slice(0, 3).map((meeting) => (
                    <div key={meeting._id} className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                      <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{meeting.title || 'Consultation'}</h4>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {meeting.meetingDate ? new Date(meeting.meetingDate).toLocaleString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            hour: 'numeric', 
                            minute: '2-digit' 
                          }) : 'TBD'}
                        </p>
                        <div className="mt-2">
                          <StatusBadge status={meeting.status} />
                        </div>
                      </div>
                    </div>
                  ))}
                  {meetings.length === 0 && <p className="text-center py-6 text-sm text-slate-500">No sessions booked.</p>}
                </div>
              </section>
            </div>
          </div>

          {/* Sidebar / Quick Stats Column */}
          <aside className="space-y-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Performance Metrics</h3>
              <p className="mt-1 text-sm text-slate-500">Key data points from your activity.</p>
              
              <div className="mt-8 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-600 dark:text-slate-400">Market Reach</span>
                    <span className="font-bold text-slate-900 dark:text-white">{animals.length} listings</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className="h-full w-[65%] rounded-full bg-indigo-600 dark:bg-indigo-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-600 dark:text-slate-400">Engagement</span>
                    <span className="font-bold text-slate-900 dark:text-white">{meetings.length} sessions</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className="h-full w-[40%] rounded-full bg-emerald-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-600 dark:text-slate-400">Pending Actions</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {bookings.filter(b => b.status?.toLowerCase() === 'pending').length} items
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className="h-full w-[25%] rounded-full bg-amber-500" />
                  </div>
                </div>
              </div>

              <div className="mt-10 rounded-2xl bg-indigo-600 p-6 text-white dark:bg-indigo-500">
                <h4 className="font-bold">Need assistance?</h4>
                <p className="mt-2 text-sm text-indigo-100">Contact our support team for help with your bookings or consultations.</p>
                <button className="mt-4 w-full rounded-xl bg-white py-2.5 text-sm font-bold text-indigo-600 transition hover:bg-indigo-50">
                  Contact Support
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;