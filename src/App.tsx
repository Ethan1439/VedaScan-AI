/**
 * ============================================================================
 * COPYRIGHT & INTELLECTUAL PROPERTY NOTICE
 * ============================================================================
 * Project: VedaScan
 * Author: Ethan Aarav Gomez (ethanaaravgomez@gmail.com)
 * Academic Institution: Sastra Deemed University / Verified Academic Software Registry
 * Year: 2026
 * 
 * Cryptographic Fingerprint / Original Signature: 
 * sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
 * 
 * ALL RIGHTS RESERVED. No portion of this custom software, schemas, database 
 * structures, designs, or proprietary algorithms may be copied, modified, 
 * redistributed, or sublicensed without the express written permission of the 
 * primary author, Ethan Aarav Gomez. Any unauthorized copies or derivative works 
 * will violate the Verified Academic Software Registry and Digital IP Protection Board.
 * ============================================================================
 */

import React, { useState, useEffect } from "react";
import { 
  Leaf, 
  Activity, 
  Sparkles, 
  AlertCircle, 
  Check, 
  RotateCcw, 
  Compass, 
  Loader2, 
  BookOpen, 
  MapPin, 
  Bookmark, 
  Flame, 
  UtensilsCrossed, 
  Grid,
  History,
  Trash2,
  CalendarPlus,
  ShoppingBag,
  X,
  Mic,
  MicOff,
  UserCheck,
  Scale,
  Brain,
  Download
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Herb, DoshaAnswers, RecommendationResponse, SavedConsultation, UserProfile as UserProfileType } from "./types";
import HerbalDirectory from "./components/HerbalDirectory";
import { COMMON_DISEASES_DB } from "./data/diseases";
import DiseaseTreatises from "./components/DiseaseTreatises";
import SattvaHabitTherapy from "./components/SattvaHabitTherapy";
import { getApiUrl } from "./lib/api";
import SattvaCalendarModal, { CalendarHabit } from "./components/SattvaCalendarModal";
import UserProfile from "./components/UserProfile";
import WeightLossPlan from "./components/WeightLossPlan";
import AuthModal from "./components/AuthModal";
import AyurBot from "./components/AyurBot";
import ProjectVerificationModal from "./components/ProjectVerificationModal";
import AcademicHub from "./components/AcademicHub";
import { generateAyurvedicPDF } from "./lib/pdfGenerator";
import AccessibilityWidget from "./components/AccessibilityWidget";
import AccessibilityDashboard from "./components/AccessibilityDashboard";

const isOwnerEmail = (email?: string) => {
  if (!email) return false;
  const canonical = email.trim().toLowerCase();
  return canonical === "ethanaaravgomez@gmail.com" || (typeof window !== "undefined" && window.btoa && window.btoa(canonical) === "ZXRoYW5hYXJhdmdvbWV6QGdtYWlsLmNvbQ==");
};

const COMMON_SYMPTOMS = [
  "Indigestion & Bloating",
  "Stress & Anxiety",
  "Insomnia / Poor Sleep",
  "Acidity / Heartburn",
  "Joint Stiffness & Pain",
  "Fatigue & Low Energy",
  "Skin Rashes & Acne",
  "Chronic Dry Skin",
  "Cough & Lung Phlegm",
  "Mental Fog / Low Focus",
  "Cold & Congestion",
  "Low Appetitte"
];

// Fallback herbs in case API fails
const FALLBACK_HERBS: Herb[] = [
  {
    id: "ashwagandha",
    name: "Ashwagandha (Indian Ginseng)",
    sanskritName: "Aswagandha",
    botanicalName: "Withania somnifera",
    doshaEffect: "Calms Vata & Kapha, can mildly increase Pitta in extreme excess.",
    category: "Rejuvenative / Adaptogen",
    primaryIndications: ["Stress", "Anxiety", "Insomnia", "Fatigue", "Weak Immunity", "Muscle Weakness"],
    description: "Ashwagandha is one of the most vital herbs in Ayurveda. It is classified as a 'Rasayana' (rejuvenative) designed to promote physical and mental health, restore body energy, and increase longevity.",
    howToUse: "Take 1/2 to 1 teaspoon of ashwagandha powder with warm milk or warm water, before bedtime or twice daily.",
    benefits: [
      "Reduces cortisol levels and counters chronic stress",
      "Promotes deep, restful sleep without feeling drowsy",
      "Increases vitality, raw physical strength, and stamina",
      "Supports balanced nervous system functioning"
    ],
    precautions: "Generally safe. Avoid in cases of acute fever, heavy toxin buildup (Ama), or high congestion. Use caution in hyperthyroidism or pregnancy (consult physician)."
  },
  {
    id: "tulsi",
    name: "Tulsi (Holy Basil)",
    sanskritName: "Tulasi / Surasa",
    botanicalName: "Ocimum sanctum",
    doshaEffect: "Balances Kapha & Vata, can increase Pitta if used in absolute excess.",
    category: "Immunomodulator / Breath Tonic",
    primaryIndications: ["Cough", "Cold", "Sore Throat", "Congestion", "Mild Fever", "Mental Fog"],
    description: "Known as 'The Queen of Herbs', Tulsi is highly sacred in India and holds an immense role as an immune builder, adaptogen, and respiratory cleanser.",
    howToUse: "Brew 5-10 fresh leaves or 1 teaspoon dry herb in hot water to make tea. Drink 2-3 times daily.",
    benefits: [
      "Expels excess mucus from lungs and soothes throat tissues",
      "Boosts immunity due to high antioxidant and antimicrobial compounds",
      "Clears cognitive stagnation, calms anxiety, and improves focus",
      "Enkindles the metabolic fire (Agni) gently"
    ],
    precautions: "Mildly heating. Avoid during hot summer months if severe Pitta imbalance (acidity, burning sensation) is present. Consult doctor during pregnancy."
  },
  {
    id: "triphala",
    name: "Triphala Powder",
    sanskritName: "Triphalā",
    botanicalName: "Amalaki + Bibhitaki + Haritaki",
    doshaEffect: "Tridoshic (balances all Vata, Pitta, and Kapha equally).",
    category: "Digestive Tonic / Gentle Detoxifier",
    primaryIndications: ["Constipation", "Indigestion", "Bloating", "Sluggish Metabolism", "Colon Cleansing"],
    description: "Triphala is an ancient synergy of three powerful fruits (Amla, Haritaki, Bibhitaki). It is celebrated as the absolute premier digestive cleanser, balancing all systems organically.",
    howToUse: "Mix 1/2 to 1 teaspoon with warm water before bed or first thing in the morning on an empty stomach.",
    benefits: [
      "Supports regular, healthy bowel movements without habit formation",
      "Eliminates internal digestive toxins (Ama)",
      "High in Vitamin C, promoting skin luster and cellular repair",
      "Nourishes the digestive tract and improves gut flora"
    ],
    precautions: "Can cause mild initial bowel cramping or purging. Do not use if suffering from acute diarrhea or severe dysentery. Stop use during menstruation if flow is very heavy."
  }
];

export default function App() {
  // State elements
  const [herbs, setHerbs] = useState<Herb[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<{ name: string; dosageInstructions: string; safetyNotes: string } | null>(null);
  const [showMedicineDeals, setShowMedicineDeals] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customDescription, setCustomDescription] = useState("");
  const [diseaseContext, setDiseaseContext] = useState("");
  const [severity, setSeverity] = useState<string>("Mild");
  const [duration, setDuration] = useState<string>("A few days");
  const [age, setAge] = useState<string>("Adult (18-60)");
  const [gender, setGender] = useState<string>("Female");

  // Voice & NLP Extraction States
  const [isListening, setIsListening] = useState(false);
  const [nlpLoading, setNlpLoading] = useState(false);
  const [nlpResult, setNlpResult] = useState<{
    symptoms: string[];
    diseaseContext: string;
    severity: string;
    duration: string;
    analysis: string;
  } | null>(null);

  // User Profile & Authentication States
  const [currentUser, setCurrentUser] = useState<UserProfileType | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup">("login");
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  // Dosha-Quiz responses
  const [doshaAnswers, setDoshaAnswers] = useState<DoshaAnswers>({
    energy: "Fluctuating, bursts of high energy then exhaustion (Vata)",
    digestion: "Irregular, frequent gas, bloating, variable appetite (Vata)",
    sleep: "Light, easily disrupted, active dreams, prone to worry (Vata)",
    skin: "Dry, cool, thin, prone to cracking, dry scalp (Vata)",
    stress: "Anxiety, fear, overthinking, restless mind (Vata)"
  });

  // Result state
  const [loading, setLoading] = useState(false);
  const [recommendationResult, setRecommendationResult] = useState<RecommendationResponse | null>(null);
  const [activeTab, setActiveTab] = useState<"Consult" | "Diseases" | "Library" | "SattvaHabits" | "WeightLoss" | "Profile" | "AyurBot" | "Academic">("Consult");
  const [showApplyToast, setShowApplyToast] = useState<string | null>(null);

  // Universal Accessibility Options
  const [fontSize, setFontSize] = useState<"normal" | "large" | "extra-large">(() => {
    try {
      const stored = localStorage.getItem("vedascan_font_size");
      return (stored as "normal" | "large" | "extra-large") || "normal";
    } catch {
      return "normal";
    }
  });
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    try {
      return localStorage.getItem("vedascan_high_contrast") === "true";
    } catch {
      return false;
    }
  });
  const [dyslexiaFont, setDyslexiaFont] = useState<boolean>(() => {
    try {
      return localStorage.getItem("vedascan_dyslexia_font") === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("vedascan_font_size", fontSize);
      localStorage.setItem("vedascan_high_contrast", String(highContrast));
      localStorage.setItem("vedascan_dyslexia_font", String(dyslexiaFont));
    } catch (e) {
      console.warn("Could not save accessibility settings:", e);
    }
  }, [fontSize, highContrast, dyslexiaFont]);
  const [savedConsultations, setSavedConsultations] = useState<SavedConsultation[]>(() => {
    try {
      const stored = localStorage.getItem("vedascan_saved_consultations");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Load active session on mount
  useEffect(() => {
    try {
      const session = localStorage.getItem("vedascan_active_session");
      if (session) {
        setCurrentUser(JSON.parse(session));
      }
    } catch (err) {
      console.warn("Could not load session from localStorage", err);
    }
  }, []);

  const handleLoginUser = (user: UserProfileType) => {
    setCurrentUser(user);
    localStorage.setItem("vedascan_active_session", JSON.stringify(user));
  };

  const handleLogoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem("vedascan_active_session");
  };

  const handleUpdateUser = (updated: UserProfileType) => {
    setCurrentUser(updated);
    localStorage.setItem("vedascan_active_session", JSON.stringify(updated));
  };

  const startVoiceCapture = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please type conversational symptoms manually.");
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = "en-US";

    rec.onstart = () => {
      setIsListening(true);
    };

    rec.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setCustomDescription((prev) => prev ? `${prev} ${text}` : text);
      setIsListening(false);
    };

    rec.onerror = (err: any) => {
      console.error("Speech recognition error:", err);
      setIsListening(false);
    };

    rec.onend = () => {
      setIsListening(false);
    };

    rec.start();
  };

  const handleNlpExtract = async () => {
    if (!customDescription.trim()) {
      alert("Please enter a description or use the voice button before scanning.");
      return;
    }
    setNlpLoading(true);
    setNlpResult(null);

    try {
      const response = await fetch(getApiUrl("/api/nlp-extract"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: customDescription })
      });
      if (!response.ok) throw new Error("Failed to extract");
      const data = await response.json();
      setNlpResult(data);
    } catch (err) {
      console.error("NLP parsing error:", err);
      alert("Error parsing conversational symptoms. Please configure parameters manually.");
    } finally {
      setNlpLoading(false);
    }
  };

  const applyNlpResult = () => {
    if (!nlpResult) return;
    
    // Auto-select checkboxes
    if (nlpResult.symptoms && nlpResult.symptoms.length > 0) {
      setSelectedSymptoms((prev) => {
        const next = [...prev];
        nlpResult.symptoms.forEach(sym => {
          if (!next.includes(sym)) next.push(sym);
        });
        return next;
      });
    }

    // Auto-populate disease context
    if (nlpResult.diseaseContext) {
      setDiseaseContext(nlpResult.diseaseContext);
    }

    // Set severity
    if (nlpResult.severity) {
      setSeverity(nlpResult.severity);
    }

    // Set duration
    if (nlpResult.duration) {
      setDuration(nlpResult.duration);
    }

    setShowApplyToast("Conversational Symptoms Extracted & Applied!");
    setTimeout(() => {
      setShowApplyToast(null);
    }, 4500);

    setNlpResult(null); // clear results after applying
  };

  const [showPrescriptionSync, setShowPrescriptionSync] = useState(false);

  const getPrescriptionSyncableHabits = (): CalendarHabit[] => {
    if (!recommendationResult) return [];
    
    const list: CalendarHabit[] = [];
    const { lifestyleRecommendations } = recommendationResult;
    
    // Add breathing exercises
    if (lifestyleRecommendations.breathingExercises && lifestyleRecommendations.breathingExercises.length > 0) {
      lifestyleRecommendations.breathingExercises.forEach((ex, idx) => {
        list.push({
          id: `pres_breath_${idx}`,
          title: `Ayurveda Breathwork - ${ex.split(":")[0]?.trim() || "Pranayama"}`,
          description: `Custom breathing recommendation: ${ex}. Deploys specific thermal action (Virya) to address symptoms.`,
          defaultTime: idx === 0 ? "07:00" : "18:00"
        });
      });
    }

    // Add yoga asanas
    if (lifestyleRecommendations.yogaAsanas && lifestyleRecommendations.yogaAsanas.length > 0) {
      lifestyleRecommendations.yogaAsanas.forEach((pose, idx) => {
        list.push({
          id: `pres_yoga_${idx}`,
          title: `Posture Sadhana - ${pose.split("-")[0]?.trim() || "Asana"}`,
          description: `Perform custom posture: ${pose}. Supports structural flexibility and moves systemic stagnation.`,
          defaultTime: "08:00"
        });
      });
    }

    // Add lifestyle tips
    if (lifestyleRecommendations.lifestyleTips && lifestyleRecommendations.lifestyleTips.length > 0) {
      lifestyleRecommendations.lifestyleTips.forEach((tip, idx) => {
        list.push({
          id: `pres_tip_${idx}`,
          title: `Vedic Dinacharya Routine #${idx + 1}`,
          description: `Custom lifestyle instruction: ${tip}. Promotes circadian alignment and Vata-Pitta mitigation.`,
          defaultTime: idx === 0 ? "06:00" : idx === 1 ? "12:30" : "22:00"
        });
      });
    }

    return list;
  };

  const handleSelectSavedConsultation = (consult: SavedConsultation) => {
    setSelectedSymptoms(consult.symptoms);
    setCustomDescription(consult.customDescription);
    setDiseaseContext(consult.diseaseContext);
    setSeverity(consult.severity);
    setDuration(consult.duration);
    setAge(consult.age || "Adult (18-60)");
    setGender(consult.gender || "Female");
    setDoshaAnswers(consult.doshaAnswers);
    setRecommendationResult(consult.result);

    setShowApplyToast(`Consultation from ${consult.timestamp} Loaded`);
    setTimeout(() => {
      setShowApplyToast(null);
    }, 4500);

    // Smooth scroll down to result
    setTimeout(() => {
      const resultsEl = document.getElementById("recommendation-result-panel");
      if (resultsEl) {
        resultsEl.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleDownloadPDF = () => {
    if (!recommendationResult) return;
    generateAyurvedicPDF(recommendationResult, {
      name: currentUser?.name,
      email: currentUser?.email,
      age,
      gender,
      symptoms: selectedSymptoms,
      severity,
      duration,
      customDescription
    });
  };

  const handleDeleteSavedConsultation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedConsultations((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem("vedascan_saved_consultations", JSON.stringify(updated));
      } catch (err) {
        console.warn("Could not save to localStorage", err);
      }
      return updated;
    });
  };

  const handleSaveConsultationToProfile = () => {
    if (!currentUser) {
      setAuthModalMode("login");
      setIsAuthModalOpen(true);
      return;
    }

    if (!recommendationResult) return;

    const newConsult: SavedConsultation = {
      id: `profile_consult_${Date.now()}`,
      timestamp: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      symptoms: [...selectedSymptoms],
      customDescription,
      diseaseContext,
      severity,
      duration,
      age,
      gender,
      doshaAnswers: { ...doshaAnswers },
      result: recommendationResult,
    };

    // Filter out duplicates in saved list
    const filtered = currentUser.savedConsultations.filter(
      c => JSON.stringify(c.symptoms.slice().sort()) !== JSON.stringify(newConsult.symptoms.slice().sort()) ||
           c.diseaseContext !== newConsult.diseaseContext
    );

    const updatedProfile = {
      ...currentUser,
      savedConsultations: [newConsult, ...filtered]
    };

    handleUpdateUser(updatedProfile);

    // Sync into the local accounts store
    const storedUsers = JSON.parse(localStorage.getItem("vedascan_user_accounts") || "[]");
    const updatedUsers = storedUsers.map((u: any) => {
      if (u.id === updatedProfile.id) {
        return { ...u, profile: updatedProfile };
      }
      return u;
    });
    localStorage.setItem("vedascan_user_accounts", JSON.stringify(updatedUsers));

    setShowApplyToast("Healing Plan Saved to your Profile!");
    setTimeout(() => {
      setShowApplyToast(null);
    }, 4500);
  };

  // Load herbs on mount
  useEffect(() => {
    fetch(getApiUrl("/api/herbs"))
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data: Herb[]) => {
        setHerbs(data);
      })
      .catch((err) => {
        console.warn("Could not fetch herbs from server. Falling back to default library.", err);
        setHerbs(FALLBACK_HERBS);
      });
  }, []);

  // Handle symptom multi toggle
  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  // Add search/herb keyword from library clicking directly to context
  const handleSelectHerbKeyword = (keyword: string) => {
    if (!selectedSymptoms.includes(keyword)) {
      setSelectedSymptoms((prev) => [...prev, keyword]);
    }
    // Set text context additionally for clarity
    setCustomDescription((prev) => 
      prev.includes(keyword) ? prev : prev ? `${prev}, Interested in ${keyword}` : `Interested in ${keyword}`
    );
    // Auto-scroll up to consult area with smooth action
    const consultSection = document.getElementById("consult-section-header");
    if (consultSection) {
      consultSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Trigger submission to server recommender
  const handleGenerateRecommendation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setRecommendationResult(null);

    try {
      const response = await fetch(getApiUrl("/api/recommend"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptoms: selectedSymptoms,
          diseaseContext,
          age,
          gender,
          severity,
          duration,
          customDescription,
          doshaAnswers
        }),
      });

      if (!response.ok) {
        throw new Error("Failure calling Vedic server engine.");
      }

      const result: RecommendationResponse = await response.json();
      setRecommendationResult(result);
      
      // Save consultation to history (last 3 entries)
      const newConsult: SavedConsultation = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
        symptoms: [...selectedSymptoms],
        customDescription,
        diseaseContext,
        severity,
        duration,
        age,
        gender,
        doshaAnswers: { ...doshaAnswers },
        result,
      };

      setSavedConsultations((prev) => {
        // Filter out identical queries to keep a clean history
        const filtered = prev.filter(
          (item) =>
            JSON.stringify(item.symptoms.slice().sort()) !== JSON.stringify(newConsult.symptoms.slice().sort()) ||
            item.diseaseContext !== newConsult.diseaseContext ||
            item.customDescription !== newConsult.customDescription
        );
        const updated = [newConsult, ...filtered].slice(0, 3);
        try {
          localStorage.setItem("vedascan_saved_consultations", JSON.stringify(updated));
        } catch (err) {
          console.warn("Could not save to localStorage", err);
        }
        return updated;
      });

      // Auto-scroll down to results block
      setTimeout(() => {
        const resultsEl = document.getElementById("recommendation-result-panel");
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);

    } catch (err) {
      console.error(err);
      alert("Something went wrong compiling the Ayurvedic algorithm. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedSymptoms([]);
    setCustomDescription("");
    setDiseaseContext("");
    setSeverity("Mild");
    setDuration("A few days");
    setRecommendationResult(null);
  };

  const handleSelectDiseaseToForm = (diseaseName: string) => {
    setDiseaseContext(diseaseName);
    setCustomDescription((prev) => {
      const intro = `Seeking full Ayurvedic therapy & diet recommendations for ${diseaseName}.`;
      return prev ? `${intro}\n${prev}` : intro;
    });
    // Add corresponding common indicators for common disease
    if (diseaseName.toLowerCase().includes("diabetes") && !selectedSymptoms.includes("Frequent urination")) {
      setSelectedSymptoms((prev) => [...prev, "Low Energy", "Fatigue & Low Energy"]);
    } else if (diseaseName.toLowerCase().includes("arthritis")) {
      setSelectedSymptoms((prev) => [...prev, "Joint Stiffness & Pain"]);
    } else if (diseaseName.toLowerCase().includes("insomnia")) {
      setSelectedSymptoms((prev) => [...prev, "Insomnia / Poor Sleep", "Stress & Anxiety"]);
    } else if (diseaseName.toLowerCase().includes("reflux")) {
      setSelectedSymptoms((prev) => [...prev, "Acidity / Heartburn", "Indigestion & Bloating"]);
    } else if (diseaseName.toLowerCase().includes("asthma")) {
      setSelectedSymptoms((prev) => [...prev, "Cough & Lung Phlegm", "Cold & Congestion"]);
    }

    setShowApplyToast(diseaseName);
    setTimeout(() => {
      setShowApplyToast(null);
    }, 4500);

    // Smooth scroll back up to inputs
    document.getElementById("consult-section-header")?.scrollIntoView({ behavior: "smooth" });
    setActiveTab("Consult");
  };

  return (
    <div className={`min-h-screen bg-[#080A09] text-[#E0D8D0] font-sans flex flex-col relative overflow-x-hidden ${
      fontSize === "large" ? "a11y-font-large" : fontSize === "extra-large" ? "a11y-font-extra-large" : ""
    } ${highContrast ? "a11y-high-contrast" : ""} ${dyslexiaFont ? "a11y-dyslexia" : ""}`}>
      
      {/* Decorative Atmosphere Glow Background Elements */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-[#2D3A25] rounded-full blur-[140px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[600px] h-[600px] bg-[#3E2C1A] rounded-full blur-[180px] opacity-35 pointer-events-none" />
      <div className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[800px] h-[400px] bg-[#1A241F] rounded-full blur-[180px] opacity-25 pointer-events-none" />

      {/* Elegant Header Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6 border-b border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border border-[#C5A36B] rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-[#C5A36B] rounded-full shadow-[0_0_15px_rgba(197,163,107,0.8)]"></div>
          </div>
          <div>
            <span className="text-xl md:text-2xl font-serif italic tracking-tight text-[#F2EBE4] font-medium block">
              VedaScan AI
            </span>
            <span className="text-[9px] uppercase tracking-widest text-[#C5A36B] block">Ayurvedic Healing Protocol</span>
          </div>
        </div>

        {/* Tab/Navigation Pillar Toggles */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 md:gap-6 text-xs uppercase tracking-widest mt-1">
          <button
            id="nav-consult-tab"
            onClick={() => {
              setActiveTab("Consult");
              // Smooth scroll to consult
              document.getElementById("consult-section-header")?.scrollIntoView({ behavior: "smooth" });
            }}
            className={`hover:text-[#C5A36B] transition cursor-pointer ${activeTab === "Consult" ? "text-[#C5A36B] font-bold" : "text-white/65"}`}
          >
            Consultation
          </button>
          <button
            id="nav-weightloss-tab"
            onClick={() => {
              setActiveTab("WeightLoss");
              setTimeout(() => {
                document.getElementById("weight-loss-section")?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
            className={`hover:text-[#C5A36B] transition cursor-pointer ${activeTab === "WeightLoss" ? "text-[#C5A36B] font-bold" : "text-white/65"}`}
          >
            Weight Loss
          </button>
          <button
            id="nav-diseases-tab"
            onClick={() => {
              setActiveTab("Diseases");
              // Smooth scroll to clinical treatises
              setTimeout(() => {
                document.getElementById("diseases-section")?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
            className={`hover:text-[#C5A36B] transition cursor-pointer ${activeTab === "Diseases" ? "text-[#C5A36B] font-bold" : "text-white/65"}`}
          >
            Disease Treatises
          </button>
          <button
            id="nav-library-tab"
            onClick={() => {
              setActiveTab("Library");
              // Smooth scroll to library
              setTimeout(() => {
                document.getElementById("library-section")?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
            className={`hover:text-[#C5A36B] transition cursor-pointer ${activeTab === "Library" ? "text-[#C5A36B] font-bold" : "text-white/65"}`}
          >
            Herb Library
          </button>
          <button
            id="nav-habits-tab"
            onClick={() => {
              setActiveTab("SattvaHabits");
              // Smooth scroll to habits counseling
              setTimeout(() => {
                document.getElementById("sattva-habits-section")?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
            className={`hover:text-[#C5A36B] transition cursor-pointer ${activeTab === "SattvaHabits" ? "text-[#C5A36B] font-bold" : "text-white/65"}`}
          >
            Sattva Habits
          </button>
          <button
            id="nav-ayurbot-tab"
            onClick={() => {
              setActiveTab("AyurBot");
              setTimeout(() => {
                document.getElementById("ayurbot-container")?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
            className={`hover:text-[#C5A36B] transition cursor-pointer ${activeTab === "AyurBot" ? "text-[#C5A36B] font-bold" : "text-white/65"}`}
          >
            Ask AyurBot
          </button>
          <button
            id="nav-academic-tab"
            onClick={() => {
              setActiveTab("Academic");
              setTimeout(() => {
                document.getElementById("academic-section")?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
            className={`hover:text-[#C5A36B] transition cursor-pointer flex items-center gap-1.5 ${activeTab === "Academic" ? "text-[#C5A36B] font-bold" : "text-white/65"}`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A36B] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C5A36B]"></span>
            </span>
            <span>📋 Functions</span>
          </button>
          <button
            id="nav-profile-tab"
            onClick={() => {
              if (!currentUser) {
                setAuthModalMode("login");
                setIsAuthModalOpen(true);
              } else {
                setActiveTab("Profile");
                setTimeout(() => {
                  document.getElementById("profile-section-container")?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }
            }}
            className={`hover:text-[#C5A36B] transition cursor-pointer flex items-center gap-1 ${activeTab === "Profile" ? "text-[#C5A36B] font-bold" : "text-white/65"}`}
          >
            {currentUser ? (
              <>
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-0.5"></span>
                <span>👤 {currentUser.name.split(" ")[0]}</span>
              </>
            ) : (
              "Sign In"
            )}
          </button>

          {isOwnerEmail(currentUser?.email) && (
            <button
              id="nav-project-verification-btn"
              onClick={() => setIsVerificationModalOpen(true)}
              className="hover:bg-[#C5A36B] hover:text-black transition cursor-pointer text-[#C5A36B] border border-[#C5A36B]/45 rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A36B] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C5A36B]"></span>
              </span>
              <span>🎓 Project Seal</span>
            </button>
          )}
          
          <a
            href="#prakriti-quiz"
            className="hidden md:inline text-white/50 hover:text-[#C5A36B] transition"
          >
            Dosha Quiz
          </a>
        </div>
      </nav>

      {/* Floating System-Alert Toast */}
      <AnimatePresence>
        {showApplyToast && (
          <motion.div
            initial={{ opacity: 0, y: -45, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
            className="fixed top-6 right-6 z-50 max-w-sm bg-black/95 border border-[#C5A36B] p-4 rounded-2xl flex items-center gap-3 backdrop-blur-xl shadow-2xl shadow-black/80"
          >
            <div className="w-8 h-8 rounded-full bg-[#C5A36B]/20 flex items-center justify-center border border-[#C5A36B]/30 flex-shrink-0">
              <Sparkles className="w-4 h-4 text-[#C5A36B]" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#C5A36B]">Clinical Context Applied</p>
              <p className="text-xs text-[#F2EBE4] mt-0.5 font-sans">
                Form configured with <strong>{showApplyToast}</strong> guidelines. Core indicators pre-populated.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Layout */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 md:px-12 py-8 space-y-12">
        {/* Dedicated Persistent Accessibility Dashboard */}
        <AccessibilityDashboard
          fontSize={fontSize}
          setFontSize={setFontSize}
          highContrast={highContrast}
          setHighContrast={setHighContrast}
          dyslexiaFont={dyslexiaFont}
          setDyslexiaFont={setDyslexiaFont}
          recommendationResult={recommendationResult}
          onVoiceCapture={startVoiceCapture}
        />

        {/* Intro Atmosphere Segment */}
        <div className="text-center md:text-left max-w-3xl py-4 space-y-4">
          {activeTab === "Consult" && (
            <>
              <span className="text-[10px] md:text-xs font-bold tracking-widest text-[#C5A36B] uppercase bg-[#C5A36B]/10 border border-[#C5A36B]/20 px-3 py-1.5 rounded-full inline-block">
                Traditional wisdom meets modern diagnostics
              </span>
              <h1 className="text-4xl md:text-6xl font-serif leading-tight text-[#F2EBE4]">
                Reveal your path to <span className="text-[#C5A36B] italic font-semibold">equilibrium</span>.
              </h1>
              <p className="text-sm md:text-base text-[#E0D8D0]/75 leading-relaxed max-w-2xl">
                Identify your symptoms and mental state to receive custom Ayurvedic herb profiles, traditional preparations (Anupana), tailored dietary restrictions (Ahar), and kinetic yoga routines (Vihar).
              </p>
            </>
          )}

          {activeTab === "WeightLoss" && (
            <>
              <span className="text-[10px] md:text-xs font-bold tracking-widest text-[#C5A36B] uppercase bg-[#C5A36B]/10 border border-[#C5A36B]/20 px-3 py-1.5 rounded-full inline-block">
                Kapha balancing & Agni Enkindling science
              </span>
              <h1 className="text-4xl md:text-6xl font-serif leading-tight text-[#F2EBE4]">
                Stoke your digestive <span className="text-[#C5A36B] italic font-semibold">metabolism</span>.
              </h1>
              <p className="text-sm md:text-base text-[#E0D8D0]/75 leading-relaxed max-w-2xl">
                A structured 30-day program of warm herbal boosters, light Sattvic meal guidelines, and Kapalabhati breathing designed to eliminate sticky fat tissue (Medas Dhatu).
              </p>
            </>
          )}

          {activeTab === "Diseases" && (
            <>
              <span className="text-[10px] md:text-xs font-bold tracking-widest text-[#C5A36B] uppercase bg-[#C5A36B]/10 border border-[#C5A36B]/20 px-3 py-1.5 rounded-full inline-block">
                Siddhantas of Charaka & Sushruta Samhita
              </span>
              <h1 className="text-4xl md:text-6xl font-serif leading-tight text-[#F2EBE4]">
                Authentic Disease <span className="text-[#C5A36B] italic font-semibold">Treatises</span>.
              </h1>
              <p className="text-sm md:text-base text-[#E0D8D0]/75 leading-relaxed max-w-2xl">
                Examine long-standing pathology outlines, doshic origins (Nidana), tissue depth (Dhatu), and core herbal prescriptions for chronic systemic imbalances.
              </p>
            </>
          )}

          {activeTab === "Library" && (
            <>
              <span className="text-[10px] md:text-xs font-bold tracking-widest text-[#C5A36B] uppercase bg-[#C5A36B]/10 border border-[#C5A36B]/20 px-3 py-1.5 rounded-full inline-block">
                Vedic Dravyaguna Guna & Virya encyclopedia
              </span>
              <h1 className="text-4xl md:text-6xl font-serif leading-tight text-[#F2EBE4]">
                The Herb <span className="text-[#C5A36B] italic font-semibold">Encyclopedia</span>.
              </h1>
              <p className="text-sm md:text-base text-[#E0D8D0]/75 leading-relaxed max-w-2xl">
                Explore individual single herbs, their sanskrit classifications, energetic tastes (Rasa), thermal potencies (Virya), and specific safety precautions.
              </p>
            </>
          )}

          {activeTab === "SattvaHabits" && (
            <>
              <span className="text-[10px] md:text-xs font-bold tracking-widest text-[#C5A36B] uppercase bg-[#C5A36B]/10 border border-[#C5A36B]/20 px-3 py-1.5 rounded-full inline-block">
                Sattvavajaya Chikitsa (Psychological balance)
              </span>
              <h1 className="text-4xl md:text-6xl font-serif leading-tight text-[#F2EBE4]">
                Cognitive Habit <span className="text-[#C5A36B] italic font-semibold">Sadhana</span>.
              </h1>
              <p className="text-sm md:text-base text-[#E0D8D0]/75 leading-relaxed max-w-2xl">
                Engage in interactive mental wellness counseling. Converse with the Veda Sattva counselor to cultivate psychological tranquility and resolve mental blockages.
              </p>
            </>
          )}

          {activeTab === "Profile" && (
            <>
              <span className="text-[10px] md:text-xs font-bold tracking-widest text-[#C5A36B] uppercase bg-[#C5A36B]/10 border border-[#C5A36B]/20 px-3 py-1.5 rounded-full inline-block">
                Personalized holistic cloud portal
              </span>
              <h1 className="text-4xl md:text-6xl font-serif leading-tight text-[#F2EBE4]">
                My Healing <span className="text-[#C5A36B] italic font-semibold">VedaProfile</span>.
              </h1>
              <p className="text-sm md:text-base text-[#E0D8D0]/75 leading-relaxed max-w-2xl">
                Manage your saved consultations, track therapeutic progress, keep customizable daily wellness notebooks, and oversee account security details.
              </p>
            </>
          )}

          {activeTab === "AyurBot" && (
            <>
              <span className="text-[10px] md:text-xs font-bold tracking-widest text-[#C5A36B] uppercase bg-[#C5A36B]/10 border border-[#C5A36B]/20 px-3 py-1.5 rounded-full inline-block">
                Resolve all your Ayurvedic & Wellness doubts
              </span>
              <h1 className="text-4xl md:text-6xl font-serif leading-tight text-[#F2EBE4]">
                Ask Vaidya <span className="text-[#C5A36B] italic font-semibold">Acharya Veda</span>.
              </h1>
              <p className="text-sm md:text-base text-[#E0D8D0]/75 leading-relaxed max-w-2xl">
                A multi-turn companion to clear any confusion about doshas, digestive fires (Agni), cellular toxicity (Ama), daily routines (Dinacharya), or specific herbs.
              </p>
            </>
          )}

          {activeTab === "Academic" && (
            <>
              <span className="text-[10px] md:text-xs font-bold tracking-widest text-[#C5A36B] uppercase bg-[#C5A36B]/10 border border-[#C5A36B]/20 px-3 py-1.5 rounded-full inline-block">
                Interactive Capability Index
              </span>
              <h1 className="text-4xl md:text-6xl font-serif leading-tight text-[#F2EBE4]">
                Website <span className="text-[#C5A36B] italic font-semibold">Functions</span>.
              </h1>
              <p className="text-sm md:text-base text-[#E0D8D0]/75 leading-relaxed max-w-2xl">
                Explore the complete interactive index of VedaScan's modular capabilities, software algorithms, and system integrations.
              </p>
            </>
          )}
        </div>

        {/* Interactive Workspace Grid */}
        {activeTab === "Consult" && (
          <div id="consult-section-header" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form Intake (Spans 5 Columns in standard desktop layout) */}
          <div className="lg:col-span-5 space-y-6">
            <form onSubmit={handleGenerateRecommendation} className="p-6 md:p-8 rounded-[32px] bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div>
                  <h3 className="text-sm font-bold text-[#F2EBE4] tracking-wide uppercase">Intake Questionnaire</h3>
                  <p className="text-[11px] text-white/40">Select physical/mental markers</p>
                </div>
                {selectedSymptoms.length > 0 && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-[10px] text-white/40 hover:text-red-400 flex items-center gap-1 transition uppercase cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" /> Clear
                  </button>
                )}
              </div>

              {/* 1. Quick Checklist Symptoms */}
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest text-[#C5A36B] font-bold block">
                  1. Current Symptoms & States
                </label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {COMMON_SYMPTOMS.map((symptom) => {
                    const isSelected = selectedSymptoms.includes(symptom);
                    return (
                      <button
                        type="button"
                        key={symptom}
                        onClick={() => toggleSymptom(symptom)}
                        className={`text-xs px-3 py-2 rounded-full transition-all duration-250 border focus:outline-none flex items-center gap-1 cursor-pointer ${
                          isSelected
                            ? "bg-[#C5A36B]/20 border-[#C5A36B] text-[#F2EBE4] font-medium"
                            : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {symptom}
                        {isSelected && <Check className="w-3 h-3 text-[#C5A36B] inline ml-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Custom Story Intake */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase tracking-widest text-[#C5A36B] font-bold block" htmlFor="custom-details">
                    2. Conversational Symptoms AI
                  </label>
                  
                  <button
                    type="button"
                    onClick={startVoiceCapture}
                    className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full flex items-center gap-1.5 transition cursor-pointer ${
                      isListening 
                        ? "bg-red-500/20 text-red-300 border border-red-500/35 animate-pulse" 
                        : "bg-[#C5A36B]/15 text-[#C5A36B] border border-[#C5A36B]/25 hover:bg-[#C5A36B]/25"
                    }`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-3 h-3" /> Listening...
                      </>
                    ) : (
                      <>
                        <Mic className="w-3 h-3" /> Speak Symptoms
                      </>
                    )}
                  </button>
                </div>

                <div className="relative">
                  <textarea
                    id="custom-details"
                    rows={3}
                    className="w-full bg-black/45 border border-white/10 rounded-2xl p-3 text-xs text-[#F2EBE4] placeholder-white/30 focus:outline-none focus:border-[#C5A36B]/50 transition pr-10"
                    placeholder="Type or speak symptoms in conversational language (e.g., 'I've been feeling extremely fatigued with acidic heartburn after eating for the last two weeks')"
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleNlpExtract}
                    disabled={nlpLoading || !customDescription.trim()}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl py-2 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
                  >
                    {nlpLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C5A36B]" />
                        <span>AI Parsing...</span>
                      </>
                    ) : (
                      <>
                        <Brain className="w-3.5 h-3.5 text-[#C5A36B]" />
                        <span>Analyze & Auto-Extract Symptoms</span>
                      </>
                    )}
                  </button>
                </div>

                {/* NLP Golden results card */}
                <AnimatePresence>
                  {nlpResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="p-4 bg-[#C5A36B]/5 border border-[#C5A36B]/30 rounded-2xl space-y-3"
                    >
                      <div className="flex items-center gap-1.5 pb-1.5 border-b border-[#C5A36B]/20">
                        <Sparkles className="w-4 h-4 text-[#C5A36B]" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A36B]">
                          Vedic NLP Extraction Results
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <p className="text-[11px] text-[#E0D8D0]/80 italic">
                          "{nlpResult.analysis}"
                        </p>
                        
                        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                          <div className="bg-black/30 p-2 rounded-lg border border-white/5">
                            <span className="text-white/40 block text-[9px] uppercase">Symptoms Checked</span>
                            <span className="text-[#F2EBE4] font-semibold">
                              {nlpResult.symptoms.length > 0 ? nlpResult.symptoms.join(", ") : "None detected"}
                            </span>
                          </div>
                          <div className="bg-black/30 p-2 rounded-lg border border-white/5">
                            <span className="text-white/40 block text-[9px] uppercase">Diagnostics</span>
                            <span className="text-[#F2EBE4] font-semibold">
                              {nlpResult.severity} • {nlpResult.duration}
                            </span>
                          </div>
                        </div>

                        {nlpResult.diseaseContext && (
                          <div className="text-[10px] bg-[#C5A36B]/10 px-2 py-1 rounded border border-[#C5A36B]/20 inline-block">
                            📌 Identified Condition: <strong>{nlpResult.diseaseContext}</strong>
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={applyNlpResult}
                        className="w-full bg-[#C5A36B] hover:bg-[#C5A36B]/85 text-black font-bold py-2 rounded-xl transition text-[11px] uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer min-h-[32px]"
                      >
                        <Check className="w-3.5 h-3.5" /> Apply Extracted Symptoms to Intake Form
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 3. Diagnosed Medical/Chronic Context */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-[#C5A36B] font-bold block" htmlFor="chronic-disease">
                  3. Known Diagnoses or Diseases (e.g. Arthritis, Acid Reflux)
                </label>
                <input
                  id="chronic-disease"
                  type="text"
                  className="w-full bg-black/45 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-[#F2EBE4] placeholder-white/30 focus:outline-none focus:border-[#C5A36B]/50 transition"
                  placeholder="e.g. Rheumatoid Arthritis, Acid Reflux, Asthma, Chronic Insomnia"
                  value={diseaseContext}
                  onChange={(e) => setDiseaseContext(e.target.value)}
                />
              </div>

              {/* 4. Prakriti Mini-assessment Quiz */}
              <div id="prakriti-quiz" className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-4">
                <div className="flex items-center gap-2 pb-1.5 border-b border-white/5">
                  <Compass className="w-4 h-4 text-[#C5A36B]" />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#F2EBE4]">
                    Dosha Prakriti Self-Check
                  </span>
                </div>

                {/* Energy states */}
                <div className="space-y-1">
                  <label className="text-[10px] text-[#E0D8D0]/60 block">Energy & Stamina:</label>
                  <select
                    className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs text-[#F2EBE4]/95 focus:outline-none"
                    value={doshaAnswers.energy}
                    onChange={(e) => setDoshaAnswers({ ...doshaAnswers, energy: e.target.value })}
                  >
                    <option value="Fluctuating, bursts of high energy then exhaustion (Vata)">Fluctuating, bursts of high energy then exhaustion (Vata)</option>
                    <option value="Intense, focused, goal-driven, easily overheated (Pitta)">Intense, focused, goal-driven, easily overheated (Pitta)</option>
                    <option value="Steady, high stamina, slow to start, dislikes cold/damp (Kapha)">Steady, high stamina, slow to start, dislikes cold/damp (Kapha)</option>
                  </select>
                </div>

                {/* Appetite states */}
                <div className="space-y-1">
                  <label className="text-[10px] text-[#E0D8D0]/60 block">Appetite & Digestion style:</label>
                  <select
                    className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs text-[#F2EBE4]/95 focus:outline-none"
                    value={doshaAnswers.digestion}
                    onChange={(e) => setDoshaAnswers({ ...doshaAnswers, digestion: e.target.value })}
                  >
                    <option value="Irregular, frequent gas, bloating, variable appetite (Vata)">Irregular, frequent gas, bloating, variable appetite (Vata)</option>
                    <option value="Strong, rapid, hyper-acidic, cannot skip meals (Pitta)">Strong, rapid, hyper-acidic, cannot skip meals (Pitta)</option>
                    <option value="Slow, heavy feel after meals, sluggish bowel movements (Kapha)">Slow, heavy feel after meals, sluggish digestion (Kapha)</option>
                  </select>
                </div>

                {/* Sleep habits */}
                <div className="space-y-1">
                  <label className="text-[10px] text-[#E0D8D0]/60 block">Sleep Pattern:</label>
                  <select
                    className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs text-[#F2EBE4]/95 focus:outline-none"
                    value={doshaAnswers.sleep}
                    onChange={(e) => setDoshaAnswers({ ...doshaAnswers, sleep: e.target.value })}
                  >
                    <option value="Light, easily disrupted, active dreams, prone to worry (Vata)">Light, easily disrupted, active dreams (Vata)</option>
                    <option value="Moderate length, wakes hot, intense dreams (Pitta)">Moderate length, wakes hot, intense/vivid dreams (Pitta)</option>
                    <option value="Deep, heavy, long hours, hard to wake up (Kapha)">Deep, heavy, long hours, hard to wake up (Kapha)</option>
                  </select>
                </div>

                {/* Skin hair characteristics */}
                <div className="space-y-1">
                  <label className="text-[10px] text-[#E0D8D0]/60 block">Skin & Hair Texture:</label>
                  <select
                    className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs text-[#F2EBE4]/95 focus:outline-none"
                    value={doshaAnswers.skin}
                    onChange={(e) => setDoshaAnswers({ ...doshaAnswers, skin: e.target.value })}
                  >
                    <option value="Dry, cool, thin, prone to cracking, dry scalp (Vata)">Dry, cool, thin, dry scalp (Vata)</option>
                    <option value="Warm, sensitive, prone to redness, early gray/balding (Pitta)">Warm, sensitive, early graying or thin (Pitta)</option>
                    <option value="Thick, oily, cool, smooth, shiny hair (Kapha)">Thick, oily, cool, smooth, shiny hair (Kapha)</option>
                  </select>
                </div>

                {/* Stress reactions */}
                <div className="space-y-1">
                  <label className="text-[10px] text-[#E0D8D0]/60 block">Mental Reaction to Stress:</label>
                  <select
                    className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs text-[#F2EBE4]/95 focus:outline-none"
                    value={doshaAnswers.stress}
                    onChange={(e) => setDoshaAnswers({ ...doshaAnswers, stress: e.target.value })}
                  >
                    <option value="Anxiety, fear, overthinking, restless mind (Vata)">Anxiety, fear, overthinking, restless mind (Vata)</option>
                    <option value="Irritability, anger, frustration, impatient under load (Pitta)">Irritability, anger, impatient (Pitta)</option>
                    <option value="Withdrawn, stubborn, calm but attaches to comfort (Kapha)">Withdrawn, stubborn, calm (Kapha)</option>
                  </select>
                </div>
              </div>

              {/* 5. Metrics: Severity & Duration Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-[#C5A36B] font-bold block">
                    Severity
                  </label>
                  <select
                    className="w-full bg-black border border-white/10 rounded-xl p-2.5 text-xs text-[#F2EBE4]/90 focus:outline-none"
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                  >
                    <option value="Mild">Mild / Preventive</option>
                    <option value="Moderate">Moderate / Recurrent</option>
                    <option value="Chronic">Chronic / Entrenched</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-[#C5A36B] font-bold block">
                    Duration
                  </label>
                  <select
                    className="w-full bg-black border border-white/10 rounded-xl p-2.5 text-xs text-[#F2EBE4]/90 focus:outline-none"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  >
                    <option value="A few days">A few days</option>
                    <option value="Weeks">Weeks</option>
                    <option value="Months or Years">Months or Years</option>
                  </select>
                </div>
              </div>

              {/* Gender & Age demographic filters */}
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-[#C5A36B] font-bold block">
                    Age Group
                  </label>
                  <select
                    className="w-full bg-black border border-white/10 rounded-xl p-2.5 text-xs text-[#F2EBE4]/90 focus:outline-none"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  >
                    <option value="Child (under 12)">Child (under 12)</option>
                    <option value="Teen (12-18)">Teen (12-18)</option>
                    <option value="Adult (18-60)">Adult (18-60)</option>
                    <option value="Elderly (60+)">Elderly (60+)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-[#C5A36B] font-bold block">
                    Identity
                  </label>
                  <select
                    className="w-full bg-black border border-white/10 rounded-xl p-2.5 text-xs text-[#F2EBE4]/90 focus:outline-none"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              {/* Submit CTA button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#C5A36B] to-[#b3905b] text-black font-semibold uppercase text-xs tracking-wider py-4 rounded-2xl hover:shadow-[0_0_20px_rgba(197,163,107,0.35)] transition duration-300 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Analyzing Prakriti...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>Generate Healing Protocol</span>
                  </>
                )}
              </button>

            </form>

            {/* Constitution Fast Facts Badge card */}
            <div className="p-6 rounded-[28px] bg-gradient-to-br from-[#1A1F1C] to-[#0A0C0B] border border-white/5 flex items-center justify-between shadow-lg">
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-widest text-[#C5A36B]">Current Active Profiler Map</span>
                <div className="text-xl font-serif text-[#F2EBE4] font-medium flex items-center gap-2">
                  <span>Tridosha Analysis</span>
                  <span className="text-xs text-[#C5A36B] bg-[#C5A36B]/15 px-2 py-0.5 rounded-full font-sans">Active</span>
                </div>
                <p className="text-[11px] text-[#E0D8D0]/60 max-w-xs">
                  Your inputs weigh physical attributes to dynamically balance Vata, Pitta, and Kapha currents.
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#C5A36B]/15 border border-[#C5A36B]/30 flex items-center justify-center">
                <Activity className="w-5 h-5 text-[#C5A36B]" />
              </div>
            </div>

          </div>

          {/* Right Column: Intelligent Recommendations output/Interactive loading (Spans 7 Columns in desktop) */}
          <div className="lg:col-span-7 flex flex-col gap-6 h-full">
            
            <AnimatePresence mode="wait">
              {/* Scenario A: Loading state */}
              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white/[0.02] border border-white/10 rounded-[40px] p-12 text-center flex flex-col items-center justify-center min-h-[500px]"
                >
                  <div className="w-20 h-20 border-2 border-dashed border-[#C5A36B] rounded-full animate-spin flex items-center justify-center mb-8">
                    <Activity className="w-8 h-8 text-[#C5A36B] animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-serif text-[#F2EBE4] italic">Consulting Ancient Sastra Literature</h3>
                  <p className="text-xs text-[#E0D8D0]/70 max-w-md mt-4 leading-relaxed">
                    Analyzing Charaka Samhita and Sushruta Samhita with the dynamic engine. We are matching physical symptoms and Prakriti markers to calculate perfect herb ratios...
                  </p>
                  <div className="mt-8 flex gap-2 items-center text-[10px] uppercase tracking-widest text-[#C5A36B] font-bold bg-[#C5A36B]/10 px-3 py-1.5 rounded-full">
                    <Activity className="w-3.5 h-3.5 animate-bounce" /> Processing active biofields
                  </div>
                </motion.div>
              )}

              {/* Scenario B: Recommendation has been successfully generated */}
              {!loading && recommendationResult && (
                <motion.div
                  id="recommendation-result-panel"
                  key="result"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 85 }}
                  className="p-8 md:p-10 rounded-[38px] bg-white/[0.03] border border-white/10 backdrop-blur-2xl relative overflow-hidden"
                >
                  {/* Decorative corner mandala pattern */}
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none select-none">
                    <svg width="240" height="240" viewBox="0 0 100 100" className="text-[#C5A36B]">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.7" strokeDasharray="3 5" />
                      <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
                      <path d="M 50 2 L 50 98 M 2 50 L 98 50 M 16 16 L 84 84 M 16 84 L 84 16" stroke="currentColor" strokeWidth="0.4" />
                    </svg>
                  </div>

                  {/* History switch bar inside report */}
                  {savedConsultations.length > 0 && (
                    <div className="mb-6 bg-black/25 border border-white/5 p-3 rounded-2xl flex flex-wrap items-center gap-2 text-xs relative z-10 select-none">
                      <span className="text-[9px] uppercase tracking-wider text-[#C5A36B] font-bold flex items-center gap-1 px-1">
                        <History className="w-3.5 h-3.5 text-[#C5A36B]" /> Past Reports:
                      </span>
                      <div className="flex flex-wrap gap-1.5 flex-1 min-w-[200px]">
                        {savedConsultations.map((consult) => {
                          const isActive = consult.result.dominantDoshaAnalysis === recommendationResult.dominantDoshaAnalysis && consult.result.holisticSummary === recommendationResult.holisticSummary;
                          return (
                            <div key={consult.id} className="relative flex items-center group">
                              <button
                                onClick={() => handleSelectSavedConsultation(consult)}
                                className={`px-2.5 py-1 rounded-xl text-[10px] transition-all duration-200 cursor-pointer flex items-center gap-1 ${
                                  isActive
                                    ? "bg-[#C5A36B] text-black font-semibold shadow-md shadow-[#C5A36B]/10"
                                    : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/5"
                                }`}
                              >
                                <span>{consult.timestamp}</span>
                                <span className="opacity-50 text-[9px]">
                                  ({consult.diseaseContext ? consult.diseaseContext.substring(0, 8) + "..." : consult.symptoms.slice(0, 1).join("") || "General"})
                                </span>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Header info bar */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-white/10 pb-6 relative z-10">
                    <div className="space-y-1">
                      <h2 className="text-[10px] uppercase tracking-widest text-[#C5A36B] font-bold">
                        AI Vaidya Diagnostics Report
                      </h2>
                      <p className="text-3xl font-serif text-[#F2EBE4] font-medium">
                        Custom Balanced Therapy
                      </p>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-2">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={handleDownloadPDF}
                          className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 text-[#F2EBE4] hover:text-[#C5A36B] text-[10px] font-bold rounded-lg tracking-wider uppercase transition flex items-center gap-1.5 cursor-pointer shadow-sm hover:border-[#C5A36B]/40"
                          title="Download personalized Ayurvedic protocol as a PDF document for offline reference"
                          id="btn-download-pdf-report"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download PDF</span>
                        </button>
                        <div className="px-3.5 py-1.5 bg-[#C5A36B] text-black text-[10px] font-bold rounded-lg tracking-widest uppercase select-none">
                          TRIDOSHA PROTOCOL
                        </div>
                      </div>
                      <span className="text-[10px] text-white/40">Authentic Traditional Safe Recommendation</span>
                    </div>
                  </div>

                  {/* Warning label if fallback loaded */}
                  {recommendationResult.warning && (
                    <div className="mb-6 bg-amber-500/10 border border-amber-500/20 px-4 py-3 rounded-2xl flex items-start gap-2 text-xs text-amber-200">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-400 mt-0.5" />
                      <span>{recommendationResult.warning}</span>
                    </div>
                  )}

                  {/* Detailed Analysis Blocks */}
                  <div className="space-y-8 relative z-10">
                    
                    {/* 1. Dominant Dosha Explanation */}
                    <div className="space-y-2">
                      <h3 className="text-xs uppercase tracking-widest text-[#C5A36B] font-bold flex items-center gap-1.5">
                        <Compass className="w-4 h-4" /> 1. Dosha Aggravation Analysis
                      </h3>
                      <p className="text-[#E0D8D0] text-sm leading-relaxed bg-black/35 p-5 rounded-2xl border border-white/5 font-serif italic">
                        "{recommendationResult.dominantDoshaAnalysis}"
                      </p>
                    </div>

                    {/* 2. Holistic Action Plan */}
                    <div className="space-y-2">
                      <h3 className="text-xs uppercase tracking-widest text-[#C5A36B] font-bold">
                        2. Holistic Healing Summary
                      </h3>
                      <p className="text-xs text-[#E0D8D0]/85 leading-relaxed">
                        {recommendationResult.holisticSummary}
                      </p>
                    </div>

                    {/* 3. Personalized Medicine Combinations */}
                    <div className="space-y-3">
                      <h3 className="text-xs uppercase tracking-widest text-[#C5A36B] font-bold flex items-center gap-1.5">
                        <Leaf className="w-4 h-4" /> 3. Recommended Herbal Formulations & Herbs
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recommendationResult.medicines.map((med, index) => (
                          <div
                            key={index}
                            onClick={() => {
                              setSelectedMedicine({
                                name: med.name,
                                dosageInstructions: med.dosageInstructions,
                                safetyNotes: med.safetyNotes
                              });
                              setShowMedicineDeals(false);
                            }}
                            className="bg-black/45 p-5 rounded-2xl border border-white/5 hover:border-[#C5A36B]/35 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
                          >
                            <div className="space-y-2">
                              <span className="text-[9px] font-bold bg-[#C5A36B]/15 text-[#C5A36B] border border-[#C5A36B]/20 px-2 py-0.5 rounded">
                                {med.type}
                              </span>
                              <h4 className="text-base font-serif text-[#F2EBE4] font-bold group-hover:text-[#C5A36B] transition-colors">
                                {med.name}
                              </h4>
                              <p className="text-[10px] text-white/40 italic">
                                Sanskrit text: {med.sanskritName}
                              </p>
                              <p className="text-xs text-[#E0D8D0]/80 leading-relaxed pt-1">
                                {med.benefits}
                              </p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-white/5">
                              <button
                                className="w-full bg-[#C5A36B]/10 group-hover:bg-[#C5A36B] text-[#C5A36B] group-hover:text-black border border-[#C5A36B]/30 font-semibold px-2.5 py-2 rounded-xl transition duration-300 flex items-center justify-center gap-1.5 text-xs text-center"
                              >
                                <ShoppingBag className="w-3.5 h-3.5" /> Buy on Flipkart
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 4. Dietary Protocols (Ahar) */}
                    <div className="space-y-3 bg-[#C5A36B]/5 border border-[#C5A36B]/10 p-6 rounded-[28px]">
                      <h3 className="text-xs uppercase tracking-widest text-[#C5A36B] font-bold flex items-center gap-1.5">
                        <UtensilsCrossed className="w-4 h-4 text-[#C5A36B]" /> 4. Traditional Dietary Regimen (Ahar)
                      </h3>
                      
                      <p className="text-xs text-[#E0D8D0]/80 leading-relaxed mb-3">
                        {recommendationResult.dietaryRecommendations.explanation}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Foods to Favor */}
                        <div className="bg-emerald-950/15 border border-emerald-900/15 p-4 rounded-xl">
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-2">
                            Foods & Spices to Favor (Pathya)
                          </h4>
                          <ul className="space-y-1.5">
                            {recommendationResult.dietaryRecommendations.toFavor.map((food, i) => (
                              <li key={i} className="text-xs flex items-start gap-1.5 text-emerald-200/85">
                                <span className="text-emerald-400">✓</span>
                                <span>{food}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Foods to Avoid */}
                        <div className="bg-red-950/15 border border-red-900/15 p-4 rounded-xl">
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-red-400 mb-2">
                            Apathya (Items & Habits to Avoid)
                          </h4>
                          <ul className="space-y-1.5">
                            {recommendationResult.dietaryRecommendations.toAvoid.map((food, i) => (
                              <li key={i} className="text-xs flex items-start gap-1.5 text-red-200/80">
                                <span className="text-red-400">×</span>
                                <span>{food}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* 5. Lifestyle modifications & Yoga (Vihar) */}
                    <div className="space-y-4 pt-1.5 border-t border-white/5">
                      <h3 className="text-xs uppercase tracking-widest text-[#C5A36B] font-bold flex items-center gap-1.5">
                        <Bookmark className="w-4 h-4 text-[#C5A36B]" /> 5. Dinacharya Habits & Stretches (Vihar)
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Yoga Postures */}
                        <div className="bg-[#181d1a] border border-white/5 p-4 rounded-xl">
                          <h4 className="text-[9px] font-bold uppercase tracking-widest text-amber-300 mb-2">
                            YOGA ASANAS
                          </h4>
                          <ul className="space-y-2">
                            {recommendationResult.lifestyleRecommendations.yogaAsanas.map((pose, i) => (
                              <li key={i} className="text-xs text-white/80 leading-relaxed font-serif italic">
                                • {pose}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Breathing */}
                        <div className="bg-[#181d1a] border border-white/5 p-4 rounded-xl">
                          <h4 className="text-[9px] font-bold uppercase tracking-widest text-amber-300 mb-2">
                            BREATHING (PRANAYAMA)
                          </h4>
                          <ul className="space-y-2">
                            {recommendationResult.lifestyleRecommendations.breathingExercises.map((ex, i) => (
                              <li key={i} className="text-xs text-white/80 leading-relaxed">
                                {ex}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Habits Tips */}
                        <div className="bg-[#181d1a] border border-white/5 p-4 rounded-xl">
                          <h4 className="text-[9px] font-bold uppercase tracking-widest text-amber-300 mb-2">
                            DAILY WELLNESS HINTS
                          </h4>
                          <ul className="space-y-2">
                            {recommendationResult.lifestyleRecommendations.lifestyleTips.map((tip, i) => (
                              <li key={i} className="text-xs text-white/85 leading-relaxed flex items-start gap-1">
                                <span className="text-[#C5A36B]">✦</span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex flex-wrap justify-center gap-3 pt-4">
                        <button
                          onClick={() => setShowPrescriptionSync(true)}
                          id="sync-prescription-calendar-btn"
                          className="py-2.5 px-6 rounded-2xl bg-[#C5A36B]/10 hover:bg-[#C5A36B] text-[#C5A36B] hover:text-black font-semibold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 border border-[#C5A36B]/30 hover:border-transparent cursor-pointer min-h-[44px]"
                        >
                          <CalendarPlus className="w-4.5 h-4.5" />
                          <span>Sync Routines to Calendar</span>
                        </button>

                        <button
                          onClick={handleSaveConsultationToProfile}
                          id="save-remedy-profile-btn"
                          className="py-2.5 px-6 rounded-2xl bg-[#C5A36B] hover:bg-[#C5A36B]/85 text-black font-semibold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
                        >
                          <Bookmark className="w-4.5 h-4.5" />
                          <span>{currentUser ? "Save to My Profile" : "Login & Save to Profile"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="bg-white/5 border border-white/5 p-4 rounded-xl text-[11px] text-white/45 leading-relaxed text-center">
                      Disclaimer: This reports recommendations represent informational traditional remedies (Charaka Samhita). It is not diagnostic and cannot replace an in-person diagnostic pulse analysis with a licensed Ayurvedic Practitioner (BAMS) or standard MD. Restrict if pregnant and consult your provider before beginning any treatment.
                    </div>

                  </div>
                </motion.div>
              )}

              {/* Scenario C: Initial / Welcome State */}
              {!loading && !recommendationResult && (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-10 rounded-[40px] bg-white/[0.02] border border-white/5 backdrop-blur-2xl flex flex-col justify-center items-center text-center space-y-6 h-full min-h-[500px]"
                >
                  <div className="w-16 h-16 border border-[#C5A36B]/40 rounded-full flex items-center justify-center bg-[#C5A36B]/5">
                    <Leaf className="w-6 h-6 text-[#C5A36B]" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-3xl font-serif text-[#F2EBE4]">Waiting for intake details...</h2>
                    <p className="text-xs text-[#E0D8D0]/60 max-w-md mx-auto leading-relaxed">
                      Select your symptoms, complete the mini-profile self-test questionnaire on the left, and click "Generate Healing Protocol" to receive your real-time formulation suggestions.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 max-w-sm pt-2">
                    <div className="bg-black/30 p-4 rounded-2xl border border-white/5 text-left text-xs space-y-1">
                      <span className="text-[#C5A36B] font-serif font-semibold text-sm">Dravyaguna science</span>
                      <p className="text-white/45 text-[10px]">Herbs are categorized by taste (Rasa) and potency (Virya) to counter tissue hotness.</p>
                    </div>
                    <div className="bg-black/30 p-4 rounded-2xl border border-white/5 text-left text-xs space-y-1">
                      <span className="text-[#C5A36B] font-serif font-semibold text-sm">Agni Enkindling</span>
                      <p className="text-white/45 text-[10px]">Aimed at clearing cellular toxins (Ama) and supporting colon absorption pathways.</p>
                    </div>
                  </div>

                  {/* Past Saved Consultations List */}
                  {savedConsultations.length > 0 && (
                    <div className="w-full max-w-md pt-6 border-t border-white/5 space-y-3">
                      <div className="flex items-center justify-center gap-1.5 text-[9px] uppercase tracking-widest text-[#C5A36B] font-bold">
                        <History className="w-3.5 h-3.5" />
                        <span>Revisit Past Consultations</span>
                      </div>
                      <div className="space-y-2">
                        {savedConsultations.map((consult) => (
                          <div
                            key={consult.id}
                            onClick={() => handleSelectSavedConsultation(consult)}
                            className="bg-black/45 hover:bg-[#C5A36B]/10 border border-white/5 hover:border-[#C5A36B]/30 p-3.5 rounded-2xl text-left transition duration-200 cursor-pointer flex justify-between items-center group relative overflow-hidden"
                          >
                            <div className="space-y-1 flex-1 pr-4 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-[8px] uppercase tracking-wider text-[#C5A36B] font-bold bg-[#C5A36B]/15 px-1.5 py-0.5 rounded">
                                  {consult.timestamp}
                                </span>
                                {consult.diseaseContext && (
                                  <span className="text-[9px] text-[#E0D8D0]/60 truncate font-serif italic">
                                    {consult.diseaseContext}
                                  </span>
                                )}
                              </div>
                              <h4 className="text-[11px] font-semibold text-[#F2EBE4] mt-1 truncate">
                                {consult.diseaseContext || (consult.symptoms.length > 0 ? consult.symptoms.slice(0, 3).join(", ") : "General Balance Assessment")}
                              </h4>
                              {consult.symptoms.length > 0 && (
                                <p className="text-[10px] text-white/45 truncate">
                                  Symptoms: {consult.symptoms.join(", ")}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <button
                                onClick={(e) => handleDeleteSavedConsultation(consult.id, e)}
                                className="p-1.5 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition cursor-pointer"
                                title="Delete reports history"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-xs group-hover:translate-x-1.5 transition-transform text-[#C5A36B] font-bold">
                                →
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>
        )}

        {/* Weight Loss 30-day plan */}
        {activeTab === "WeightLoss" && (
          <div id="weight-loss-section" className="w-full">
            <WeightLossPlan currentUser={currentUser} onUpdateProfile={handleUpdateUser} />
          </div>
        )}

        {/* Common Clinical Disease Treatises Section */}
        {activeTab === "Diseases" && (
          <div id="diseases-section" className="w-full">
            <DiseaseTreatises 
              diseases={COMMON_DISEASES_DB} 
              onApplyDiseaseToForm={handleSelectDiseaseToForm} 
            />
          </div>
        )}

        {/* Sattvavajaya Cognitive Habit Counseling Section */}
        {activeTab === "SattvaHabits" && (
          <div id="sattva-habits-section" className="w-full">
            <SattvaHabitTherapy />
          </div>
        )}

        {/* Reference Library Section (Always beautifully present at the bottom of the dashboard) */}
        {activeTab === "Library" && (
          <div id="library-section" className="space-y-6 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-serif text-[#F2EBE4] font-medium flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#C5A36B]" />
                  <span>Reference Encyclopedia</span>
                </h2>
                <p className="text-[#E0D8D0]/60 text-xs mt-0.5">
                  Quickly review single herb benefits, sanskrit names, and safety contraindications.
                </p>
              </div>
              
              <div className="text-[11px] text-white/40 italic bg-white/5 px-3 py-1 rounded-full border border-white/5">
                💡 Hint: click any herb in search to auto-apply it to your consultation form directly!
              </div>
            </div>

            <HerbalDirectory 
              herbs={herbs} 
              onSelectHerbKeyword={handleSelectHerbKeyword} 
            />
          </div>
        )}

        {/* User profile tab */}
        {activeTab === "Profile" && (
          <div id="profile-section-container" className="w-full">
            <UserProfile 
              currentUser={currentUser} 
              onLogin={handleLoginUser} 
              onLogout={handleLogoutUser} 
              onUpdateProfile={handleUpdateUser}
              onSelectSaved={handleSelectSavedConsultation}
            />
          </div>
        )}

        {/* Ask AyurBot Chatbot tab */}
        {activeTab === "AyurBot" && (
          <div id="ayurbot-section" className="w-full animate-fade-in">
            <AyurBot />
          </div>
        )}

        {/* Academic tab */}
        {activeTab === "Academic" && (
          <div id="academic-tab-section" className="w-full animate-fade-in">
            <AcademicHub 
              currentUser={currentUser} 
              onNavigateTab={(targetTab: any) => {
                setActiveTab(targetTab);
                setTimeout(() => {
                  if (targetTab === "Consult") {
                    document.getElementById("consult-section-header")?.scrollIntoView({ behavior: "smooth" });
                  } else if (targetTab === "WeightLoss") {
                    document.getElementById("weight-loss-section")?.scrollIntoView({ behavior: "smooth" });
                  } else if (targetTab === "Diseases") {
                    document.getElementById("diseases-section")?.scrollIntoView({ behavior: "smooth" });
                  } else if (targetTab === "Library") {
                    document.getElementById("library-section")?.scrollIntoView({ behavior: "smooth" });
                  } else if (targetTab === "SattvaHabits") {
                    document.getElementById("sattva-habits-section")?.scrollIntoView({ behavior: "smooth" });
                  } else if (targetTab === "AyurBot") {
                    document.getElementById("ayurbot-container")?.scrollIntoView({ behavior: "smooth" });
                  } else if (targetTab === "Profile") {
                    document.getElementById("profile-section-container")?.scrollIntoView({ behavior: "smooth" });
                  }
                }, 150);
              }}
            />
          </div>
        )}

      </main>

      {/* Atmospheric Immersive footer */}
      <footer className="relative z-10 px-6 md:px-12 py-10 mt-16 border-t border-white/5 bg-[#050606] text-[10px] uppercase tracking-widest text-[#E0D8D0]/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="space-y-1.5">
            <div className="text-white/60 font-medium">Ayurvedic Sastra Recommendation Engine v2.4.0</div>
            <p className="text-white/35 max-w-sm normal-case leading-relaxed font-sans text-[10px]">
              VedaScan AI is designed to promote wellness balance based on standard Charaka specifications. Always verify safety measures prior to dosing.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-[10px] tracking-wider text-white/40">
            {isOwnerEmail(currentUser?.email) && (
              <button 
                onClick={() => setIsVerificationModalOpen(true)}
                className="text-[#C5A36B] hover:underline cursor-pointer font-bold flex items-center gap-1 uppercase"
              >
                🎓 School Project Seal (Owner Ethan Aarav Gomez)
              </button>
            )}
            <span>Authentic Herb Database</span>
            <span>Tridoshic Purifying</span>
            <span>Privacy Seal</span>
            <span className="text-white/70 font-semibold">© 2026 VEDASCAN AI INC</span>
          </div>
        </div>
      </footer>
<AnimatePresence>
  {isVerificationModalOpen && (
    <ProjectVerificationModal
      isOpen={isVerificationModalOpen}
      onClose={() => setIsVerificationModalOpen(false)}
      currentUser={currentUser}
    />
  )}
</AnimatePresence>

      <SattvaCalendarModal
        isOpen={showPrescriptionSync}
        onClose={() => setShowPrescriptionSync(false)}
        habits={getPrescriptionSyncableHabits()}
        title="Ayurvedic Treatment Calendar Sync"
        subtitle="Schedule your custom yoga, breathwork, and wellness guidance into dynamic daily dynamic recurring reminders."
      />

      {/* Recommended Medicine Purchase Modal */}
      <AnimatePresence>
        {selectedMedicine && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setSelectedMedicine(null); setShowMedicineDeals(false); }}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-md bg-[#0F1310] border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-10 p-6 flex flex-col gap-4"
            >
              <button
                onClick={() => { setSelectedMedicine(null); setShowMedicineDeals(false); }}
                className="absolute right-4 top-4 text-white/65 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-full transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="mt-2">
                <span className="text-[9px] font-mono tracking-widest text-[#C5A36B] font-bold uppercase block mb-1">
                  RECOMMENDED REMEDY PROFILE
                </span>
                <h4 className="text-xl font-serif text-[#F2EBE4] font-bold">{selectedMedicine.name}</h4>
              </div>

              <div className="bg-[#080A09] p-3.5 rounded-xl border border-white/5 space-y-2.5">
                <div>
                  <span className="text-[9px] font-mono text-[#C5A36B] tracking-wider uppercase block">
                    DOSAGE & ANUPANA (VEHICLE)
                  </span>
                  <p className="text-xs text-[#E0D8D0]/90 italic leading-relaxed">{selectedMedicine.dosageInstructions}</p>
                </div>
                
                <div className="bg-red-950/15 border border-red-900/10 p-2.5 rounded-lg">
                  <span className="text-[9px] font-mono text-red-400 tracking-wider uppercase block font-bold">
                    CAUTION & CONTRAINDICATIONS
                  </span>
                  <p className="text-[11px] text-red-200/80 leading-relaxed">{selectedMedicine.safetyNotes}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex flex-col gap-2.5">
                <a
                  href={`https://linkredirect.in/visitretailer/2318?id=5388051&shareid=88qOeli&dl=${encodeURIComponent(`https://www.flipkart.com/search?q=${encodeURIComponent("planet ayurveda " + selectedMedicine.name.replace(/\(.*?\)/g, "").trim())}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#C5A36B] hover:bg-[#C5A36B]/85 text-black font-semibold py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 text-xs text-center"
                >
                  <ShoppingBag className="w-4 h-4" /> Buy on Flipkart
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Auth Modal Overlay */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            initialMode={authModalMode}
            onLoginSuccess={(user) => {
              handleLoginUser(user);
            }}
          />
        )}
      </AnimatePresence>

      {/* Floating Universal Accessibility Hub */}
      <AccessibilityWidget
        fontSize={fontSize}
        setFontSize={setFontSize}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        dyslexiaFont={dyslexiaFont}
        setDyslexiaFont={setDyslexiaFont}
        recommendationResult={recommendationResult}
        onVoiceCapture={startVoiceCapture}
      />
    </div>
  );
}
