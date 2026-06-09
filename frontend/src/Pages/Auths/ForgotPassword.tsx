import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa6";
import { useAuth } from "../../Contexts/AuthContext";

const inputClass =
  "w-full px-6 py-[18px] pl-12 rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#16191f] text-gray-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-[15px] focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-500 transition-all duration-200";

function InputWithIcon({ icon: Icon, ...props }: any) {
  return (
    <div className="relative">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 z-10">
        <Icon size={18} />
      </div>
      <input {...props} className={inputClass} />
    </div>
  );
}

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await forgotPassword(email);
      setMessage(response.message || "Check your email for the reset link and OTP.");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to request password reset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f6f8] dark:bg-[#0c0e12] px-4 py-10">
      <div className="w-full max-w-md bg-white dark:bg-[#111827] rounded-[32px] shadow-2xl p-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white mb-3">Forgot Password</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Enter the email address for your account and we’ll send you a reset link with OTP.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <InputWithIcon
            icon={FaEnvelope}
            name="email"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-2xl">
              {error}
            </p>
          )}

          {message && (
            <p className="text-emerald-600 text-sm text-center bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-2xl">
              {message}
            </p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-4 rounded-3xl bg-[#0f172a] hover:bg-black text-white font-bold text-[15px] tracking-wider shadow-xl shadow-black/30 hover:brightness-105 transition-all disabled:opacity-70"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </motion.button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          <Link to="/login" className="inline-flex items-center gap-2 text-orange-500 font-semibold hover:underline">
            <FaArrowLeft size={14} /> Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
