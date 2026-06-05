import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Truck,
  PackageX,
  BadgeCheck,
  FileSignature,
  MapPin,
} from "lucide-react";
import Subscribe  from "../../Components/Home/Subscribe"

const faqs = [
  {
    icon: <ShieldCheck size={18} />,
    question: "How does payment and escrow work?",
    answer:
      "Payments are held in escrow until delivery is confirmed. Once both parties agree, funds are released to the seller securely through our protected gateway.",
  },
  {
    icon: <BadgeCheck size={18} />,
    question: "Are the animals vaccinated and verified?",
    answer:
      "All listed animals go through a verification process. Sellers must provide vaccination records and health certificates before their listings go live.",
  },
  {
    icon: <PackageX size={18} />,
    question: "What happens if the animal is not delivered?",
    answer:
      "If delivery fails, the escrow amount is fully refunded to the buyer. You can also raise a dispute through our support team within 7 days.",
  },
  {
    icon: <BadgeCheck size={18} />,
    question: "How can I become a verified seller?",
    answer:
      "Submit your ID, farm registration, and livestock documentation. Our team reviews your application within 2–3 business days.",
  },
  {
    icon: <FileSignature size={18} />,
    question: "How can I request an agreement?",
    answer:
      'Go to the listing page and click "Request Agreement". Fill in the terms — the seller will review and either accept or negotiate conditions before both parties sign digitally.',
  },
  {
    icon: <Truck size={18} />,
    question: "How do I request delivering?",
    answer:
      'After completing payment, navigate to your order and select "Request Delivery". Enter your address and preferred delivery window. A logistics partner will be assigned and you\'ll receive real-time tracking updates.',
  },
  {
    icon: <MapPin size={18} />,
    question: "Do you deliver to my location?",
    answer:
      "We currently serve all major regions. Enter your address during checkout to confirm availability and estimated delivery times for your area.",
  },
];

const FAQItem = ({
  icon,
  question,
  answer,
  index,
}: {
  icon: React.ReactNode;
  question: string;
  answer: string;
  index: number;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`border border-[var(--border)] rounded-xl overflow-hidden transition-all duration-200 ${
        open
          ? "bg-[var(--primary)]/5 border-[var(--primary)]/40"
          : "bg-[var(--surface)] hover:border-[var(--primary)]/30 hover:bg-[var(--primary)]/5"
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors"
      >
        {/* Index badge */}
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-[11px] font-bold flex items-center justify-center">
          {index + 1}
        </span>

        {/* Icon */}
        <span className="flex-shrink-0 text-[var(--primary)]">{icon}</span>

        {/* Question */}
        <span className="flex-1 text-sm font-semibold text-[var(--text)]">
          {question}
        </span>

        {/* Chevron */}
        <ChevronDown
          size={16}
          className={`flex-shrink-0 text-[var(--primary)] transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-40" : "max-h-0"
        }`}
      >
        <div className="px-4 pb-4 pt-1 text-sm text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border)] ml-0">
          <div className="pl-[52px]">{answer}</div>
        </div>
      </div>
    </div>
  );
};

const Questions = () => {
  const navigate = useNavigate();

  return (
    <div>
    <section className="w-full bg-[var(--bg)] px-6 py-10">
      <div className="flex gap-5 w-full">
        {/* FAQ Section */}
        <div className="flex-1 bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border)] shadow-sm min-w-0">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-lg font-bold text-[var(--text)]">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Everything you need to know about Animarket
              </p>
            </div>
            <a
              href="#"
              className="text-[var(--primary)] text-sm font-semibold hover:underline whitespace-nowrap"
            >
              View all FAQs →
            </a>
          </div>

          <div className="flex flex-col gap-2">
            {faqs.map((faq, i) => (
              <FAQItem
                key={i}
                index={i}
                icon={faq.icon}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </div>

        {/* CTA Card */}
        <div className="w-64 flex-shrink-0 bg-[var(--primary)] rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
          {/* Decorative circle */}
          <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/5" />
          <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-white/5" />

          <div className="relative z-10">
            <span className="inline-block bg-white/20 text-white text-[11px] font-bold px-3 py-1 rounded-full mb-3 tracking-wide uppercase">
              🌿 Animarket
            </span>
            <h3 className="text-white text-xl font-extrabold leading-snug mb-3">
              Ready to Start Your Livestock Journey?
            </h3>
            <p className="text-white/80 text-xs leading-relaxed">
              Join thousands of farmers, breeders and professionals growing with
              Animarket across Africa.
            </p>
          </div>

          {/* Stats row */}
          <div className="relative z-10 flex gap-3 my-5">
            <div className="flex-1 bg-white/10 rounded-xl p-3 text-center">
              <p className="text-white font-extrabold text-base">12K+</p>
              <p className="text-white/70 text-[10px] mt-0.5">Farmers</p>
            </div>
            <div className="flex-1 bg-white/10 rounded-xl p-3 text-center">
              <p className="text-white font-extrabold text-base">50K+</p>
              <p className="text-white/70 text-[10px] mt-0.5">Animals</p>
            </div>
          </div>

          <div className="relative z-10 flex flex-col gap-2">
            <button
              onClick={() => navigate("/animals")}
              className="w-full bg-white text-[var(--primary)] text-sm font-bold py-2.5 rounded-xl hover:bg-gray-100 transition-colors"
            >
              Explore Animals
            </button>
            <button
              onClick={() => navigate("/register")}
              className="w-full bg-white/15 text-white text-sm font-semibold py-2.5 rounded-xl border border-white/20 hover:bg-white/25 transition-colors"
            >
              Start Selling
            </button>
          </div>
        </div>
      </div>
    </section>
    <Subscribe/>
    </div>
  );
};

export default Questions;