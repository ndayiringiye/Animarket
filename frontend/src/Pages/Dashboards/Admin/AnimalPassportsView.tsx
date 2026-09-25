import { useEffect, useMemo, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { RefreshCw, Printer, ExternalLink, Search, MapPin, Phone } from 'lucide-react';

const PASSPORT_LIST_ENDPOINT = 'http://localhost:4000/api/passport/admin/list';
const PASSPORT_STATUS_ENDPOINT = 'http://localhost:4000/api/passport/admin/delivery';

const PUBLIC_BASE_URL: string =
  (import.meta as any).env?.VITE_PUBLIC_URL || window.location.origin;

interface PassportItem {
  animalId: string;
  passportId: string;
  name: string;
  type: string;
  breed: string;
  gender: string;
  age: number;
  photo: string | null;
  location: { district?: string; sector?: string; province?: string };
  healthStatus: string;
  source: 'customer' | 'hotel';
  bookingId: string;
  reference: string;
  requester: { name: string; email: string; phone: string };
  ownerName?: string;
  deliveryAddress: string;
  deliveryDate: string | null;
  deliveryStatus: string;
  deliveryRequestedAt: string;
  allowedStatuses: string[];
}

const HEALTH_STYLES: Record<string, string> = {
  excellent: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  good: 'bg-green-50 text-green-700 border-green-200',
  fair: 'bg-amber-50 text-amber-700 border-amber-200',
  poor: 'bg-red-50 text-red-700 border-red-200',
};

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-slate-100 text-slate-600',
  scheduled: 'bg-blue-50 text-blue-700',
  in_transit: 'bg-amber-50 text-amber-700',
  delivered: 'bg-emerald-50 text-emerald-700',
  failed: 'bg-red-50 text-red-700',
  cancelled: 'bg-red-50 text-red-700',
};

const label = (s: string) => s.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

const AnimalPassportsView = () => {
  const [items, setItems] = useState<PassportItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [savingId, setSavingId] = useState<string | null>(null);
  const qrRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const authHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchPassports = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(PASSPORT_LIST_ENDPOINT, { headers: authHeaders() });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to load passports');
      setItems(json.data || []);
    } catch (e: any) {
      setError(e.message || 'Failed to load passports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPassports();
  }, []);

  const updateStatus = async (item: PassportItem, status: string) => {
    const key = `${item.source}-${item.bookingId}`;
    setSavingId(key);
    try {
      const res = await fetch(
        `${PASSPORT_STATUS_ENDPOINT}/${item.source}/${item.bookingId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...authHeaders() },
          body: JSON.stringify({ status }),
        }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Could not update status');
      setItems((prev) =>
        prev.map((p) =>
          p.source === item.source && p.bookingId === item.bookingId
            ? { ...p, deliveryStatus: status }
            : p
        )
      );
    } catch (e: any) {
      alert(e.message || 'Could not update status');
    } finally {
      setSavingId(null);
    }
  };

  const passportUrl = (animalId: string) => `${PUBLIC_BASE_URL}/passport/${animalId}`;

  const printPassport = (item: PassportItem) => {
    const key = `${item.source}-${item.bookingId}`;
    const qrSvg = qrRefs.current[key]?.innerHTML || '';
    const w = window.open('', '_blank', 'width=520,height=720');
    if (!w) return;
    const loc = [item.location.sector, item.location.district].filter(Boolean).join(', ') || '-';
    w.document.write(`<!doctype html><html><head><title>${item.passportId}</title>
      <style>
        body{font-family:Arial,sans-serif;margin:0;padding:24px;color:#0f172a}
        .card{border:2px solid #0f172a;border-radius:12px;padding:20px;max-width:420px;margin:auto}
        h1{font-size:20px;margin:0 0 2px}
        .id{font-family:monospace;font-size:16px;letter-spacing:1px;margin-bottom:14px}
        .row{display:flex;gap:16px;align-items:flex-start}
        img{width:110px;height:110px;object-fit:cover;border-radius:8px;border:1px solid #cbd5e1}
        dl{margin:0;font-size:13px}
        dt{color:#64748b;float:left;clear:left;width:70px}
        dd{margin:0 0 4px 70px}
        .qr{text-align:center;margin-top:18px}
        .qr svg{width:180px;height:180px}
        .hint{font-size:11px;color:#64748b;margin-top:6px}
      </style></head><body><div class="card">
        <h1>${item.name}</h1><div class="id">${item.passportId}</div>
        <div class="row">
          ${item.photo ? `<img src="${item.photo}" />` : ''}
          <dl>
            <dt>Type</dt><dd>${label(item.type)} - ${item.breed}</dd>
            <dt>Sex / Age</dt><dd>${label(item.gender)}, ${item.age}</dd>
            <dt>Health</dt><dd>${label(item.healthStatus)}</dd>
            <dt>Location</dt><dd>${loc}</dd>
          </dl>
        </div>
        <div class="qr">${qrSvg}<div class="hint">Scan to view this animal's passport</div></div>
      </div><script>window.onload=function(){window.print()}</script></body></html>`);
    w.document.close();
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((i) => {
      if (filter !== 'all' && i.deliveryStatus !== filter) return false;
      if (!q) return true;
      return [i.name, i.passportId, i.requester.name, i.breed, i.reference]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [items, search, filter]);

  const filters = ['all', 'pending', 'scheduled', 'in_transit', 'delivered'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Animal Passports</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Animals with a delivery request, each with a scannable passport
          </p>
        </div>
        <button
          onClick={fetchPassports}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-600 border border-slate-200 bg-white px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, passport ID or requester"
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                filter === f
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f === 'all' ? 'All' : label(f)}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchPassports} className="text-xs font-medium underline">
            Try again
          </button>
        </div>
      )}

      {loading && items.length === 0 && (
        <p className="text-sm text-slate-400">Loading passports...</p>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center text-sm text-slate-400 border border-dashed border-slate-200 rounded-xl py-14">
          No delivery requests match. Passports appear here once a customer or hotel requests delivery.
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filtered.map((item) => {
          const key = `${item.source}-${item.bookingId}`;
          const loc =
            [item.location.sector, item.location.district].filter(Boolean).join(', ') || 'Location not set';
          return (
            <div key={key} className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 flex flex-col sm:flex-row gap-4">
              <div className="flex gap-3 flex-1 min-w-0">
                {item.photo ? (
                  <img src={item.photo} alt={item.name} className="w-20 h-20 rounded-lg object-cover border border-slate-200 shrink-0" />
                ) : (
                  <div className="w-20 h-20 rounded-lg bg-slate-100 shrink-0" />
                )}
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-slate-800 truncate">{item.name}</h3>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full border ${HEALTH_STYLES[item.healthStatus] || HEALTH_STYLES.good}`}>
                      {label(item.healthStatus)}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-slate-500">{item.passportId}</p>
                  <p className="text-xs text-slate-500">
                    {label(item.type)}, {item.breed} - {label(item.gender)}, {item.age}
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin size={12} /> {loc}
                  </p>
                  <p className="text-xs text-slate-600 pt-1">
                    <span className="text-slate-400">{item.source === 'hotel' ? 'Hotel' : 'Customer'}:</span>{' '}
                    {item.requester.name}
                    {item.ownerName ? ` (owner ${item.ownerName})` : ''}
                  </p>
                  {item.requester.phone && (
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Phone size={12} /> {item.requester.phone}
                    </p>
                  )}
                  {item.deliveryAddress && (
                    <p className="text-xs text-slate-500">Deliver to: {item.deliveryAddress}</p>
                  )}
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:w-40 shrink-0">
                <div
                  ref={(el) => {
                    qrRefs.current[key] = el;
                  }}
                  className="p-1.5 bg-white border border-slate-200 rounded-lg"
                >
                  <QRCodeSVG value={passportUrl(item.animalId)} size={96} />
                </div>
                <div className="flex-1 sm:flex-none w-full space-y-2">
                  <select
                    value={item.deliveryStatus}
                    disabled={savingId === key}
                    onChange={(e) => updateStatus(item, e.target.value)}
                    className={`w-full text-xs font-medium rounded-lg px-2 py-1.5 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300 ${STATUS_STYLES[item.deliveryStatus] || 'bg-slate-100 text-slate-600'}`}
                  >
                    {!item.allowedStatuses.includes(item.deliveryStatus) && (
                      <option value={item.deliveryStatus} disabled>
                        {label(item.deliveryStatus)}
                      </option>
                    )}
                    {item.allowedStatuses.map((s) => (
                      <option key={s} value={s}>
                        {label(s)}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => printPassport(item)}
                      className="flex-1 flex items-center justify-center gap-1 text-xs text-slate-600 border border-slate-200 rounded-lg py-1.5 hover:bg-slate-50"
                    >
                      <Printer size={12} /> Print
                    </button>
                    
                      <a
                        href={passportUrl(item.animalId)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-1 text-xs text-slate-600 border border-slate-200 rounded-lg py-1.5 hover:bg-slate-50"
                    >
                      <ExternalLink size={12} /> Open
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnimalPassportsView;
