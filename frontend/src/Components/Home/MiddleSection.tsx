'use client';

import { useState, useEffect, useRef } from "react";
import {
  MdLocalShipping,
  MdPayment,
  MdDescription,
  MdHealthAndSafety,
  MdWork,
  MdChevronLeft,
  MdChevronRight,
  MdPause,
  MdPlayArrow,
  MdVolumeUp,
  MdVolumeOff,
  MdZoomOutMap,
} from "react-icons/md";
import { useTheme } from "../../Contexts/ThemeContext";

import delivery from "../../../public/images/delivery.mp4";
import payment from "../../../public/images/payment.mp4";
import agreement from "../../../public/images/agreement.mp4";
import vacine from "../../../public/images/vacine.mp4";
import jobs from "../../../public/images/job.mp4";
import Cards from "./Cards";
const getFeatures = () => [
  {
    id: "delivery",
    title: "Safe Delivery",
    subtitle: "Track your livestock in real-time from farm to destination",
    icon: MdLocalShipping,
    tag: "GPS Tracked",
    video: delivery,
    color: "#10b981",
    accent: "#34d399",
  },
  {
    id: "payment",
    title: "Smart Payment",
    subtitle: "Secure escrow payments released only on confirmed delivery",
    icon: MdPayment,
    tag: "Escrow Protected",
    video: payment,
    color: "#3b82f6",
    accent: "#60a5fa",
  },
  {
    id: "agreement",
    title: "Digital Agreement",
    subtitle: "Smart contracts between hotels, customers, sellers & farmers",
    icon: MdDescription,
    tag: "Legally Binding",
    video: agreement,
    button: "View Digital Agreement",
    color: "#8b5cf6",
    accent: "#a78bfa",
  },
  {
    id: "health",
    title: "Animal Health",
    subtitle: "Certified healthy animals treated by professional veterinarians",
    icon: MdHealthAndSafety,
    tag: "Vet Certified",
    video: vacine,
    button: "View Health Certificates",
    color: "#ef4444",
    accent: "#f87171",
  },
  {
    id: "jobs",
    title: "Veterinary Jobs",
    subtitle: "Connect agents and veterinarians with livestock businesses",
    icon: MdWork,
    tag: "Hire Experts",
    video: jobs,
    button: "Explore Jobs",
    color: "#f59e0b",
    accent: "#fbbf24",
  },
];

const MiddleSection = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [transitioning, setTransitioning] = useState(false);

  const intervalRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const features = getFeatures();
  const current = features[active];

  const textPrimary = isDark ? "#ffffff" : "#0f172a";
  const textSecondary = isDark ? "rgba(255,255,255,0.6)" : "#475569";
  const ctrlBg = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";
  const ctrlBorder = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)";
  const ctrlColor = isDark ? "#ffffff" : "#0f172a";
  const dotActive = isDark ? "#ffffff" : "#0f172a";
  const dotInactive = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.25)";
  const sectionBg = isDark ? "#0c0e12" : "#f1f5f9";

  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTransitioning(true);
      setTimeout(() => {
        setActive((prev) => (prev + 1) % features.length);
        setTransitioning(false);
      }, 300);
    }, 3500);
  };

  useEffect(() => {
    if (playing) startTimer();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = muted;
      playing ? videoRef.current.play().catch(() => {}) : videoRef.current.pause();
    }
  }, [playing, active, muted]);

  const go = (dir: number) => {
    setTransitioning(true);
    setTimeout(() => {
      setActive((prev) => (prev + dir + features.length) % features.length);
      setTransitioning(false);
    }, 300);
    if (playing) startTimer();
  };

  const handleZoom = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.requestFullscreen) video.requestFullscreen();
    else if ((video as any).webkitRequestFullscreen) (video as any).webkitRequestFullscreen();
  };

  const ctrlBtn = {
    border: `1.5px solid ${ctrlBorder}`,
    background: ctrlBg,
    color: ctrlColor,
  };

  return (
    <div className="w-full">
      <section
        ref={sectionRef}
        className="relative w-full overflow-hidden"
        style={{ height: "420px", background: sectionBg }}
      >
        {/* Full-bleed video */}
        <video
          ref={videoRef}
          key={active}
          src={current.video}
          autoPlay
          loop
          muted={muted}
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transition: "opacity 0.5s ease", opacity: transitioning ? 0 : 1 }}
        />

        {/* Left fade — hides adjacent card edge */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1/3"
          style={{
            background: isDark
              ? "linear-gradient(to right, rgba(10,12,20,1) 0%, rgba(10,12,20,0) 100%)"
              : "linear-gradient(to right, rgba(241,245,249,1) 0%, rgba(241,245,249,0) 100%)",
          }}
        />

        {/* Right scrim — behind text panel */}
        <div
          className="absolute right-0 top-0 bottom-0 w-2/5"
          style={{
            background: isDark
              ? "rgba(10,12,20,0.55)"
              : "rgba(241,245,249,0.72)",
            backdropFilter: "blur(2px)",
          }}
        />

        {/* Text content — RIGHT side */}
        <div
          className="absolute inset-0 flex flex-col justify-center items-end px-12"
          style={{
            transition: "opacity 0.3s ease, transform 0.3s ease",
            opacity: transitioning ? 0 : 1,
            transform: transitioning ? "translateY(8px)" : "translateY(0)",
          }}
        >
          <div className="max-w-xs text-right">
            <span
              className="text-xs font-semibold uppercase tracking-widest mb-4 block"
              style={{ color: current.color }}
            >
              {current.tag}
            </span>

            <h2
              className="text-2xl font-extrabold leading-tight mb-3"
              style={{ color: textPrimary }}
            >
              {current.title}
            </h2>

            <p
              className="text-sm leading-relaxed mb-6"
              style={{ color: textSecondary }}
            >
              {current.subtitle}
            </p>

            {current.button && (
              <button
                className="px-6 py-3 rounded-full text-sm font-semibold text-white transition-all hover:scale-105"
                style={{ background: current.color }}
              >
                {current.button}
              </button>
            )}
          </div>
        </div>

        {/* Dot indicators — bottom CENTER */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          {features.map((_, i) => (
            <button
              key={i}
              onClick={() => { setActive(i); if (playing) startTimer(); }}
              className="rounded-full transition-all"
              style={{
                width: i === active ? "20px" : "8px",
                height: "8px",
                background: i === active ? dotActive : dotInactive,
              }}
            />
          ))}
        </div>

        {/* Controls — bottom LEFT */}
        <div className="absolute bottom-5 left-8 flex items-center gap-2 z-10">
          <button
            onClick={() => go(-1)}
            className="w-9 h-9 rounded-full flex items-center justify-center transition hover:opacity-80"
            style={ctrlBtn}
          >
            <MdChevronLeft className="text-xl" />
          </button>

          <button
            onClick={() => setPlaying((p) => !p)}
            className="w-9 h-9 rounded-full flex items-center justify-center transition hover:opacity-80"
            style={ctrlBtn}
          >
            {playing ? <MdPause className="text-lg" /> : <MdPlayArrow className="text-lg" />}
          </button>

          <button
            onClick={() => go(1)}
            className="w-9 h-9 rounded-full flex items-center justify-center transition hover:opacity-80"
            style={ctrlBtn}
          >
            <MdChevronRight className="text-xl" />
          </button>

          <button
            onClick={() => setMuted((m) => !m)}
            className="w-9 h-9 rounded-full flex items-center justify-center transition hover:opacity-80"
            style={ctrlBtn}
            title={muted ? "Unmute" : "Mute"}
          >
            {muted ? <MdVolumeOff className="text-lg" /> : <MdVolumeUp className="text-lg" />}
          </button>

          <button
            onClick={handleZoom}
            className="w-9 h-9 rounded-full flex items-center justify-center transition hover:opacity-80"
            style={ctrlBtn}
            title="Fullscreen"
          >
            <MdZoomOutMap className="text-lg" />
          </button>
        </div>

      </section>
      <Cards/>
    </div>
  );
};

export default MiddleSection;