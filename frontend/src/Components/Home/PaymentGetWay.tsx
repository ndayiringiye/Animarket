'use client';

import { useTheme } from "../../Contexts/ThemeContext";

const PaymentGetWay = () => {
  const { theme } = useTheme();

  const paymentLogos = [
    { 
      name: "IER", 
      src: "/images/engineering.png", 
      alt: "Institute of Engineering Rwanda" 
    },
    { 
      name: "MTN", 
      src: "/images/mtn.png", 
      alt: "MTN" 
    },
    { 
      name: "Airtel", 
      src: "/images/airtel.png", 
      alt: "Airtel" 
    },
    { 
      name: "BK", 
      src: "/images/bk.png", 
      alt: "BK Group" 
    },
    { 
      name: "Equity", 
      src: "/images/equity.png", 
      alt: "Equity Bank" 
    },
    { 
      name: "VISA", 
      src: "/images/visa.png", 
      alt: "Visa" 
    },
    { 
      name: "I&M Bank", 
      src: "/images/i&m.png", 
      alt: "I&M Bank" 
    },
  ];

  return (
    <div className={`w-full py-12 transition-colors duration-300
      ${theme === 'dark' ? 'bg-gray-950' : 'bg-white'}`}
    >
      {/* Title */}
      <div className="text-center mb-10">
        <h2 className={`text-3xl md:text-4xl font-bold transition-colors
          ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
        >
          Regulated &amp; Secure Payment Methods
        </h2>
        <p className={`mt-3 text-lg transition-colors
          ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
        >
          Trusted partners for safe and seamless transactions
        </p>
      </div>

      {/* Infinite Scrolling Marquee */}
      <div className="relative overflow-hidden py-6">
        <div className="flex animate-marquee whitespace-nowrap gap-16 items-center">
          {paymentLogos.map((logo, index) => (
            <div
              key={index}
              className="flex-shrink-0 transition-transform duration-300 hover:scale-110"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-12 md:h-16 w-auto object-contain"
              />
            </div>
          ))}

          {/* Duplicate for seamless infinite loop */}
          {paymentLogos.map((logo, index) => (
            <div
              key={`duplicate-${index}`}
              className="flex-shrink-0 transition-transform duration-300 hover:scale-110"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-12 md:h-16 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Gradient edges - adapted to theme */}
      <div className={`absolute left-0 top-0 h-full w-20 pointer-events-none transition-all
        ${theme === 'dark' 
          ? 'bg-gradient-to-r from-gray-950 to-transparent' 
          : 'bg-gradient-to-r from-white to-transparent'}`} 
      />
      <div className={`absolute right-0 top-0 h-full w-20 pointer-events-none transition-all
        ${theme === 'dark' 
          ? 'bg-gradient-to-l from-gray-950 to-transparent' 
          : 'bg-gradient-to-l from-white to-transparent'}`} 
      />
    </div>
  );
};

export default PaymentGetWay;