import React, { useState, useEffect } from "react";
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  UserPlus, 
  KeyRound, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Compass
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile as ProfileType } from "../types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: ProfileType) => void;
  initialMode?: "login" | "signup";
}

export default function AuthModal({ 
  isOpen, 
  onClose, 
  onLoginSuccess,
  initialMode = "login" 
}: AuthModalProps) {
  const [isLoginMode, setIsLoginMode] = useState(initialMode === "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [dosha, setDosha] = useState("Vata");
  const [showPassword, setShowPassword] = useState(false);
  
  // Feedback states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  // Sync mode whenever modal is opened
  useEffect(() => {
    if (isOpen) {
      setIsLoginMode(initialMode === "login");
      setError("");
      setSuccess(false);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setShake(false);

    if (!email || !password) {
      setError("Please fill in all security credentials.");
      triggerShake();
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem("vedascan_user_accounts") || "[]");

    if (isLoginMode) {
      // Login Process
      const matched = storedUsers.find(
        (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (matched) {
        setSuccess(true);
        setTimeout(() => {
          onLoginSuccess(matched.profile);
          onClose();
        }, 1200);
      } else {
        setError("Invalid email or password. Please verify your credentials and try again.");
        triggerShake();
      }
    } else {
      // Registration Process
      if (!name) {
        setError("Please provide your full name for registration.");
        triggerShake();
        return;
      }
      
      const alreadyExists = storedUsers.some(
        (u: any) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (alreadyExists) {
        setError("This email address is already associated with an active profile.");
        triggerShake();
        return;
      }

      // Create beautiful new profile
      const newProfile: ProfileType = {
        id: `user_${Date.now()}`,
        name,
        email,
        dosha,
        createdAt: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        notes: [],
        weightLogs: [
          { id: `w_${Date.now()}`, date: new Date().toISOString().split("T")[0], weight: 75.0 }
        ],
        completedWeightLossDays: [],
        savedConsultations: []
      };

      const newUserAccount = {
        id: newProfile.id,
        email,
        password,
        profile: newProfile
      };

      storedUsers.push(newUserAccount);
      localStorage.setItem("vedascan_user_accounts", JSON.stringify(storedUsers));
      
      setSuccess(true);
      setTimeout(() => {
        onLoginSuccess(newProfile);
        onClose();
      }, 1200);
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
        id="auth-modal-backdrop"
      />

      {/* Modal core card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 15 }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          y: 0,
          x: shake ? [-6, 6, -4, 4, 0] : 0 
        }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ 
          type: "spring", 
          stiffness: 350, 
          damping: 25,
          x: { type: "tween", duration: 0.5 }
        }}
        className="relative w-full max-w-md bg-[#0D0F0E]/95 border border-white/10 rounded-[32px] p-6 md:p-8 overflow-hidden shadow-2xl z-10"
        id="auth-modal-card"
      >
        {/* Ambient atmospheric backdrop light */}
        <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-[#C5A36B]/5 blur-[70px] pointer-events-none" />

        {/* Header Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white/50 hover:text-white transition p-1.5 hover:bg-white/5 rounded-full cursor-pointer"
          id="auth-close-btn"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Succes state indicator */}
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-10 space-y-4 flex flex-col items-center justify-center min-h-[300px]"
            >
              <div className="w-16 h-16 bg-green-500/15 border border-green-500/35 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-serif text-white font-medium">Equilibrium Established</h3>
                <p className="text-xs text-white/55">
                  Welcome to VedaScan AI. Synchronizing your diagnostic healing panel...
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-5">
              {/* Logo icon representation */}
              <div className="text-center space-y-2">
                <div className="w-12 h-12 border border-[#C5A36B] rounded-full flex items-center justify-center mx-auto bg-[#C5A36B]/5">
                  <Compass className="w-5 h-5 text-[#C5A36B] animate-spin-slow" />
                </div>
                <h3 className="text-2xl font-serif text-[#F2EBE4]">
                  {isLoginMode ? "Sign In to VedaProfile" : "Begin Healing Journey"}
                </h3>
                <p className="text-xs text-white/50 leading-relaxed max-w-xs mx-auto">
                  Access custom herb recommendations, track weight reduction plans, and secure your consultations.
                </p>
              </div>

              {/* Form elements */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/15 border border-red-500/30 text-red-200 text-xs rounded-xl p-3 text-center"
                  >
                    {error}
                  </motion.div>
                )}

                {/* SIGN UP: Name */}
                {!isLoginMode && (
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-[#C5A36B] block">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 w-4 h-4 text-white/30" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Ethan Gomez"
                        className="w-full bg-black/45 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#F2EBE4] focus:outline-none focus:border-[#C5A36B] focus:ring-1 focus:ring-[#C5A36B]/25 transition"
                      />
                    </div>
                  </div>
                )}

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-[#C5A36B] block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-white/30" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. acharya@vedascan.com"
                      className="w-full bg-black/45 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#F2EBE4] focus:outline-none focus:border-[#C5A36B] focus:ring-1 focus:ring-[#C5A36B]/25 transition"
                    />
                  </div>
                </div>

                {/* Secret Password */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-[#C5A36B] block">
                    Security Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-white/30" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password (e.g. sattva108)"
                      className="w-full bg-black/45 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#F2EBE4] focus:outline-none focus:border-[#C5A36B] focus:ring-1 focus:ring-[#C5A36B]/25 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-white/30 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* SIGN UP: Primary Dosha */}
                {!isLoginMode && (
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-[#C5A36B] block">
                      Primary Dosha Constitute (Prakriti)
                    </label>
                    <select
                      value={dosha}
                      onChange={(e) => setDosha(e.target.value)}
                      className="w-full bg-black/45 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-[#F2EBE4] focus:outline-none focus:border-[#C5A36B] focus:ring-1 focus:ring-[#C5A36B]/25 transition"
                    >
                      <option value="Vata">Vata (Air & Ether)</option>
                      <option value="Pitta">Pitta (Fire & Water)</option>
                      <option value="Kapha">Kapha (Earth & Water)</option>
                      <option value="Vata-Pitta">Vata-Pitta (Dual Constitutional)</option>
                      <option value="Pitta-Kapha">Pitta-Kapha (Dual Constitutional)</option>
                      <option value="Vata-Kapha">Vata-Kapha (Dual Constitutional)</option>
                      <option value="Tridoshic">Tridoshic (Balanced Vata, Pitta, Kapha)</option>
                    </select>
                  </div>
                )}

                {/* Action Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-[#C5A36B] hover:bg-[#C5A36B]/85 text-black font-semibold py-3 rounded-xl transition text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer mt-5 min-h-[44px]"
                >
                  {isLoginMode ? <KeyRound className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                  <span>{isLoginMode ? "Unlock My Profile" : "Register Wellness Account"}</span>
                </button>
              </form>

              {/* Toggle switch between login / signup modes */}
              <div className="pt-4 border-t border-white/5 text-center space-y-3.5">
                <button
                  onClick={() => {
                    setIsLoginMode(!isLoginMode);
                    setError("");
                  }}
                  className="text-xs text-[#C5A36B] hover:underline cursor-pointer"
                >
                  {isLoginMode ? "Don't have an account yet? Register here" : "Already registered? Login to your profile"}
                </button>
              </div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
