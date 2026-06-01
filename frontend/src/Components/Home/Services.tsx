import { useState, useEffect, useRef } from "react";

const services = [
  {
    id: 1,
    title: "Digital Solutions",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididid. Leverage agile frameworks.",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-12 h-12" stroke="#3b82f6" strokeWidth="1.5">
        <circle cx="32" cy="32" r="20" strokeDasharray="4 3" />
        <circle cx="32" cy="32" r="28" strokeDasharray="2 4" opacity="0.4" />
        <path d="M22 32 Q32 20 42 32 Q32 44 22 32Z" />
        <circle cx="32" cy="32" r="3" fill="#3b82f6" />
        <path d="M32 12v4M32 48v4M12 32h4M48 32h4" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Software Masters",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididid. Leverage agile frameworks.",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-12 h-12" stroke="white" strokeWidth="1.5">
        <circle cx="32" cy="32" r="20" strokeDasharray="4 3" />
        <rect x="18" y="20" width="28" height="20" rx="2" />
        <path d="M24 40v4h16v-4" />
        <path d="M24 28l4 4-4 4M36 36h4" />
      </svg>
    ),
    active: true,
  },
  {
    id: 3,
    title: "Execution Business",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididid. Leverage agile frameworks.",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-12 h-12" stroke="#3b82f6" strokeWidth="1.5">
        <circle cx="32" cy="32" r="20" strokeDasharray="4 3" />
        <circle cx="32" cy="32" r="10" />
        <path d="M32 22v4M32 38v4M22 32h4M38 32h4" />
        <path d="M26 26l2 2M36 36l2 2M26 38l2-2M36 28l2-2" />
      </svg>
    ),
  },
  {
    id: 4,
    title: "Information Security",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididid. Leverage agile frameworks.",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-12 h-12" stroke="#3b82f6" strokeWidth="1.5">
        <circle cx="32" cy="32" r="20" strokeDasharray="4 3" />
        <circle cx="32" cy="32" r="28" strokeDasharray="2 4" opacity="0.3" />
        <path d="M32 18 L44 23 L44 33 Q44 42 32 47 Q20 42 20 33 L20 23 Z" />
        <circle cx="32" cy="31" r="4" />
        <path d="M32 35v4" strokeWidth="2" />
      </svg>
    ),
  },
];

const stats = [
  { value: "260k", label: "COMPLETED PROJECTS" },
  { value: "50+", label: "NEW TECHNOLOGIES" },
  { value: "90%", label: "HAPPY CUSTOMERS" },
  { value: "25+", label: "YEARS OF EXPERIENCE" },
];

const socialIcons = [
  { label: "Bē", color: "#3b82f6", angle: 90 },
  { label: "f", color: "#3b82f6", angle: 45, svgPath: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" },
  { label: "🅐", color: "#3b82f6", angle: 0 },
  { label: "✈", color: "#3b82f6", angle: 315 },
  { label: "S", color: "#7c3aed", angle: 270 },
  { label: "in", color: "#3b82f6", angle: 225 },
  { label: "📌", color: "#ef4444", angle: 180 },
  { label: "📷", color: "#e11d48", angle: 135 },
];

export default function Services() {
  const [activeCard, setActiveCard] = useState(1);
  const [counts, setCounts] = useState({ "260k": 0, "50+": 0, "90%": 0, "25+": 0 });
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!statsVisible) return;
    const targets = [260, 50, 90, 25];
    const suffixes = ["k", "+", "%", "+"];
    const keys = ["260k", "50+", "90%", "25+"];
    const duration = 1800;
    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const next: Record<string, number> = {};
      targets.forEach((t, i) => { next[keys[i]] = Math.floor(t * ease); });
      setCounts(next as any);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [statsVisible]);

  const formatCount = (key: string, val: number) => {
    if (key === "260k") return `${val}k`;
    if (key === "50+") return `${val}+`;
    if (key === "90%") return `${val}%`;
    if (key === "25+") return `${val}+`;
    return val;
  };

  return (
    <div
      style={{
        background: "linear-gradient(160deg, #060810 0%, #0a0d14 40%, #06080f 100%)",
        fontFamily: "'Sora', 'Inter', sans-serif",
        minHeight: "100vh",
      }}
    >
      {/* ── Section 1: Services ── */}
      <section className="relative overflow-hidden px-6 py-20">
        {/* grid bg lines */}
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(59,130,246,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.15) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* diagonal circuit lines */}
        <svg className="pointer-events-none absolute inset-0 w-full h-full opacity-10" preserveAspectRatio="none">
          <line x1="0" y1="40%" x2="30%" y2="0" stroke="#3b82f6" strokeWidth="0.5" />
          <line x1="0" y1="60%" x2="20%" y2="100%" stroke="#3b82f6" strokeWidth="0.5" />
          <line x1="70%" y1="0" x2="100%" y2="30%" stroke="#3b82f6" strokeWidth="0.5" />
          <line x1="80%" y1="100%" x2="100%" y2="70%" stroke="#3b82f6" strokeWidth="0.5" />
          <circle cx="30%" cy="0" r="3" fill="none" stroke="#3b82f6" />
          <circle cx="70%" cy="0" r="3" fill="none" stroke="#3b82f6" />
        </svg>

        <div className="relative mx-auto max-w-7xl">
          {/* Header row */}
          <div className="flex items-start justify-between mb-12">
            <div>
              <p className="text-xs font-semibold tracking-[0.25em] text-blue-500 mb-3 uppercase">
                We Provide Exclusive Service
              </p>
              <h2 className="text-4xl font-bold text-white leading-tight">
                We Provide The <span className="text-blue-500">Best</span>{" "}
                <span className="text-blue-500">Services</span>
              </h2>
            </div>
            {/* Nav arrows */}
            <div className="flex gap-3 mt-2">
              {[
                <path key="l" d="M19 12H5M12 5l-7 7 7 7" />,
                <path key="r" d="M5 12h14M12 5l7 7-7 7" />,
              ].map((p, i) => (
                <button
                  key={i}
                  className="w-11 h-11 rounded-full border border-blue-500/50 flex items-center justify-center text-white hover:bg-blue-500/20 transition-all duration-200"
                  style={{ background: "rgba(59,130,246,0.08)" }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    {p}
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-4 gap-5">
            {services.map((svc) => {
              const isActive = activeCard === svc.id;
              return (
                <div
                  key={svc.id}
                  onClick={() => setActiveCard(svc.id)}
                  className="relative cursor-pointer rounded-xl p-7 flex flex-col gap-5 transition-all duration-300"
                  style={{
                    background: isActive ? "rgba(17,30,60,0.95)" : "rgba(10,16,32,0.85)",
                    border: isActive
                      ? "1.5px dashed #3b82f6"
                      : "1px solid rgba(59,130,246,0.12)",
                    boxShadow: isActive
                      ? "0 0 30px rgba(59,130,246,0.12), inset 0 0 20px rgba(59,130,246,0.04)"
                      : "none",
                    transform: isActive ? "translateY(-4px)" : "none",
                  }}
                >
                  {/* icon circle */}
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
                    style={{
                      border: "1.5px dashed rgba(59,130,246,0.5)",
                      background: "rgba(59,130,246,0.06)",
                    }}
                  >
                    {svc.icon}
                  </div>

                  {/* title */}
                  <h3
                    className="text-center font-bold text-lg"
                    style={{ color: isActive ? "#3b82f6" : "#e2e8f0" }}
                  >
                    {svc.title}
                  </h3>

                  {/* description */}
                  <p
                    className="text-center text-sm leading-relaxed"
                    style={{ color: "rgba(148,163,184,0.85)" }}
                  >
                    {svc.description}
                  </p>

                  {/* arrow */}
                  <div className="flex justify-center mt-auto">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
                      style={{
                        background: isActive ? "rgba(59,130,246,0.15)" : "transparent",
                        border: "1px solid rgba(59,130,246,0.3)",
                      }}
                    >
                      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div ref={statsRef} className="mt-16 grid grid-cols-4 gap-0">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="flex flex-col items-center gap-2 py-6 relative"
              >
                {i < stats.length - 1 && (
                  <span
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500"
                    style={{ boxShadow: "0 0 6px #3b82f6" }}
                  />
                )}
                <span
                  className="text-5xl font-black"
                  style={{
                    color: "#3b82f6",
                    fontFamily: "'Sora', sans-serif",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {statsVisible ? formatCount(s.value, (counts as any)[s.value]) : "0"}
                </span>
                <span
                  className="text-xs font-semibold tracking-widest uppercase"
                  style={{ color: "rgba(148,163,184,0.8)" }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 2: Support ── */}
      <section className="relative overflow-hidden">
        {/* dark overlay background image placeholder */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, rgba(5,8,20,0.94) 0%, rgba(8,12,28,0.88) 50%, rgba(5,8,20,0.92) 100%)",
          }}
        />
        {/* Subtle people silhouette effect */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(20,30,70,0.8) 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 py-20 flex items-center gap-16">
          {/* Left content */}
          <div className="flex-1 max-w-lg">
            <p className="text-xs font-semibold tracking-[0.25em] text-blue-500 uppercase mb-4">
              All Channel Support Available
            </p>
            <h2 className="text-4xl font-bold text-white leading-tight mb-5">
              24/7 All Time{" "}
              <span className="text-blue-500">Support Any</span>
              <br />
              <span className="text-blue-500">Channel</span> With On Platform
            </h2>
            <p className="text-sm leading-7 mb-8" style={{ color: "rgba(148,163,184,0.85)" }}>
              Our Help Desk is staffed with experienced professionals who are committed to
              providing you with the solutions you need, as quickly and efficiently as
              possible, whether you're dealing with.
            </p>
            <button
              className="px-8 py-4 font-bold text-sm tracking-widest uppercase text-white transition-all duration-200 hover:brightness-110 active:scale-95"
              style={{
                background: "#3b82f6",
                letterSpacing: "0.12em",
              }}
            >
              Connect With Support
            </button>
          </div>

          {/* Right: Orbit diagram */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-80 h-80">
              {/* Outer orbit ring */}
              <div
                className="absolute inset-0 rounded-full"
                style={{ border: "1px solid rgba(255,255,255,0.2)" }}
              />
              {/* Center hub */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full flex items-center justify-center"
                style={{
                  background: "white",
                  boxShadow: "0 0 30px rgba(59,130,246,0.3)",
                }}
              >
                <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
                  <rect x="4" y="4" width="14" height="14" rx="1" stroke="#1e3a8a" strokeWidth="2" />
                  <rect x="22" y="4" width="14" height="14" rx="1" stroke="#1e3a8a" strokeWidth="2" />
                  <rect x="4" y="22" width="14" height="14" rx="1" stroke="#1e3a8a" strokeWidth="2" />
                  <rect x="22" y="22" width="14" height="14" rx="1" stroke="#1e3a8a" strokeWidth="2" />
                </svg>
              </div>

              {/* Orbit icons */}
              {[
                { label: "Bē", bg: "#3b82f6", angle: 90, textColor: "white" },
                { label: "f", bg: "#3b82f6", angle: 45, textColor: "white" },
                { label: "A", bg: "#1d4ed8", angle: 0, textColor: "white" },
                { label: "✈", bg: "#0ea5e9", angle: 315, textColor: "white" },
                { label: "S", bg: "#7c3aed", angle: 270, textColor: "white" },
                { label: "in", bg: "#3b82f6", angle: 225, textColor: "white" },
                { label: "P", bg: "#ef4444", angle: 180, textColor: "white" },
                { label: "◎", bg: "#e11d48", angle: 135, textColor: "white" },
              ].map(({ label, bg, angle, textColor }) => {
                const r = 130;
                const rad = ((angle - 90) * Math.PI) / 180;
                const x = 160 + r * Math.cos(rad);
                const y = 160 + r * Math.sin(rad);
                return (
                  <div
                    key={label + angle}
                    className="absolute w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shadow-lg"
                    style={{
                      left: x - 24,
                      top: y - 24,
                      background: bg,
                      color: textColor,
                      border: "2.5px solid rgba(255,255,255,0.9)",
                      boxShadow: `0 0 12px ${bg}55`,
                    }}
                  >
                    {label}
                  </div>
                );
              })}

              {/* Connector dots on ring */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
                const rad = ((deg - 90) * Math.PI) / 180;
                const r2 = 152;
                const x = 160 + r2 * Math.cos(rad);
                const y = 160 + r2 * Math.sin(rad);
                return (
                  <div
                    key={`dot-${deg}`}
                    className="absolute w-1.5 h-1.5 rounded-full bg-white/60"
                    style={{ left: x - 3, top: y - 3 }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
      `}</style>
    </div>
  );
}