'use client';

import React from 'react';
import { useTheme } from '../../Contexts/ThemeContext';
import {
  FiArrowRight
} from 'react-icons/fi';

import ancount from "../../../public/images/ancount.png";
import { FaSearch } from "react-icons/fa";
import { FiLink } from "react-icons/fi";

import securePayment from "../../../public/images/securePayemnt.png";
import deliverycow from "../../../public/images/delivercow.png";
import { LuPackageCheck } from "react-icons/lu";
import AnimalDemo from '../../Components/Home/AnimalDemo';

interface Step {
  icon: React.ElementType | string;
  isImage?: boolean;
  title: string;
  description: string;
  bg: string;
  color: string;
}

const steps: Step[] = [
  {
    icon: ancount,
    isImage: true,
    title: 'Create Account',
    description: 'Sign up as a buyer, seller or vet.',
    bg: 'bg-cyan-50 dark:bg-cyan-900/20',
    color: 'text-cyan-600',
  },
  {
    icon: FaSearch,
    title: 'Browse & Choose',
    description: 'Find verified animals that fit your needs.',
    bg: 'bg-green-50 dark:bg-green-900/20',
    color: 'text-green-600',
  },
  {
    icon: FiLink,
    title: 'Book & Negotiate',
    description: 'Connect with seller and agree on terms.',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    color: 'text-purple-600',
  },
  {
    icon: securePayment,
    isImage: true,
    title: 'Secure Payment',
    description: 'Pay safely with our escrow protection.',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    color: 'text-orange-600',
  },
  {
    icon: deliverycow,
    isImage: true,
    title: 'Delivery Tracking',
    description: 'Track your animal in real-time.',
    bg: 'bg-red-50 dark:bg-red-900/20',
    color: 'text-red-600',
  },
  {
    icon: LuPackageCheck,
    title: 'Confirm Delivery',
    description: 'Confirm and rate your experience.',
    bg: 'bg-green-50 dark:bg-green-900/20',
    color: 'text-green-600',
  },
];

const HowItWorks = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div>
    <section
      className={`py-4 md:py-8 transition-colors duration-300 ${
        isDark ? 'bg-gray-900' : 'bg-white'
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-6">

        <div
          className={`rounded-3xl border p-6 md:p-8 transition-all duration-300 ${
            isDark
              ? 'bg-gray-400 border-gray-700'
              : 'bg-gray-50 border-green-200'
          }`}
        >
          {/* Title */}
          <div className="flex items-center justify-center mb-8 md:mb-10">
            <div
              className={`flex-1 h-px ${
                isDark ? 'bg-green-700 h-4' : 'bg-green-200 h-4'
              }`}
            />

            <h2
              className={`px-4 md:px-6 text-lg md:text-2xl font-bold whitespace-nowrap ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              How Animarket Works
            </h2>

            <div
              className={`flex-1 h-px ${
                isDark ? 'bg-green-700' : 'bg-green-200'
              }`}
            />
          </div>

          {/* Steps */}
          <div className="grid grid-cols-2 md:grid-cols-11 gap-4 items-start">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <React.Fragment key={index}>
                  {/* Step */}
                  <div className="md:col-span-1 text-center">
                    <div
                      className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center `}
                    >
                      {step.isImage ? (
                        <img
                          src={Icon as string}
                          alt={step.title}
                          className="w-10 h-10 object-contain"
                        />
                      ) : (
                        <Icon className={`text-2xl ${step.color}`} />
                      )}
                    </div>

                    <h3
                      className={`mt-4 font-semibold text-sm ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {index + 1}. {step.title}
                    </h3>

                    <p
                      className={`mt-2 text-xs leading-relaxed ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  {index !== steps.length - 1 && (
                    <div className="hidden md:flex items-center justify-center md:col-span-1 pt-6">
                      <FiArrowRight
                        className={`text-xl ${
                          isDark ? 'text-gray-500' : 'text-gray-400'
                        }`}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

        </div>
      </div>
    </section>
    <AnimalDemo />
    </div>
  );
};

export default HowItWorks;