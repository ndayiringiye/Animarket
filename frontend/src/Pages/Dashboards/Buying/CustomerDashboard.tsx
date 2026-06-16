import React, { useState, useEffect } from "react";

// ─── SVG Icon helper ──────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, className = "", stroke = true }: { d: string; size?: number; className?: string; stroke?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={stroke ? "none" : "currentColor"}
    stroke={stroke ? "currentColor" : "none"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={className}>
    <path d={d} />
  </svg>
);

const icons = {
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  filter: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
  map: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 10a1 1 0 100-2 1 1 0 000 2z",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  calendar: "M3 4h18v18H3V4zM16 2v4M8 2v4M3 10h18",
  tag: "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01",
  user: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z",
  x: "M18 6L6 18M6 6l12 12",
  check: "M20 6L9 17l-5-5",
  logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
  paw: "M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zM6 6c1.1 0 2 .9 2 2S7.1 10 6 10 4 9.1 4 8s.9-2 2-2zm12 0c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zM12 12c3 0 6 2.5 6 5.5 0 .8-.7 1.5-1.5 1.5h-9c-.8 0-1.5-.7-1.5-1.5C6 14.5 9 12 12 12z",
  pen: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
};

// ─── Badge ────────────────────────────────────────────────────────────────────
const Badge = ({ color, children }: { color: "green" | "yellow" | "red" | "blue"; children: React.ReactNode }) => {
  const colors = {
    green:  "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    yellow: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    red:    "bg-red-500/20 text-red-400 border border-red-500/30",
    blue:   "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-xl backdrop-blur-md ${colors[color]}`}>
      {children}
    </span>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const CustomerDashboard = () => {
  const [animalData, setAnimalData]   = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [userName, setUserName]       = useState<string>("");
  const [view, setView]               = useState<"grid" | "list">("grid");
  const [filter, setFilter]           = useState({ type: "All Types", gender: "All Genders", status: "All Status" });

  // Modal
  const [selectedAnimal, setSelectedAnimal] = useState<any>(null);
  const [activeModal, setActiveModal]       = useState<"meeting" | "booking" | "agreement" | null>(null);

  // Meeting
  const [meetingDate, setMeetingDate]       = useState("");
  const [meetingNote, setMeetingNote]       = useState("");
  const [meetingLoading, setMeetingLoading] = useState(false);
  const [meetingSuccess, setMeetingSuccess] = useState("");
  const [meetingError, setMeetingError]     = useState("");

  // Booking
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [bookingError, setBookingError]     = useState("");

  // Agreement
  const [digitalSignature, setDigitalSignature]   = useState("");
  const [agreementLoading, setAgreementLoading]   = useState(false);
  const [agreementSuccess, setAgreementSuccess]   = useState("");
  const [agreementError, setAgreementError]       = useState("");

  const baseurl = "http://localhost:4000";
  const getToken  = () => localStorage.getItem("token") || "";
  const getUserId = () => {
    try { const u = JSON.parse(localStorage.getItem("user") || "{}"); return u?._id || u?.id || ""; }
    catch { return ""; }
  };

  useEffect(() => {
    try { const u = JSON.parse(localStorage.getItem("user") || "{}"); setUserName(u?.name || ""); }
    catch { /* ignore */ }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); localStorage.removeItem("user"); setUserName("");
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res  = await fetch(`${baseurl}/api/animal/animals`);
        const data = await res.json();
        if      (Array.isArray(data))         setAnimalData(data);
        else if (Array.isArray(data.animals)) setAnimalData(data.animals);
        else if (Array.isArray(data.data))    setAnimalData(data.data);
        else                                  setAnimalData([]);
      } catch (e: any) { setError(e.message); }
      finally { setLoading(false); }
    })();
  }, []);

  const openModal = (animal: any, modal: "meeting" | "booking" | "agreement") => {
    setSelectedAnimal(animal); setActiveModal(modal);
    setMeetingDate(""); setMeetingNote(""); setMeetingSuccess(""); setMeetingError("");
    setBookingSuccess(""); setBookingError("");
    setDigitalSignature(""); setAgreementSuccess(""); setAgreementError("");
  };
  const closeModal = () => { setActiveModal(null); setSelectedAnimal(null); };

  const handleScheduleMeeting = async () => {
    if (!meetingDate) { setMeetingError("Please select a date and time."); return; }
    setMeetingLoading(true); setMeetingError(""); setMeetingSuccess("");
    try {
      const res  = await fetch(`${baseurl}/api/meetings`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }, body: JSON.stringify({ animalId: selectedAnimal?._id, scheduledAt: meetingDate, note: meetingNote }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to schedule meeting.");
      setMeetingSuccess(`Meeting scheduled for ${selectedAnimal?.name} on ${new Date(meetingDate).toLocaleString()}!`);
    } catch (e: any) { setMeetingError(e.message); }
    finally { setMeetingLoading(false); }
  };

  const handleBookAnimal = async () => {
    setBookingLoading(true); setBookingError(""); setBookingSuccess("");
    try {
      const res  = await fetch(`${baseurl}/api/bookings/create`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }, body: JSON.stringify({ animalId: selectedAnimal?._id, userId: getUserId() }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to book animal.");
      setBookingSuccess(`${selectedAnimal?.name} booked successfully! You can now sign the agreement.`);
    } catch (e: any) { setBookingError(e.message); }
    finally { setBookingLoading(false); }
  };

  const handleSignAgreement = async () => {
    if (!digitalSignature.trim()) { setAgreementError("Please enter your digital signature."); return; }
    setAgreementLoading(true); setAgreementError(""); setAgreementSuccess("");
    try {
      const cRes  = await fetch(`${baseurl}/api/agreement/agreements`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }, body: JSON.stringify({ animalId: selectedAnimal?._id, buyerId: getUserId() }) });
      const cData = await cRes.json();
      if (!cRes.ok) throw new Error(cData?.message || "Failed to create agreement.");
      const agreementId = cData?.data?._id;
      if (!agreementId) throw new Error("Agreement ID not returned.");
      const sRes  = await fetch(`${baseurl}/api/agreement/agreements/${agreementId}/sign`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }, body: JSON.stringify({ signature: digitalSignature }) });
      const sData = await sRes.json();
      if (!sRes.ok) throw new Error(sData?.message || "Failed to sign agreement.");
      setAgreementSuccess("Agreement created and signed successfully!");
    } catch (e: any) { setAgreementError(e.message); }
    finally { setAgreementLoading(false); }
  };

  // Derived filter lists
  const types   = ["All Types",   ...Array.from(new Set(animalData.map(a => a.type).filter(Boolean)))];
  const genders = ["All Genders", ...Array.from(new Set(animalData.map(a => a.gender).filter(Boolean)))];
  const statuses = ["All Status", "Active", "Inactive", "Maintenance"];

  const filtered = animalData.filter(a => {
    if (filter.type   !== "All Types"    && a.type   !== filter.type)   return false;
    if (filter.gender !== "All Genders"  && a.gender !== filter.gender) return false;
    if (filter.status !== "All Status") {
      const s = (a.status || "active").toLowerCase();
      if (filter.status.toLowerCase() !== s) return false;
    }
    return true;
  });

  const statusColor = (s: string) =>
    s === "active" ? "green" : s === "maintenance" ? "yellow" : "red";

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="p-8 bg-gray-50 dark:bg-[#0a0f1c] min-h-full">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Animal Portfolio</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Browse and manage {animalData.length} animals available for booking
          </p>
        </div>

        <div className="flex items-center gap-3">
          {userName && (
            <>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Welcome, <strong className="text-gray-900 dark:text-white">{userName}</strong>
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
              >
                <Icon d={icons.logout} size={16} />
                Logout
              </button>
            </>
          )}
          <button
            onClick={() => setView("grid")}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-all ${view === "grid" ? "bg-emerald-600 text-white" : "bg-white dark:bg-[#1a2338] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10"}`}
          >
            <Icon d={icons.grid} size={18} /> Grid
          </button>
          <button
            onClick={() => setView("list")}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-all ${view === "list" ? "bg-emerald-600 text-white" : "bg-white dark:bg-[#1a2338] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10"}`}
          >
            <Icon d={icons.list} size={18} /> List
          </button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex items-center gap-4 mb-8 flex-wrap">
        {([["type", types], ["gender", genders], ["status", statuses]] as [string, string[]][]).map(([key, opts]) => (
          <select
            key={key}
            value={(filter as any)[key]}
            onChange={(e) => setFilter(f => ({ ...f, [key]: e.target.value }))}
            className="bg-white dark:bg-[#1a2338] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-emerald-500 min-w-[160px]"
          >
            {opts.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        ))}
        <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-3 rounded-2xl flex items-center gap-2 transition-all">
          <Icon d={icons.filter} size={18} /> Apply Filters
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl px-5 py-4 mb-6">
          {error}
        </div>
      )}

      {/* ── Grid View ── */}
      {!loading && view === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((animal) => (
            <div key={animal._id} className="bg-white dark:bg-[#1a2338] rounded-3xl overflow-hidden border border-gray-100 dark:border-white/10 hover:border-emerald-500/30 transition-all group shadow-sm">
              {/* Image */}
              <div className="relative h-52">
                {animal.images?.length > 0 ? (
                  <img
                    src={animal.images[0]} alt={animal.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                ) : (
                  <div className="w-full h-full bg-emerald-500/10 flex items-center justify-center">
                    <Icon d={icons.paw} size={48} className="text-emerald-500/30" />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <Badge color={statusColor(animal.status || "active")}>
                    {(animal.status || "active").toUpperCase()}
                  </Badge>
                </div>
                {animal.type && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/70 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-2xl">
                    <Icon d={icons.tag} size={12} className="text-emerald-400" />
                    {animal.type}
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-6">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">{animal.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1 mb-1">
                  <Icon d={icons.user} size={14} /> {animal.breed || "Unknown breed"} · {animal.gender}
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-xs mb-5">Age: {animal.age} &nbsp;|&nbsp; Owner: {animal.owner || "N/A"}</p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 text-center mb-5">
                  <div>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">{animal.age ?? "—"}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Age</p>
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">
                      {animal.price ? `${animal.price}` : "—"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{animal.currency || "Price"}</p>
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">{animal.gender?.[0] ?? "—"}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Gender</p>
                  </div>
                </div>

                {/* Videos */}
                {animal.videos?.length > 0 && (
                  <video controls width="100%" className="rounded-2xl mb-4">
                    <source src={animal.videos[0]} type="video/mp4" />
                  </video>
                )}

                {/* Action buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => openModal(animal, "meeting")}
                    className="flex flex-col items-center gap-1 py-2.5 rounded-2xl text-xs font-semibold bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-all"
                  >
                    <Icon d={icons.calendar} size={16} />
                    Meeting
                  </button>
                  <button
                    onClick={() => openModal(animal, "booking")}
                    className="flex flex-col items-center gap-1 py-2.5 rounded-2xl text-xs font-semibold bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-all"
                  >
                    <Icon d={icons.star} size={16} />
                    Book Now
                  </button>
                  <button
                    onClick={() => openModal(animal, "agreement")}
                    className="flex flex-col items-center gap-1 py-2.5 rounded-2xl text-xs font-semibold bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-all"
                  >
                    <Icon d={icons.pen} size={16} />
                    Agreement
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── List View ── */}
      {!loading && view === "list" && (
        <div className="bg-white dark:bg-[#1a2338] rounded-3xl overflow-hidden border border-gray-100 dark:border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/10 text-gray-500 dark:text-gray-400 text-xs uppercase">
                <th className="text-left px-6 py-4 font-semibold">Animal</th>
                <th className="text-left px-6 py-4 font-semibold">Type / Breed</th>
                <th className="text-left px-6 py-4 font-semibold">Status</th>
                <th className="text-left px-6 py-4 font-semibold">Price</th>
                <th className="text-left px-6 py-4 font-semibold">Owner</th>
                <th className="text-right px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((animal, i) => (
                <tr key={animal._id} className={`border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${i === filtered.length - 1 ? "border-0" : ""}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {animal.images?.[0] ? (
                        <img src={animal.images[0]} alt={animal.name} className="w-10 h-10 rounded-xl object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                          <Icon d={icons.paw} size={18} className="text-emerald-500/40" />
                        </div>
                      )}
                      <span className="font-medium text-gray-900 dark:text-white">{animal.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{animal.type} · {animal.breed}</td>
                  <td className="px-6 py-4">
                    <Badge color={statusColor(animal.status || "active")}>
                      {(animal.status || "active").toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 font-semibold text-emerald-600 dark:text-emerald-400">
                    {animal.price} {animal.currency}
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{animal.owner || "N/A"}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openModal(animal, "meeting")} className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-all">Meeting</button>
                      <button onClick={() => openModal(animal, "booking")} className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-all">Book</button>
                      <button onClick={() => openModal(animal, "agreement")} className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-all">Sign</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400 dark:text-gray-600">
          <Icon d={icons.paw} size={48} className="mb-4 opacity-30" />
          <p className="text-lg font-medium">No animals found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      )}

      {/* ── Modal ── */}
      {activeModal && selectedAnimal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="bg-white dark:bg-[#1a2338] rounded-3xl w-full max-w-md mx-4 border border-gray-100 dark:border-white/10 shadow-2xl overflow-hidden">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-white/10">
              <div>
                <p className="text-xs font-semibold text-emerald-500 uppercase tracking-widest mb-0.5">
                  {activeModal === "meeting"   && "Schedule"}
                  {activeModal === "booking"   && "Book Animal"}
                  {activeModal === "agreement" && "Digital Agreement"}
                </p>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{selectedAnimal.name}</h3>
              </div>
              <button
                onClick={closeModal}
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-all text-gray-500 dark:text-gray-400"
              >
                <Icon d={icons.x} size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6 space-y-4">

              {/* ── Schedule Meeting ── */}
              {activeModal === "meeting" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Date & Time *</label>
                    <input
                      type="datetime-local"
                      value={meetingDate}
                      onChange={(e) => setMeetingDate(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full bg-gray-50 dark:bg-[#0a0f1c] border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Note (optional)</label>
                    <textarea
                      rows={3}
                      placeholder="Any details for the meeting..."
                      value={meetingNote}
                      onChange={(e) => setMeetingNote(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-[#0a0f1c] border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                    />
                  </div>
                  {meetingError   && <p className="text-red-400 text-sm">{meetingError}</p>}
                  {meetingSuccess && <p className="text-emerald-400 text-sm flex items-center gap-2"><Icon d={icons.check} size={14} />{meetingSuccess}</p>}
                  {!meetingSuccess && (
                    <button onClick={handleScheduleMeeting} disabled={meetingLoading}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold py-3 rounded-2xl transition-all">
                      {meetingLoading ? "Scheduling…" : "Confirm Meeting"}
                    </button>
                  )}
                </>
              )}

              {/* ── Book Animal ── */}
              {activeModal === "booking" && (
                <>
                  <div className="bg-gray-50 dark:bg-[#0a0f1c] rounded-2xl p-4 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Type</span><span className="font-medium text-gray-900 dark:text-white">{selectedAnimal.type}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Breed</span><span className="font-medium text-gray-900 dark:text-white">{selectedAnimal.breed}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Gender</span><span className="font-medium text-gray-900 dark:text-white">{selectedAnimal.gender}</span></div>
                    <div className="flex justify-between border-t border-gray-200 dark:border-white/10 pt-2 mt-2">
                      <span className="text-gray-500 dark:text-gray-400">Price</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedAnimal.price} {selectedAnimal.currency}</span>
                    </div>
                  </div>
                  {bookingError   && <p className="text-red-400 text-sm">{bookingError}</p>}
                  {bookingSuccess && (
                    <>
                      <p className="text-emerald-400 text-sm flex items-center gap-2"><Icon d={icons.check} size={14} />{bookingSuccess}</p>
                      <button onClick={() => openModal(selectedAnimal, "agreement")}
                        className="w-full border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 font-semibold py-3 rounded-2xl transition-all text-sm">
                        Proceed to Sign Agreement →
                      </button>
                    </>
                  )}
                  {!bookingSuccess && (
                    <button onClick={handleBookAnimal} disabled={bookingLoading}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold py-3 rounded-2xl transition-all">
                      {bookingLoading ? "Booking…" : "Confirm Booking"}
                    </button>
                  )}
                </>
              )}

              {/* ── Digital Agreement ── */}
              {activeModal === "agreement" && (
                <>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    By signing below you agree to the terms and conditions of adopting / purchasing{" "}
                    <strong className="text-gray-700 dark:text-gray-300">{selectedAnimal.name}</strong>.
                    This constitutes a legally binding digital agreement.
                  </p>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Digital Signature *</label>
                    <input
                      type="text"
                      placeholder="Type your full legal name"
                      value={digitalSignature}
                      onChange={(e) => setDigitalSignature(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-[#0a0f1c] border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  {agreementError   && <p className="text-red-400 text-sm">{agreementError}</p>}
                  {agreementSuccess && <p className="text-emerald-400 text-sm flex items-center gap-2"><Icon d={icons.check} size={14} />{agreementSuccess}</p>}
                  {!agreementSuccess && (
                    <button onClick={handleSignAgreement} disabled={agreementLoading}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold py-3 rounded-2xl transition-all">
                      {agreementLoading ? "Submitting…" : "Sign Agreement"}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;