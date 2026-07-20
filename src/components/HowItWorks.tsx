/**
 * ============================================================================
 * COPYRIGHT & INTELLECTUAL PROPERTY NOTICE
 * ============================================================================
 * Project: VedaScan Academic Hub
 * Component: AcademicHub Tab System
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

import React from "react";
import { 
  Search, 
  MessageSquare, 
  Scale, 
  BookOpen, 
  TrendingDown, 
  User, 
  ClipboardList, 
  ArrowRight
} from "lucide-react";

interface AcademicHubProps {
  onNavigateTab: (tab: any) => void;
  currentUser: any;
}

export default function HowItWorks({ onNavigateTab, currentUser }: AcademicHubProps) {
  // Static list of website functions
  const websiteFunctions = [
    {
      id: "Consult",
      title: "Interactive Consultation Form",
      badge: "Diagnostics",
      icon: Search,
      description: "Allows users to choose physical, physiological, and emotional markers or type custom symptoms in natural language. Dynamically parses and matches classical Ayurvedic formulations, thermal potencies (Virya), taste profiles (Rasa), post-digestive effects (Vipaka), and therapeutic guides.",
      actions: ["Symptom Checklist Selection", "Conversational NLP Intake", "Dravya Herb Matching", "Anupana (Carrier) Integration"]
    },
    {
      id: "WeightLoss",
      title: "Stoke Metabolism & Weight Program",
      badge: "Therapeutics",
      icon: TrendingDown,
      description: "An enkindling 30-day weight control regimen centered on balancing Kapha dosha. Features an interactive calorie balance analyzer, custom basal metabolism assessments, water requirements estimator, daily habit task checks, and clinical notes saving.",
      actions: ["30-Day Checklist Tasks", "Calorie Intake Log", "Dynamic Water Target Calculations", "Dravya Weight Formulas"]
    },
    {
      id: "Diseases",
      title: "Authentic Clinical Disease Treatises",
      badge: "Education",
      icon: BookOpen,
      description: "A comprehensive reference directory mapping standard clinical disease classifications under ancient Sastra treatises (Charaka & Sushruta Samhitas). Includes systemic pathology outlines, tissue involvement (Dhatu), diagnostic signs (Roopa), and primary herbal remediation formulas.",
      actions: ["Disease Catalog Browsing", "Nidana (Etiology) Breakdown", "Dhatu Depth Mapping", "Formulation Auto-Populators"]
    },
    {
      id: "Library",
      title: "Dravyaguna Herb Encyclopedia",
      badge: "Knowledge Base",
      icon: ClipboardList,
      description: "An authentic, searchable database profiles cataloging classical single herbs. Detailing botanical nomenclature, specific active components, Sanskrit taxonomy, energetic qualities, traditional preparations, and safety guidelines.",
      actions: ["Dynamic Search & Filters", "Sanskrit Classification Profiles", "Thermal Potency (Virya) Metrics", "Flipkart / Retail Redirects"]
    },
    {
      id: "SattvaHabits",
      title: "Sattva Mental Wellness Counseling",
      badge: "Psychology",
      icon: Scale,
      description: "An interactive, conversational psychological helper modeled under the tenets of Sattvavajaya Chikitsa. Offers responsive mental habit training, behavioral guidance, cognitive training, and stress relief counseling.",
      actions: ["Sattva Counselor Chat", "Dosha Behavioral Profiles", "Stress Assessment Indicators", "Sattva Calendar Scheduler"]
    },
    {
      id: "AyurBot",
      title: "Ask Vaidya Acharya Bot",
      badge: "AI Companion",
      icon: MessageSquare,
      description: "A state-of-the-art server-side conversational chatbot engine contextually calibrated to classical Ayurveda. Capable of clarifying dense terminology, diagnosing constitutional questions, suggesting daily schedules, and mapping clinical recipes.",
      actions: ["Multi-turn AI Conversations", "Server-Side Gemini API Proxying", "Strict Prompt Calibration", "Suggested Diagnostic Queries"]
    },
    {
      id: "Profile",
      title: "User Profile & Healing Portal",
      badge: "Cloud Registry",
      icon: User,
      description: "Manages local profile registrations, saved consultations, weight loss logs, chronic health notes, and authentication structures. Syncs historical diagnostic reports directly into local memory storage files.",
      actions: ["Sattva Account Registration", "Saved Consultations File Cabinet", "Daily Progress Tracker Logs", "Privacy Seal Security Logs"]
    }
  ];


    return (
    <div id="academic-section" className="space-y-8 animate-fade-in">
      
      {/* WRO & AI Backend Section */}
      <div className="bg-white/[0.03] border border-white/10 rounded-[32px] p-6 md:p-8 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full filter blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[9px] uppercase tracking-widest font-mono text-blue-400 font-bold bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
              World Robot Olympiad (WRO) Standards
            </span>
            <span className="text-[9px] uppercase tracking-widest font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
              Functional AI Backend
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-serif text-[#F2EBE4] font-medium leading-tight">
            Advanced Intelligence & WRO Compliance
          </h2>
          <p className="text-sm text-white/70 max-w-3xl leading-relaxed">
            VedaScan AI leverages a sophisticated functional AI backend designed to process natural language symptom reports and accurately match them with thousands of classical Ayurvedic data points. This robust intelligence layer ensures seamless conversational interactions and diagnostic reliability. Developed entirely from scratch to meet and exceed <strong>World Robot Olympiad (WRO) standards</strong>, the architecture incorporates real-time health data parsing, a modular capability index, and an encapsulated secure processing environment to deliver high-performance, accurate wellness insights.
          </p>
        </div>
      </div>

      
      {/* Dynamic Header Block */}
      <div className="bg-white/[0.03] border border-white/10 rounded-[32px] p-6 md:p-8 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A36B]/5 rounded-full filter blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[9px] uppercase tracking-widest font-mono text-[#C5A36B] font-bold bg-[#C5A36B]/10 px-2.5 py-1 rounded-md border border-[#C5A36B]/25">
                VedaScan Blueprint
              </span>
              <span className="text-[9px] uppercase tracking-widest font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                100% Core Capabilities
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif text-[#F2EBE4] font-medium leading-tight">
              Interactive System Functions
            </h2>
            <p className="text-xs md:text-sm text-white/50 max-w-2xl">
              Explore the core capabilities of the VedaScan system. Click any component below to launch or navigate directly to that section of the live application.
            </p>
          </div>
        </div>
      </div>

      {/* RENDER ACTIVE FUNCTIONS LIST */}
      <div className="space-y-6 animate-fade-in">
        <div className="space-y-1">
          <h3 className="text-lg font-serif text-[#F2EBE4] font-medium">
            Modular Software Functions & Architecture
          </h3>
          <p className="text-xs text-white/50">
            Select any component below to activate its view state and explore its healing methodologies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {websiteFunctions.map((func) => {
            const IconComp = func.icon;
            return (
              <div 
                key={func.id} 
                className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 rounded-2xl p-5 md:p-6 transition duration-200 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#C5A36B]/10 border border-[#C5A36B]/20 flex items-center justify-center text-[#C5A36B]">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="bg-[#C5A36B]/15 text-[#C5A36B] text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded border border-[#C5A36B]/20">
                      {func.badge}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-[#F2EBE4]">{func.title}</h4>
                    <p className="text-[11px] text-[#E0D8D0]/70 leading-relaxed">
                      {func.description}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-white/30 block">Core Processes:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {func.actions.map((act, aIdx) => (
                        <span key={aIdx} className="bg-black/45 border border-white/5 text-[9px] text-[#E0D8D0]/80 font-mono px-2 py-0.5 rounded">
                          {act}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateTab(func.id)}
                  className="w-full bg-white/5 hover:bg-[#C5A36B] hover:text-black border border-white/10 hover:border-[#C5A36B] text-[#C5A36B] font-bold py-2 rounded-xl text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer mt-2"
                >
                  <span>Activate & Navigate To Component</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
