import React, { useState, useEffect } from "react";
import { 
  Accessibility, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Type, 
  Eye, 
  Keyboard, 
  X, 
  Check, 
  Play, 
  Pause, 
  Square,
  HelpCircle,
  AlertTriangle
} from "lucide-react";
import { RecommendationResponse } from "../types";

interface AccessibilityWidgetProps {
  fontSize: "normal" | "large" | "extra-large";
  setFontSize: (size: "normal" | "large" | "extra-large") => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  dyslexiaFont: boolean;
  setDyslexiaFont: (val: boolean) => void;
  recommendationResult: RecommendationResponse | null;
  onVoiceCapture?: () => void;
}

export default function AccessibilityWidget({
  fontSize,
  setFontSize,
  highContrast,
  setHighContrast,
  dyslexiaFont,
  setDyslexiaFont,
  recommendationResult,
  onVoiceCapture
}: AccessibilityWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [srAnnouncement, setSrAnnouncement] = useState("");
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Trigger browser speech synthesis
  const handleSpeak = () => {
    if (!window.speechSynthesis) {
      announceToScreenReader("Speech synthesis is not supported on this browser.");
      return;
    }

    // Stop previous speech if any
    window.speechSynthesis.cancel();

    if (!recommendationResult) {
      const introText = "VedaScan Ayurvedic Healing Protocol. Please complete the somatic symptom questionnaire first to generate your custom wellness plan.";
      speakText(introText);
      return;
    }

    const reportText = `
      VedaScan AI Vaidya Diagnostics Report.
      Dominant Dosha Aggravation Analysis: ${recommendationResult.dominantDoshaAnalysis}.
      Holistic summary: ${recommendationResult.holisticSummary}.
      Recommended Botanical Formulas: ${
        recommendationResult.medicines && recommendationResult.medicines.length > 0
          ? recommendationResult.medicines.map(m => `${m.name}, also known as ${m.sanskritName || "Sanskrit name unknown"}.`).join(" ")
          : "None specific."
      }
      Dietary protocols: ${recommendaryDiet()}
      Lifestyle guidelines. Yoga postures: ${recommendationResult.lifestyleRecommendations.yogaAsanas.join(", ")}.
      Breathing exercises: ${recommendationResult.lifestyleRecommendations.breathingExercises.join(", ")}.
      Ayurvedic everyday tips: ${recommendationResult.lifestyleRecommendations.lifestyleTips.join(". ")}.
      This concludes your personalized health protocol. Please consult your physician before starting herbal therapies.
    `;

    speakText(reportText);
  };

  const recommendaryDiet = () => {
    if (!recommendationResult) return "";
    const diet = recommendationResult.dietaryRecommendations;
    return `
      Explanation: ${diet.explanation}.
      Substances to favor include: ${diet.toFavor.join(", ")}.
      Substances to entirely avoid: ${diet.toAvoid.join(", ")}.
    `;
  };

  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speechRate;
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      announceToScreenReader("Starting protocol narration.");
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      announceToScreenReader("Protocol narration completed.");
    };

    utterance.onerror = (e) => {
      console.error("Speech Synthesis Error:", e);
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePauseResume = () => {
    if (!window.speechSynthesis) return;
    if (isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      announceToScreenReader("Narration paused.");
    } else if (isSpeaking && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      announceToScreenReader("Narration resumed.");
    }
  };

  const handleStop = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    announceToScreenReader("Narration stopped.");
  };

  const announceToScreenReader = (msg: string) => {
    setSrAnnouncement(msg);
    // Auto clear after announcements so same text can be re-triggered
    setTimeout(() => setSrAnnouncement(""), 3000);
  };

  // Keyboard accessibility listeners (Accesskeys & global shortcuts)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Use Alt + (Key) for fast, robust navigation triggers
      if (e.altKey) {
        switch (e.key.toLowerCase()) {
          case "a": // Alt + A: Open Accessibility Options panel
            e.preventDefault();
            setIsOpen(prev => !prev);
            announceToScreenReader(isOpen ? "Accessibility panel closed" : "Accessibility panel opened");
            break;
          case "t": // Alt + T: Trigger Text-to-Speech playback
            e.preventDefault();
            handleSpeak();
            break;
          case "c": // Alt + C: Toggle High Contrast Mode
            e.preventDefault();
            setHighContrast(!highContrast);
            announceToScreenReader(`High contrast mode ${!highContrast ? "activated" : "deactivated"}`);
            break;
          case "d": // Alt + D: Toggle Dyslexia-Friendly Font Mode
            e.preventDefault();
            setDyslexiaFont(!dyslexiaFont);
            announceToScreenReader(`Dyslexia readable font mode ${!dyslexiaFont ? "activated" : "deactivated"}`);
            break;
          case "f": // Alt + F: Loop Font Sizes
            e.preventDefault();
            const sizes: ("normal" | "large" | "extra-large")[] = ["normal", "large", "extra-large"];
            const currentIdx = sizes.indexOf(fontSize);
            const nextSize = sizes[(currentIdx + 1) % sizes.length];
            setFontSize(nextSize);
            announceToScreenReader(`Font size adjusted to ${nextSize}`);
            break;
          case "k": // Alt + K: Show Keyboard Navigation guide
            e.preventDefault();
            setShowShortcuts(prev => !prev);
            announceToScreenReader(showShortcuts ? "Keyboard Shortcuts reference closed" : "Keyboard Shortcuts reference opened");
            break;
          case "s": // Alt + S: Trigger Speech recognition intake
            if (onVoiceCapture) {
              e.preventDefault();
              onVoiceCapture();
              announceToScreenReader("Microphone symptoms intake activated");
            }
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [fontSize, highContrast, dyslexiaFont, recommendationResult, isOpen, showShortcuts, speechRate, onVoiceCapture]);

  return (
    <>
      {/* Invisible Screen Reader Announcement Region */}
      <div 
        className="sr-only" 
        role="status" 
        aria-live="assertive" 
        aria-atomic="true"
      >
        {srAnnouncement}
      </div>

      {/* Floating Accessibility Trigger Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          announceToScreenReader(isOpen ? "Accessibility panel closed" : "Accessibility panel opened. Tab to options.");
        }}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 cursor-pointer flex items-center justify-center border focus-visible:outline focus-visible:outline-4 ${
          highContrast 
            ? "bg-[#ffff00] text-black border-black hover:bg-white" 
            : "bg-[#C5A36B] text-black border-[#F2EBE4]/20 hover:bg-[#D5B37B]"
        }`}
        aria-label="Open Accessibility Options. Keyboard shortcut: Alt + A."
        aria-expanded={isOpen}
        id="btn-accessibility-trigger"
      >
        <Accessibility className="w-6 h-6 animate-pulse" />
      </button>

      {/* Accessibility Panel Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="a11y-panel-title"
        >
          <div 
            className={`w-full max-w-lg rounded-[28px] p-6 md:p-8 shadow-2xl relative border ${
              highContrast 
                ? "bg-black text-white border-[#ffff00] border-4" 
                : "bg-[#0F1110] text-[#E0D8D0] border-white/10"
            }`}
          >
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <Accessibility className={`w-6 h-6 ${highContrast ? "text-[#ffff00]" : "text-[#C5A36B]"}`} />
                <div>
                  <h2 id="a11y-panel-title" className="text-lg font-serif font-semibold tracking-tight text-[#F2EBE4]">
                    Universal Accessibility Hub
                  </h2>
                  <p className="text-[11px] text-white/40">
                    Customize your visual, reading, and listening preferences
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className={`p-2 rounded-xl transition cursor-pointer ${
                  highContrast ? "bg-[#ffff00] text-black hover:bg-white" : "bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
                }`}
                aria-label="Close Accessibility Panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Toggles */}
            <div className="space-y-6">
              {/* Text-to-Speech Protocol Voice Reader */}
              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-white/60 block">
                  🔊 Protocol Speech Reader (Text-To-Speech)
                </label>
                <div className={`p-4 rounded-xl border flex flex-col gap-3 ${
                  highContrast ? "bg-black border-white" : "bg-white/[0.02] border-white/5"
                }`}>
                  <p className="text-xs text-white/60">
                    Reads aloud Ayurvedic assessments, botanical formulas, and custom lifestyle tips. Ideal for low-vision or reading difficulty.
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleSpeak}
                      className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer ${
                        highContrast 
                          ? "bg-[#ffff00] text-black hover:bg-white border border-black" 
                          : "bg-[#C5A36B] hover:bg-[#D5B37B] text-black"
                      }`}
                      aria-label="Start Speak Protocol. Alt + T"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isSpeaking ? "Restart Audio" : "Speak Protocol"}</span>
                    </button>

                    {isSpeaking && (
                      <button
                        onClick={handlePauseResume}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/15 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer"
                        aria-label={isPaused ? "Resume Audio" : "Pause Audio"}
                      >
                        <Pause className="w-3.5 h-3.5 fill-current" />
                        <span>{isPaused ? "Resume" : "Pause"}</span>
                      </button>
                    )}

                    {isSpeaking && (
                      <button
                        onClick={handleStop}
                        className="px-4 py-2 bg-red-600/20 hover:bg-red-600 border border-red-500/30 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer"
                        aria-label="Stop Audio"
                      >
                        <Square className="w-3.5 h-3.5 fill-current text-white" />
                        <span>Stop</span>
                      </button>
                    )}
                  </div>

                  {/* Speech Rate Adjustment */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-[11px] text-white/50">Narration Speed:</span>
                    <div className="flex gap-1.5">
                      {[0.75, 1, 1.25, 1.5].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => {
                            setSpeechRate(rate);
                            announceToScreenReader(`Narration speed set to ${rate} times`);
                          }}
                          className={`px-2 py-1 rounded text-[10px] font-bold ${
                            speechRate === rate 
                              ? (highContrast ? "bg-[#ffff00] text-black" : "bg-[#C5A36B] text-black") 
                              : "bg-white/5 text-white/60 hover:text-white"
                          }`}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Adjust Font Sizes */}
              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-white/60 block">
                  <Type className="w-4 h-4 inline mr-1.5 text-white/40" />
                  Text Font Scaling (Alt + F)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["normal", "large", "extra-large"] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setFontSize(size);
                        announceToScreenReader(`Font scale set to ${size}`);
                      }}
                      className={`py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer border flex items-center justify-center gap-1 ${
                        fontSize === size 
                          ? (highContrast ? "bg-[#ffff00] text-black border-black" : "bg-[#C5A36B] text-black border-[#C5A36B]") 
                          : "bg-white/5 border-white/5 text-white/60 hover:text-white hover:border-white/20"
                      }`}
                    >
                      {fontSize === size && <Check className="w-3.5 h-3.5" />}
                      <span>{size === "normal" ? "Standard" : size === "large" ? "Large" : "Huge"}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggle Controls Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* High Contrast Mode Toggle */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white/60 block">
                    <Eye className="w-4 h-4 inline mr-1.5 text-white/40" />
                    High Contrast (Alt + C)
                  </label>
                  <button
                    onClick={() => {
                      setHighContrast(!highContrast);
                      announceToScreenReader(`High contrast mode ${!highContrast ? "enabled" : "disabled"}`);
                    }}
                    className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer border flex items-center justify-center gap-2 ${
                      highContrast 
                        ? "bg-[#ffff00] text-black border-black" 
                        : "bg-white/5 border-white/5 text-white/60 hover:text-white"
                    }`}
                  >
                    <span>{highContrast ? "✔ High Contrast Enabled" : "Enable High Contrast"}</span>
                  </button>
                </div>

                {/* Dyslexia Readable Toggle */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white/60 block">
                    <Sparkles className="w-4 h-4 inline mr-1.5 text-white/40" />
                    Dyslexia-Friendly (Alt + D)
                  </label>
                  <button
                    onClick={() => {
                      setDyslexiaFont(!dyslexiaFont);
                      announceToScreenReader(`Dyslexia readable font ${!dyslexiaFont ? "enabled" : "disabled"}`);
                    }}
                    className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer border flex items-center justify-center gap-2 ${
                      dyslexiaFont 
                        ? (highContrast ? "bg-[#ffff00] text-black border-black" : "bg-[#C5A36B] text-black border-[#C5A36B]") 
                        : "bg-white/5 border-white/5 text-white/60 hover:text-white"
                    }`}
                  >
                    <span>{dyslexiaFont ? "✔ Dyslexic Font Active" : "Enable Dyslexia Font"}</span>
                  </button>
                </div>
              </div>

              {/* Keyboard Shortcuts Guide Toggle */}
              <div className="pt-2 border-t border-white/10">
                <button
                  onClick={() => setShowShortcuts(!showShortcuts)}
                  className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer ${
                    highContrast ? "text-[#ffff00] hover:underline" : "text-[#C5A36B] hover:text-[#D5B37B]"
                  }`}
                  aria-expanded={showShortcuts}
                >
                  <Keyboard className="w-4 h-4" />
                  <span>{showShortcuts ? "Hide Keyboard Hotkeys Guide" : "Show Keyboard Hotkeys Guide (Alt + K)"}</span>
                </button>

                {showShortcuts && (
                  <div className={`mt-3 p-4 rounded-xl border text-[11px] space-y-2 ${
                    highContrast ? "bg-black border-white" : "bg-white/[0.01] border-white/5"
                  }`}>
                    <p className="text-white/40 mb-1.5">Navigate our traditional diagnostic suite instantly using simple hotkeys:</p>
                    <div className="grid grid-cols-2 gap-2 text-white/75 font-mono">
                      <div><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white text-[10px]">Alt + A</kbd> : Toggle Options Panel</div>
                      <div><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white text-[10px]">Alt + T</kbd> : Speech Narration</div>
                      <div><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white text-[10px]">Alt + C</kbd> : High Contrast On/Off</div>
                      <div><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white text-[10px]">Alt + D</kbd> : Dyslexia Font On/Off</div>
                      <div><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white text-[10px]">Alt + F</kbd> : Loop Text Sizes</div>
                      <div><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white text-[10px]">Alt + S</kbd> : Voice Dictation</div>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Clinical safety disclaimer */}
            <div className="mt-6 flex gap-2.5 items-start p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[10px] text-amber-500">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>
                Safety Precaution: Ensure correct speaker levels before starting voice readings. Consult medical practitioners for formal diagnostic validation.
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
