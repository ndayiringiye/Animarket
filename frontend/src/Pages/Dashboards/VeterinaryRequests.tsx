import { useCallback, useEffect, useState } from "react";
import {
  Image as ImageIcon,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Stethoscope,
  Dog,
  Cat,
  Bird,
  HeartPulse,
  CalendarDays,
  MessageCircle,
  Bell,
  Star,
  ShieldCheck,
  FileText,
  QrCode,
  AlertTriangle,
  ClipboardCheck,
  Syringe,
  Activity,
  Award,
  BookOpen,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../Contexts/AuthContext";

type VeterinaryRequest = {
  _id: string;
  animalName: string;
  animalType: string;
  animalImage?: string;
  animalLocation?: Record<string, string | number>;
  serviceType: string;
  serviceDate: string;
  notes?: string;
  status: string;
  requester?: {
    name?: string;
    phone?: string;
    email?: string;
  };
};

const API_BASE = "http://localhost:4000";

const formatLocation = (location?: VeterinaryRequest["animalLocation"]) => {
  if (!location) return "Location not provided";
  return Object.values(location).filter(Boolean).join(", ") || "Location not provided";
};

// Mock data to demonstrate the new responsibilities layout
const MOCK_REQUESTS: VeterinaryRequest[] = [
  {
    _id: "1",
    animalName: "Bella",
    animalType: "Cattle",
    animalImage: "https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&q=80&w=800",
    animalLocation: { city: "Ranijnhan", state: "RC" },
    serviceType: "Pre-Sale Inspection",
    serviceDate: "2024-06-15",
    notes: "Scheduled for pre-sale health check. Farmer reports mild lameness.",
    status: "Scheduled",
    requester: { name: "John Farmer", phone: "+1 555-0101" },
  },
  {
    _id: "2",
    animalName: "Max",
    animalType: "Dog",
    animalImage: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800",
    animalLocation: { city: "Inner Richmond", state: "RC" },
    serviceType: "Vaccination Update",
    serviceDate: "2024-06-16",
    notes: "Rabies booster due. Verify previous vaccination records.",
    status: "Pending",
    requester: { name: "Sarah Owner", phone: "+1 555-0102" },
  },
  {
    _id: "3",
    animalName: "Luna",
    animalType: "Cat",
    animalImage: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800",
    animalLocation: { city: "Jordan Park", state: "RC" },
    serviceType: "Medical Record Update",
    serviceDate: "2024-06-14",
    notes: "Post-treatment follow-up for respiratory infection.",
    status: "In Progress",
    requester: { name: "Mike Vet", phone: "+1 555-0103" },
  },
  {
    _id: "4",
    animalName: "Charlie",
    animalType: "Horse",
    animalImage: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=800",
    animalLocation: { city: "Anza Vista", state: "RC" },
    serviceType: "Health Certification",
    serviceDate: "2024-06-17",
    notes: "Requires official health certificate for interstate transfer.",
    status: "Completed",
    requester: { name: "Equine Ranch", phone: "+1 555-0104" },
  },
];

const VeterinaryRequests = () => {
  const { token } = useAuth();
  const [requests, setRequests] = useState<VeterinaryRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // In a real app, this would fetch from the API
      // For now, we simulate the API call and use mock data
      // const response = await fetch(`${API_BASE}/api/veterinary/service-jobs?status=posted`, {
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      // const data = await response.json();
      // if (!response.ok) throw new Error(data?.message || "Failed to load veterinary requests.");
      // setRequests(data.data || []);
      
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 600));
      setRequests(MOCK_REQUESTS);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to load veterinary requests.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) loadRequests();
  }, [loadRequests, token]);

  // Helper to get a random rating for visual purposes (since not in data)
  const getRating = (id: string) => {
    const num = id.charCodeAt(0) + id.charCodeAt(id.length - 1);
    return (4 + (num % 10) / 10).toFixed(1);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed": return "bg-emerald-100 text-emerald-700";
      case "scheduled": return "bg-blue-100 text-blue-700";
      case "in progress": return "bg-amber-100 text-amber-700";
      case "pending": return "bg-slate-100 text-slate-700";
      case "failed": return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-3">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-xl font-bold text-blue-600">
              <Stethoscope size={24} className="text-blue-600" />
              <span>VetNest</span>
            </div>
            
            <nav className="hidden items-center gap-6 md:flex">
              <button className="text-sm font-medium text-slate-600 hover:text-blue-600">Dashboard</button>
              <button className="text-sm font-medium text-blue-600">Inspections</button>
              <button className="text-sm font-medium text-slate-600 hover:text-blue-600">Records</button>
              <button className="text-sm font-medium text-slate-600 hover:text-blue-600">Reports</button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200">
              <MessageCircle size={20} />
            </button>
            <button className="relative rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200">
              <Bell size={20} />
              <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500"></span>
            </button>
            <div className="flex items-center gap-2">
              <img 
                src="https://i.pravatar.cc/150?u=vet" 
                alt="User" 
                className="h-9 w-9 rounded-full border border-slate-200 object-cover"
              />
              <ChevronDown size={16} className="text-slate-500" />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-6 py-6">
        {/* Top Filter Pills Row */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:border-blue-300 hover:text-blue-600">
              <Activity size={16} />
              All Tasks
            </button>
            <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:border-blue-300 hover:text-blue-600">
              <ClipboardCheck size={16} />
              Inspections
            </button>
            <button className="flex items-center gap-2 rounded-full border border-blue-600 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
              <Syringe size={16} />
              Vaccinations
            </button>
            <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:border-blue-300 hover:text-blue-600">
              <FileText size={16} />
              Records
            </button>
            <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:border-blue-300 hover:text-blue-600">
              <AlertTriangle size={16} />
              Disease Reports
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600">
              <MapPin size={16} className="text-slate-400" />
              <span>Ranijnhan City, RC</span>
            </div>
            <button className="rounded-full bg-blue-600 p-2.5 text-white shadow-md shadow-blue-200 hover:bg-blue-700">
              <Search size={18} />
            </button>
            <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:border-blue-300 hover:text-blue-600">
              <SlidersHorizontal size={16} />
              Filter
            </button>
          </div>
        </div>

        {/* Main Layout: Sidebar + Grid */}
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Left Sidebar - Responsibilities */}
          <aside className="w-full shrink-0 lg:w-72">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800">Responsibilities</h2>
                <ShieldCheck size={18} className="text-blue-500" />
              </div>

              {/* Animal Health Inspection */}
              <div className="mb-5">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <ClipboardCheck size={16} className="text-blue-600" />
                  <span>Health Inspection</span>
                </div>
                <ul className="space-y-1.5 pl-6 text-xs text-slate-500">
                  <li className="flex items-start gap-1.5"><span className="mt-1 h-1 w-1 rounded-full bg-slate-300"></span> Inspect listed animals</li>
                  <li className="flex items-start gap-1.5"><span className="mt-1 h-1 w-1 rounded-full bg-slate-300"></span> Assess general health</li>
                  <li className="flex items-start gap-1.5"><span className="mt-1 h-1 w-1 rounded-full bg-slate-300"></span> Check for diseases/injuries</li>
                  <li className="flex items-start gap-1.5"><span className="mt-1 h-1 w-1 rounded-full bg-slate-300"></span> Record findings</li>
                </ul>
              </div>

              {/* Vaccination Management */}
              <div className="mb-5">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Syringe size={16} className="text-blue-600" />
                  <span>Vaccination Mgmt</span>
                </div>
                <ul className="space-y-1.5 pl-6 text-xs text-slate-500">
                  <li className="flex items-start gap-1.5"><span className="mt-1 h-1 w-1 rounded-full bg-slate-300"></span> Verify records</li>
                  <li className="flex items-start gap-1.5"><span className="mt-1 h-1 w-1 rounded-full bg-slate-300"></span> Add/update info</li>
                  <li className="flex items-start gap-1.5"><span className="mt-1 h-1 w-1 rounded-full bg-slate-300"></span> Record dates & requirements</li>
                  <li className="flex items-start gap-1.5"><span className="mt-1 h-1 w-1 rounded-full bg-slate-300"></span> Identify missing/expired</li>
                </ul>
              </div>

              {/* Medical Records */}
              <div className="mb-5">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <FileText size={16} className="text-blue-600" />
                  <span>Medical Records</span>
                </div>
                <ul className="space-y-1.5 pl-6 text-xs text-slate-500">
                  <li className="flex items-start gap-1.5"><span className="mt-1 h-1 w-1 rounded-full bg-slate-300"></span> Create/maintain records</li>
                  <li className="flex items-start gap-1.5"><span className="mt-1 h-1 w-1 rounded-full bg-slate-300"></span> Record treatments</li>
                  <li className="flex items-start gap-1.5"><span className="mt-1 h-1 w-1 rounded-full bg-slate-300"></span> Update health status</li>
                </ul>
              </div>

              {/* Animal Certification */}
              <div className="mb-5">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Award size={16} className="text-blue-600" />
                  <span>Certification</span>
                </div>
                <ul className="space-y-1.5 pl-6 text-xs text-slate-500">
                  <li className="flex items-start gap-1.5"><span className="mt-1 h-1 w-1 rounded-full bg-slate-300"></span> Provide health certs</li>
                  <li className="flex items-start gap-1.5"><span className="mt-1 h-1 w-1 rounded-full bg-slate-300"></span> Confirm sale conditions</li>
                  <li className="flex items-start gap-1.5"><span className="mt-1 h-1 w-1 rounded-full bg-slate-300"></span> Upload documents</li>
                </ul>
              </div>

              {/* Pre-Sale Inspection */}
              <div className="mb-5">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <ClipboardCheck size={16} className="text-blue-600" />
                  <span>Pre-Sale Inspection</span>
                </div>
                <ul className="space-y-1.5 pl-6 text-xs text-slate-500">
                  <li className="flex items-start gap-1.5"><span className="mt-1 h-1 w-1 rounded-full bg-slate-300"></span> Perform health checks</li>
                  <li className="flex items-start gap-1.5"><span className="mt-1 h-1 w-1 rounded-full bg-slate-300"></span> Verify farmer info</li>
                  <li className="flex items-start gap-1.5"><span className="mt-1 h-1 w-1 rounded-full bg-slate-300"></span> Submit report</li>
                </ul>
              </div>

              {/* Disease & Risk Reporting */}
              <div className="mb-5">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <AlertTriangle size={16} className="text-red-500" />
                  <span>Disease & Risk</span>
                </div>
                <ul className="space-y-1.5 pl-6 text-xs text-slate-500">
                  <li className="flex items-start gap-1.5"><span className="mt-1 h-1 w-1 rounded-full bg-slate-300"></span> Report suspected diseases</li>
                  <li className="flex items-start gap-1.5"><span className="mt-1 h-1 w-1 rounded-full bg-slate-300"></span> Flag animals for hold</li>
                  <li className="flex items-start gap-1.5"><span className="mt-1 h-1 w-1 rounded-full bg-slate-300"></span> Notify Admin/Agent</li>
                </ul>
              </div>

              {/* Animal Passport / QR */}
              <div className="mb-5">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <QrCode size={16} className="text-blue-600" />
                  <span>Passport / QR</span>
                </div>
                <ul className="space-y-1.5 pl-6 text-xs text-slate-500">
                  <li className="flex items-start gap-1.5"><span className="mt-1 h-1 w-1 rounded-full bg-slate-300"></span> Verify health info</li>
                  <li className="flex items-start gap-1.5"><span className="mt-1 h-1 w-1 rounded-full bg-slate-300"></span> Update QR history</li>
                  <li className="flex items-start gap-1.5"><span className="mt-1 h-1 w-1 rounded-full bg-slate-300"></span> Ensure accuracy</li>
                </ul>
              </div>

              {/* Farmer Guidance */}
              <div className="mb-5">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <BookOpen size={16} className="text-blue-600" />
                  <span>Farmer Guidance</span>
                </div>
                <ul className="space-y-1.5 pl-6 text-xs text-slate-500">
                  <li className="flex items-start gap-1.5"><span className="mt-1 h-1 w-1 rounded-full bg-slate-300"></span> Advise on health</li>
                  <li className="flex items-start gap-1.5"><span className="mt-1 h-1 w-1 rounded-full bg-slate-300"></span> Recommend treatments</li>
                  <li className="flex items-start gap-1.5"><span className="mt-1 h-1 w-1 rounded-full bg-slate-300"></span> Preventive care</li>
                </ul>
              </div>

              {/* Inspection Scheduling */}
              <div className="mb-5">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Clock size={16} className="text-blue-600" />
                  <span>Scheduling</span>
                </div>
                <ul className="space-y-1.5 pl-6 text-xs text-slate-500">
                  <li className="flex items-start gap-1.5"><span className="mt-1 h-1 w-1 rounded-full bg-slate-300"></span> Receive requests</li>
                  <li className="flex items-start gap-1.5"><span className="mt-1 h-1 w-1 rounded-full bg-slate-300"></span> Schedule/accept</li>
                  <li className="flex items-start gap-1.5"><span className="mt-1 h-1 w-1 rounded-full bg-slate-300"></span> Mark status</li>
                </ul>
              </div>

              {/* Reports */}
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <FileText size={16} className="text-blue-600" />
                  <span>Reports</span>
                </div>
                <ul className="space-y-1.5 pl-6 text-xs text-slate-500">
                  <li className="flex items-start gap-1.5"><span className="mt-1 h-1 w-1 rounded-full bg-slate-300"></span> Submit inspection reports</li>
                  <li className="flex items-start gap-1.5"><span className="mt-1 h-1 w-1 rounded-full bg-slate-300"></span> Maintain records</li>
                  <li className="flex items-start gap-1.5"><span className="mt-1 h-1 w-1 rounded-full bg-slate-300"></span> Report issues to Admin</li>
                </ul>
              </div>
            </div>
          </aside>

          {/* Right Content Area */}
          <div className="flex-1">
            {error && (
              <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}
            
            {loading && (
              <div className="flex h-64 items-center justify-center">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            )}

            {!loading && !error && requests.length === 0 && (
              <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-8 text-center">
                <Stethoscope className="mb-3 h-12 w-12 text-slate-300" />
                <p className="text-lg font-medium text-slate-500">No pending veterinary tasks.</p>
                <p className="text-sm text-slate-400">Check back later or adjust your filters.</p>
              </div>
            )}

            {!loading && !error && requests.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {requests.map((request) => (
                  <article 
                    key={request._id} 
                    className="group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md"
                  >
                    {/* Image Section */}
                    <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                      {request.animalImage ? (
                        <img 
                          src={request.animalImage} 
                          alt={request.animalName} 
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-300">
                          <ImageIcon size={48} />
                        </div>
                      )}
                      
                      {/* Top Badges */}
                      <div className="absolute left-3 top-3 flex items-center gap-2">
                        <span className="rounded-md bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-700 backdrop-blur-sm">
                          {request.animalType}
                        </span>
                        <span className={`rounded-md px-2.5 py-1 text-xs font-semibold backdrop-blur-sm ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                      
                      {/* Favorite/Share Button */}
                      <button className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-slate-600 backdrop-blur-sm transition-colors hover:bg-white hover:text-blue-600">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                      </button>
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-1 flex-col p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">{request.animalName}</h3>
                          <p className="flex items-center gap-1 text-xs text-slate-500">
                            <MapPin size={12} className="text-blue-500" />
                            {formatLocation(request.animalLocation)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-sm font-semibold text-amber-500">
                          <Star size={14} fill="currentColor" />
                          <span>{getRating(request._id)}</span>
                        </div>
                      </div>

                      <div className="mb-3 flex items-center gap-2 text-xs font-medium text-slate-600">
                        <CalendarDays size={14} className="text-slate-400" />
                        <span>{new Date(request.serviceDate).toLocaleDateString()}</span>
                        <span className="text-slate-300">•</span>
                        <span className="capitalize">{request.serviceType.replace("_", " ")}</span>
                      </div>

                      {request.notes && (
                        <p className="mb-4 line-clamp-2 text-xs text-slate-500">
                          {request.notes}
                        </p>
                      )}

                      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Requested By</p>
                          <p className="text-sm font-semibold text-slate-700">
                            {request.requester?.name || "Unknown"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Phone size={12} />
                            <span>{request.requester?.phone || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons on Hover */}
                      <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-2 bg-gradient-to-t from-white via-white to-transparent p-4 pt-8 transition-transform duration-300 group-hover:translate-y-0">
                        <button className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700">
                          Start Inspection
                        </button>
                        <button className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
                          View Details
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VeterinaryRequests;