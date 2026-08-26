import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { IoMdLogOut, IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { FaFlag, FaGlobe, FaChevronDown, FaChevronUp } from "react-icons/fa";
import Brand from "../../../../public/images/brand.png";

// ─── Icon Component ──────────────────────────────────────────────────────
const Icon = ({ d, size = 20, className = "", stroke = true }: { d: string; size?: number; className?: string; stroke?: boolean }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={stroke ? "none" : "currentColor"}
    stroke={stroke ? "currentColor" : "none"}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d={d} />
  </svg>
);

// ─── Icons Collection ──────────────────────────────────────────────────
const icons = {
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  filter: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  calendar: "M3 4h18v18H3V4zM16 2v4M8 2v4M3 10h18",
  tag: "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01",
  user: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z",
  x: "M18 6L6 18M6 6l12 12",
  check: "M20 6L9 17l-5-5",
  logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
  paw: "M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zM6 6c1.1 0 2 .9 2 2S7.1 10 6 10 4 9.1 4 8s.9-2 2-2zm12 0c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zM12 12c3 0 6 2.5 6 5.5 0 .8-.7 1.5-1.5 1.5h-9c-.8 0-1.5-.7-1.5-1.5C6 14.5 9 12 12 12z",
  pen: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  document: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z M7 17h10 M7 13h10 M7 9h5",
  verify: "M9 12l2 2 4-4 M7.5 12h9 M12 7.5v9",
  search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  home: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  settings: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
  plus: "M12 4v16M4 12h16",
  chevronDown: "M6 9l6 6 6-6",
  chevronUp: "M18 15l-6-6-6 6",
  award: "M12 2L8 6l4 4-4 4 4 4-4 4 8-8z M12 2l4 4-4 4 4 4-4 4 4 4-8-8z",
  arrowUp: "M12 19V5M5 12l7-7 7 7",
  bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0",
  clock: "M12 8v4l3 3M12 2a10 10 0 100 20 10 10 0 000-20z",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z",
  beef: "M12 2C8 2 4 5 4 10c0 3 2 5 4 7v5h8v-5c2-2 4-4 4-7 0-5-4-8-8-8z",
  trendingUp: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  briefcase: "M20 7h-4V5l-2-2h-4L8 5v2H4v14h16V7z M8 7h8",
  send: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",
  message: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
  video: "M23 7l-7 5 7 5V7zM1 5a2 2 0 012-2h12a2 2 0 012 2v14a2 2 0 01-2 2H3a2 2 0 01-2-2V5z",
  phone: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z",
  paperclip: "M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48",
  shoppingCart: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.4 6M17 13l2.4 6M9 21a2 2 0 100-4 2 2 0 000 4zm8 0a2 2 0 100-4 2 2 0 000 4z",
  trash: "M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2",
  creditCard: "M3 10h18M7 15h1m4 0h1m-2 0h1M5 6h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z",
  zoom: "M23 7l-7 5 7 5V7zM1 5a2 2 0 012-2h12a2 2 0 012 2v14a2 2 0 01-2 2H3a2 2 0 01-2-2V5z",
  dollar: "M12 2v20M8 6h8M8 18h8",
  users: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
  barChart: "M4 20h16M6 16l4-8 4 4 4-4",
  pieChart: "M21 12a9 9 0 11-18 0 9 9 0 0118 0zM12 3v9l5 5",
  shoppingBag: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
  truck: "M1 3h15v13H1V3zM6 16v2a2 2 0 104 0v-2M16 8h4l3 3v5h-2M16 16h-2M18 16h2",
  heart: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
};

// ─── Badge Component ──────────────────────────────────────────────────
const Badge = ({ 
  color, 
  children, 
  className = "",
  size = "sm"
}: { 
  color: "primary" | "success" | "warning" | "info" | "purple" | "gray" | "orange"; 
  children: React.ReactNode; 
  className?: string;
  size?: "sm" | "md";
}) => {
  const colors = {
    primary: "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20",
    success: "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20",
    warning: "bg-warning/10 text-warning border border-warning/20",
    info: "bg-blue-500/10 text-blue-600 border border-blue-500/20",
    purple: "bg-purple-500/10 text-purple-600 border border-purple-500/20",
    gray: "bg-gray-100 text-gray-600 border border-gray-200",
    orange: "bg-orange-500/10 text-orange-600 border border-orange-500/20",
  };
  
  const sizes = {
    sm: "text-[10px] px-2.5 py-1",
    md: "text-xs px-3 py-1.5",
  };
  
  return (
    <span className={`font-semibold rounded-full backdrop-blur-sm ${sizes[size]} ${colors[color]} ${className}`}>
      {children}
    </span>
  );
};

// ─── ZoomMeeting Component ──────────────────────────────────────────
const ZoomMeeting = ({
  animal,
  onClose,
  onScheduleZoom,
}: {
  animal: any;
  onClose: () => void;
  onScheduleZoom: (date: string, time: string) => Promise<{ link: string }>;
}) => {
  const [meetingLink, setMeetingLink] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [scheduled, setScheduled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleScheduleZoom = async () => {
    if (!meetingDate || !meetingTime) return;
    setLoading(true);
    setError("");
    try {
      const { link } = await onScheduleZoom(meetingDate, meetingTime);
      setMeetingLink(link);
      setScheduled(true);
    } catch (e: any) {
      setError(e.message || "Failed to schedule Zoom meeting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#ffffff] rounded-2xl border border-[rgba(15,23,42,0.08)] p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[#0f172a]">Schedule Zoom Meeting</h3>
        <button onClick={onClose} className="text-[#475569] hover:text-[#0f172a]">
          <Icon d={icons.x} size={18} />
        </button>
      </div>

      {!scheduled ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-[#f8fafc] rounded-xl border border-[rgba(15,23,42,0.08)]">
            <div className="w-10 h-10 rounded-lg bg-[#10b981]/10 flex items-center justify-center">
              <Icon d={icons.video} size={20} className="text-[#10b981]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#0f172a]">{animal?.name}</p>
              <p className="text-xs text-[#475569]">{animal?.breed || 'Unknown breed'}</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-2">
              Meeting Date
            </label>
            <input
              type="date"
              value={meetingDate}
              onChange={(e) => setMeetingDate(e.target.value)}
              className="w-full bg-[#f8fafc] border border-[rgba(15,23,42,0.08)] rounded-xl px-4 py-2.5 text-sm text-[#0f172a] focus:outline-none focus:border-[#10b981]/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-2">
              Meeting Time
            </label>
            <input
              type="time"
              value={meetingTime}
              onChange={(e) => setMeetingTime(e.target.value)}
              className="w-full bg-[#f8fafc] border border-[rgba(15,23,42,0.08)] rounded-xl px-4 py-2.5 text-sm text-[#0f172a] focus:outline-none focus:border-[#10b981]/50"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            onClick={handleScheduleZoom}
            disabled={!meetingDate || !meetingTime || loading}
            className="w-full bg-[#10b981] hover:bg-[#059669] disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Scheduling…
              </>
            ) : (
              <>
                <Icon d={icons.video} size={16} />
                Schedule Zoom Meeting
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-[#f8fafc] rounded-xl p-4 border border-[rgba(15,23,42,0.08)]">
            <div className="flex items-center gap-2 text-[#10b981] mb-2">
              <Icon d={icons.check} size={16} />
              <span className="text-sm font-medium">Meeting Scheduled!</span>
            </div>
            <p className="text-sm text-[#475569] mb-2">Zoom Meeting Link:</p>
            <div className="bg-[#ffffff] p-3 rounded-lg border border-[rgba(15,23,42,0.08)]">
              <p className="text-sm text-[#10b981] font-mono break-all">{meetingLink}</p>
            </div>
            <p className="text-xs text-[#475569] mt-2">
              Date: {new Date(meetingDate).toLocaleDateString()} at {meetingTime}
            </p>
          </div>
          <button
            onClick={() => window.open(meetingLink, '_blank')}
            className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-semibold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
          >
            <Icon d={icons.video} size={16} />
            Join Zoom Meeting
          </button>
        </div>
      )}
    </div>
  );
};

// ─── PaymentModal Component ──────────────────────────────────────────
const PaymentModal = ({
  animal,
  onClose,
  onPay,
}: {
  animal: any;
  onClose: () => void;
  onPay: (method: string, details: Record<string, string>) => Promise<void>;
}) => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    setProcessing(true);
    setError("");
    try {
      const details =
        paymentMethod === "card"
          ? { cardNumber, expiry, cvv }
          : paymentMethod === "mobile"
          ? { mobileNumber }
          : { bankAccount };
      await onPay(paymentMethod, details);
      setSuccess(true);
    } catch (e: any) {
      setError(e.message || "Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-[#ffffff] rounded-2xl border border-[rgba(15,23,42,0.08)] p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[#0f172a]">Payment Details</h3>
        <button onClick={onClose} className="text-[#475569] hover:text-[#0f172a]">
          <Icon d={icons.x} size={18} />
        </button>
      </div>

      {!success ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-[#f8fafc] rounded-xl border border-[rgba(15,23,42,0.08)]">
            <div className="w-10 h-10 rounded-lg bg-[#10b981]/10 flex items-center justify-center">
              <Icon d={icons.beef} size={20} className="text-[#10b981]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#0f172a]">{animal?.name}</p>
              <p className="text-xs text-[#475569]">{animal?.breed || 'Unknown breed'}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-[#10b981]">FRW {animal?.price?.toLocaleString() || 0}</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "card", label: "Card", icon: icons.creditCard },
                { id: "mobile", label: "Mobile", icon: icons.phone },
                { id: "bank", label: "Bank", icon: icons.briefcase },
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                    paymentMethod === method.id
                      ? "border-[#10b981] bg-[#10b981]/10 text-[#10b981]"
                      : "border-[rgba(15,23,42,0.08)] text-[#475569] hover:border-[#10b981]/30"
                  }`}
                >
                  <Icon d={method.icon} size={16} className="mx-auto mb-1" />
                  {method.label}
                </button>
              ))}
            </div>
          </div>

          {paymentMethod === "card" && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-[#f8fafc] border border-[rgba(15,23,42,0.08)] rounded-xl px-4 py-2.5 text-sm text-[#0f172a] placeholder:text-[#475569] focus:outline-none focus:border-[#10b981]/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-2">
                    Expiry
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full bg-[#f8fafc] border border-[rgba(15,23,42,0.08)] rounded-xl px-4 py-2.5 text-sm text-[#0f172a] placeholder:text-[#475569] focus:outline-none focus:border-[#10b981]/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-2">
                    CVV
                  </label>
                  <input
                    type="password"
                    placeholder="***"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="w-full bg-[#f8fafc] border border-[rgba(15,23,42,0.08)] rounded-xl px-4 py-2.5 text-sm text-[#0f172a] placeholder:text-[#475569] focus:outline-none focus:border-[#10b981]/50"
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === "mobile" && (
            <div>
              <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-2">
                Mobile Number
              </label>
              <input
                type="tel"
                placeholder="0788 123 456"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full bg-[#f8fafc] border border-[rgba(15,23,42,0.08)] rounded-xl px-4 py-2.5 text-sm text-[#0f172a] placeholder:text-[#475569] focus:outline-none focus:border-[#10b981]/50"
              />
            </div>
          )}

          {paymentMethod === "bank" && (
            <div>
              <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-2">
                Bank Account
              </label>
              <input
                type="text"
                placeholder="Account Number"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className="w-full bg-[#f8fafc] border border-[rgba(15,23,42,0.08)] rounded-xl px-4 py-2.5 text-sm text-[#0f172a] placeholder:text-[#475569] focus:outline-none focus:border-[#10b981]/50"
              />
            </div>
          )}

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            onClick={handlePayment}
            disabled={processing}
            className="w-full bg-[#10b981] hover:bg-[#059669] disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Icon d={icons.creditCard} size={16} />
                Pay FRW {animal?.price?.toLocaleString() || 0}
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-[#10b981]/10 flex items-center justify-center mx-auto mb-4">
            <Icon d={icons.check} size={32} className="text-[#10b981]" />
          </div>
          <h4 className="text-lg font-semibold text-[#0f172a]">Payment Successful!</h4>
          <p className="text-sm text-[#475569] mt-2">
            Your payment of FRW {animal?.price?.toLocaleString()} for {animal?.name} has been processed.
          </p>
          <button
            onClick={onClose}
            className="mt-6 px-6 py-2.5 bg-[#10b981] hover:bg-[#059669] text-white font-medium rounded-xl text-sm transition-all"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Calendar Component ──────────────────────────────────────────────
const MeetingCalendar = ({ animal, onSchedule }: { animal: any; onSchedule: (date: Date, title: string) => void }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingTime, setMeetingTime] = useState("10:00");
  const [showForm, setShowForm] = useState(false);
  const [events, setEvents] = useState<{ date: Date; title: string }[]>([]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    const startingDay = firstDay.getDay();
    
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear();
  };

  const hasEvent = (date: Date) => {
    return events.some(e => 
      e.date.getDate() === date.getDate() &&
      e.date.getMonth() === date.getMonth() &&
      e.date.getFullYear() === date.getFullYear()
    );
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowForm(true);
  };

  const handleSchedule = () => {
    if (selectedDate && meetingTitle.trim()) {
      const [hours, minutes] = meetingTime.split(':').map(Number);
      const scheduledDate = new Date(selectedDate);
      scheduledDate.setHours(hours, minutes);
      onSchedule(scheduledDate, meetingTitle);
      setEvents([...events, { date: scheduledDate, title: meetingTitle }]);
      setShowForm(false);
      setMeetingTitle("");
    }
  };

  const changeMonth = (delta: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentDate(newDate);
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="bg-[#ffffff] rounded-2xl p-6 border border-[rgba(15,23,42,0.08)]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-[#0f172a]">
          Schedule Meeting - {animal?.name || "Select Animal"}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => changeMonth(-1)}
            className="p-1.5 rounded-lg hover:bg-[#f8fafc] transition-all"
          >
            <Icon d="M15 19l-7-7 7-7" size={18} className="text-[#475569]" />
          </button>
          <span className="text-sm font-medium text-[#0f172a]">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button
            onClick={() => changeMonth(1)}
            className="p-1.5 rounded-lg hover:bg-[#f8fafc] transition-all"
          >
            <Icon d="M9 5l7 7-7 7" size={18} className="text-[#475569]" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-medium text-[#475569] py-1">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {getDaysInMonth(currentDate).map((date, index) => (
          <div key={index} className="aspect-square">
            {date ? (
              <button
                onClick={() => handleDateClick(date)}
                className={`w-full h-full rounded-lg text-sm font-medium transition-all relative ${
                  isToday(date)
                    ? "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20"
                    : isSelected(date)
                    ? "bg-[#10b981] text-white hover:bg-[#059669]"
                    : "hover:bg-[#f8fafc] text-[#0f172a]"
                }`}
              >
                {date.getDate()}
                {hasEvent(date) && !isSelected(date) && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#10b981]"></span>
                )}
                {hasEvent(date) && isSelected(date) && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white"></span>
                )}
              </button>
            ) : (
              <div className="w-full h-full"></div>
            )}
          </div>
        ))}
      </div>

      {showForm && selectedDate && (
        <div className="mt-4 p-4 bg-[#f8fafc] rounded-xl border border-[rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-[#0f172a]">
              New Meeting - {selectedDate.toLocaleDateString()}
            </h4>
            <button
              onClick={() => setShowForm(false)}
              className="text-[#475569] hover:text-[#0f172a]"
            >
              <Icon d={icons.x} size={16} />
            </button>
          </div>
          <input
            type="text"
            placeholder="Meeting title"
            value={meetingTitle}
            onChange={(e) => setMeetingTitle(e.target.value)}
            className="w-full bg-[#ffffff] border border-[rgba(15,23,42,0.08)] rounded-xl px-4 py-2 text-sm text-[#0f172a] placeholder:text-[#475569] focus:outline-none focus:border-[#10b981]/50 mb-3"
          />
          <div className="flex items-center gap-3">
            <input
              type="time"
              value={meetingTime}
              onChange={(e) => setMeetingTime(e.target.value)}
              className="bg-[#ffffff] border border-[rgba(15,23,42,0.08)] rounded-xl px-4 py-2 text-sm text-[#0f172a] focus:outline-none focus:border-[#10b981]/50"
            />
            <button
              onClick={handleSchedule}
              disabled={!meetingTitle.trim()}
              className="flex-1 bg-[#10b981] hover:bg-[#059669] disabled:opacity-50 text-white font-medium py-2 rounded-xl text-sm transition-all"
            >
              Schedule Meeting
            </button>
          </div>
        </div>
      )}

      {events.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[rgba(15,23,42,0.08)]">
          <h4 className="text-xs font-semibold text-[#475569] uppercase tracking-wider mb-2">
            Upcoming Meetings
          </h4>
          <div className="space-y-2">
            {events.slice(0, 3).map((event, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-[#f8fafc] rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#10b981]"></div>
                  <span className="text-sm text-[#0f172a]">{event.title}</span>
                </div>
                <span className="text-xs text-[#475569]">
                  {event.date.toLocaleDateString()} {event.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── ChatWidget Component ────────────────────────────────────────────
const ChatWidget = ({
  animal,
  onClose,
  fetchMessages,
  sendChatMessage,
}: {
  animal: any;
  onClose: () => void;
  fetchMessages: (animalId: string) => Promise<{ text: string; sender: "user" | "other"; timestamp: Date }[]>;
  sendChatMessage: (animalId: string, text: string) => Promise<{ text: string; sender: "user" | "other"; timestamp: Date } | null>;
}) => {
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'other'; timestamp: Date }[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    (async () => {
      setLoadingHistory(true);
      try {
        const history = await fetchMessages(animal?._id);
        setMessages(history);
      } catch {
        setMessages([]);
      } finally {
        setLoadingHistory(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animal?._id]);

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;
    const outgoing = { text: newMessage, sender: 'user' as const, timestamp: new Date() };
    setMessages(prev => [...prev, outgoing]);
    setNewMessage("");
    setSending(true);
    setError("");
    try {
      const reply = await sendChatMessage(animal?._id, outgoing.text);
      if (reply) {
        setMessages(prev => [...prev, reply]);
      }
    } catch (e: any) {
      setError(e.message || "Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-[#ffffff] rounded-2xl border border-[rgba(15,23,42,0.08)] flex flex-col h-[500px]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(15,23,42,0.08)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#10b981]/10 flex items-center justify-center text-[#10b981] font-semibold text-sm">
            {animal?.name?.[0] || 'A'}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#0f172a]">{animal?.name || 'Support'}</h4>
            <p className="text-xs text-[#10b981] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
              Online
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-[#475569] hover:text-[#0f172a] transition-all"
        >
          <Icon d={icons.x} size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loadingHistory && (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-[#10b981] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                msg.sender === 'user'
                  ? 'bg-[#10b981] text-white'
                  : 'bg-[#f8fafc] text-[#0f172a] border border-[rgba(15,23,42,0.08)]'
              }`}
            >
              {msg.text}
              <div className={`text-[10px] mt-1 ${msg.sender === 'user' ? 'text-white/70' : 'text-[#475569]'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 border-t border-[rgba(15,23,42,0.08)]">
        {error && <p className="text-red-600 text-xs mb-2">{error}</p>}
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl hover:bg-[#f8fafc] transition-all text-[#475569]">
            <Icon d={icons.paperclip} size={18} />
          </button>
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            disabled={sending}
            className="flex-1 bg-[#f8fafc] border border-[rgba(15,23,42,0.08)] rounded-xl px-4 py-2.5 text-sm text-[#0f172a] placeholder:text-[#475569] focus:outline-none focus:border-[#10b981]/50 disabled:opacity-60"
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || sending}
            className="p-2.5 rounded-xl bg-[#10b981] hover:bg-[#059669] disabled:opacity-50 text-white transition-all"
          >
            <Icon d={icons.send} size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── VeterinaryModal Component ───────────────────────────────────────
const VeterinaryModal = ({
  animal,
  onClose,
  onSubmit,
}: {
  animal: any;
  onClose: () => void;
  onSubmit: (data: { preferredDate: string; notes: string }) => Promise<void>;
}) => {
  const [preferredDate, setPreferredDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      await onSubmit({ preferredDate, notes });
      setSuccess(true);
    } catch (e: any) {
      setError(e.message || "Failed to submit veterinary request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#ffffff] rounded-2xl border border-[rgba(15,23,42,0.08)] p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[#0f172a]">Request Veterinary Visit</h3>
        <button onClick={onClose} className="text-[#475569] hover:text-[#0f172a]">
          <Icon d={icons.x} size={18} />
        </button>
      </div>

      {!success ? (
        <div className="space-y-4">
          {animal?.name && (
            <div className="flex items-center gap-3 p-3 bg-[#f8fafc] rounded-xl border border-[rgba(15,23,42,0.08)]">
              <div className="w-10 h-10 rounded-lg bg-[#10b981]/10 flex items-center justify-center">
                <Icon d={icons.beef} size={20} className="text-[#10b981]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#0f172a]">{animal.name}</p>
                <p className="text-xs text-[#475569]">{animal.breed || "Unknown breed"}</p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-2">
              Preferred Date
            </label>
            <input
              type="date"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              className="w-full bg-[#f8fafc] border border-[rgba(15,23,42,0.08)] rounded-xl px-4 py-2.5 text-sm text-[#0f172a] focus:outline-none focus:border-[#10b981]/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-2">
              Notes for the Vet
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Describe symptoms or the reason for the visit"
              className="w-full bg-[#f8fafc] border border-[rgba(15,23,42,0.08)] rounded-xl px-4 py-2.5 text-sm text-[#0f172a] placeholder:text-[#475569] focus:outline-none focus:border-[#10b981]/50"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={!preferredDate || loading}
            className="w-full bg-[#10b981] hover:bg-[#059669] disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                <Icon d={icons.document} size={16} />
                Request Veterinary Visit
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-[#10b981]/10 flex items-center justify-center mx-auto mb-4">
            <Icon d={icons.check} size={32} className="text-[#10b981]" />
          </div>
          <h4 className="text-lg font-semibold text-[#0f172a]">Request Submitted!</h4>
          <p className="text-sm text-[#475569] mt-2">A veterinary partner will reach out to confirm the visit.</p>
          <button
            onClick={onClose}
            className="mt-6 px-6 py-2.5 bg-[#10b981] hover:bg-[#059669] text-white font-medium rounded-xl text-sm transition-all"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};

// ─── DeliveryModal Component ─────────────────────────────────────────
const DeliveryModal = ({
  animal,
  onClose,
  onSubmit,
}: {
  animal: any;
  onClose: () => void;
  onSubmit: (data: { address: string; deliveryDate: string; notes: string }) => Promise<void>;
}) => {
  const [address, setAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      await onSubmit({ address, deliveryDate, notes });
      setSuccess(true);
    } catch (e: any) {
      setError(e.message || "Failed to submit delivery request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#ffffff] rounded-2xl border border-[rgba(15,23,42,0.08)] p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[#0f172a]">Request Delivery</h3>
        <button onClick={onClose} className="text-[#475569] hover:text-[#0f172a]">
          <Icon d={icons.x} size={18} />
        </button>
      </div>

      {!success ? (
        <div className="space-y-4">
          {animal?.name && (
            <div className="flex items-center gap-3 p-3 bg-[#f8fafc] rounded-xl border border-[rgba(15,23,42,0.08)]">
              <div className="w-10 h-10 rounded-lg bg-[#10b981]/10 flex items-center justify-center">
                <Icon d={icons.truck} size={20} className="text-[#10b981]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#0f172a]">{animal.name}</p>
                <p className="text-xs text-[#475569]">{animal.breed || "Unknown breed"}</p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-2">
              Delivery Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="District, Sector, Cell"
              className="w-full bg-[#f8fafc] border border-[rgba(15,23,42,0.08)] rounded-xl px-4 py-2.5 text-sm text-[#0f172a] placeholder:text-[#475569] focus:outline-none focus:border-[#10b981]/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-2">
              Preferred Delivery Date
            </label>
            <input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              className="w-full bg-[#f8fafc] border border-[rgba(15,23,42,0.08)] rounded-xl px-4 py-2.5 text-sm text-[#0f172a] focus:outline-none focus:border-[#10b981]/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-2">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Gate code, landmark, or other instructions"
              className="w-full bg-[#f8fafc] border border-[rgba(15,23,42,0.08)] rounded-xl px-4 py-2.5 text-sm text-[#0f172a] placeholder:text-[#475569] focus:outline-none focus:border-[#10b981]/50"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={!address || !deliveryDate || loading}
            className="w-full bg-[#10b981] hover:bg-[#059669] disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                <Icon d={icons.truck} size={16} />
                Request Delivery
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-[#10b981]/10 flex items-center justify-center mx-auto mb-4">
            <Icon d={icons.check} size={32} className="text-[#10b981]" />
          </div>
          <h4 className="text-lg font-semibold text-[#0f172a]">Delivery Requested!</h4>
          <p className="text-sm text-[#475569] mt-2">We'll confirm logistics and share tracking details shortly.</p>
          <button
            onClick={onClose}
            className="mt-6 px-6 py-2.5 bg-[#10b981] hover:bg-[#059669] text-white font-medium rounded-xl text-sm transition-all"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};

// ─── InterestModal Component ─────────────────────────────────────────
const InterestModal = ({
  animal,
  interestRate,
  onClose,
  onSubmit,
}: {
  animal: any;
  interestRate: number;
  onClose: () => void;
  onSubmit: (data: { amount: number; termMonths: number }) => Promise<void>;
}) => {
  const [amount, setAmount] = useState("");
  const [termMonths, setTermMonths] = useState("12");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const principal = parseFloat(amount) || 0;
  const months = parseInt(termMonths, 10) || 0;
  const estimatedInterest = principal * (interestRate / 100) * (months / 12);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      await onSubmit({ amount: principal, termMonths: months });
      setSuccess(true);
    } catch (e: any) {
      setError(e.message || "Failed to submit interest request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#ffffff] rounded-2xl border border-[rgba(15,23,42,0.08)] p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[#0f172a]">Request Interest Financing</h3>
        <button onClick={onClose} className="text-[#475569] hover:text-[#0f172a]">
          <Icon d={icons.x} size={18} />
        </button>
      </div>

      {!success ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-[#f8fafc] rounded-xl border border-[rgba(15,23,42,0.08)]">
            <span className="text-sm text-[#475569]">Current Rate</span>
            <span className="text-sm font-bold text-[#10b981]">{interestRate}% / year</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-2">
              Amount (FRW)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={animal?.price ? String(animal.price) : "0"}
              className="w-full bg-[#f8fafc] border border-[rgba(15,23,42,0.08)] rounded-xl px-4 py-2.5 text-sm text-[#0f172a] placeholder:text-[#475569] focus:outline-none focus:border-[#10b981]/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-2">
              Term (months)
            </label>
            <input
              type="number"
              value={termMonths}
              onChange={(e) => setTermMonths(e.target.value)}
              className="w-full bg-[#f8fafc] border border-[rgba(15,23,42,0.08)] rounded-xl px-4 py-2.5 text-sm text-[#0f172a] focus:outline-none focus:border-[#10b981]/50"
            />
          </div>

          {principal > 0 && (
            <div className="flex items-center justify-between p-3 bg-[#10b981]/10 rounded-xl border border-[#10b981]/20">
              <span className="text-sm text-[#475569]">Estimated Interest</span>
              <span className="text-sm font-bold text-[#10b981]">FRW {estimatedInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
          )}

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={!amount || !termMonths || loading}
            className="w-full bg-[#10b981] hover:bg-[#059669] disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                <Icon d={icons.dollar} size={16} />
                Submit Interest Request
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-[#10b981]/10 flex items-center justify-center mx-auto mb-4">
            <Icon d={icons.check} size={32} className="text-[#10b981]" />
          </div>
          <h4 className="text-lg font-semibold text-[#0f172a]">Request Submitted!</h4>
          <p className="text-sm text-[#475569] mt-2">Our finance team will review your request and follow up.</p>
          <button
            onClick={onClose}
            className="mt-6 px-6 py-2.5 bg-[#10b981] hover:bg-[#059669] text-white font-medium rounded-xl text-sm transition-all"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};

// ─── TrustScoreModal Component ───────────────────────────────────────
const TrustScoreModal = ({
  onClose,
  onVerify,
}: {
  onClose: () => void;
  onVerify: () => Promise<{ score: number; level: string }>;
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ score: number; level: string } | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await onVerify();
        setResult(data);
      } catch (e: any) {
        setError(e.message || "Failed to verify trust score.");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-[#ffffff] rounded-2xl border border-[rgba(15,23,42,0.08)] p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[#0f172a]">Verify Trust Score</h3>
        <button onClick={onClose} className="text-[#475569] hover:text-[#0f172a]">
          <Icon d={icons.x} size={18} />
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-[#10b981] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-8">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && result && (
        <div className="text-center py-6">
          <div className="w-24 h-24 rounded-full bg-[#10b981]/10 border-4 border-[#10b981]/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-black text-[#10b981]">{result.score}</span>
          </div>
          <h4 className="text-lg font-semibold text-[#0f172a]">{result.level}</h4>
          <p className="text-sm text-[#475569] mt-2">
            Your trust score reflects your transaction history, verification status, and community feedback on AniMarket.
          </p>
          <button
            onClick={onClose}
            className="mt-6 px-6 py-2.5 bg-[#10b981] hover:bg-[#059669] text-white font-medium rounded-xl text-sm transition-all"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Chart Component ─────────────────────────────────────────────────
const chartData = [
  { name: 'Jan', value: 4000, volume: 2400 },
  { name: 'Feb', value: 3000, volume: 1398 },
  { name: 'Mar', value: 2000, volume: 9800 },
  { name: 'Apr', value: 2780, volume: 3908 },
  { name: 'May', value: 1890, volume: 4800 },
  { name: 'Jun', value: 2390, volume: 3800 },
  { name: 'Jul', value: 3490, volume: 4300 },
];

const AssetChart = () => {
  const topCategories = [
    { name: "Electronics", sales: 1200000, color: "#059669" },
    { name: "Fashion", sales: 950000, color: "#10b981" },
    { name: "Home & Kitchen", sales: 750000, color: "#34d399" },
    { name: "Beauty & Personal Care", sales: 500000, color: "#86eac5" },
  ];

  const totalSales = topCategories.reduce((sum, cat) => sum + cat.sales, 0);

  const DonutChart = ({
    data,
    size = 180,
    strokeWidth = 18,
  }: {
    data: any[];
    size?: number;
    strokeWidth?: number;
  }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const GAP = 10;
    let currentOffset = 0;

    return (
      <div className="relative flex items-center justify-center">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#F3F4F6"
            strokeWidth={strokeWidth}
          />

          {data.map((item, index) => {
            const percentage = item.sales / totalSales;
            const dash = circumference * percentage - GAP;

            const circle = (
              <circle
                key={index}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dash} ${circumference}`}
                strokeDashoffset={-currentOffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-in-out"
              />
            );

            currentOffset += circumference * percentage;
            return circle;
          })}
        </svg>

        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-xs text-gray-400">Total Sales</span>
          <span className="text-2xl font-bold text-slate-900">
            ${(totalSales / 1000000).toFixed(1)}M
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 bg-[#ffffff] rounded-2xl p-6 border border-[rgba(15,23,42,0.08)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-semibold text-[#0f172a]">Asset Performance</h4>
            <p className="text-xs text-[#475569]">Monthly market trends</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span>
              <span className="text-xs text-[#475569]">Value</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#34d399]"></span>
              <span className="text-xs text-[#475569]">Volume</span>
            </div>
          </div>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid rgba(15,23,42,0.08)',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#10b981" 
                fill="#10b981" 
                fillOpacity={0.15}
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="volume" 
                stroke="#34d399" 
                fill="#34d399" 
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="col-span-1 bg-[#ffffff] rounded-2xl p-6 border border-[rgba(15,23,42,0.08)]">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-[#0f172a]">Top Categories</h4>
          <button className="text-xs font-medium text-[#10b981] hover:text-[#059669] transition-all">
            See All →
          </button>
        </div>

        <div className="flex justify-center">
          <DonutChart data={topCategories} size={190} strokeWidth={20} />
        </div>

        <div className="space-y-3 mt-6">
          {topCategories.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
              <span className="text-sm font-semibold text-slate-900">
                ${(item.sales / 1000000).toFixed(1)}M
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── ShoppingCart Component ──────────────────────────────────────────
const ShoppingCart = ({ cart, onClose, onRemove }: { cart: any[]; onClose: () => void; onRemove: (id: string) => void }) => {
  const totalAmount = cart.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <div className="bg-[#ffffff] rounded-2xl border border-[rgba(15,23,42,0.08)] flex flex-col max-w-md w-full max-h-[80vh]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(15,23,42,0.08)]">
        <div className="flex items-center gap-2">
          <Icon d={icons.shoppingCart} size={20} className="text-[#10b981]" />
          <h3 className="font-semibold text-[#0f172a]">Shopping Cart</h3>
          <span className="text-xs bg-[#10b981]/10 text-[#10b981] px-2 py-0.5 rounded-full">
            {cart.length} {cart.length === 1 ? 'item' : 'items'}
          </span>
        </div>
        <button onClick={onClose} className="text-[#475569] hover:text-[#0f172a] transition-all">
          <Icon d={icons.x} size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-[#475569]">
            <Icon d={icons.shoppingCart} size={48} className="mb-4 opacity-30" />
            <p className="text-sm font-medium">Your cart is empty</p>
            <p className="text-xs mt-1">Start adding assets to your cart</p>
          </div>
        ) : (
          cart.map((item, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-[#f8fafc] rounded-xl border border-[rgba(15,23,42,0.08)]">
              <div className="w-12 h-12 rounded-lg bg-[#10b981]/10 flex items-center justify-center flex-shrink-0">
                <Icon d={icons.beef} size={24} className="text-[#10b981]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#0f172a] truncate">{item.name}</p>
                <p className="text-xs text-[#475569]">{item.breed || 'Unknown breed'}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-[#10b981]">FRW {item.price?.toLocaleString() || 0}</p>
                <button onClick={() => onRemove(item._id)} className="text-xs text-red-500 hover:text-red-600 transition-all">
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <div className="p-4 border-t border-[rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-[#475569]">Total Amount</span>
            <span className="text-lg font-bold text-[#10b981]">FRW {totalAmount.toLocaleString()}</span>
          </div>
          <button className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-semibold py-3 rounded-xl text-sm transition-all">
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Animal Detail Modal ─────────────────────────────────────────────
const AnimalDetailModal = ({ 
  animal, 
  onClose, 
  isDark,
  addToCart,
  openModal,
}: { 
  animal: any; 
  onClose: () => void;
  isDark: boolean;
  addToCart: (animal: any) => void;
  openModal: (animal: any, modal: "booking" | "agreement" | "calendar" | "chat" | "zoom" | "payment") => void;
}) => {
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>, animal: any) => {
    e.stopPropagation();
    addToCart(animal);
    setAddedId(animal._id);
    setTimeout(() => setAddedId(null), 1200);
  };

  if (!animal) return null;

  const muted = isDark ? 'text-slate-400' : 'text-slate-500';
  const surface = isDark ? 'bg-white/[0.03]' : 'bg-slate-50';
  const divider = isDark ? 'border-white/10' : 'border-slate-100';
  const modalBg = isDark ? 'bg-[#16191f] text-white' : 'bg-white text-slate-900';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl ${modalBg} max-h-[92vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero Image */}
        <div className="relative h-64">
          {animal.images?.length > 0 ? (
            <img
              src={animal.images[0]}
              alt={animal.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-700">
              <Icon d={icons.beef} size={64} className="text-slate-400" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur text-white flex items-center justify-center hover:bg-red-500 transition-all"
          >
            <Icon d={icons.x} size={20} />
          </button>

          {animal.verified && (
            <div className="absolute top-4 left-4 flex items-center gap-1 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              <Icon d={icons.verify} size={14} />
              VERIFIED
            </div>
          )}

          <div className="absolute bottom-5 left-6">
            <h2 className="text-3xl font-black text-white">{animal.name}</h2>
            <div className="flex items-center gap-1 text-white/80 text-sm mt-1">
              <Icon d={icons.user} size={14} />
              {animal.owner?.name || 'Unknown Owner'}
            </div>
          </div>

          <div className="absolute bottom-5 right-6 text-right">
            <div className="text-3xl font-black text-white">
              FRW {animal.price?.toLocaleString() || 0}
            </div>
            <div className="text-white/70 text-sm">per head</div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 grid lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-5">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Weight', value: animal.weight || '—' },
                { label: 'Age', value: animal.age || '—' },
                { label: 'Breed', value: animal.breed || 'Unknown' },
              ].map((s) => (
                <div key={s.label} className={`rounded-xl p-3 text-center ${surface}`}>
                  <p className={`text-xs mb-1 ${muted}`}>{s.label}</p>
                  <p className="font-bold text-sm">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Status & Rating */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`rounded-xl p-4 ${surface}`}>
                <p className={`text-xs mb-1 ${muted}`}>Status</p>
                <p className={`text-xl font-black ${animal.isAvailable ? 'text-emerald-500' : 'text-red-500'}`}>
                  {animal.isAvailable ? 'Available' : 'Sold Out'}
                </p>
              </div>
              <div className={`rounded-xl p-4 ${surface}`}>
                <p className={`text-xs mb-1 ${muted}`}>Health Score</p>
                <p className="text-xl font-black text-[#10b981]">
                  {animal.healthScore || '—'}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-bold mb-2 text-sm uppercase tracking-wide text-emerald-500">About</h3>
              <p className={`text-sm leading-7 ${muted}`}>
                {animal.description || 'No description available for this animal.'}
              </p>
            </div>

            {/* Genetic Lineage */}
            {animal.geneticLineage && (
              <div>
                <h3 className="font-bold mb-2 text-sm uppercase tracking-wide text-emerald-500">Genetic Lineage</h3>
                <div className={`rounded-xl p-3 ${surface}`}>
                  <p className="text-sm font-medium">{animal.geneticLineage}</p>
                </div>
              </div>
            )}

            {/* Vaccinations */}
            {animal.vaccinatedFor && animal.vaccinatedFor.length > 0 && (
              <div>
                <h3 className="font-bold mb-3 text-sm uppercase tracking-wide text-emerald-500 flex items-center gap-2">
                  <Icon d={icons.shield} size={16} />
                  Vaccinations
                </h3>
                <div className="flex flex-wrap gap-2">
                  {animal.vaccinatedFor.map((v: string) => (
                    <span
                      key={v}
                      className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold"
                    >
                      <Icon d={icons.check} size={12} />
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Owner Contact */}
            <div className={`rounded-xl p-4 ${surface}`}>
              <h3 className="font-bold mb-3 text-sm uppercase tracking-wide text-emerald-500 flex items-center gap-2">
                <Icon d={icons.user} size={16} />
                Owner Contact
              </h3>
              <p className="font-bold mb-2">{animal.owner?.name || 'Unknown Owner'}</p>
              <div className={`flex items-center gap-2 text-sm mb-1 ${muted}`}>
                <Icon d={icons.phone} size={14} />
                {animal.owner?.phone || '+250 788 000 000'}
              </div>
              <div className={`flex items-center gap-2 text-sm ${muted}`}>
                <Icon d={icons.send} size={14} />
                {animal.owner?.email || 'owner@animarket.rw'}
              </div>
              {animal.location && (
                <div className={`flex items-center gap-2 text-sm mt-1 ${muted}`}>
                  <Icon d={icons.user} size={14} />
                  📍 {animal.location}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => openModal(animal, "booking")}
                className={`flex-1 h-12 rounded-xl font-bold text-sm transition-all ${
                  animal.isAvailable
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:scale-[1.02]'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
                disabled={!animal.isAvailable}
              >
                {animal.isAvailable ? 'Apply for Purchase' : 'Unavailable'}
              </button>

              <button
                onClick={() => openModal(animal, "zoom")}
                className={`h-12 px-4 rounded-xl border font-bold text-sm transition-all ${
                  isDark ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Icon d={icons.video} size={18} />
              </button>

              <button
                onClick={(e) => handleAddToCart(e, animal)}
                className={`h-12 w-12 rounded-xl border flex items-center justify-center transition-all flex-shrink-0 ${
                  addedId === animal._id
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : 'border-emerald-500/30 text-emerald-500 hover:bg-emerald-500 hover:text-white'
                }`}
              >
                {addedId === animal._id ? (
                  <Icon d={icons.check} size={20} />
                ) : (
                  <Icon d={icons.shoppingCart} size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Right Column - Map */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-sm uppercase tracking-wide text-emerald-500 flex items-center gap-2">
              <Icon d={icons.user} size={14} />
              Location
            </h3>
            <div className="rounded-2xl overflow-hidden flex-1 min-h-[400px] border border-emerald-500/20">
              {animal.location ? (
                <iframe
                  width="100%"
                  height="100%"
                  style={{ minHeight: '400px', border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(animal.location)}&output=embed`}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  Location not available
                </div>
              )}
            </div>
            {animal.location && (
              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(animal.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center text-sm text-emerald-500 font-semibold hover:underline"
              >
                Open in Google Maps →
              </a>
            )}

            <div className={`rounded-xl p-4 ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
              <h3 className="font-bold text-emerald-500 mb-1 text-sm flex items-center gap-2">
                <Icon d={icons.shield} size={14} />
                AniMarket Guarantee
              </h3>
              <p className={`text-xs leading-6 ${muted}`}>
                Every verified livestock purchase is protected against fraud and includes trusted delivery verification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────
const CustomerDashboard = () => {
  const location = useLocation();
  const [animalData, setAnimalData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("Jameson Holt");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState<"all" | "cattle" | "goat" | "chicken" | "pig" | "rabbit">("all");
  const [cart, setCart] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);
  const [activeSidebarItem, setActiveSidebarItem] = useState("Dashboard");
  
  // Animal Detail Modal
  const [showAnimalDetail, setShowAnimalDetail] = useState(false);
  const [detailAnimal, setDetailAnimal] = useState<any>(null);

  // Category stats
  const [categoryStats, setCategoryStats] = useState({
    total: 0,
    cattle: 0,
    goat: 0,
    chicken: 0,
    pig: 0,
    rabbit: 0
  });

  const [interestRate] = useState(5.5);

  // Modal
  const [selectedAnimal, setSelectedAnimal] = useState<any>(null);
  const [activeModal, setActiveModal] = useState<
    "booking" | "agreement" | "calendar" | "chat" | "zoom" | "payment" | "veterinary" | "delivery" | "interest" | "trustscore" | null
  >(null);

  // Booking
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [bookingError, setBookingError] = useState("");

  // Agreement
  const [digitalSignature, setDigitalSignature] = useState("");
  const [agreementId, setAgreementId] = useState("");
  const [agreement, setAgreement] = useState<any>(null);
  const [agreementPrice, setAgreementPrice] = useState("");
  const [agreementFetching, setAgreementFetching] = useState(false);
  const [agreementLoading, setAgreementLoading] = useState(false);
  const [agreementSuccess, setAgreementSuccess] = useState("");
  const [agreementError, setAgreementError] = useState("");

  const baseurl = "http://localhost:4000";
  const getToken = () => localStorage.getItem("token") || "";
  const getUserId = () => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      return u?._id || u?.id || "";
    } catch {
      return "";
    }
  };

  // Sidebar items
  const sidebarItems = [
    { id: "Dashboard", icon: icons.home, label: "Dashboard" },
    { id: "Analytics", icon: icons.trendingUp, label: "Analytics" },
    { id: "Veterinary", icon: icons.document, label: "Request Veterinary" },
    { id: "Zoom", icon: icons.video, label: "Schedule Zoom" },
    { id: "Agreement", icon: icons.pen, label: "Sign Agreement" },
    { id: "Delivery", icon: icons.truck, label: "Request Delivery" },
    { id: "Payment", icon: icons.creditCard, label: "Payment" },
    { id: "Interest", icon: icons.dollar, label: "Request Interest" },
    { id: "TrustScore", icon: icons.shield, label: "Verify Trust Score" },
  ];

  const handleSidebarClick = (itemId: string) => {
    setActiveSidebarItem(itemId);
    const contextAnimal = selectedAnimal || detailAnimal || cart[0] || filtered[0] || null;
    switch (itemId) {
      case "Veterinary":
        openModal(contextAnimal, "veterinary");
        break;
      case "Zoom":
        openModal(contextAnimal, "zoom");
        break;
      case "Agreement":
        openModal(contextAnimal, "agreement");
        break;
      case "Delivery":
        openModal(contextAnimal, "delivery");
        break;
      case "Payment":
        openModal(contextAnimal, "payment");
        break;
      case "Interest":
        openModal(contextAnimal, "interest");
        break;
      case "TrustScore":
        openModal(contextAnimal, "trustscore");
        break;
      default:
        break;
    }
  };

  // Toggle theme
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      setUserName(u?.name || "Jameson Holt");
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (activeModal !== "agreement" || !selectedAnimal?._id) return;

    const loadAgreement = async () => {
      setAgreementFetching(true);
      setAgreementId("");
      setAgreement(null);
      setAgreementPrice("");
      setAgreementError("");
      try {
        const res = await fetch(`${baseurl}/api/agreements/agreements/animal/${selectedAnimal._id}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (res.status === 404) return;
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to load agreement.");
        setAgreement(data?.data || null);
        setAgreementId(data?.data?._id || "");
        setAgreementPrice(data?.data?.price?.toString() || "");
      } catch (e: any) {
        setAgreementError(e.message);
      } finally {
        setAgreementFetching(false);
      }
    };

    loadAgreement();
  }, [activeModal, selectedAnimal]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserName("Jameson Holt");
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${baseurl}/api/animal/animals`);
        const data = await res.json();
        let animals = [];
        if (Array.isArray(data)) animals = data;
        else if (Array.isArray(data.animals)) animals = data.animals;
        else if (Array.isArray(data.data)) animals = data.data;
        else animals = [];
        
        setAnimalData(animals);
        
        const stats = {
          total: animals.length,
          cattle: animals.filter((a: any) => a.type?.toLowerCase() === 'cattle').length,
          goat: animals.filter((a: any) => a.type?.toLowerCase() === 'goat').length,
          chicken: animals.filter((a: any) => a.type?.toLowerCase() === 'chicken').length,
          pig: animals.filter((a: any) => a.type?.toLowerCase() === 'pig').length,
          rabbit: animals.filter((a: any) => a.type?.toLowerCase() === 'rabbit').length,
        };
        setCategoryStats(stats);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openModal = (
    animal: any,
    modal: "booking" | "agreement" | "calendar" | "chat" | "zoom" | "payment" | "veterinary" | "delivery" | "interest" | "trustscore"
  ) => {
    setSelectedAnimal(animal);
    setActiveModal(modal);
    if (modal !== "booking" && modal !== "agreement") {
      setBookingSuccess("");
      setBookingError("");
    }
    if (modal !== "agreement") {
      setDigitalSignature("");
      setAgreementSuccess("");
      setAgreementError("");
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedAnimal(null);
  };

  const addToCart = (animal: any) => {
    setCart([...cart, { ...animal, price: animal.price || 0 }]);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item._id !== id));
  };

  const handleBookAnimal = async () => {
    setBookingLoading(true);
    setBookingError("");
    setBookingSuccess("");
    try {
      const res = await fetch(`${baseurl}/api/bookings/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ animalId: selectedAnimal?._id, userId: getUserId() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to book animal.");
      const createdAgreement = data?.data?.agreement;
      if (createdAgreement?._id) {
        setAgreement(createdAgreement);
        setAgreementId(createdAgreement._id);
        setAgreementPrice(createdAgreement.price?.toString() || "");
      }
      setBookingSuccess(`${selectedAnimal?.name} booked successfully! You can now sign the agreement.`);
    } catch (e: any) {
      setBookingError(e.message);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleUpdateAgreementPrice = async () => {
    const price = Number(agreementPrice);
    if (!agreementId || !Number.isFinite(price) || price < 0) {
      setAgreementError("Please enter a valid price.");
      return;
    }
    setAgreementLoading(true);
    setAgreementError("");
    try {
      const res = await fetch(`${baseurl}/api/agreements/agreements/${agreementId}/price`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ price }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to update price.");
      setAgreement(data?.data || agreement);
      setAgreementPrice(data?.data?.price?.toString() || agreementPrice);
      setAgreementSuccess("Agreement price updated successfully.");
    } catch (e: any) {
      setAgreementError(e.message);
    } finally {
      setAgreementLoading(false);
    }
  };

  const handleSignAgreement = async () => {
    if (!digitalSignature.trim()) {
      setAgreementError("Please enter your digital signature.");
      return;
    }
    if (!agreementId) {
      setAgreementError("This agreement is waiting for admin creation.");
      return;
    }
    setAgreementLoading(true);
    setAgreementError("");
    setAgreementSuccess("");
    try {
      const sRes = await fetch(`${baseurl}/api/agreements/agreements/${agreementId}/sign`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ signature: digitalSignature }),
      });
      const sData = await sRes.json();
      if (!sRes.ok) throw new Error(sData?.message || "Failed to sign agreement.");
      setAgreementSuccess("Agreement signed successfully!");
    } catch (e: any) {
      setAgreementError(e.message);
    } finally {
      setAgreementLoading(false);
    }
  };

  const handleScheduleMeeting = async (date: Date, title: string) => {
    try {
const res = await fetch(`${baseurl}/api/meeting/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          animalId: selectedAnimal?._id,
          title,
          meetingDate: date.toISOString(),
          meetingType: "animal_inspection",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to schedule meeting.");
    } catch (e: any) {
      console.error("Meeting scheduling failed:", e.message);
    }
  };

  const handleScheduleZoomMeeting = async (date: string, time: string): Promise<{ link: string }> => {
    const meetingDateTime = new Date(`${date}T${time}:00`).toISOString();
    const res = await fetch(`${baseurl}/api/meeting/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        animalId: selectedAnimal?._id,
        title: `Zoom Meeting - ${selectedAnimal?.name || "Animal Inspection"}`,
        meetingDate: meetingDateTime,
        meetingType: "animal_inspection",
        provider: "zoom",
        durationMinutes: 30,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Failed to schedule Zoom meeting.");
    const link = data?.data?.meetingLink || data?.data?.videoCall?.meetingLink || data?.meetingLink;
    if (!link) throw new Error("Zoom link not returned by server.");
    return { link };
  };

  const handlePayAnimal = async (method: string, details: Record<string, string>) => {
    const res = await fetch(`${baseurl}/api/payments/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        animalId: selectedAnimal?._id,
        userId: getUserId(),
        amount: selectedAnimal?.price || 0,
        method,
        details,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Payment failed.");
  };

  const handleFetchChatMessages = async (
    animalId: string
  ): Promise<{ text: string; sender: "user" | "other"; timestamp: Date }[]> => {
    const res = await fetch(`${baseurl}/api/chat/messages/${animalId}?userId=${getUserId()}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const list = Array.isArray(data) ? data : data?.data || data?.messages || [];
    return list.map((m: any) => ({
      text: m.text || m.message || "",
      sender: m.senderId === getUserId() || m.sender === "user" ? "user" : "other",
      timestamp: m.createdAt ? new Date(m.createdAt) : new Date(),
    }));
  };

  const handleSendChatMessage = async (
    animalId: string,
    text: string
  ): Promise<{ text: string; sender: "user" | "other"; timestamp: Date } | null> => {
    const res = await fetch(`${baseurl}/api/chat/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ animalId, userId: getUserId(), text }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Failed to send message.");
    const reply = data?.data?.reply || data?.reply;
    if (!reply) return null;
    return {
      text: reply.text || reply.message || reply,
      sender: "other",
      timestamp: reply.createdAt ? new Date(reply.createdAt) : new Date(),
    };
  };

  const handleVeterinaryRequest = async (data: { preferredDate: string; notes: string }) => {
    const res = await fetch(`${baseurl}/api/veterinary/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        animalId: selectedAnimal?._id,
        userId: getUserId(),
        preferredDate: data.preferredDate,
        notes: data.notes,
      }),
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData?.message || "Failed to request veterinary visit.");
  };

  const handleDeliveryRequest = async (data: { address: string; deliveryDate: string; notes: string }) => {
    const res = await fetch(`${baseurl}/api/delivery/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        animalId: selectedAnimal?._id,
        userId: getUserId(),
        address: data.address,
        deliveryDate: data.deliveryDate,
        notes: data.notes,
      }),
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData?.message || "Failed to request delivery.");
  };

  const handleInterestRequest = async (data: { amount: number; termMonths: number }) => {
    const res = await fetch(`${baseurl}/api/interest/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        animalId: selectedAnimal?._id,
        userId: getUserId(),
        amount: data.amount,
        termMonths: data.termMonths,
        rate: interestRate,
      }),
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData?.message || "Failed to submit interest request.");
  };

  const handleVerifyTrustScore = async (): Promise<{ score: number; level: string }> => {
    const res = await fetch(`${baseurl}/api/trust/verify/${getUserId()}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Failed to verify trust score.");
    const score = data?.data?.score ?? data?.score ?? 0;
    const level = data?.data?.level ?? data?.level ?? (score >= 80 ? "Excellent Standing" : score >= 50 ? "Good Standing" : "Needs Improvement");
    return { score, level };
  };

  const handleAnimalClick = (animal: any) => {
    setDetailAnimal(animal);
    setShowAnimalDetail(true);
  };

  const closeAnimalDetail = () => {
    setShowAnimalDetail(false);
    setDetailAnimal(null);
  };

  const filtered = animalData.filter((a) => {
    if (searchTerm && !a.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !a.type?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !a.breed?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !a.geneticLineage?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !a.id?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (activeTab !== "all") {
      const typeMap: Record<string, string> = { cattle: "cattle", goat: "goat", chicken: "chicken", pig: "pig", rabbit: "rabbit" };
      if (a.type?.toLowerCase() !== typeMap[activeTab]) return false;
    }
    return true;
  });

  const getBadge = (animal: any) => {
    if (animal.verified && animal.audited) {
      return { text: "AUDITED ASSET", color: "info" as const };
    }
    if (animal.verified) {
      return { text: "VERIFIED ASSET", color: "success" as const };
    }
    if (animal.govCertified) {
      return { text: "GOV CERTIFIED", color: "purple" as const };
    }
    return null;
  };

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'rw', label: 'Kinyarwanda', flag: '🇷🇼' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'sw', label: 'Kiswahili', flag: '🇰🇪' },
  ];

  const getFlagEmoji = (lang: string) => {
    const found = languages.find(l => l.label === lang);
    return found ? found.flag : '🌐';
  };

  return (
    <div className={`flex h-screen ${isDarkMode ? 'dark bg-[#0f172a]' : 'bg-[#f8fafc]'} text-[#0f172a] overflow-hidden`} style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ─── SIDEBAR ────────────────────────────────────────────────────────── */}
{/* ─── SIDEBAR ────────────────────────────────────────────────────────── */}
<aside className={`w-64 flex-shrink-0 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[rgba(15,23,42,0.08)]'} border-r flex flex-col transition-all duration-300 h-screen`}>
  <div className={`px-6 py-6 border-b ${isDarkMode ? 'border-[#334155]' : 'border-[rgba(15,23,42,0.08)]'} flex-shrink-0`}>
    <div className="flex items-center gap-2.5">
      <div className="w-16 h-16 flex items-center justify-center">
        <img src={Brand} alt="logo"/>
      </div>
      <div>
        <h1 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-[#0f172a]'} tracking-tight`} style={{ fontFamily: "'Sora', sans-serif" }}>
          AniMarket
        </h1>
      </div>
    </div>
  </div>

  {/* Scrollable nav area with hover scroll */}
  <div 
    className="flex-1 px-4 py-6 space-y-1  hover:scrollbar-show"
    style={{
      scrollbarWidth: 'thin',
      scrollbarColor: 'rgba(16, 185, 129, 0.3) transparent',
    }}
  >
    {/* Custom scrollbar styles using style tag */}
    <style>{`
      .hover\\:scrollbar-show {
        overflow-y: auto;
      }
      .hover\\:scrollbar-show::-webkit-scrollbar {
        width: 4px;
        opacity: 0;
        transition: opacity 0.3s;
      }
      .hover\\:scrollbar-show::-webkit-scrollbar-track {
        background: transparent;
      }
      .hover\\:scrollbar-show::-webkit-scrollbar-thumb {
        background: transparent;
        border-radius: 10px;
        transition: background 0.3s;
      }
      .hover\\:scrollbar-show:hover::-webkit-scrollbar-thumb {
        background: rgba(16, 185, 129, 0.3);
      }
      .hover\\:scrollbar-show:hover::-webkit-scrollbar-thumb:hover {
        background: rgba(16, 185, 129, 0.5);
      }
      /* Firefox scrollbar */
      .hover\\:scrollbar-show {
        scrollbar-width: thin;
        scrollbar-color: transparent transparent;
        transition: scrollbar-color 0.3s;
      }
      .hover\\:scrollbar-show:hover {
        scrollbar-color: rgba(16, 185, 129, 0.3) transparent;
      }
    `}</style>

    <nav className="space-y-1">
      {sidebarItems.map((item) => (
        <div
          key={item.id}
          onClick={() => handleSidebarClick(item.id)}
          className={`px-3 py-2.5 rounded-xl flex items-center gap-3 text-sm font-medium transition-all duration-200 cursor-pointer ${
            activeSidebarItem === item.id
              ? 'bg-[#10b981] text-white shadow-lg shadow-[#10b981]/20'
              : isDarkMode
                ? 'text-[#94a3b8] hover:text-white hover:bg-[#334155]'
                : 'text-[#475569] hover:text-[#0f172a] hover:bg-[rgba(255,255,255,0.7)]'
          }`}
        >
          <Icon d={item.icon} size={18} />
          {item.label}
        </div>
      ))}
    </nav>
  </div>

  {/* Bottom actions - Fixed at bottom */}
  <div className={`px-4 pb-6 space-y-1 border-t ${isDarkMode ? 'border-[#334155]' : 'border-[rgba(15,23,42,0.08)]'} pt-4 flex-shrink-0`}>
    <div className={`px-3 py-2.5 rounded-xl ${isDarkMode ? 'text-[#94a3b8] hover:text-white hover:bg-[#334155]' : 'text-[#475569] hover:text-[#0f172a] hover:bg-[rgba(255,255,255,0.7)]'} flex items-center gap-3 text-sm transition-all duration-200 cursor-pointer`}>
      <Icon d={icons.settings} size={18} />
      Settings
    </div>
  
    <Link 
      to="/" 
      onMouseEnter={() => setIsLogoutHovered(true)}
      onMouseLeave={() => setIsLogoutHovered(false)}
      onClick={handleLogout}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
        isLogoutHovered 
          ? 'bg-red-500/10 text-red-600' 
          : isDarkMode 
            ? 'text-[#94a3b8] hover:text-white hover:bg-[#334155]' 
            : 'text-[#475569] hover:text-[#0f172a] hover:bg-[rgba(255,255,255,0.7)]'
      }`}
    >
      <IoMdLogOut className={`text-lg transition-colors duration-200 ${isLogoutHovered ? 'text-red-600' : ''}`} />
      <span>Logout</span>
    </Link>
  </div>
</aside>

      {/* ─── MAIN CONTENT ──────────────────────────────────────────────────────── */}
      <div className={`flex-1 flex flex-col min-w-0 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
        <header className={`flex-shrink-0 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[rgba(15,23,42,0.08)]'} border-b px-8 py-4`}>
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-xl">
              <Icon d={icons.search} size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-[#94a3b8]' : 'text-[#475569]'}`} />
              <input
                type="text"
                placeholder="Search animal category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full ${isDarkMode ? 'bg-[#334155] border-[#475569] text-white placeholder:text-[#94a3b8]' : 'bg-[#f8fafc] border-[rgba(15,23,42,0.08)] text-[#0f172a] placeholder:text-[#475569]'} rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#10b981]/50 transition-colors`}
              />
            </div>

            <div className="flex items-center gap-5">
              {/* Language Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                  className={`w-9 h-9 rounded-xl ${isDarkMode ? 'bg-[#334155] hover:bg-[#475569]' : 'bg-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.95)]'} flex items-center justify-center transition-all duration-200`}
                >
                  <span className="text-lg">{getFlagEmoji(selectedLanguage)}</span>
                  <FaChevronDown className={`ml-0.5 text-xs ${isDarkMode ? 'text-[#94a3b8]' : 'text-[#475569]'} transition-transform duration-300 ${isLanguageOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform origin-top-right ${
                  isLanguageOpen 
                    ? 'opacity-100 scale-100 pointer-events-auto' 
                    : 'opacity-0 scale-95 pointer-events-none'
                } ${isDarkMode ? 'bg-[#1e293b] border border-[#334155]' : 'bg-[#ffffff] border border-[rgba(15,23,42,0.08)]'}`}>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setSelectedLanguage(lang.label);
                        setIsLanguageOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-all duration-200 ${
                        selectedLanguage === lang.label 
                          ? 'bg-[#10b981]/10 text-[#10b981]' 
                          : isDarkMode 
                            ? 'text-[#94a3b8] hover:text-white hover:bg-[#334155]' 
                            : 'text-[#475569] hover:text-[#0f172a] hover:bg-[rgba(255,255,255,0.7)]'
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      {lang.label}
                      {selectedLanguage === lang.label && (
                        <Icon d={icons.check} size={14} className="ml-auto text-[#10b981]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`w-9 h-9 rounded-xl ${isDarkMode ? 'bg-[#334155] hover:bg-[#475569]' : 'bg-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.95)]'} flex items-center justify-center transition-all duration-300 hover:rotate-12`}
              >
                {isDarkMode ? (
                  <MdLightMode className="text-yellow-400 text-xl" />
                ) : (
                  <MdDarkMode className="text-[#475569] text-xl" />
                )}
              </button>

              {/* Cart */}
              <button
                onClick={() => setShowCart(!showCart)}
                className={`w-9 h-9 rounded-xl ${isDarkMode ? 'bg-[#334155] hover:bg-[#475569]' : 'bg-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.95)]'} flex items-center justify-center transition-all duration-200 relative`}
              >
                <Icon d={icons.shoppingCart} size={18} className={isDarkMode ? 'text-[#94a3b8]' : 'text-[#475569]'} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#10b981] text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {cart.length}
                  </span>
                )}
              </button>

              {/* Profile Dropdown */}
              <div className="relative flex items-center gap-3 pl-4 border-l border-[rgba(15,23,42,0.08)]">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3"
                >
                  <div className={`w-9 h-9 rounded-full ${isDarkMode ? 'bg-[#10b981]/20' : 'bg-[#10b981]/10'} flex items-center justify-center text-[#10b981] font-semibold text-sm transition-all duration-300 ${isProfileOpen ? 'ring-2 ring-[#10b981]' : ''}`}>
                    {userName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex items-center gap-1">
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-[#0f172a]'}`}>{userName}</p>
                    <IoMdArrowDropdown className={`transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''} ${isDarkMode ? 'text-[#94a3b8]' : 'text-[#475569]'}`} />
                  </div>
                </button>

                <div className={`absolute right-0 top-full mt-2 w-56 rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform origin-top-right ${
                  isProfileOpen 
                    ? 'opacity-100 scale-100 pointer-events-auto' 
                    : 'opacity-0 scale-95 pointer-events-none'
                } ${isDarkMode ? 'bg-[#1e293b] border border-[#334155]' : 'bg-[#ffffff] border border-[rgba(15,23,42,0.08)]'}`}>
                  <div className={`px-4 py-3 border-b ${isDarkMode ? 'border-[#334155]' : 'border-[rgba(15,23,42,0.08)]'}`}>
                    <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-[#0f172a]'}`}>{userName}</p>
                    <p className="text-xs text-[#475569]">user@example.com</p>
                  </div>
                  <div className="py-1">
                    {[
                      { icon: icons.user, label: 'My Profile' },
                      { icon: icons.settings, label: 'Account Settings' },
                      { icon: icons.creditCard, label: 'Billing' },
                      { icon: icons.shield, label: 'Privacy' },
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-200 ${
                          isDarkMode 
                            ? 'text-[#94a3b8] hover:text-white hover:bg-[#334155]' 
                            : 'text-[#475569] hover:text-[#0f172a] hover:bg-[rgba(255,255,255,0.7)]'
                        }`}
                      >
                        <Icon d={item.icon} size={16} />
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <div className={`border-t ${isDarkMode ? 'border-[#334155]' : 'border-[rgba(15,23,42,0.08)]'} py-1`}>
                    <button
                      onClick={handleLogout}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition-all duration-200 hover:bg-red-50 ${isDarkMode ? 'hover:bg-red-500/10' : 'hover:bg-red-50'}`}
                    >
                      <IoMdLogOut className="text-lg" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className={`flex-1 overflow-y-auto p-8 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
          <div className="flex gap-6">
            <div className="flex-1 min-w-0">
              {/* Category Stats */}
              <div className="grid grid-cols-6 gap-4 mb-6">
                <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[rgba(15,23,42,0.08)]'} border`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-[#94a3b8]' : 'text-[#475569]'}`}>Total</p>
                      <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#0f172a]'}`}>{categoryStats.total}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-[#10b981]/10 flex items-center justify-center">
                      <Icon d={icons.pieChart} size={20} className="text-[#10b981]" />
                    </div>
                  </div>
                </div>
                <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[rgba(15,23,42,0.08)]'} border`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-[#94a3b8]' : 'text-[#475569]'}`}> Cattle</p>
                      <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#0f172a]'}`}>{categoryStats.cattle}</p>
                    </div>
                  </div>
                </div>
                <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[rgba(15,23,42,0.08)]'} border`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-[#94a3b8]' : 'text-[#475569]'}`}> Goat</p>
                      <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#0f172a]'}`}>{categoryStats.goat}</p>
                    </div>
                  </div>
                </div>
                <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[rgba(15,23,42,0.08)]'} border`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-[#94a3b8]' : 'text-[#475569]'}`}> Chicken</p>
                      <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#0f172a]'}`}>{categoryStats.chicken}</p>
                    </div>
                  </div>
                </div>
                <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[rgba(15,23,42,0.08)]'} border`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-[#94a3b8]' : 'text-[#475569]'}`}>Pig</p>
                      <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#0f172a]'}`}>{categoryStats.pig}</p>
                    </div>
                  </div>
                </div>
                <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[rgba(15,23,42,0.08)]'} border`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-[#94a3b8]' : 'text-[#475569]'}`}> Rabbit</p>
                      <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-[#0f172a]'}`}>{categoryStats.rabbit}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className={`flex gap-1 ${isDarkMode ? 'bg-[#1e293b]' : 'bg-[#ffffff]'} rounded-xl p-1 border ${isDarkMode ? 'border-[#334155]' : 'border-[rgba(15,23,42,0.08)]'}`}>
                  {[
                    { id: "all", label: "All Categories" },
                    { id: "cattle", label: " Cow" },
                    { id: "goat", label: " Goat" },
                    { id: "chicken", label: " Chicken" },
                    { id: "pig", label: "Pig" },
                    { id: "rabbit", label: " Rabbit" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? "bg-[#10b981]/10 text-[#10b981]"
                          : isDarkMode 
                            ? "text-[#94a3b8] hover:text-white" 
                            : "text-[#475569] hover:text-[#0f172a]"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <select className={`${isDarkMode ? 'bg-[#1e293b] border-[#334155] text-white' : 'bg-[#ffffff] border-[rgba(15,23,42,0.08)] text-[#0f172a]'} border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#10b981]/50`}>
                    <option>Sort by: Recent</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Health Score</option>
                  </select>
                  <div className={`flex ${isDarkMode ? 'bg-[#1e293b]' : 'bg-[#ffffff]'} rounded-xl p-1 border ${isDarkMode ? 'border-[#334155]' : 'border-[rgba(15,23,42,0.08)]'}`}>
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 rounded-lg transition-all ${
                        viewMode === "grid" ? "bg-[#10b981]/10 text-[#10b981]" : isDarkMode ? "text-[#94a3b8] hover:text-white" : "text-[#475569] hover:text-[#0f172a]"
                      }`}
                    >
                      <Icon d={icons.grid} size={18} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-1.5 rounded-lg transition-all ${
                        viewMode === "list" ? "bg-[#10b981]/10 text-[#10b981]" : isDarkMode ? "text-[#94a3b8] hover:text-white" : "text-[#475569] hover:text-[#0f172a]"
                      }`}
                    >
                      <Icon d={icons.list} size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {loading && (
                <div className="flex items-center justify-center py-24">
                  <div className="w-10 h-10 border-4 border-[#10b981] border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-600 rounded-2xl px-5 py-4 mb-6">
                  {error}
                </div>
              )}

              {!loading && (
                <>
                  <div className="grid grid-cols-2 gap-5">
                    {filtered.map((animal) => {
                      const badge = getBadge(animal);
                      return (
                        <div
                          key={animal._id}
                          onClick={() => handleAnimalClick(animal)}
                          className={`${isDarkMode ? 'bg-[#1e293b] border-[#334155] hover:border-[#10b981]/30' : 'bg-[#ffffff] border-[rgba(15,23,42,0.08)] hover:border-[#10b981]/30'} rounded-2xl overflow-hidden border hover:shadow-[0_10px_25px_rgba(15,23,42,0.08)] transition-all group cursor-pointer`}
                        >
                          <div className="relative h-48 bg-[#f8fafc]">
                            {animal.images?.length > 0 ? (
                              <img
                                src={animal.images[0]}
                                alt={animal.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Icon d={icons.beef} size={48} className="text-[#10b981]/20" />
                              </div>
                            )}

                            {badge && (
                              <div className="absolute top-3 left-3">
                                <Badge color={badge.color} size="sm">
                                  {badge.text}
                                </Badge>
                              </div>
                            )}

                            {animal.id && (
                              <div className="absolute top-3 right-3 bg-[#f8fafc]/80 backdrop-blur-sm text-[#475569] text-xs font-mono px-3 py-1.5 rounded-full border border-[rgba(15,23,42,0.08)]">
                                #{animal.id}
                              </div>
                            )}

                            {animal.price && (
                              <div className="absolute bottom-3 right-3 bg-[#10b981]/90 backdrop-blur-sm text-white text-sm font-bold px-4 py-2 rounded-xl">
                                FRW {animal.price.toLocaleString()}
                              </div>
                            )}

                            {animal.geneticLineage && (
                              <div className="absolute bottom-3 left-3 bg-[#f8fafc]/80 backdrop-blur-sm text-[#475569] text-xs px-3 py-1.5 rounded-full border border-[rgba(15,23,42,0.08)]">
                                🧬 {animal.geneticLineage}
                              </div>
                            )}
                          </div>

                          <div className="p-5">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-[#0f172a]'}`}>{animal.name}</h3>
                                <p className={`text-xs ${isDarkMode ? 'text-[#94a3b8]' : 'text-[#475569]'} mt-0.5`}>{animal.breed || "Unknown breed"}</p>
                              </div>
                              <div className="text-right">
                                <p className={`text-xs ${isDarkMode ? 'text-[#94a3b8]' : 'text-[#475569]'}`}>Market Price</p>
                                <p className="text-sm font-bold text-[#10b981]">
                                  FRW {animal.marketPrice?.toLocaleString() || "—"}
                                </p>
                              </div>
                            </div>

                            {animal.stableValue && (
                              <div className="mt-2 flex items-center gap-1.5 text-xs text-[#475569]">
                                <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
                                Stable Value: {animal.stableValue}
                              </div>
                            )}

                            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[rgba(15,23,42,0.08)]">
                              <div className="text-center">
                                <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-[#0f172a]'}`}>{animal.weight || "—"}kg</p>
                                <p className={`text-[10px] uppercase tracking-wider ${isDarkMode ? 'text-[#94a3b8]' : 'text-[#475569]'}`}>Weight</p>
                              </div>
                              <div className="text-center">
                                <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-[#0f172a]'}`}>{animal.age || "—"} mo</p>
                                <p className={`text-[10px] uppercase tracking-wider ${isDarkMode ? 'text-[#94a3b8]' : 'text-[#475569]'}`}>Age</p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm font-semibold text-[#10b981]">
                                  {animal.healthScore ? `${animal.healthScore}` : "—"}
                                </p>
                                <p className={`text-[10px] uppercase tracking-wider ${isDarkMode ? 'text-[#94a3b8]' : 'text-[#475569]'}`}>Score</p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-4">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openModal(animal, "booking");
                                }}
                                className="flex-1 min-w-[60px] flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium bg-[#10b981] text-white hover:bg-[#059669] transition-all"
                              >
                                <Icon d={icons.check} size={14} />
                                Book
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openModal(animal, "zoom");
                                }}
                                className="flex-1 min-w-[60px] flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium border border-[#10b981]/30 text-[#10b981] hover:bg-[#10b981]/10 transition-all"
                              >
                                <Icon d={icons.video} size={14} />
                                Zoom
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openModal(animal, "payment");
                                }}
                                className="flex-1 min-w-[60px] flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium border border-yellow-500/30 text-yellow-600 hover:bg-yellow-500/10 transition-all"
                              >
                                <Icon d={icons.creditCard} size={14} />
                                Pay
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openModal(animal, "chat");
                                }}
                                className="flex-1 min-w-[60px] flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium border border-blue-500/30 text-blue-600 hover:bg-blue-500/10 transition-all"
                              >
                                <Icon d={icons.message} size={14} />
                                Chat
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addToCart(animal);
                                }}
                                className="flex-1 min-w-[60px] flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium border border-[#10b981]/30 text-[#10b981] hover:bg-[#10b981]/10 transition-all"
                              >
                                <Icon d={icons.shoppingCart} size={14} />
                                Cart
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6">
                    <AssetChart />
                  </div>
                </>
              )}

              {!loading && filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-[#475569]">
                  <Icon d={icons.beef} size={48} className="mb-4 opacity-30" />
                  <p className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-[#0f172a]'}`}>No assets found</p>
                  <p className="text-sm mt-1">Try adjusting your search criteria</p>
                </div>
              )}

              <div className={`mt-6 border-2 border-dashed ${isDarkMode ? 'border-[#334155]' : 'border-[rgba(15,23,42,0.08)]'} rounded-2xl p-8 text-center hover:border-[#10b981]/30 transition-all`}>
                <div className="w-14 h-14 rounded-full bg-[#10b981]/10 flex items-center justify-center mx-auto mb-3">
                  <Icon d={icons.briefcase} size={24} className="text-[#10b981]" />
                </div>
                <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-[#0f172a]'}`}>List Your Asset</h4>
                <p className={`text-sm ${isDarkMode ? 'text-[#94a3b8]' : 'text-[#475569]'} mt-1`}>Reach institutional buyers and manage transactions</p>
                <button className="mt-4 px-6 py-2.5 bg-[#10b981] hover:bg-[#059669] text-white font-medium rounded-xl text-sm transition-all">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── SHOPPING CART OVERLAY ────────────────────────────────────────────── */}
      {showCart && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCart(false);
          }}
        >
          <div className="mx-4">
            <ShoppingCart cart={cart} onClose={() => setShowCart(false)} onRemove={removeFromCart} />
          </div>
        </div>
      )}

      {/* ─── ANIMAL DETAIL MODAL ───────────────────────────────────────────────── */}
      {showAnimalDetail && detailAnimal && (
        <AnimalDetailModal
          animal={detailAnimal}
          onClose={closeAnimalDetail}
          isDark={isDarkMode}
          addToCart={addToCart}
          openModal={openModal}
        />
      )}

      {/* ─── MODALS ────────────────────────────────────────────────────────────── */}
      {activeModal && (activeModal === "trustscore" || activeModal === "interest" || selectedAnimal) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="bg-[#ffffff] rounded-3xl w-full max-w-2xl mx-4 border border-[rgba(15,23,42,0.08)] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(15,23,42,0.08)] sticky top-0 bg-[#ffffff] z-10">
              <div>
                <p className="text-xs font-semibold text-[#10b981] uppercase tracking-widest mb-0.5">
                  {activeModal === "booking" && "Book Animal"}
                  {activeModal === "agreement" && "Digital Agreement"}
                  {activeModal === "calendar" && "Schedule Meeting"}
                  {activeModal === "chat" && "Chat with Seller"}
                  {activeModal === "zoom" && "Zoom Meeting"}
                  {activeModal === "payment" && "Payment"}
                  {activeModal === "veterinary" && "Veterinary Request"}
                  {activeModal === "delivery" && "Delivery Request"}
                  {activeModal === "interest" && "Interest Financing"}
                  {activeModal === "trustscore" && "Trust Score"}
                </p>
                <h3 className="text-lg font-bold text-[#0f172a]">{selectedAnimal?.name || userName}</h3>
              </div>
              <button
                onClick={closeModal}
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.95)] transition-all text-[#475569] hover:text-[#0f172a]"
              >
                <Icon d={icons.x} size={16} />
              </button>
            </div>

            <div className="px-6 py-6">
              {activeModal === "calendar" && (
                <MeetingCalendar animal={selectedAnimal} onSchedule={handleScheduleMeeting} />
              )}

              {activeModal === "chat" && (
                <ChatWidget
                  animal={selectedAnimal}
                  onClose={closeModal}
                  fetchMessages={handleFetchChatMessages}
                  sendChatMessage={handleSendChatMessage}
                />
              )}

              {activeModal === "zoom" && (
                <ZoomMeeting animal={selectedAnimal} onClose={closeModal} onScheduleZoom={handleScheduleZoomMeeting} />
              )}

              {activeModal === "payment" && (
                <PaymentModal animal={selectedAnimal} onClose={closeModal} onPay={handlePayAnimal} />
              )}

              {activeModal === "veterinary" && (
                <VeterinaryModal animal={selectedAnimal} onClose={closeModal} onSubmit={handleVeterinaryRequest} />
              )}

              {activeModal === "delivery" && (
                <DeliveryModal animal={selectedAnimal} onClose={closeModal} onSubmit={handleDeliveryRequest} />
              )}

              {activeModal === "interest" && (
                <InterestModal
                  animal={selectedAnimal}
                  interestRate={interestRate}
                  onClose={closeModal}
                  onSubmit={handleInterestRequest}
                />
              )}

              {activeModal === "trustscore" && (
                <TrustScoreModal onClose={closeModal} onVerify={handleVerifyTrustScore} />
              )}

              {activeModal === "booking" && (
                <>
                  <div className="bg-[#f8fafc] rounded-2xl p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#475569]">Type</span>
                      <span className="font-medium text-[#0f172a]">{selectedAnimal.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#475569]">Breed</span>
                      <span className="font-medium text-[#0f172a]">{selectedAnimal.breed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#475569]">Gender</span>
                      <span className="font-medium text-[#0f172a]">{selectedAnimal.gender}</span>
                    </div>
                    <div className="flex justify-between border-t border-[rgba(15,23,42,0.08)] pt-2 mt-2">
                      <span className="text-[#475569]">Price</span>
                      <span className="font-bold text-[#10b981]">{agreement?.currency || "RWF"} {Number(agreement?.price ?? selectedAnimal.price ?? 0).toLocaleString()}</span>
                    </div>
                  </div>
                  {bookingError && <p className="text-red-600 text-sm">{bookingError}</p>}
                  {bookingSuccess && (
                    <>
                      <p className="text-[#10b981] text-sm flex items-center gap-2">
                        <Icon d={icons.check} size={14} />
                        {bookingSuccess}
                      </p>
                      <button
                        onClick={() => openModal(selectedAnimal, "agreement")}
                        className="w-full border border-purple-500/30 text-purple-600 hover:bg-purple-500/10 font-semibold py-3 rounded-2xl transition-all text-sm"
                      >
                        Proceed to Sign Agreement →
                      </button>
                    </>
                  )}
                  {!bookingSuccess && (
                    <button
                      onClick={handleBookAnimal}
                      disabled={bookingLoading}
                      className="w-full bg-[#10b981] hover:bg-[#059669] disabled:opacity-50 text-white font-semibold py-3 rounded-2xl transition-all"
                    >
                      {bookingLoading ? "Booking…" : "Confirm Booking"}
                    </button>
                  )}
                </>
              )}

              {activeModal === "agreement" && (
                <>
                  {agreementFetching && <p className="text-[#475569] text-sm">Loading agreement…</p>}
                  <div className="bg-[#f8fafc] border border-[rgba(15,23,42,0.08)] rounded-2xl p-4 space-y-3 text-sm">
                    <p className="text-xs font-semibold text-[#10b981] uppercase tracking-wider">Agreement details</p>
                    <div className="flex justify-between gap-4">
                      <span className="text-[#475569]">Animal</span>
                      <span className="font-semibold text-[#0f172a] text-right">{selectedAnimal.name}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-[#475569]">Type / Breed</span>
                      <span className="font-medium text-[#0f172a] text-right">{selectedAnimal.type} / {selectedAnimal.breed || "Not specified"}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-[#475569]">Seller</span>
                      <span className="font-medium text-[#0f172a] text-right">{selectedAnimal.owner?.name || "Animal owner"}</span>
                    </div>
                    <div className="flex justify-between gap-4 border-t border-[rgba(15,23,42,0.08)] pt-3">
                      <span className="text-[#475569]">Purchase price</span>
                      <span className="font-bold text-[#10b981]">FRW {selectedAnimal.price?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-[#475569]">Payment method</span>
                      <span className="font-medium text-[#0f172a]">{agreement?.paymentMethod || "To be agreed"}</span>
                    </div>
                    <p className="text-xs text-[#475569] leading-relaxed border-t border-[rgba(15,23,42,0.08)] pt-3">
                      The seller agrees to sell this animal to the buyer. By signing below, you accept these purchase terms and confirm the information shown above.
                    </p>
                    {!agreementFetching && !agreementId && (
                      <p className="text-xs text-amber-600 border-t border-[rgba(15,23,42,0.08)] pt-3">
                        This agreement is waiting for admin creation. Refresh after the administrator publishes it.
                      </p>
                    )}
                  </div>
                  {agreementId && (
                    <div className="mt-4 flex gap-2">
                      <input
                        type="number"
                        min="0"
                        value={agreementPrice}
                        onChange={(e) => setAgreementPrice(e.target.value)}
                        className="min-w-0 flex-1 bg-[#f8fafc] border border-[rgba(15,23,42,0.08)] rounded-2xl px-4 py-3 text-sm text-[#0f172a] focus:outline-none focus:border-[#10b981]/50"
                        aria-label="Agreement price"
                      />
                      <button
                        onClick={handleUpdateAgreementPrice}
                        disabled={agreementLoading || Boolean(agreement?.signatures?.customer || agreement?.signatures?.farmer)}
                        className="px-4 rounded-2xl border border-[#10b981]/40 text-[#059669] font-semibold text-sm disabled:opacity-50"
                      >
                        Set price
                      </button>
                    </div>
                  )}
                  <div className="mt-4">
                    <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-2">
                      Digital Signature *
                    </label>
                    <input
                      type="text"
                      placeholder="Type your full legal name"
                      value={digitalSignature}
                      onChange={(e) => setDigitalSignature(e.target.value)}
                      className="w-full bg-[#f8fafc] border border-[rgba(15,23,42,0.08)] rounded-2xl px-4 py-3 text-sm text-[#0f172a] placeholder:text-[#475569] focus:outline-none focus:border-[#10b981]/50 transition-colors"
                    />
                  </div>
                  {agreementError && <p className="text-red-600 text-sm mt-2">{agreementError}</p>}
                  {agreementSuccess && (
                    <p className="text-[#10b981] text-sm flex items-center gap-2 mt-2">
                      <Icon d={icons.check} size={14} />
                      {agreementSuccess}
                    </p>
                  )}
                  {!agreementSuccess && (
                    <button
                      onClick={handleSignAgreement}
                      disabled={agreementLoading || agreementFetching || !agreementId}
                      className="w-full mt-4 bg-[#10b981] hover:bg-[#059669] disabled:opacity-50 text-white font-semibold py-3 rounded-2xl transition-all"
                    >
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