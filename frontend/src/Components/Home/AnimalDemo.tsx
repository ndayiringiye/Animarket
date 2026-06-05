'use client';

import React, { useState } from 'react';
import { useTheme } from '../../Contexts/ThemeContext';

import avatar1 from "../../../public/images/avatar1.png"
import avatar2 from "../../../public/images/avatar2.png"
import avatar3 from "../../../public/images/avatar3.png"
import avatar4 from "../../../public/images/avatar4.png"
import avatar5 from "../../../public/images/avatar5.png"

import rwandaMap from "../../../public/images/rwanda-map.png";

import {
  Check,
  Star,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  UserCheck,
} from 'lucide-react';

const AnimalDemo = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Jean Claude',
      title: 'Breeder, Musanze',
      quote:
        'Animamarket helped me sell 20 goats securely within 3 days. The payment was safe and delivery was on time.',
      avatar: avatar1,
      rating: 5,
    },
    {
      id: 2,
      name: 'Marie Immaculee',
      title: 'Farmer, Gasabo',
      quote:
        'I found the best veterinary partner for my cattle. The platform is transparent and easy to use.',
      avatar: avatar2,
      rating: 5,
    },
    {
      id: 3,
      name: 'Patrick Nzeyimana',
      title: 'Livestock Dealer, Rwamagana',
      quote:
        'Animamarket revolutionized how I do business. Secure payments and verified partners make all the difference.',
      avatar: avatar3,
      rating: 5,
    },
    {
      id: 4,
      name: 'Josephine Keza',
      title: 'Veterinarian, Kigali',
      quote:
        'As a vet partner, I appreciate the verified records system. It builds trust with my clients.',
      avatar: avatar4,
      rating: 5,
    },
    {
      id: 5,
      name: 'David Mugisha',
      title: 'Farmer, Muhanga',
      quote:
        'The real-time tracking gave me peace of mind during my first sale. Highly recommended!',
      avatar: avatar5,
      rating: 5,
    },
  ];

  const features = [
    {
      traditional: 'No delivery tracking',
      animamarket: 'Real-time tracking',
    },
    {
      traditional: 'Fraud risk',
      animamarket: 'Escrow protection',
    },
    {
      traditional: 'Unknown animal health',
      animamarket: 'Verified veterinary records',
    },
    {
      traditional: 'Limited reach',
      animamarket: 'Nationwide marketplace',
    },
    {
      traditional: 'No transparency',
      animamarket: 'Transparent transactions',
    },
    {
      traditional: 'Cash only',
      animamarket: 'Secure digital payments',
    },
  ];

  const stats = [
    {
      icon: MapPin,
      number: '30+',
      label: 'Districts Covered',
    },
    {
      icon: Users,
      number: '200+',
      label: 'Veterinary Partners',
    },
    {
      icon: UserCheck,
      number: '1,500+',
      label: 'Active Daily Users',
    },
  ];

  const avatars = [
    { id: 1, src: avatar1, left: '25%', top: '30%' },
    { id: 2, src: avatar2, left: '55%', top: '20%' },
    { id: 3, src: avatar3, left: '75%', top: '35%' },
    { id: 4, src: avatar4, left: '45%', top: '55%' },
    { id: 5, src: avatar5, left: '65%', top: '70%' },
  ];

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section className={`py-12 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Why Choose Animamarket */}
          <div className={`rounded-2xl p-8 shadow-sm border ${
            isDark
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-100'
          }`}>
            <h3 className="text-xl font-bold text-gray-900 mb-8">
              Why Choose Animamarket?
            </h3>

            <div className="grid grid-cols-2 gap-6 mb-6 pb-4 border-b border-gray-200">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Traditional Market
              </p>
              <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">
                Animamarket
              </p>
            </div>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">
                      {feature.traditional}
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-green-600">
                      {feature.animamarket}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className={`rounded-2xl p-8 shadow-sm border ${
            isDark
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-100'
          }`}>
            <h3 className="text-xl font-bold text-gray-900 mb-8">
              What Our Users Say
            </h3>

            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                }}
              >
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="w-full flex-shrink-0">
                    <div className="space-y-4">
                      <div className="flex gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>

                      <p className="text-base text-gray-700 italic min-h-[120px]">
                        "{testimonial.quote}"
                      </p>

                      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="rounded-full w-12 h-12 object-cover"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {testimonial.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {testimonial.title}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center mt-6">
              <button onClick={goToPrevious} className="p-2 hover:bg-gray-100 rounded-lg">
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full ${
                      currentIndex === index ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <button onClick={goToNext} className="p-2 hover:bg-gray-100 rounded-lg">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Rwanda Stats (THEME FIXED) */}
          <div className={`rounded-2xl p-8 shadow-sm border ${
            isDark
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-100'
          }`}>
            <h3 className="text-xl font-bold text-gray-900 mb-8">
              Trusted by Thousands Across Rwanda
            </h3>

            <div className="space-y-6">

              {/* Rwanda Map Background */}
              <div className="relative h-56 rounded-xl overflow-hidden border border-gray-200">
                <img
                  src={rwandaMap}
                  alt="Rwanda Map"
                  className={`absolute inset-0 w-full h-full object-cover ${
                    isDark ? 'opacity-20' : 'opacity-30'
                  }`}
                />

                {/* dark overlay for theme balance */}
                {isDark && (
                  <div className="absolute inset-0 bg-black/30" />
                )}

                {avatars.map((avatar) => (
                  <div
                    key={avatar.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: avatar.left,
                      top: avatar.top,
                    }}
                  >
                    <img
                      src={avatar.src}
                      alt="User avatar"
                      className="rounded-full border-2 border-white shadow-md w-12 h-12 object-cover"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;

                  return (
                    <div key={index} className="flex flex-col items-center text-center">
                      <Icon className="w-6 h-6 text-green-600 mb-2" />
                      <p className="font-bold text-green-600 text-base">
                        {stat.number}
                      </p>
                      <p className="text-xs text-gray-600">{stat.label}</p>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AnimalDemo;