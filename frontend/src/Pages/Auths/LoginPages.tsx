import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFacebookF,
  FaGoogle,
  FaInstagram,
  FaLinkedinIn,
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaShop,
  FaIdCard,
  FaBuilding,
  FaGlobe,
} from "react-icons/fa6";
import { useAuth } from "../../Contexts/AuthContext";
import { useHotelAuth } from "../../Contexts/HotelAuthContext";

const inputClass =
  "w-full px-6 py-[18px] pl-12 rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#16191f] text-gray-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-[15px] focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-500 transition-all duration-200";

const selectClass =
  "w-full px-6 py-[18px] pl-12 rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#16191f] text-gray-900 dark:text-white text-[15px] focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-500 transition-all duration-200 appearance-none";

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

function SelectWithIcon({ icon: Icon, children, ...props }: any) {
  return (
    <div className="relative">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 z-10">
        <Icon size={18} />
      </div>
      <select {...props} className={selectClass}>
        {children}
      </select>
    </div>
  );
}

function LoginFormComponent({ onSubmit, loading, error, userType }: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void> | void;
  loading: boolean;
  error: string;
  userType?: "user" | "hotel";
}) {
  return (
    <form className="w-full max-w-[380px] space-y-5" onSubmit={onSubmit as any}>
      <InputWithIcon icon={FaEnvelope} name="email" type="email" placeholder="Email Address" required />
      <InputWithIcon icon={FaLock} name="password" type="password" placeholder="Password" required />

      {error && (
        <p className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-2xl">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between text-sm px-2">
        <label className="flex items-center gap-2 text-slate-500 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500" />
          Remember me
        </label>
        <Link to="/forgot-password" className="text-slate-400 hover:text-orange-500 transition-colors">
          Forgot Password
        </Link>
      </div>

      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="w-full py-4 rounded-3xl bg-[#0f172a] hover:bg-black text-white font-bold text-[15px] tracking-wider shadow-xl shadow-black/30 hover:brightness-105 transition-all disabled:opacity-70"
      >
        {loading ? "Signing in..." : "Login"}
      </motion.button>
    </form>
  );
}

function HotelSignupForm({ onSubmit, loading, error }: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>, files: Record<string, File | null>) => void;
  loading: boolean;
  error: string;
}) {
  const [files, setFiles] = useState<Record<string, File | null>>({
    logo: null,
    coverImage: null,
    profileImage: null,
  });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: f } = e.target;
    setFiles((prev) => ({ ...prev, [name]: f?.[0] || null }));
  };

  const handleSubmitInternal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e, files);
  };

  return (
    <form className="w-full max-w-[380px] space-y-5" onSubmit={handleSubmitInternal}>
      {/* Hotel Basic Info */}
      <InputWithIcon icon={FaBuilding} name="hotelName" type="text" placeholder="Hotel Name" required />
      <InputWithIcon icon={FaEnvelope} name="email" type="email" placeholder="Email Address" required />
      <InputWithIcon icon={FaPhone} name="phone" type="tel" placeholder="Phone Number" required />
      
      <InputWithIcon icon={FaIdCard} name="registrationNumber" type="text" placeholder="Registration Number" required />

      <div className="grid grid-cols-2 gap-4">
        <SelectWithIcon icon={FaBuilding} name="hotelType" required defaultValue="">
          <option value="" disabled>Hotel Type</option>
          <option value="boutique">Boutique</option>
          <option value="luxury">Luxury</option>
          <option value="budget">Budget</option>
          <option value="mid-range">Mid-Range</option>
          <option value="resort">Resort</option>
          <option value="hostel">Hostel</option>
        </SelectWithIcon>

        <SelectWithIcon icon={FaGlobe} name="country" required defaultValue="">
          <option value="" disabled>Country</option>
          <option value="Pakistan">Pakistan</option>
          <option value="India">India</option>
          <option value="Other">Other</option>
        </SelectWithIcon>
      </div>

      <InputWithIcon icon={FaPhone} name="city" type="text" placeholder="City" required />
      <InputWithIcon icon={FaShop} name="address" type="text" placeholder="Address" required />
      <InputWithIcon icon={FaIdCard} name="zipCode" type="text" placeholder="Zip Code" />

      {/* Contact Person */}
      <InputWithIcon icon={FaUser} name="contactPersonName" type="text" placeholder="Contact Person Name" required />
      <InputWithIcon icon={FaPhone} name="contactPersonPhone" type="tel" placeholder="Contact Person Phone" required />
      <InputWithIcon icon={FaEnvelope} name="contactPersonEmail" type="email" placeholder="Contact Person Email" />

      {/* Password */}
      <InputWithIcon icon={FaLock} name="password" type="password" placeholder="Password" required />
      <InputWithIcon icon={FaLock} name="confirmPassword" type="password" placeholder="Confirm Password" required />

      {/* File Uploads */}
      {[
        { label: "Hotel Logo *", name: "logo", accept: "image/*" },
        { label: "Cover Image *", name: "coverImage", accept: "image/*" },
        { label: "Profile Image *", name: "profileImage", accept: "image/*" },
      ].map(({ label, name, accept }) => (
        <div key={name} className="space-y-1">
          <label className="block text-sm text-slate-500 px-2">{label}</label>
          <input
            type="file"
            name={name}
            accept={accept}
            onChange={handleFile}
            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-2xl file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />
          {files[name] && (
            <p className="text-xs text-blue-600 px-2">✓ {files[name]!.name}</p>
          )}
        </div>
      ))}

      {error && (
        <p className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-2xl">
          {error}
        </p>
      )}

      <label className="flex items-start gap-2 text-sm text-slate-500 px-2 cursor-pointer">
        <input
          type="checkbox"
          className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500"
          required
        />
        <span>I agree to the Terms of Service and Privacy Policy</span>
      </label>

      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="w-full py-4 rounded-3xl bg-[#0f172a] hover:bg-black text-white font-bold text-[15px] tracking-wider shadow-xl shadow-black/30 hover:brightness-105 transition-all disabled:opacity-70"
      >
        {loading ? "Registering..." : "Register Hotel"}
      </motion.button>
    </form>
  );
}

function SignupForm({ onSubmit, loading, error, selectedRole }: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>, files: Record<string, File | null>) => void;
  loading: boolean;
  error: string;
  selectedRole: string;
}) {
  const [files, setFiles] = useState<Record<string, File | null>>({
    profile_img: null,
    id_proof_img: null,
    shopLogo: null,
    license: null,
  });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: f } = e.target;
    setFiles((prev) => ({ ...prev, [name]: f?.[0] || null }));
  };

  // Intercept the submit locally to cleanly format fields for Multer
  const handleSubmitInternal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e, files);
  };

  return (
    <form
      className="w-full max-w-[380px] space-y-5"
      onSubmit={handleSubmitInternal}
    >
      {/* Basic Info */}
      <InputWithIcon icon={FaUser}     name="name"            type="text"  placeholder="Full Name"     required />
      <InputWithIcon icon={FaEnvelope} name="email"           type="email" placeholder="Email Address" required />
      <InputWithIcon icon={FaPhone}    name="phone"           type="tel"   placeholder="Phone Number"  required />
      <InputWithIcon icon={FaLock}     name="password"        type="password" placeholder="Password"        required />
      <InputWithIcon icon={FaLock}     name="confirmPassword" type="password" placeholder="Confirm Password" required />

      {/* ID Number — required by schema */}
      <InputWithIcon icon={FaIdCard} name="id_Number" type="text" placeholder="National ID Number" required />

      {selectedRole?.toLowerCase() !== "veterinary" && (
        <div className="grid grid-cols-2 gap-4">
          {/* Gender — required by schema */}
          <SelectWithIcon icon={FaUser} name="gender" required defaultValue="">
            <option value="" disabled>Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </SelectWithIcon>

          {/* Category — required enum: Goat, cow, pigs, sheep */}
          <SelectWithIcon icon={FaShop} name="category" required defaultValue="">
            <option value="" disabled>Category</option>
            <option value="Goat">Goat</option>
            <option value="cow">Cow</option>
            <option value="pigs">Pigs</option>
            <option value="sheep">Sheep</option>
          </SelectWithIcon>
        </div>
      )}

      {selectedRole?.toLowerCase() !== "veterinary" && (
        <>
          <InputWithIcon icon={FaShop} name="shopName"    type="text" placeholder="Shop / Farm Name" required />
          <InputWithIcon icon={FaShop} name="shopAddress" type="text" placeholder="Shop Address"     required />
        </>
      )}

      {/* Veterinary specific fields */}
      {selectedRole?.toLowerCase() === "veterinary" && (
        <>
          <h3 className="text-sm font-semibold text-slate-700 dark:text-white mt-2">Veterinary Details</h3>
          <InputWithIcon icon={FaIdCard} name="licenseNumber" type="text" placeholder="License / Registration Number" />
          <InputWithIcon icon={FaUser} name="clinicName" type="text" placeholder="Clinic / Practice Name" />
          <InputWithIcon icon={FaPhone} name="yearsOfExperience" type="text" placeholder="Years of Experience" />
        </>
      )}

      {/* File Uploads — controlled so FormData receives them */}
      {[
        { label: "Profile Image *",  name: "profile_img",  accept: "image/*" },
        { label: "ID Proof *",       name: "id_proof_img", accept: "image/*,application/pdf" },
        ...(selectedRole?.toLowerCase() !== "veterinary" ? [{ label: "Shop Logo *",      name: "shopLogo",     accept: "image/*" }] : []),
      ].map(({ label, name, accept }) => (
        <div key={name} className="space-y-1">
          <label className="block text-sm text-slate-500 px-2">{label}</label>
          <input
            type="file"
            name={name}
            accept={accept}
            onChange={handleFile}
            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-2xl file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
          />
          {files[name] && (
            <p className="text-xs text-emerald-600 px-2">✓ {files[name]!.name}</p>
          )}
        </div>
      ))}

      {error && (
        <p className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-2xl">
          {error}
        </p>
      )}

      {/* Veterinary license upload */}
      {selectedRole?.toLowerCase() === "veterinary" && (
        <div className="space-y-1">
          <label className="block text-sm text-slate-500 px-2">License / Certification (optional)</label>
          <input
            type="file"
            name="license"
            accept="image/*,application/pdf"
            onChange={handleFile}
            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-2xl file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
          />
          {files.license && (
            <p className="text-xs text-emerald-600 px-2">✓ {files.license!.name}</p>
          )}
        </div>
      )}

      <label className="flex items-start gap-2 text-sm text-slate-500 px-2 cursor-pointer">
        <input
          type="checkbox"
          className="mt-1 w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
          required
        />
        <span>I agree to the Terms of Service and Privacy Policy</span>
      </label>

      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="w-full py-4 rounded-3xl bg-[#0f172a] hover:bg-black text-white font-bold text-[15px] tracking-wider shadow-xl shadow-black/30 hover:brightness-105 transition-all disabled:opacity-70"
      >
        {loading ? "Creating Account..." : "Create Account"}
      </motion.button>
    </form>
  );
}

function SocialButtons() {
  const socials = [
    { icon: FaFacebookF, label: "Facebook", color: "hover:bg-[#1877F2]" },
    { icon: FaGoogle,    label: "Google",   color: "hover:bg-[#DB4437]" },
    { icon: FaInstagram, label: "Instagram",color: "hover:bg-[#E1306C]" },
    { icon: FaLinkedinIn,label: "LinkedIn", color: "hover:bg-[#0A66C2]" },
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

function ModeToggle({ isLogin, setMode }: { isLogin: boolean; setMode: (mode: "login" | "register") => void }) {
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
  const [mode, setMode]               = useState<"login" | "register">("login");
  const [userType, setUserType]       = useState<"user" | "hotel">("user");
  const [selectedRole, setSelectedRole] = useState("Customer");
  const [error, setError]             = useState("");
  const [loading, setLoading]         = useState(false);

  const { login, register } = useAuth();
  const { login: hotelLogin, register: hotelRegister } = useHotelAuth();
  const navigate = useNavigate();

  const isLogin = mode === "login";
  const roles   = ["Customer", "Hotel", "Veterinary", "Farmer"];

  // ====================== LOGIN ======================
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email    = formData.get("email")    as string;
    const password = formData.get("password") as string;

    try {
      if (userType === "hotel") {
        const hotelData = await hotelLogin(email, password);
        navigate("/dashboard/hotel", { replace: true });
      } else {
        const userData = await login(email, password);
        let dashboardPath = "/dashboard";

        switch (userData.role?.toLowerCase()) {
          case "seller":
          case "farmer":      dashboardPath = "/dashboard/selling";    break;
          case "customer":
          case "hotel":       dashboardPath = "/dashboard/buying";     break;
          case "veterinary":  dashboardPath = "/dashboard/veterinary"; break;
          case "admin":       dashboardPath = "/admin/dashboard";      break;
        }

        navigate(dashboardPath, { replace: true });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // ====================== REGISTER ======================
  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>,
    files: Record<string, File | null>
  ) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    if (userType === "hotel") {
      // Hotel registration
      [
        "logo", "coverImage", "profileImage"
      ].forEach((fieldName) => {
        formData.delete(fieldName);
      });

      Object.entries(files).forEach(([key, file]) => {
        if (file) formData.append(key, file);
      });

      try {
        const res = await hotelRegister(formData);
        alert(res.message || "Hotel registered successfully! Awaiting admin approval.");
        setMode("login");
      } catch (err: any) {
        setError(err.response?.data?.message || "Hotel registration failed. Please try again.");
      }
    } else {
      // User registration
      ["profile_img", "id_proof_img", "shopLogo"].forEach((fieldName) => {
        formData.delete(fieldName);
      });

      Object.entries(files).forEach(([key, file]) => {
        if (file) formData.append(key, file);
      });

      formData.append("profile", selectedRole.toLowerCase());

      const roleMap: Record<string, string> = {
        customer:   "customer",
        hotel:      "hotel",
        veterinary: "veterinary",
        farmer:     "farmer",
      };
      formData.append("role", roleMap[selectedRole.toLowerCase()] ?? "customer");

      try {
        const res = await register(formData);
        alert(res.message || "Registration successful! Awaiting admin approval.");
        setMode("login");
      } catch (err: any) {
        setError(err.response?.data?.message || "Registration failed. Please try again.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex font-poppins overflow-hidden bg-[#f4f6f8] dark:bg-[#0c0e12]">
      {/* LEFT PANEL */}
      <div className="w-full lg:w-[46%] min-h-screen bg-[#f4f6f8] dark:bg-[#0c0e12] flex flex-col items-center justify-center px-6 py-12 relative z-20">
        <Link to="/" className="mb-10">
          <img src="/images/logo.png" alt="Animarket" className="h-11 w-auto object-contain" />
        </Link>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${userType}-${mode}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-[380px] flex flex-col items-center"
          >
            <h1 className="text-[22px] font-semibold text-[#0f172a] dark:text-white mb-2 text-center">
              {isLogin
                ? `Sign Into Your ${userType === "hotel" ? "Hotel" : ""} Account`
                : `Create Your ${userType === "hotel" ? "Hotel" : ""} Account`}
            </h1>
            {!isLogin && userType === "user" && (
              <p className="text-emerald-600 dark:text-emerald-400 font-medium mb-9">
                as <span className="font-semibold">{selectedRole}</span>
              </p>
            )}

            {isLogin ? (
              <LoginFormComponent onSubmit={handleLogin} loading={loading} error={error} userType={userType} />
            ) : userType === "hotel" ? (
              <HotelSignupForm onSubmit={handleRegister} loading={loading} error={error} />
            ) : (
              <SignupForm onSubmit={handleRegister} loading={loading} error={error} selectedRole={selectedRole} />
            )}

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

      {/* RIGHT PANEL */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-emerald-600 to-green-700 min-h-screen items-center justify-center overflow-hidden">
        <div className="absolute w-[320px] h-[320px] bg-white/10 rounded-full -top-20 -right-20" />
        <div className="absolute w-[220px] h-[220px] bg-white/10 rounded-full -bottom-16 left-12" />

        <div className="relative z-20 max-w-md px-8 text-center text-white">
          <h2 className="text-4xl font-bold tracking-wide leading-tight mb-4">
            Welcome to <span className="text-white">ANIMARKET</span>
          </h2>

          <p className="text-lg mb-10 text-white/90">Are you a</p>

          <div className="grid grid-cols-2 gap-4 mb-10">
            {roles.map((role) => (
              <motion.button
                key={role}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setSelectedRole(role);
                  setUserType(role === "Hotel" ? "hotel" : "user");
                }}
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

          <Link to="/" className="block mt-12 text-xs text-white/60 hover:text-white transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}