import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaKey, FaArrowLeft } from "react-icons/fa6";
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

export default function ResetPassword() {
  const { verifyResetOTP, confirmResetPassword } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";

  const [email, setEmail] = useState("");
  const [resetOTP, setResetOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await verifyResetOTP(email, resetOTP);
      setOtpVerified(true);
      setMessage("OTP verified. You can now reset your password.");
    } catch (err: any) {
      setOtpVerified(false);
      setError(err.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await confirmResetPassword(token, newPassword, confirmPassword);
      setMessage("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Password reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f6f8] dark:bg-[#0c0e12] px-4 py-10">
      <div className="w-full max-w-md bg-white dark:bg-[#111827] rounded-[32px] shadow-2xl p-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white mb-3">Reset Password</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Enter the email and OTP sent to you, then choose a new password.
          </p>
        </div>

        {!token ? (
          <div className="space-y-5">
            <p className="text-sm text-orange-600 dark:text-orange-400">
              No reset token found in the link. Please request a new password reset from the forgot password page.
            </p>
            <Link to="/forgot-password" className="text-orange-500 font-semibold hover:underline">
              Request new reset link
            </Link>
          </div>
        ) : (
          <>
            <form className="space-y-5" onSubmit={handleVerifyOtp}>
              <InputWithIcon
                icon={FaEnvelope}
                name="email"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <InputWithIcon
                icon={FaKey}
                name="resetOTP"
                type="text"
                placeholder="OTP Code"
                value={resetOTP}
                onChange={(e) => setResetOTP(e.target.value)}
                required
              />
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-4 rounded-3xl bg-[#0f172a] hover:bg-black text-white font-bold text-[15px] tracking-wider shadow-xl shadow-black/30 hover:brightness-105 transition-all disabled:opacity-70"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </motion.button>
            </form>

            {otpVerified && (
              <form className="space-y-5 mt-6" onSubmit={handleResetPassword}>
                <InputWithIcon
                  icon={FaLock}
                  name="newPassword"
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <InputWithIcon
                  icon={FaLock}
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-4 rounded-3xl bg-[#0f172a] hover:bg-black text-white font-bold text-[15px] tracking-wider shadow-xl shadow-black/30 hover:brightness-105 transition-all disabled:opacity-70"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </motion.button>
              </form>
            )}
          </>
        )}

        {error && (
          <p className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-2xl mt-6">
            {error}
          </p>
        )}

        {message && (
          <p className="text-emerald-600 text-sm text-center bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-2xl mt-6">
            {message}
          </p>
        )}

        <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          <Link to="/login" className="inline-flex items-center gap-2 text-orange-500 font-semibold hover:underline">
            <FaArrowLeft size={14} /> Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
