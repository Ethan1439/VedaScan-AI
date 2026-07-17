import React, { useState } from "react";
import { 
  Accessibility, 
  Volume2, 
  Sparkles, 
  Type, 
  Eye, 
  Keyboard, 
  RotateCcw, 
  Check, 
  Info,
  Sliders,
  Play,
  Pause,
  Square
} from "lucide-react";
import { RecommendationResponse } from "../types";

interface AccessibilityDashboardProps {
  fontSize: "normal" | "large" | "extra-large";
  setFontSize: (size: "normal" | "large" | "extra-large") => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  dyslexiaFont: boolean;
  setDyslexiaFont: (val: boolean) => void;
  recommendationResult: RecommendationResponse | null;
  onVoiceCapture?: () => void;
}

export default function AccessibilityDashboard({
  fontSize,
  setFontSize,
  highContrast,
  setHighContrast,
  dyslexiaFont,
  setDyslexiaFont,
  recommendationResult,
  onVoiceCapture
}: AccessibilityDashboardProps) {
  const [showHotkeys, setShowHotkeys] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1);
  const [srMessage, setSrMessage] = useState("");

  const triggerSR = (msg: string) => {
    setSrMessage(msg);
    setTimeout(() => setSrMessage(""), 2500);
  };

  const handleReset = () => {
    setFontSize("normal");
    setHighContrast(false);
    setDyslexiaFont(false);
    triggerSR("Accessibility settings reset to default standard theme");
  };

  // Text to speech implementation
  const handleSpeak = () => {
    if (!window.speechSynthesis) {
      triggerSR("Text to speech is not supported in this browser.");
      return;
    }
    window.speechSynthesis.cancel();

    if (!recommendationResult) {
      const genericIntro = "VedaScan Ayurvedic healing portal is ready. Adjust display scaling, dyslexia fonts, or high contrast mode using the toggles below. Select Alt plus A to open accessibility controls anytime.";
      speakText(genericIntro);
      return;
    }

    const reportText = `
      Personalized Ayurvedic Protocol diagnostics.
      Constitutional Aggravation: ${recommendationResult.dominantDoshaAnalysis}.
      Holistic Therapy: ${recommendationResult.holisticSummary}.
      Recommended Herbs: ${
        recommendationResult.medicines && recommendationResult.medicines.length > 0
          ? recommendationResult.medicines.map(m => m.name).join(", ")
          : "None specific."
      }.
      Diet guidelines: Favor ${recommendationResult.dietaryRecommendations.toFavor.join(", ")}, avoid ${recommendationResult.dietaryRecommendations.toAvoid.join(", ")}.
    `;
    speakText(reportText);
  };

  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speechRate;
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      triggerSR("Narration started");
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      triggerSR("Narration completed");
    };

    utterance.onerror = () => {
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
      triggerSR("Narration paused");
    } else if (isSpeaking && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      triggerSR("Narration resumed");
    }
  };

  const handleStop = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    triggerSR("Narration stopped");
  };

  return (
    <div 
      id="accessibility-settings-dashboard"
      className={`rounded-3xl border p-6 md:p-8 transition-all duration-300 relative z-20 shadow-xl ${
        highContrast 
          ? "bg-black border-[#FFFF00] text-white" 
          : "bg-[#0F1110] border-white/10 text-[#E0D8D0]"
      }`}
      aria-label="Accessibility Settings Dashboard"
      role="region"
    >
      {/* Screen Reader Live Status */}
      <div className="sr-only" role="status" aria-live="polite">
        {srMessage}
      </div>

      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A36B]/5 rounded-full blur-2xl pointer-events-none" />

      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10 mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl flex items-center justify-center ${
            highContrast ? "bg-[#FFFF00] text-black" : "bg-[#C5A36B]/10 text-[#C5A36B]"
          }`}>
            <Accessibility className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-semibold tracking-tight text-[#F2EBE4]">
              Accessibility Dashboard & Adaptability Suite
            </h2>
            <p className="text-xs text-white/40 mt-0.5">
              Persistent UI modifiers to match cognitive, visual, and physical specifications.
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
            highContrast 
              ? "bg-black border-2 border-[#FFFF00] text-[#FFFF00] hover:bg-[#FFFF00] hover:text-black" 
              : "bg-white/5 border border-white/10 text-[#E0D8D0]/80 hover:bg-white/10 hover:text-white"
          }`}
          title="Reset accessibility overrides to traditional aesthetic default"
          id="btn-reset-accessibility"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Direct Controls */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Control 1: High Contrast */}
            <div className={`p-5 rounded-2xl border transition-all duration-300 ${
              highContrast ? "bg-[#111] border-[#FFFF00]" : "bg-white/[0.02] border-white/5 hover:border-white/10"
            }`}>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  Color Contrast
                </span>
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                  highContrast ? "bg-[#FFFF00]/10 text-[#FFFF00]" : "bg-emerald-500/10 text-emerald-400"
                }`}>
                  WCAG AAA Compliant
                </span>
              </div>
              <h3 className="text-sm font-semibold text-[#F2EBE4] mb-1.5">High Contrast Mode</h3>
              <p className="text-[11px] text-white/40 leading-relaxed mb-4">
                Enforce deep pitch-black backdrops, pure white content paragraphs, and bright yellow buttons.
              </p>
              
              <button
                onClick={() => {
                  setHighContrast(!highContrast);
                  triggerSR(`High contrast mode ${!highContrast ? "activated" : "deactivated"}`);
                }}
                className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition border flex items-center justify-center gap-2 cursor-pointer ${
                  highContrast 
                    ? "bg-[#FFFF00] text-black border-[#FFFF00] font-black" 
                    : "bg-white/5 border-white/10 text-[#E0D8D0]/80 hover:bg-white/10 hover:text-white"
                }`}
                id="btn-dashboard-contrast-toggle"
              >
                {highContrast ? <Check className="w-4 h-4 stroke-[3px]" /> : null}
                <span>{highContrast ? "Contrast Active" : "Enable High Contrast"}</span>
              </button>
            </div>

            {/* Control 2: Dyslexia-Friendly Font */}
            <div className={`p-5 rounded-2xl border transition-all duration-300 ${
              dyslexiaFont ? "bg-[#111] border-[#C5A36B]/60" : "bg-white/[0.02] border-white/5 hover:border-white/10"
            }`}>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Typography Structure
                </span>
                <span className="text-[9px] font-mono font-bold bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded">
                  Dyslexia Readable
                </span>
              </div>
              <h3 className="text-sm font-semibold text-[#F2EBE4] mb-1.5">Monospace Font Mode</h3>
              <p className="text-[11px] text-white/40 leading-relaxed mb-4">
                Applies wider word spacing, highly defined letter structures, and uniform font weight.
              </p>

              <button
                onClick={() => {
                  setDyslexiaFont(!dyslexiaFont);
                  triggerSR(`Monospace readable font ${!dyslexiaFont ? "activated" : "deactivated"}`);
                }}
                className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition border flex items-center justify-center gap-2 cursor-pointer ${
                  dyslexiaFont 
                    ? (highContrast ? "bg-[#FFFF00] text-black border-[#FFFF00]" : "bg-[#C5A36B] text-black border-[#C5A36B]") 
                    : "bg-white/5 border-white/10 text-[#E0D8D0]/80 hover:bg-white/10 hover:text-white"
                }`}
                id="btn-dashboard-font-toggle"
              >
                {dyslexiaFont ? <Check className="w-4 h-4 stroke-[3px]" /> : null}
                <span>{dyslexiaFont ? "Readable Font Active" : "Enable Readable Font"}</span>
              </button>
            </div>

          </div>

          {/* Control 3: Font Scaling Slider & Presets */}
          <div className={`p-5 rounded-2xl border ${
            highContrast ? "bg-[#111] border-[#FFFF00]" : "bg-white/[0.02] border-white/5"
          }`}>
            <span className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-1.5 mb-3">
              <Type className="w-4 h-4" />
              Real-time Font Scale & Text Sizing
            </span>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 max-w-sm">
                <h3 className="text-sm font-semibold text-[#F2EBE4]">Scaling Mode</h3>
                <p className="text-[11px] text-white/40 leading-relaxed">
                  Scales up all buttons, titles, questionnaire options, and medicine catalogs for stress-free ocular reading.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 w-full md:w-auto md:min-w-[320px]">
                {(["normal", "large", "extra-large"] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setFontSize(size);
                      triggerSR(`Ocular font scale adjusted to ${size}`);
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition border flex items-center justify-center gap-1 cursor-pointer ${
                      fontSize === size 
                        ? (highContrast ? "bg-[#FFFF00] text-black border-black" : "bg-[#C5A36B] text-black border-[#C5A36B]") 
                        : "bg-white/5 border-white/5 text-white/60 hover:text-white hover:border-white/20"
                    }`}
                    id={`btn-dashboard-size-${size}`}
                  >
                    <span>{size === "normal" ? "Standard" : size === "large" ? "1.15x Large" : "1.30x Huge"}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Control 4: Text-To-Speech Narration */}
          <div className={`p-5 rounded-2xl border ${
            highContrast ? "bg-[#111] border-[#FFFF00]" : "bg-[#C5A36B]/5 border-[#C5A36B]/10"
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C5A36B] flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4" />
                  Voice Synthesizer (Audio Assistant)
                </span>
                <h3 className="text-sm font-semibold text-[#F2EBE4]">Traditional Narration Service</h3>
                <p className="text-[11px] text-white/40 leading-relaxed max-w-md">
                  Have VedaScan's clinical diagnostics, warning protocols, and botanical ingredient details read out loud.
                </p>
              </div>

              <div className="flex flex-col gap-2 shrink-0">
                <div className="flex gap-2">
                  <button
                    onClick={handleSpeak}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer ${
                      highContrast 
                        ? "bg-[#FFFF00] text-black hover:bg-white border border-black" 
                        : "bg-[#C5A36B] hover:bg-[#D5B37B] text-black"
                    }`}
                    id="btn-dashboard-speak"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isSpeaking ? "Replay Narration" : "Read Aloud"}</span>
                  </button>

                  {isSpeaking && (
                    <button
                      onClick={handlePauseResume}
                      className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/15 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer"
                      id="btn-dashboard-pause-resume"
                    >
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>{isPaused ? "Resume" : "Pause"}</span>
                    </button>
                  )}

                  {isSpeaking && (
                    <button
                      onClick={handleStop}
                      className="px-3 py-2 bg-red-600/20 hover:bg-red-600 border border-red-500/30 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer"
                      id="btn-dashboard-stop"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>Stop</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 justify-between">
                  <span className="text-[10px] text-white/40">Speed:</span>
                  <div className="flex gap-1">
                    {[0.75, 1, 1.25, 1.5].map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          setSpeechRate(r);
                          triggerSR(`Speed configured to ${r} times`);
                        }}
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          speechRate === r 
                            ? (highContrast ? "bg-[#FFFF00] text-black" : "bg-[#C5A36B] text-black") 
                            : "bg-white/5 text-white/60 hover:text-white"
                        }`}
                      >
                        {r}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Information, Hotkeys & Accessibility Seal */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Live Adaptive Preview Box */}
          <div className={`p-5 rounded-2xl border text-center ${
            highContrast ? "bg-black border-[#FFFF00]" : "bg-white/[0.01] border-white/5"
          }`}>
            <span className="text-[9px] font-mono uppercase tracking-widest text-white/30 block mb-2">Adaptive Font Preview</span>
            <div className="py-6 px-4 bg-black/40 rounded-xl border border-white/5 space-y-3">
              <span className={`text-[#C5A36B] font-serif block ${
                fontSize === "large" ? "text-lg" : fontSize === "extra-large" ? "text-xl" : "text-sm"
              }`}>
                ॐ Shanti Pathya
              </span>
              <p className={`text-[#E0D8D0]/80 leading-relaxed ${
                fontSize === "large" ? "text-sm" : fontSize === "extra-large" ? "text-base" : "text-xs"
              } ${dyslexiaFont ? "font-mono" : ""}`}>
                "Health is a state of physical, mental, social, and spiritual well-being, not just the absence of symptoms."
              </p>
            </div>
          </div>

          {/* Quick Hotkeys Reference Panel */}
          <div className={`p-5 rounded-2xl border ${
            highContrast ? "bg-black border-[#FFFF00]" : "bg-white/[0.01] border-white/5"
          }`}>
            <button
              onClick={() => {
                setShowHotkeys(!showHotkeys);
                triggerSR(showHotkeys ? "Keyboard shortcuts hidden" : "Keyboard shortcuts displayed");
              }}
              className="w-full flex items-center justify-between text-left cursor-pointer"
              aria-expanded={showHotkeys}
              id="btn-dashboard-hotkeys-toggle"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-white/60 flex items-center gap-1.5">
                <Keyboard className="w-4 h-4 text-white/40" />
                Keyboard Hotkeys (Alt keys)
              </span>
              <span className={`text-[10px] font-bold ${
                highContrast ? "text-[#FFFF00] underline" : "text-[#C5A36B] hover:text-[#D5B37B]"
              }`}>
                {showHotkeys ? "Collapse" : "Expand Guide"}
              </span>
            </button>

            {showHotkeys && (
              <div className="mt-4 pt-4 border-t border-white/5 space-y-2.5 font-mono text-[10px] text-white/75">
                <div className="flex justify-between items-center bg-white/5 p-1.5 rounded">
                  <span>Accessibility Hub:</span>
                  <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white text-[9px]">Alt + A</kbd>
                </div>
                <div className="flex justify-between items-center bg-white/5 p-1.5 rounded">
                  <span>Speak Protocol:</span>
                  <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white text-[9px]">Alt + T</kbd>
                </div>
                <div className="flex justify-between items-center bg-white/5 p-1.5 rounded">
                  <span>High Contrast Mode:</span>
                  <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white text-[9px]">Alt + C</kbd>
                </div>
                <div className="flex justify-between items-center bg-white/5 p-1.5 rounded">
                  <span>Monospace Readable Font:</span>
                  <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white text-[9px]">Alt + D</kbd>
                </div>
                <div className="flex justify-between items-center bg-white/5 p-1.5 rounded">
                  <span>Adjust Text Scaling:</span>
                  <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white text-[9px]">Alt + F</kbd>
                </div>
                <div className="flex justify-between items-center bg-white/5 p-1.5 rounded">
                  <span>Voice Symptom Capture:</span>
                  <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white text-[9px]">Alt + S</kbd>
                </div>
              </div>
            )}
          </div>

          {/* Compliance Info Banner */}
          <div className="p-4 bg-[#C5A36B]/5 border border-[#C5A36B]/15 rounded-2xl flex gap-3">
            <Info className="w-4.5 h-4.5 text-[#C5A36B] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A36B] block">Inclusive Design Assurance</span>
              <p className="text-[10px] text-white/40 leading-relaxed">
                VedaScan implements screen-reader ARIA-live regions, full keyboard focusing overlays, and scalable typography tags in accordance with Section 508 & WCAG standards.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
