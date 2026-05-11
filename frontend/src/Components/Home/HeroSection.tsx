import React from 'react';

const HeroSection = () => {
  return (
    <section
      className="relative overflow-hidden min-h-[88vh]"
      style={{
        background:
          'linear-gradient(to bottom right,var(--hero-from),var(--hero-via),var(--hero-to))',
      }}
    >
      {/* Glow */}
      <div
        className="absolute pointer-events-none w-[500px] h-[500px] rounded-full blur-[30px]"
        style={{
          top: '10%',
          left: '28%',
          background:
            'radial-gradient(circle, rgba(52,211,153,0.14) 0%, rgba(16,185,129,0.07) 45%, transparent 70%)',
        }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 container mx-auto px-8 flex items-center min-h-[88vh]">
        <div className="flex flex-col lg:flex-row items-center w-full gap-8">

          {/* Left */}
          <div className="flex-1 max-w-2xl pt-12">

            {/* Heading */}
            <h1 className="font-bold leading-[1.05] tracking-[-0.03em] text-[var(--text)] text-[clamp(2.8rem,5vw,4.4rem)] mb-6">

              The Trusted Digital{' '}

              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    'var(--gradient-primary)',
                }}
              >
                Livestock
              </span>{' '}

               for{' '}

              <span className="typewriter-wrapper">

                <span
                  className="typewriter-word marketable"
                >
                  Marketable
                </span>

                <span
                  className="typewriter-word health"
                >
                  Animal Health Safe
                </span>

                <span
                  className="typewriter-word delivery"
                >
                  Delivery Safe
                </span>

                <span
                  className="typewriter-word jobs"
                >
                  Veterinary Jobs
                </span>

                <span
                  className="typewriter-word trading"
                >
                  Easy Trading
                </span>

              </span>
            </h1>

            {/* Description */}
            <p className="text-[1.05rem] leading-relaxed text-[var(--text-secondary)] max-w-[620px] mb-10">
              Buy, sell, and manage livestock securely
              with verified animal profiles, smart
              bookings, veterinary support, safe
              delivery systems, digital agreements,
              secure payments, and real-time
              transaction tracking for farmers,
              breeders, and livestock businesses.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mb-10">

              {[
                {
                  value: '12K+',
                  label: 'Verified Animals',
                },
                {
                  value: '3.4K',
                  label: 'Active Breeders',
                },
                {
                  value: '98%',
                  label: 'Satisfaction Rate',
                },
              ].map(({ value, label }) => (
                <div key={label}>

                  <div className="text-4xl font-bold text-[var(--text)]">
                    {value}
                  </div>

                  <div className="text-xs text-[var(--text-secondary)] mt-1 tracking-widest uppercase">
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4">

              {/* Primary */}
              <button
                className="text-white font-bold px-8 py-4 rounded-2xl hover:-translate-y-1 transition-all duration-300"
                style={{
                  background:
                    'var(--gradient-primary)',
                  boxShadow:
                    '0 0 24px rgba(16,185,129,0.3)',
                }}
              >
                Explore Animals
              </button>

              {/* Secondary */}
              <button
                className="font-semibold px-8 py-4 rounded-2xl backdrop-blur-md hover:scale-[1.02] transition-all duration-300"
                style={{
                  background: 'var(--glass)',
                  border:
                    '1px solid var(--border)',
                  color: 'var(--text)',
                }}
              >
                Start Selling
              </button>
            </div>
          </div>

          {/* Right */}
          <div className="flex-1 flex items-center justify-center relative min-h-[480px]">

            {/* Glass card */}
            <div
              className="absolute inset-6 rounded-3xl backdrop-blur-sm"
              style={{
                background: 'var(--glass)',
                border:
                  '1px solid var(--border)',
              }}
            />

            {/* Glow */}
            <div className="relative w-[420px] h-[420px] rounded-full flex items-center justify-center">

              <div
                className="absolute inset-0 rounded-full blur-3xl"
                style={{
                  background:
                    'radial-gradient(circle,var(--accent),transparent)',
                  opacity: 0.15,
                }}
              />

              {/* Main Orb */}
              <div
                className="w-[280px] h-[280px] rounded-full animate-pulse"
                style={{
                  background:
                    'var(--gradient-primary)',
                  boxShadow:
                    '0 0 80px rgba(16,185,129,0.25)',
                }}
              />

              {/* Floating Cards */}
              <div
                className="absolute top-8 left-0 px-4 py-3 rounded-2xl backdrop-blur-md"
                style={{
                  background: 'var(--glass)',
                  border:
                    '1px solid var(--border)',
                }}
              >
                <div className="text-sm font-bold text-[var(--text)]">
                  Safe Delivery
                </div>

                <div className="text-xs text-[var(--text-secondary)] mt-1">
                  Real-time livestock tracking
                </div>
              </div>

              <div
                className="absolute bottom-8 right-0 px-4 py-3 rounded-2xl backdrop-blur-md"
                style={{
                  background: 'var(--glass)',
                  border:
                    '1px solid var(--border)',
                }}
              >
                <div className="text-sm font-bold text-[var(--text)]">
                  Veterinary Jobs
                </div>

                <div className="text-xs text-[var(--text-secondary)] mt-1">
                  Connect with professionals
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Typewriter Animation */}
      
    </section>
  );
};

export default HeroSection;