'use client';

import React from 'react';
import { useTheme } from '../../Contexts/ThemeContext'; // adjust path
import { CheckCircle, XCircle, Truck, Shield, Stethoscope, MapPin, Users, Activity, Quote } from 'lucide-react';

const AnimalDemo = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Theme-aware colors
  const bgColor = isDark ? 'bg-gray-900' : 'bg-white';
  const headingColor = isDark ? 'text-white' : 'text-gray-900';
  const subheadingColor = isDark ? 'text-gray-400' : 'text-gray-500';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const cardBorder = isDark ? 'border-gray-700' : 'border-gray-200';
  const tableHeaderBg = isDark ? 'bg-gray-800' : 'bg-gray-50';
  const tableBorder = isDark ? 'border-gray-700' : 'border-gray-200';
  const textPrimary = isDark ? 'text-gray-200' : 'text-gray-800';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const testimonialBg = isDark ? 'bg-gray-800/50' : 'bg-gray-50';
  const statBg = isDark ? 'bg-gray-800' : 'bg-white';

  // Comparison data
  const comparisons = [
    { traditional: 'No delivery tracking', animarket: 'Real-time tracking', animarketGood: true },
    { traditional: 'Fraud risk', animarket: 'Escrow protection', animarketGood: true },
    { traditional: 'Unknown animal health', animarket: 'Verified veterinary records', animarketGood: true },
    { traditional: 'Limited reach', animarket: 'Nationwide marketplace', animarketGood: true },
    { traditional: 'No transparency', animarket: 'Transparent transactions', animarketGood: true },
    { traditional: 'Cash only', animarket: 'Secure digital payments', animarketGood: true },
  ];

  return (
    <section className={`py-16 md:py-24 transition-colors duration-300 ${bgColor}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        {/* Why Choose Animarket? */}
        <div className="mb-20">
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-12 ${headingColor}`}>
            Why Choose Animarket?
          </h2>
          
          <div className={`overflow-x-auto rounded-xl border ${cardBorder}`}>
            <table className="w-full text-left">
              <thead className={`${tableHeaderBg} border-b ${tableBorder}`}>
                <tr>
                  <th className={`px-6 py-4 text-lg font-semibold ${headingColor} w-1/2`}>
                    Traditional Market
                  </th>
                  <th className={`px-6 py-4 text-lg font-semibold ${headingColor} w-1/2`}>
                    Animarket
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((item, idx) => (
                  <tr key={idx} className={`border-b ${tableBorder} last:border-b-0`}>
                    <td className={`px-6 py-4 ${textSecondary}`}>
                      <div className="flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <span>{item.traditional}</span>
                      </div>
                    </td>
                    <td className={`px-6 py-4 ${textPrimary}`}>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="font-medium">{item.animarket}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* What Our Users Say */}
        <div className="mb-20">
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-12 ${headingColor}`}>
            What Our Users Say
          </h2>
          
          <div className={`max-w-3xl mx-auto rounded-2xl p-8 ${testimonialBg} border ${cardBorder}`}>
            <Quote className={`w-10 h-10 mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`text-xl md:text-2xl italic mb-6 leading-relaxed ${textPrimary}`}>
              “Animarket helped me sell 20 goats securely within 3 days. The payment was safe and delivery was on time.”
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                JC
              </div>
              <div>
                <p className={`font-semibold ${headingColor}`}>Jean Claude</p>
                <p className={`text-sm ${textSecondary}`}>Breeder, Musanze</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trusted by Thousands Across Rwanda */}
        <div>
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-12 ${headingColor}`}>
            Trusted by Thousands Across Rwanda
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stat 1 */}
            <div className={`rounded-xl p-8 text-center border ${cardBorder} ${statBg}`}>
              <MapPin className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <div className={`text-4xl md:text-5xl font-bold mb-2 ${headingColor}`}>30+</div>
              <div className={`text-lg ${textSecondary}`}>Districts Covered</div>
            </div>
            
            {/* Stat 2 */}
            <div className={`rounded-xl p-8 text-center border ${cardBorder} ${statBg}`}>
              <Stethoscope className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <div className={`text-4xl md:text-5xl font-bold mb-2 ${headingColor}`}>200+</div>
              <div className={`text-lg ${textSecondary}`}>Veterinary Partners</div>
            </div>
            
            {/* Stat 3 */}
            <div className={`rounded-xl p-8 text-center border ${cardBorder} ${statBg}`}>
              <Users className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <div className={`text-4xl md:text-5xl font-bold mb-2 ${headingColor}`}>1,500+</div>
              <div className={`text-lg ${textSecondary}`}>Active Daily Users</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnimalDemo;