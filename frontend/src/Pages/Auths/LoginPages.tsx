import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFacebookF,
  FaGoogle,
  FaInstagram,
  FaLinkedinIn,
  FaUser,
  FaEnvelope,
  FaLock,
} from "react-icons/fa6";
import { useTheme } from "../../Contexts/ThemeContext";

const inputClass =
  "w-full px-6 py-[18px] pl-12 rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#16191f] text-gray-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-[15px] focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-500 transition-all duration-200";

function InputWithIcon({ icon: Icon, ...props }: any) {
  return (
    <div className="relative">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
        <Icon size={18} />
      </div>
      <input {...props} className={inputClass} />
    </div>
  );
}

function LoginForm() {
  return (
    <form className="w-full max-w-[380px] space-y-5" onSubmit={(e) => e.preventDefault()}>
      <InputWithIcon icon={FaEnvelope} type="email" placeholder="Email Address" required />
      <InputWithIcon icon={FaLock} type="password" placeholder="Password" required />

      <div className="flex items-center justify-between text-sm px-2">
        <label className="flex items-center gap-2 text-slate-500 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500" />
          Remember me
        </label>
        <Link to="#" className="text-slate-400 hover:text-orange-500 transition-colors">
          Forgot Password
        </Link>
      </div>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="w-full py-4 rounded-3xl bg-[#0f172a] hover:bg-black text-white font-bold text-[15px] tracking-wider shadow-xl shadow-black/30 hover:brightness-105 transition-all"
      >
        Login
      </motion.button>
    </form>
  );
}

function SignupForm() {
  return (
    <form className="w-full max-w-[380px] space-y-5" onSubmit={(e) => e.preventDefault()}>
      <InputWithIcon icon={FaUser} type="text" placeholder="Full Name" required />
      <InputWithIcon icon={FaEnvelope} type="email" placeholder="Email Address" required />
      <InputWithIcon icon={FaLock} type="password" placeholder="Password" required />
      <InputWithIcon icon={FaLock} type="password" placeholder="Confirm Password" required />

      <label className="flex items-start gap-2 text-sm text-slate-500 px-2 cursor-pointer">
        <input type="checkbox" className="mt-1 w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500" required />
        <span>I agree to the Terms of Service and Privacy Policy</span>
      </label>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="w-full py-4 rounded-3xl bg-[#0f172a] hover:bg-black text-white font-bold text-[15px] tracking-wider shadow-xl shadow-black/30 hover:brightness-105 transition-all"
      >
        Create Account
      </motion.button>
    </form>
  );
}

function SocialButtons() {
  const socials = [
    { icon: FaFacebookF, label: "Facebook", color: "hover:bg-[#1877F2]" },
    { icon: FaGoogle, label: "Google", color: "hover:bg-[#DB4437]" },
    { icon: FaInstagram, label: "Instagram", color: "hover:bg-[#E1306C]" },
    { icon: FaLinkedinIn, label: "LinkedIn", color: "hover:bg-[#0A66C2]" },
  ];

  return (
    <div className="flex items-center justify-center gap-4">
      {socials.map(({ icon: Icon, label, color }) => (
        <motion.button
          key={label}
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className={`w-11 h-11 rounded-xl bg-white text-slate-600 flex items-center justify-center shadow-md transition-all duration-300 ${color} hover:text-white`}
        >
          <Icon size={19} />
        </motion.button>
      ))}
    </div>
  );
}

function ModeToggle({ isLogin, setMode }: { isLogin: boolean; setMode: (mode: string) => void }) {
  return (
    <div className="inline-flex rounded-xl overflow-hidden shadow-lg border border-white/10">
      <button
        type="button"
        onClick={() => setMode("login")}
        className={`px-8 py-3 text-sm font-bold transition-all ${
          isLogin ? "bg-[#0f172a] text-white" : "bg-white text-slate-600 hover:bg-white/90"
        }`}
      >
        Login
      </button>
      <button
        type="button"
        onClick={() => setMode("register")}
        className={`px-8 py-3 text-sm font-bold transition-all ${
          !isLogin ? "bg-[#0f172a] text-white" : "bg-white text-slate-600 hover:bg-white/90"
        }`}
      >
        Register
      </button>
    </div>
  );
}

export default function LoginPages() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [selectedRole, setSelectedRole] = useState("Customer");
  const isLogin = mode === "login";
  const { theme } = useTheme();

  const roles = [
    "Customer",
    "Hotel",
    "Veterinary",
    "Farmer",
  ];

  return (
    <div className="min-h-screen flex font-poppins overflow-hidden bg-[#f4f6f8] dark:bg-[#0c0e12]">
      {/* LEFT PANEL - Form */}
      <div className="w-full lg:w-[46%] min-h-screen bg-[#f4f6f8] dark:bg-[#0c0e12] flex flex-col items-center justify-center px-6 py-12 relative z-20">
        <Link to="/" className="mb-10">
          <img src="/images/logo.png" alt="Animarket" className="h-11 w-auto object-contain" />
        </Link>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-[380px] flex flex-col items-center"
          >
            <h1 className="text-[22px] font-semibold text-[#0f172a] dark:text-white mb-2 text-center">
              {isLogin ? "Sign Into Your Account" : "Create Your Account"}
            </h1>
            <p className="text-emerald-600 dark:text-emerald-400 font-medium mb-9">
              as <span className="font-semibold">{selectedRole}</span>
            </p>

            {isLogin ? <LoginForm /> : <SignupForm />}

            <p className="mt-8 text-sm text-slate-500 dark:text-slate-400 text-center">
              {isLogin ? (
                <>
                  Don't have an account?{" "}
                  <button onClick={() => setMode("register")} className="text-orange-500 font-semibold hover:underline">
                    Register here
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button onClick={() => setMode("login")} className="text-orange-500 font-semibold hover:underline">
                    Sign in here
                  </button>
                </>
              )}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* RIGHT PANEL - Role Selection */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-emerald-600 to-green-700 min-h-screen items-center justify-center overflow-hidden">
        <div className="absolute w-[320px] h-[320px] bg-white/10 rounded-full -top-20 -right-20" />
        <div className="absolute w-[220px] h-[220px] bg-white/10 rounded-full -bottom-16 left-12" />

        <div className="relative z-20 max-w-md px-8 text-center text-white">
          <h2 className="text-4xl font-bold tracking-wide leading-tight mb-4">
            Welcome to <span className="text-white">ANIMARKET</span>
          </h2>

          <p className="text-lg mb-10 text-white/90">
            Are you a
          </p>

          <div className="grid grid-cols-2 gap-4 mb-10">
            {roles.map((role) => (
              <motion.button
                key={role}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedRole(role)}
                className={`py-5 rounded-3xl font-semibold text-lg transition-all duration-300 border ${
                  selectedRole === role
                    ? "bg-white text-emerald-700 border-white"
                    : "bg-white/10 hover:bg-white/20 border-white/30 hover:border-white/50 text-white"
                }`}
              >
                {role}
              </motion.button>
            ))}
          </div>

          <p className="text-sm text-white/70 mb-8">
            Choose your role to access the right features and dashboard
          </p>

          <ModeToggle isLogin={isLogin} setMode={setMode} />

          <p className="mt-8 text-xs uppercase tracking-[1.5px] text-white/70 font-medium">
            Or continue with
          </p>

          <SocialButtons />

          <Link
            to="/"
            className="block mt-12 text-xs text-white/60 hover:text-white transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}