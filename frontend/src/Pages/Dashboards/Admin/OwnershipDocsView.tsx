import { useEffect, useMemo, useState } from 'react';
import { RefreshCw, Search, FileText, X, ExternalLink, Download, ShieldCheck, ShieldX, Clock, MapPin, Phone, User } from 'lucide-react';

const OWNERSHIP_LIST_ENDPOINT = 'http://localhost:4000/api/ownership/admin/list';
const OWNERSHIP_STATUS_ENDPOINT = 'http://localhost:4000/api/ownership/admin';

interface OwnershipDoc {
  _id: string;
  documentId: string;
  animalName: string;
  animalTag: string;
  passportId: string;
  breed: string;
  sex: string;
  ownerName: string;
  farmerId: string;
  phone: string;
  location: string;
  documentType: string;
  fileUrl: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
};

const STATUS_DOT: Record<string, string> = {
  pending: 'bg-amber-400',
  approved: 'bg-emerald-500',
  rejected: 'bg-red-500',
};

const fmtDate = (d?: string) =>
  d ? new Date(d).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) : '-';

const isImage = (url: string) => /\.(png|jpe?g|gif|webp)$/i.test(url);
const isPdf = (url: string) => /\.pdf$/i.test(url);

const OwnershipDocsView = () => {
  const [items, setItems] = useState<OwnershipDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [selected, setSelected] = useState<OwnershipDoc | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const authHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchDocs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(OWNERSHIP_LIST_ENDPOINT, { headers: authHeaders() });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to load ownership documents');
      setItems(json.data || []);
    } catch (e: any) {
      setError(e.message || 'Failed to load ownership documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const updateStatus = async (doc: OwnershipDoc, status: 'approved' | 'rejected') => {
    setSavingId(doc._id);
    try {
      const res = await fetch(`${OWNERSHIP_STATUS_ENDPOINT}/${doc._id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Could not update status');
      setItems((prev) => prev.map((d) => (d._id === doc._id ? { ...d, status } : d)));
      setSelected((prev) => (prev && prev._id === doc._id ? { ...prev, status } : prev));
    } catch (e: any) {
      alert(e.message || 'Could not update status');
    } finally {
      setSavingId(null);
    }
  };

  const counts = useMemo(() => {
    return {
      all: items.length,
      pending: items.filter((d) => d.status === 'pending').length,
      approved: items.filter((d) => d.status === 'approved').length,
      rejected: items.filter((d) => d.status === 'rejected').length,
    };
  }, [items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items
      .filter((d) => (filter === 'all' ? true : d.status === filter))
      .filter((d) => {
        if (!q) return true;
        return [d.documentId, d.animalName, d.animalTag, d.passportId, d.ownerName, d.farmerId]
          .join(' ')
          .toLowerCase()
          .includes(q);
      });
  }, [items, search, filter]);

  const FILTER_TABS: { key: FilterStatus; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Ownership Documents</h1>
          <p className="text-xs text-slate-400 mt-0.5">Review and verify ownership certificates submitted with each animal</p>
        </div>
        <button
          onClick={fetchDocs}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-600 border border-slate-200 bg-white px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm w-fit"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
          <p className="text-[11px] text-slate-400">Total</p>
          <p className="text-lg font-bold text-slate-800 mt-0.5">{counts.all}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
          <p className="text-[11px] text-amber-600 flex items-center gap-1"><Clock size={11} /> Pending</p>
          <p className="text-lg font-bold text-slate-800 mt-0.5">{counts.pending}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
          <p className="text-[11px] text-emerald-600 flex items-center gap-1"><ShieldCheck size={11} /> Approved</p>
          <p className="text-lg font-bold text-slate-800 mt-0.5">{counts.approved}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
          <p className="text-[11px] text-red-600 flex items-center gap-1"><ShieldX size={11} /> Rejected</p>
          <p className="text-lg font-bold text-slate-800 mt-0.5">{counts.rejected}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 w-fit">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
                filter === tab.key ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
              <span className="ml-1 text-[10px] text-slate-400">{counts[tab.key]}</span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search document, animal or owner"
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchDocs} className="text-xs font-medium underline">Try again</button>
        </div>
      )}

      {loading && items.length === 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 animate-pulse h-24" />
          ))}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center text-sm text-slate-400 border border-dashed border-slate-200 rounded-xl py-14">
          {items.length === 0 ? 'No ownership documents submitted yet.' : 'No documents match this filter.'}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filtered.map((doc) => (
          <button
            key={doc._id}
            onClick={() => setSelected(doc)}
            className="text-left bg-white border border-slate-200 rounded-xl shadow-sm p-4 hover:border-emerald-300 hover:shadow-md transition-all flex gap-3"
          >
            <div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
              {isImage(doc.fileUrl) ? (
                <img src={doc.fileUrl} alt={doc.documentType} className="w-full h-full object-cover" />
              ) : (
                <FileText size={20} className="text-slate-400" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-mono text-[11px] text-slate-400">{doc.documentId}</p>
                  <h3 className="font-semibold text-slate-800 truncate mt-0.5">{doc.animalName}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{doc.ownerName} · {doc.farmerId}</p>
                </div>
                <span className={`shrink-0 flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full border capitalize ${STATUS_STYLES[doc.status] || STATUS_STYLES.pending}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[doc.status] || STATUS_DOT.pending}`} />
                  {doc.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-3">Submitted {fmtDate(doc.submittedAt)}</p>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-sm font-bold text-slate-800">Ownership Document Review</h2>
                <p className="font-mono text-[11px] text-slate-400 mt-0.5">{selected.documentId}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 grid md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <section>
                  <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Animal Information</h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="bg-slate-50 rounded-lg px-3.5 py-2.5"><p className="text-[10px] text-slate-400">Animal</p><p className="text-xs font-medium text-slate-700">{selected.animalName} #{selected.animalTag}</p></div>
                    <div className="bg-slate-50 rounded-lg px-3.5 py-2.5"><p className="text-[10px] text-slate-400">Passport ID</p><p className="text-xs font-medium text-slate-700 truncate">{selected.passportId}</p></div>
                    <div className="bg-slate-50 rounded-lg px-3.5 py-2.5"><p className="text-[10px] text-slate-400">Breed</p><p className="text-xs font-medium text-slate-700">{selected.breed}</p></div>
                    <div className="bg-slate-50 rounded-lg px-3.5 py-2.5"><p className="text-[10px] text-slate-400">Sex</p><p className="text-xs font-medium text-slate-700 capitalize">{selected.sex}</p></div>
                  </div>
                </section>

                <section>
                  <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Owner Information</h3>
                  <div className="space-y-2">
                    <div className="bg-slate-50 rounded-lg px-3.5 py-2.5 flex items-center gap-2">
                      <User size={13} className="text-slate-400 shrink-0" />
                      <div className="min-w-0"><p className="text-[10px] text-slate-400">Owner</p><p className="text-xs font-medium text-slate-700 truncate">{selected.ownerName}</p></div>
                    </div>
                    <div className="bg-slate-50 rounded-lg px-3.5 py-2.5 flex items-center gap-2">
                      <Phone size={13} className="text-slate-400 shrink-0" />
                      <div className="min-w-0"><p className="text-[10px] text-slate-400">Phone</p><p className="text-xs font-medium text-slate-700 truncate">{selected.phone || 'Not provided'}</p></div>
                    </div>
                    <div className="bg-slate-50 rounded-lg px-3.5 py-2.5 flex items-center gap-2">
                      <MapPin size={13} className="text-slate-400 shrink-0" />
                      <div className="min-w-0"><p className="text-[10px] text-slate-400">Location</p><p className="text-xs font-medium text-slate-700 truncate">{selected.location || 'Not provided'}</p></div>
                    </div>
                    <div className="bg-slate-50 rounded-lg px-3.5 py-2.5"><p className="text-[10px] text-slate-400">Farmer ID</p><p className="text-xs font-medium text-slate-700 truncate">{selected.farmerId}</p></div>
                  </div>
                </section>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div>
                    <p className="text-[10px] text-slate-400">Submitted</p>
                    <p className="text-xs font-medium text-slate-700">{fmtDate(selected.submittedAt)}</p>
                  </div>
                  <span className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border capitalize ${STATUS_STYLES[selected.status] || STATUS_STYLES.pending}`}>
                    {selected.status === 'pending' ? 'Pending Review' : selected.status}
                  </span>
                </div>

                {selected.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      disabled={savingId === selected._id}
                      onClick={() => updateStatus(selected, 'approved')}
                      className="flex-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 rounded-lg py-2.5 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      disabled={savingId === selected._id}
                      onClick={() => updateStatus(selected, 'rejected')}
                      className="flex-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 disabled:opacity-60 rounded-lg py-2.5 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>

              <section>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Document Preview</h3>
                  <div className="flex gap-2">
                    <a href={selected.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[11px] font-medium text-slate-600 border border-slate-200 rounded-lg px-2.5 py-1.5 hover:bg-slate-50">
                      <ExternalLink size={12} /> Open
                    </a>
                    <a href={selected.fileUrl} download className="flex items-center gap-1 text-[11px] font-medium text-slate-600 border border-slate-200 rounded-lg px-2.5 py-1.5 hover:bg-slate-50">
                      <Download size={12} /> Download
                    </a>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-lg overflow-hidden min-h-[260px] flex items-center justify-center">
                  {!selected.fileUrl ? (
                    <p className="text-xs text-slate-400 py-16">No file uploaded</p>
                  ) : isImage(selected.fileUrl) ? (
                    <img src={selected.fileUrl} alt={selected.documentType} className="w-full max-h-[420px] object-contain" />
                  ) : isPdf(selected.fileUrl) ? (
                    <iframe src={selected.fileUrl} title="Ownership document" className="w-full h-[420px]" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-16">
                      <FileText size={28} className="text-slate-400" />
                      <p className="text-xs text-slate-500">{selected.documentType}</p>
                      <p className="text-[11px] text-slate-400">Preview not available - use Open or Download</p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnershipDocsView;
