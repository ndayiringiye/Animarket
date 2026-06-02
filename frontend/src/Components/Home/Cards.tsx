'use client';

import { useState } from 'react';

import inka from '../../../public/images/inka.jpg';
import Goat from '../../../public/images/Gaot.jpg';
import Hens from '../../../public/images/Hens.jpg';
import Pigs from '../../../public/images/pigs.jpg';

import { IoIosHeartEmpty, IoIosHeart } from 'react-icons/io';
import {
  MdLocationOn,
  MdVerified,
  MdShoppingCart,
  MdStar,
  MdClose,
  MdPhone,
  MdEmail,
  MdLocalShipping,
  MdHealthAndSafety,
  MdCheck,
} from 'react-icons/md';

import { useTheme } from '../../Contexts/ThemeContext';
import { useCart } from '../../Contexts/CartContext';
import PaymentGetWay from '../../Components/Home/PaymentGetWay';
import { RiSlideshow3Fill } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import HowItWorks from '../../Components/Home/HowItWorks';

const products = [
  {
    id: 1,
    name: 'Premium Cow',
    price: 240,
    image: inka,
    location: 'Kigali, Rwanda',
    mapQuery: 'Kigali, Rwanda',
    rate: 4.5,
    description:
      'Healthy premium cow with verified veterinary certificates and fast delivery support.',
    isAvailable: true,
    isVerified: true,
    weight: '450kg',
    age: '3 years',
    breed: 'Ankole',
    seller: 'Jean Baptiste',
    phone: '+250 788 123 456',
    email: 'jean@animiture.rw',
    deliveryDays: 2,
    vaccinatedFor: ['FMD', 'Brucellosis', 'Anthrax'],
  },
  {
    id: 2,
    name: 'Mountain Goat',
    price: 120,
    image: Goat,
    location: 'Musanze, Rwanda',
    mapQuery: 'Musanze, Rwanda',
    rate: 4.0,
    description:
      'Strong and healthy goat suitable for farming and livestock investment.',
    isAvailable: true,
    isVerified: true,
    weight: '45kg',
    age: '2 years',
    breed: 'Alpine',
    seller: 'Marie Claire',
    phone: '+250 722 654 321',
    email: 'marie@animiture.rw',
    deliveryDays: 3,
    vaccinatedFor: ['PPR', 'FMD'],
  },
  {
    id: 3,
    name: 'Healthy Sheep',
    price: 100,
    image: Hens,
    location: 'Huye, Rwanda',
    mapQuery: 'Huye, Rwanda',
    rate: 4.8,
    description:
      'Verified healthy sheep with vaccination and transport support.',
    isAvailable: false,
    isVerified: true,
    weight: '38kg',
    age: '1.5 years',
    breed: 'Dorper',
    seller: 'Emmanuel K.',
    phone: '+250 733 789 000',
    email: 'emmanuel@animiture.rw',
    deliveryDays: 4,
    vaccinatedFor: ['PPR', 'Anthrax', 'Pasteurella'],
  },
  {
    id: 4,
    name: 'Organic Hen',
    price: 50,
    image: Pigs,
    location: 'Rubavu, Rwanda',
    mapQuery: 'Rubavu, Rwanda',
    rate: 3.9,
    description:
      'Organic farm hen raised naturally with quality nutrition.',
    isAvailable: true,
    isVerified: false,
    weight: '2.5kg',
    age: '8 months',
    breed: 'Rhode Island',
    seller: 'Alice Uwase',
    phone: '+250 788 000 111',
    email: 'alice@animiture.rw',
    deliveryDays: 1,
    vaccinatedFor: ['Newcastle', 'Gumboro'],
  },
];

type Product = (typeof products)[0];

const Cards = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const { liked, toggleLike, addToCart } = useCart();

  const [selected, setSelected] = useState<Product | null>(null);
  const [addedId, setAddedId] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleAddToCart = (
    e: React.MouseEvent<HTMLButtonElement>,
    product: Product
  ) => {
    e.stopPropagation();

    addToCart(product);

    setAddedId(product.id);

    setTimeout(() => {
      setAddedId(null);
    }, 1200);
  };

  const card = isDark
    ? 'bg-[#16191f] border border-white/10 hover:border-emerald-500/40'
    : 'bg-white border border-slate-100 hover:border-emerald-200 hover:shadow-sm';

  const muted = isDark
    ? 'text-slate-400'
    : 'text-slate-500';

  const surface = isDark
    ? 'bg-white/[0.03]'
    : 'bg-slate-50';

  const modalBg = isDark
    ? 'bg-[#16191f] text-white'
    : 'bg-white text-slate-900';

  const divider = isDark
    ? 'border-white/10'
    : 'border-slate-100';

  return (
    <div>
    <div
      className={`min-h-screen px-6 py-12 transition-all duration-500 ${
        isDark
          ? 'bg-[#0c0e12] text-white'
          : 'bg-[#f8fafc] text-slate-900'
      }`}
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
        <div>
          <p className="text-md uppercase tracking-[0.3em] text-emerald-500 font-bold mb-3">
            Trusted Marketplace
          </p>

          <h1 className="text-2xl lg:text-3xl font-black leading-tight">
            Easy Selling,
            <span className="block bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">
              Buying & Livestock Jobs
            </span>
          </h1>

          <p
            className={`mt-4 max-w-xl text-base leading-7 ${muted}`}
          >
            Discover verified livestock, secure transactions,
            professional veterinary services, and trusted sellers
            across Rwanda.
          </p>
        </div>

        <button 
          className="h-14 px-8 rounded-2xl  flex justify-center items-center gap-2 bg-emerald-500 text-white font-bold shadow-md hover:scale-105 transition-all duration-300"
          onClick={() => navigate('/how-it-works')}
        >
          <span className="">
            <RiSlideshow3Fill  className="text-md" />
          </span> 
          How It Works
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {products.map((p) => {
          return (
            <div
              key={p.id}
              onClick={() => setSelected(p)}
              className={`group rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-sm ${card}`}
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {p.isVerified && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 bg-emerald-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow">
                    <MdVerified className="text-sm" />
                    VERIFIED
                  </div>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(p.id);
                  }}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white shadow flex items-center justify-center text-lg hover:scale-110 transition-all"
                >
                  {liked[p.id] ? (
                    <IoIosHeart className="text-red-500" />
                  ) : (
                    <IoIosHeartEmpty className="text-slate-400" />
                  )}
                </button>
              </div>

              <div className="p-4">
                <h2 className="text-base font-bold mb-1">
                  {p.name}
                </h2>

                <div
                  className={`flex items-center gap-1 text-sm mb-3 ${muted}`}
                >
                  <MdLocationOn className="text-emerald-500 flex-shrink-0" />

                  <span className="truncate">{p.location}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-emerald-600 font-extrabold text-base">
                    ${p.price}
                    <span
                      className={`text-xs font-normal ml-1 ${muted}`}
                    >
                      / head
                    </span>
                  </span>

                  <div className="flex items-center gap-1 text-sm">
                    <MdStar className="text-yellow-400" />

                    <span className="font-semibold">
                      {p.rate}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className={`w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl ${modalBg} max-h-[92vh] overflow-y-auto`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Hero */}
            <div className="relative h-64">
              <img
                src={selected.image}
                alt={selected.name}
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur text-white flex items-center justify-center hover:bg-red-500 transition-all"
              >
                <MdClose className="text-xl" />
              </button>

              {selected.isVerified && (
                <div className="absolute top-4 left-4 flex items-center gap-1 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  <MdVerified />
                  VERIFIED
                </div>
              )}

              <div className="absolute bottom-5 left-6">
                <h2 className="text-3xl font-black text-white">
                  {selected.name}
                </h2>

                <div className="flex items-center gap-1 text-white/80 text-sm mt-1">
                  <MdLocationOn />
                  {selected.location}
                </div>
              </div>

              <div className="absolute bottom-5 right-6 text-right">
                <div className="text-3xl font-black text-white">
                  ${selected.price}
                </div>

                <div className="text-white/70 text-sm">
                  per head
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 grid lg:grid-cols-2 gap-6">
              {/* Left */}
              <div className="space-y-5">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      label: 'Weight',
                      value: selected.weight,
                    },
                    {
                      label: 'Age',
                      value: selected.age,
                    },
                    {
                      label: 'Breed',
                      value: selected.breed,
                    },
                  ].map((s) => {
                    return (
                      <div
                        key={s.label}
                        className={`rounded-xl p-3 text-center ${surface}`}
                      >
                        <p className={`text-xs mb-1 ${muted}`}>
                          {s.label}
                        </p>

                        <p className="font-bold text-sm">
                          {s.value}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Status */}
                <div className="grid grid-cols-2 gap-3">
                  <div className={`rounded-xl p-4 ${surface}`}>
                    <p className={`text-xs mb-1 ${muted}`}>
                      Rating
                    </p>

                    <p className="text-xl font-black text-yellow-500">
                      ⭐ {selected.rate}
                    </p>
                  </div>

                  <div className={`rounded-xl p-4 ${surface}`}>
                    <p className={`text-xs mb-1 ${muted}`}>
                      Status
                    </p>

                    <p
                      className={`text-xl font-black ${
                        selected.isAvailable
                          ? 'text-emerald-500'
                          : 'text-red-500'
                      }`}
                    >
                      {selected.isAvailable
                        ? 'Available'
                        : 'Sold Out'}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-bold mb-2 text-sm uppercase tracking-wide text-emerald-500">
                    About
                  </h3>

                  <p
                    className={`text-sm leading-7 ${muted}`}
                  >
                    {selected.description}
                  </p>
                </div>

                {/* Vaccinations */}
                <div>
                  <h3 className="font-bold mb-3 text-sm uppercase tracking-wide text-emerald-500 flex items-center gap-2">
                    <MdHealthAndSafety />
                    Vaccinations
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {selected.vaccinatedFor.map((v) => {
                      return (
                        <span
                          key={v}
                          className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold"
                        >
                          <MdCheck className="text-sm" />
                          {v}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Pricing */}
                <div
                  className={`rounded-xl p-4 border ${divider} ${surface}`}
                >
                  <h3 className="font-bold mb-3 text-sm">
                    Pricing Breakdown
                  </h3>

                  <div className="space-y-2 text-sm">
                    {[
                      {
                        label: 'Livestock Price',
                        val: `$${selected.price}`,
                      },
                      {
                        label: 'Delivery Fee',
                        val: '$50',
                      },
                      {
                        label: 'Trust & Escrow Fee',
                        val: '$25',
                      },
                    ].map((r) => {
                      return (
                        <div
                          key={r.label}
                          className="flex justify-between"
                        >
                          <span className={muted}>
                            {r.label}
                          </span>

                          <span className="font-bold">
                            {r.val}
                          </span>
                        </div>
                      );
                    })}

                    <div
                      className={`flex justify-between pt-2 border-t ${divider} font-black text-emerald-500`}
                    >
                      <span>Total</span>

                      <span>${selected.price + 75}</span>
                    </div>
                  </div>
                </div>

                {/* Seller */}
                <div className={`rounded-xl p-4 ${surface}`}>
                  <h3 className="font-bold mb-3 text-sm uppercase tracking-wide text-emerald-500">
                    Seller Info
                  </h3>

                  <p className="font-bold mb-2">
                    {selected.seller}
                  </p>

                  <div
                    className={`flex items-center gap-2 text-sm mb-1 ${muted}`}
                  >
                    <MdPhone />
                    {selected.phone}
                  </div>

                  <div
                    className={`flex items-center gap-2 text-sm ${muted}`}
                  >
                    <MdEmail />
                    {selected.email}
                  </div>
                </div>

                {/* Delivery */}
                <div className="rounded-xl p-4 flex items-center gap-3 bg-emerald-500/10">
                  <MdLocalShipping className="text-emerald-500 text-2xl flex-shrink-0" />

                  <div>
                    <p className="font-bold text-emerald-500 text-sm">
                      Fast Delivery
                    </p>

                    <p className={`text-xs ${muted}`}>
                      Estimated {selected.deliveryDays}{' '}
                      business day
                      {selected.deliveryDays > 1
                        ? 's'
                        : ''}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    className={`flex-1 h-12 rounded-xl font-bold text-sm transition-all ${
                      selected.isAvailable
                        ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:scale-[1.02]'
                        : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    }`}
                    disabled={!selected.isAvailable}
                  >
                    {selected.isAvailable
                      ? 'Apply for Purchase'
                      : 'Unavailable'}
                  </button>

                  <button
                    className={`h-12 px-4 rounded-xl border font-bold text-sm transition-all ${
                      isDark
                        ? 'border-white/10 hover:bg-white/5'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Schedule
                  </button>

                  <button
                    onClick={(e) =>
                      handleAddToCart(e, selected)
                    }
                    className={`h-12 w-12 rounded-xl border flex items-center justify-center transition-all flex-shrink-0 ${
                      addedId === selected.id
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-emerald-500/30 text-emerald-500 hover:bg-emerald-500 hover:text-white'
                    }`}
                  >
                    {addedId === selected.id ? (
                      <MdCheck className="text-xl" />
                    ) : (
                      <MdShoppingCart />
                    )}
                  </button>
                </div>
              </div>

              {/* Right */}
              <div className="flex flex-col gap-4">
                <h3 className="font-bold text-sm uppercase tracking-wide text-emerald-500 flex items-center gap-2">
                  <MdLocationOn />
                  Location
                </h3>

                <div className="rounded-2xl overflow-hidden flex-1 min-h-[400px] border border-emerald-500/20">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{
                      minHeight: '400px',
                      border: 0,
                    }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(
                      selected.mapQuery
                    )}&output=embed`}
                  />
                </div>

                <a
                  href={`https://www.google.com/maps/search/${encodeURIComponent(
                    selected.mapQuery
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center text-sm text-emerald-500 font-semibold hover:underline"
                >
                  Open in Google Maps →
                </a>

                <div
                  className={`rounded-xl p-4 ${
                    isDark
                      ? 'bg-emerald-500/10'
                      : 'bg-emerald-50'
                  }`}
                >
                  <h3 className="font-bold text-emerald-500 mb-1 text-sm">
                    AniMarket Guarantee
                  </h3>

                  <p
                    className={`text-xs leading-6 ${muted}`}
                  >
                    Every verified livestock purchase is
                    protected against fraud and includes trusted
                    delivery verification.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    <HowItWorks />
    <PaymentGetWay />
    </div>
  );
};

export default Cards;