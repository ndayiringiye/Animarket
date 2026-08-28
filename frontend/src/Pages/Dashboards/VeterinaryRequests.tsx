import { useCallback, useEffect, useState } from "react";
import { Image, MapPin, Phone, RefreshCw } from "lucide-react";
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

const VeterinaryRequests = () => {
  const { token } = useAuth();
  const [requests, setRequests] = useState<VeterinaryRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/api/veterinary/service-jobs?status=posted`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Failed to load veterinary requests.");
      setRequests(data.data || []);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to load veterinary requests.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) loadRequests();
  }, [loadRequests, token]);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">Veterinary</p>
            <h1 className="mt-1 text-3xl font-bold">Service requests</h1>
            <p className="mt-2 text-slate-500">Review customer requests and animal details.</p>
          </div>
          <button
            type="button"
            onClick={loadRequests}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {error && <p className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {loading && <p className="text-slate-500">Loading requests...</p>}
        {!loading && !error && requests.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            No pending veterinary requests.
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          {requests.map((request) => (
            <article key={request._id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              {request.animalImage ? (
                <img src={request.animalImage} alt={request.animalName} className="h-52 w-full object-cover" />
              ) : (
                <div className="flex h-52 items-center justify-center bg-slate-100 text-slate-400">
                  <Image size={32} />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold">{request.animalName}</h2>
                    <p className="text-sm capitalize text-slate-500">{request.animalType} · {request.serviceType.replace("_", " ")}</p>
                  </div>
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold capitalize text-amber-700">{request.status}</span>
                </div>
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p><strong>Preferred date:</strong> {new Date(request.serviceDate).toLocaleDateString()}</p>
                  <p className="flex gap-2"><MapPin size={17} className="shrink-0 text-emerald-600" />{formatLocation(request.animalLocation)}</p>
                  <p className="flex gap-2"><Phone size={17} className="shrink-0 text-emerald-600" />{request.requester?.phone || "Phone not provided"}</p>
                  <p><strong>Customer:</strong> {request.requester?.name || "Customer"}</p>
                </div>
                {request.notes && <p className="mt-4 border-t border-slate-100 pt-4 text-sm text-slate-600">{request.notes}</p>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
};

export default VeterinaryRequests;
