'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../Contexts/ThemeContext';

// Import images correctly
import appScreenshot from "../../../public/images/app.png";
import phoneScreenshot from "../../../public/images/phone.png";
import advertisScreenshot from "../../../public/images/advertis.png";

/* ════════════════════════════════════════════
   QR CODE
   ════════════════════════════════════════════ */
const QRCode = ({ dark = '#0f172a', light = '#ffffff' }: { dark?: string; light?: string }) => {
  const grid = [
    [1,1,1,1,1,1,1,0,1,0,1,0,0,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,1,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,1,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,0,0,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0,0,0],
    [1,1,0,1,1,0,1,1,0,1,1,0,1,1,1,0,1,0,1,1,0],
    [0,1,1,0,0,1,0,1,1,0,0,1,0,1,0,1,1,0,0,1,1],
    [1,0,1,1,0,0,1,0,1,1,0,0,1,0,1,1,0,1,1,0,0],
    [0,1,0,0,1,1,0,0,0,1,1,0,0,1,0,0,1,1,0,1,0],
    [1,1,1,0,1,0,1,1,1,0,1,1,0,0,1,0,0,1,1,0,1],
    [0,0,0,0,0,0,0,0,1,0,1,0,1,0,0,1,0,1,0,0,1],
    [1,1,1,1,1,1,1,0,0,1,0,0,1,1,1,0,1,0,0,1,0],
    [1,0,0,0,0,0,1,0,1,1,1,0,0,0,1,1,0,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,0,1,1,0,1,0,0,1,0,0,1,1],
    [1,0,1,1,1,0,1,0,1,0,0,1,1,0,1,1,1,1,0,0,0],
    [1,0,1,1,1,0,1,0,0,1,1,0,0,1,0,0,0,1,1,1,0],
    [1,0,0,0,0,0,1,0,1,1,0,1,0,0,1,0,1,0,0,1,1],
    [1,1,1,1,1,1,1,0,0,0,1,0,1,1,0,1,0,1,1,0,0],
  ];
  const S = 10;
  const PAD = 8;
  const SIZE = 21 * S + PAD * 2;
  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} xmlns="http://www.w3.org/2000/svg" width={SIZE} height={SIZE}>
      <rect width={SIZE} height={SIZE} fill={light} rx="6" />
      {grid.map((row, r) =>
        row.map((val, c) =>
          val === 1 ? (
            <rect
              key={`${r}-${c}`}
              x={PAD + c * S}
              y={PAD + r * S}
              width={S}
              height={S}
              fill={dark}
              rx="1"
            />
          ) : null
        )
      )}
    </svg>
  );
};

/* Google Play Badge */
const GooglePlayBadge = () => (
  <a
    href="#"
    className="flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-200 hover:scale-[1.03] active:scale-95 select-none"
    style={{ background: '#000000', borderColor: 'rgba(255,255,255,0.18)', minWidth: '180px' }}
  >
    <svg width="28" height="28" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <path d="M48 28.8 284.4 256 48 483.2V28.8Z" fill="#00D4AA"/>
      <path d="M48 28.8 284.4 256l-78.2 78.2L48 28.8Z" fill="#00A3FF"/>
      <path d="M48 483.2 206.2 177.8 284.4 256 48 483.2Z" fill="#FFBC00"/>
      <path d="M284.4 256 464 355.6 206.2 334.2 284.4 256Z" fill="#FF3D00"/>
    </svg>
    <div className="text-left leading-tight">
      <div className="text-[10px] tracking-wide" style={{ color: 'rgba(255,255,255,0.7)' }}>GET IT ON</div>
      <div className="text-[17px] font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>Google Play</div>
    </div>
  </a>
);

/* App Store Badge */
const AppStoreBadge = () => (
  <a
    href="#"
    className="flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-200 hover:scale-[1.03] active:scale-95 select-none"
    style={{ background: '#000000', borderColor: 'rgba(255,255,255,0.18)', minWidth: '180px' }}
  >
    <svg width="26" height="28" viewBox="0 0 814 1000" xmlns="http://www.w3.org/2000/svg">
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.1 134.7-316.9 267.6-316.9 100.9 0 184.1 67.7 244.8 67.7 57.6 0 148.3-71.7 261-71.7zm-84.7-212.9c-49.6 58.8-132.3 104.4-213.3 99.8-12.2-82.3 28.6-168.2 76.2-221.8C615.1 50.5 705 0 787.2 0c10.6 82.3-24.3 163.3-83.8 228z" fill="#ffffff"/>
    </svg>
    <div className="text-left leading-tight">
      <div className="text-[10px] tracking-wide" style={{ color: 'rgba(255,255,255,0.7)' }}>Download on the</div>
      <div className="text-[17px] font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>App Store</div>
    </div>
  </a>
);

/* Phone Image Component */
const PhoneImage = ({ src, rotate = 0, zIndex = 0 }: { src: string; rotate?: number; zIndex?: number }) => (
  <div
    className="relative flex-shrink-0"
    style={{ transform: `rotate(${rotate}deg)`, zIndex, width: '170px' }}
  >
    <div
      className="relative rounded-[3rem] overflow-hidden border-[8px] border-gray-900 shadow-2xl"
      style={{ background: '#000' }}
    >
      <img
        src={src}
        alt="App Screenshot"
        className="w-full h-auto object-contain"
      />
    </div>
  </div>
);

/* StatChip */
const StatChip = ({ icon, value, label }: { icon: string; value: string; label: string }) => (
  <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border" style={{ background: 'var(--glass)', borderColor: 'var(--border)', backdropFilter: 'blur(8px)' }}>
    <span className="text-xl">{icon}</span>
    <div>
      <div className="text-sm font-extrabold leading-none" style={{ fontFamily: 'Sora, sans-serif', color: 'var(--primary)' }}>{value}</div>
      <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{label}</div>
    </div>
  </div>
);

/* Main Component */
const AppDownloadSection: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const qrDark = isDark ? '#0f172a' : '#0f172a';
  const qrLight = '#ffffff';

  return (
    <section ref={ref} id="download" className="relative w-full overflow-hidden py-20 px-4 sm:px-8">
      <div
        className={`relative w-full mx-auto rounded-3xl border transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        style={{
          background: isDark ? '#16191f' : '#ffffff',
          borderColor: 'var(--border)',
          boxShadow: 'var(--shadow)',
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-8 sm:p-12 lg:p-16 items-center">

          {/* LEFT SIDE */}
          <div className="space-y-7">
            <div>
              <h2 className="text-3xl sm:text-4xl xl:text-[2.6rem] font-extrabold leading-[1.15] mb-3" style={{ fontFamily: 'Sora, sans-serif', color: 'var(--text)' }}>
                Rwanda's #1<br />
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'var(--gradient-primary)' }}>
                  Farm Marketplace
                </span>
                <br />in your pocket
              </h2>
              <p className="text-sm leading-relaxed max-w-md" style={{ color: 'var(--text-secondary)' }}>
                Buy &amp; sell livestock, fresh produce, and agri-supplies directly from your phone.
                Built for Rwandan farmers — works on 2G too.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <StatChip icon="🧑‍🌾" value="50K+" label="Farmers" />
              <StatChip icon="⭐" value="4.8" label="App Rating" />
              <StatChip icon="📦" value="120K+" label="Orders" />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <GooglePlayBadge />
              <AppStoreBadge />
            </div>

            <div className="flex items-center gap-5 p-4 rounded-2xl border" style={{ background: 'var(--glass)', borderColor: 'var(--border)' }}>
              <div className="flex-shrink-0 rounded-xl overflow-hidden p-1.5" style={{ background: '#ffffff', width: '88px', height: '88px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                <QRCode dark={qrDark} light={qrLight} />
              </div>
              <div>
                <p className="text-sm font-bold mb-1" style={{ color: 'var(--text)', fontFamily: 'Sora, sans-serif' }}>Scan to download</p>
                <p className="text-xs leading-snug" style={{ color: 'var(--text-secondary)' }}>
                  Point your phone camera at the QR code to open the store listing instantly.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Phone Screenshots */}
          <div className="relative flex justify-center items-end gap-6" style={{ height: '480px' }}>
            <PhoneImage src={appScreenshot} rotate={-10} zIndex={1} />
            <PhoneImage src={phoneScreenshot} rotate={3} zIndex={2} />
            <PhoneImage src={advertisScreenshot} rotate={-5} zIndex={1} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownloadSection;