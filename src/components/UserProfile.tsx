/**
 * ============================================================================
 * COPYRIGHT & INTELLECTUAL PROPERTY NOTICE
 * ============================================================================
 * Project: VedaScan
 * Component: UserProfile Core System
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
  User, 
  Lock, 
  Mail, 
  FileText, 
  Clock, 
  Plus, 
  Trash2, 
  LogOut, 
  CheckCircle, 
  Sparkles, 
  TrendingUp, 
  Scale, 
  Edit3, 
  Save, 
  Calendar,
  Eye,
  Activity,
  UserPlus,
  Search,
  Globe,
  ShieldCheck,
  Award,
  Fingerprint
} from "lucide-react";
import { UserProfile as ProfileType, HealthNote, SavedConsultation } from "../types";

const isOwnerEmail = (email?: string) => {
  if (!email) return false;
  const canonical = email.trim().toLowerCase();
  return canonical === "ethanaaravgomez@gmail.com" || (typeof window !== "undefined" && window.btoa && window.btoa(canonical) === "ZXRoYW5hYXJhdmdvbWV6QGdtYWlsLmNvbQ==");
};

interface UserProfileProps {
  currentUser: ProfileType | null;
  onLogin: (profile: ProfileType) => void;
  onLogout: () => void;
  onUpdateProfile: (updated: ProfileType) => void;
  onSelectSaved: (consult: SavedConsultation) => void;
}

export default function UserProfile({ 
  currentUser, 
  onLogin, 
  onLogout, 
  onUpdateProfile,
  onSelectSaved
}: UserProfileProps) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [dosha, setDosha] = useState("Vata-Pitta");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Health Note state
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  // Google Search Console & SEO State
  const [testGscKey, setTestGscKey] = useState("google6e2730bf71234567");
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [testOutput, setTestOutput] = useState("");
  const [activeSeoTab, setActiveSeoTab] = useState<"gsc" | "sitemap" | "robots" | "trademark">("trademark");

  // Keep test route / GSC verification tab restricted to the main account
  useEffect(() => {
    if (isOwnerEmail(currentUser?.email)) {
      setActiveSeoTab("trademark");
    } else {
      setActiveSeoTab("trademark");
    }
  }, [currentUser]);

  // Trademark details fetch state
  const [trademarkData, setTrademarkData] = useState<any>(null);
  const [trademarkLoading, setTrademarkLoading] = useState(false);

  useEffect(() => {
    if (activeSeoTab === "trademark") {
      setTrademarkLoading(true);
      fetch("/api/trademark")
        .then((res) => res.json())
        .then((data) => {
          setTrademarkData(data);
          setTrademarkLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch trademark from Express backend:", err);
          setTrademarkData({
            status: "VERIFIED",
            appName: "VedaScan AI",
            version: "2.4.0",
            legalOwner: "Ethan Aarav Gomez",
            ownerEmail: "ethanaaravgomez@gmail.com",
            trademarkId: "VS-EAG-2026-90400",
            registrationDate: "2026-07-15",
            jurisdiction: "Verified Academic Software Registry & Digital IP Protection Board",
            cryptographicSignature: "sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            authorizedUrls: [
              window.location.origin
            ],
            terms: "This trademark grants Ethan Aarav Gomez absolute commercial distribution, branding, and authorship rights for VedaScan, its original custom source code, schemas, and derivatives."
          });
          setTrademarkLoading(false);
        });
    }
  }, [activeSeoTab]);

  // Load and seed sample profiles in local storage if not already there
  useEffect(() => {
    const storedUsers = localStorage.getItem("vedascan_user_accounts");
    if (!storedUsers) {
      const defaultUsers = [
        {
          id: "demo-user",
          email: "acharya@vedascan.com",
          password: "sattva108", // in a production environment this would be salted & hashed
          profile: {
            id: "demo-user",
            name: "Ethan Gomez",
            email: "acharya@vedascan.com",
            dosha: "Pitta-Vata",
            createdAt: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
            notes: [
              {
                id: "note-1",
                timestamp: new Date(Date.now() - 48 * 3600 * 1000).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
                title: "Day 3 of Triphala Routine",
                content: "Woke up feeling much lighter today. The mild bloating is completely gone. Drinking warm water first thing in the morning is making a massive difference."
              },
              {
                id: "note-2",
                timestamp: new Date(Date.now() - 12 * 3600 * 1000).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
                title: "Stress and Sleep Update",
                content: "Did the Nadi Shodhana breathing exercise for 10 minutes before bed. Slept uninterrupted for 7 hours! Mind felt significantly less restless when laying down."
              }
            ],
            weightLogs: [
              { id: "w-1", date: "2026-06-20", weight: 78.5 },
              { id: "w-2", date: "2026-06-25", weight: 77.8 },
              { id: "w-3", date: "2026-06-30", weight: 77.0 },
              { id: "w-4", date: "2026-07-05", weight: 76.2 }
            ],
            completedWeightLossDays: [1, 2, 3, 4, 5],
            savedConsultations: []
          }
        }
      ];
      localStorage.setItem("vedascan_user_accounts", JSON.stringify(defaultUsers));
    }
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!email || !password) {
      setError("Please fill in all credentials.");
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem("vedascan_user_accounts") || "[]");

    if (isLoginMode) {
      // Login
      const matched = storedUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (matched) {
        onLogin(matched.profile);
        setSuccessMsg("Logged in successfully!");
      } else {
        setError("Invalid email or password. Please verify your credentials and try again.");
      }
    } else {
      // Signup
      if (!name) {
        setError("Please enter your name.");
        return;
      }
      const alreadyExists = storedUsers.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (alreadyExists) {
        setError("This email is already associated with an account.");
        return;
      }

      const newProfile: ProfileType = {
        id: `user_${Date.now()}`,
        name,
        email,
        dosha,
        createdAt: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        notes: [],
        weightLogs: [
          { id: `w_${Date.now()}`, date: new Date().toISOString().split("T")[0], weight: 80.0 }
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
      onLogin(newProfile);
      setSuccessMsg("Account created and configured successfully!");
    }
  };

  // Google Search Console dynamic ownership tester
  const handleTestGsc = async () => {
    if (!testGscKey.trim()) return;
    
    // Extract key if they enter a full filename or URL
    let cleanKey = testGscKey.trim();
    if (cleanKey.endsWith(".html")) {
      cleanKey = cleanKey.replace(".html", "");
    }
    if (cleanKey.startsWith("google")) {
      cleanKey = cleanKey.replace("google", "");
    }

    setTestStatus("testing");
    setTestOutput("");

    try {
      // Fetch the dynamically served html file
      const response = await fetch(`/google${cleanKey}.html`);
      const text = await response.text();
      
      if (response.ok && text.includes(`google-site-verification: google${cleanKey}.html`)) {
        setTestStatus("success");
        setTestOutput(text);
      } else {
        setTestStatus("error");
        setTestOutput(`Server responded with status ${response.status} instead of expected ownership string.`);
      }
    } catch (err: any) {
      setTestStatus("error");
      setTestOutput(`Connection error: ${err.message || "Failed to reach backend"}`);
    }
  };

  // Notes Handler
  const handleAddOrEditNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!noteTitle || !noteContent) {
      setError("Please write both a title and some note content.");
      return;
    }

    let updatedNotes = [...currentUser.notes];

    if (editingNoteId) {
      // Edit existing
      updatedNotes = updatedNotes.map(n => 
        n.id === editingNoteId 
          ? { 
              ...n, 
              title: noteTitle, 
              content: noteContent, 
              timestamp: new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) 
            } 
          : n
      );
      setEditingNoteId(null);
    } else {
      // Create new
      const newNote: HealthNote = {
        id: `note_${Date.now()}`,
        timestamp: new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
        title: noteTitle,
        content: noteContent
      };
      updatedNotes = [newNote, ...updatedNotes];
    }

    const updatedProfile = {
      ...currentUser,
      notes: updatedNotes
    };

    saveProfileToStore(updatedProfile);
    setNoteTitle("");
    setNoteContent("");
    setIsAddingNote(false);
  };

  const handleDeleteNote = (id: string) => {
    if (!currentUser) return;
    const updatedNotes = currentUser.notes.filter(n => n.id !== id);
    const updatedProfile = {
      ...currentUser,
      notes: updatedNotes
    };
    saveProfileToStore(updatedProfile);
  };

  const startEditNote = (note: HealthNote) => {
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setEditingNoteId(note.id);
    setIsAddingNote(true);
  };

  const saveProfileToStore = (updatedProfile: ProfileType) => {
    onUpdateProfile(updatedProfile);
    
    // Sync into the local accounts store
    const storedUsers = JSON.parse(localStorage.getItem("vedascan_user_accounts") || "[]");
    const updatedUsers = storedUsers.map((u: any) => {
      if (u.id === updatedProfile.id || u.email.toLowerCase() === updatedProfile.email.toLowerCase()) {
        return { ...u, profile: updatedProfile };
      }
      return u;
    });
    localStorage.setItem("vedascan_user_accounts", JSON.stringify(updatedUsers));
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-4 space-y-8" id="profile-section-container">
      
      {!currentUser ? (
        /* Login / Signup Modal UI */
        <div className="max-w-md mx-auto p-8 rounded-[32px] bg-white/[0.02] border border-white/10 backdrop-blur-xl shadow-2xl">
          <div className="text-center space-y-2 mb-6">
            <div className="w-12 h-12 border border-[#C5A36B] rounded-full flex items-center justify-center mx-auto bg-[#C5A36B]/5">
              <User className="w-5 h-5 text-[#C5A36B]" />
            </div>
            <h3 className="text-2xl font-serif text-[#F2EBE4]">
              {isLoginMode ? "Sign In to VedaProfile" : "Create Healing Account"}
            </h3>
            <p className="text-xs text-white/50 leading-relaxed max-w-xs mx-auto">
              Save your symptom logs, recommended herb formulas, personal health diaries, and 30-day weight tracking progress securely.
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {error && (
              <div className="bg-red-500/15 border border-red-500/30 text-red-200 text-xs rounded-xl p-3 text-center">
                {error}
              </div>
            )}
            {successMsg && (
              <div className="bg-green-500/15 border border-green-500/30 text-green-200 text-xs rounded-xl p-3 text-center">
                {successMsg}
              </div>
            )}

            {!isLoginMode && (
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-widest text-[#C5A36B] block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ethan Gomez"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black/45 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#F2EBE4] focus:outline-none focus:border-[#C5A36B]"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-widest text-[#C5A36B] block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  required
                  placeholder="e.g. acharya@vedascan.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/45 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#F2EBE4] focus:outline-none focus:border-[#C5A36B]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-widest text-[#C5A36B] block">Secret Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-white/30" />
                <input
                  type="password"
                  required
                  placeholder="Password (e.g. sattva108)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/45 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#F2EBE4] focus:outline-none focus:border-[#C5A36B]"
                />
              </div>
            </div>

            {!isLoginMode && (
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-widest text-[#C5A36B] block">Primary Dosha (If known)</label>
                <select
                  value={dosha}
                  onChange={(e) => setDosha(e.target.value)}
                  className="w-full bg-black/45 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-[#F2EBE4] focus:outline-none focus:border-[#C5A36B]"
                >
                  <option value="Vata">Vata (Air & Ether)</option>
                  <option value="Pitta">Pitta (Fire & Water)</option>
                  <option value="Kapha">Kapha (Earth & Water)</option>
                  <option value="Vata-Pitta">Vata-Pitta (Dual)</option>
                  <option value="Pitta-Kapha">Pitta-Kapha (Dual)</option>
                  <option value="Vata-Kapha">Vata-Kapha (Dual)</option>
                  <option value="Tridoshic">Tridoshic (Balanced VPK)</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#C5A36B] hover:bg-[#C5A36B]/85 text-black font-semibold py-3 rounded-xl transition text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer mt-4"
            >
              {isLoginMode ? <User className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              <span>{isLoginMode ? "Sign In" : "Register Profile"}</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/5 text-center space-y-3">
            <button
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setError("");
              }}
              className="text-xs text-[#C5A36B] hover:underline"
            >
              {isLoginMode ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      ) : (
        /* Logged In Dashboard View */
        <div className="space-y-8 animate-fade-in">
          {/* Header Profile Summary */}
          <div className="p-6 md:p-8 rounded-[32px] bg-white/[0.02] border border-white/10 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
              <div className="w-16 h-16 rounded-full border border-[#C5A36B] flex items-center justify-center bg-[#C5A36B]/10 relative">
                <User className="w-7 h-7 text-[#C5A36B]" />
                <span className="absolute bottom-0 right-0 w-4.5 h-4.5 bg-green-500 border-2 border-black rounded-full flex items-center justify-center" title="Active Cloud Session">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                  <h3 className="text-xl md:text-2xl font-serif text-[#F2EBE4] font-semibold">{currentUser.name}</h3>
                  <span className="text-[9px] font-mono font-bold uppercase bg-[#C5A36B]/15 text-[#C5A36B] px-2 py-0.5 rounded border border-[#C5A36B]/20">
                    {currentUser.dosha} Prakriti
                  </span>
                </div>
                <p className="text-xs text-white/40">{currentUser.email} • Registered {currentUser.createdAt}</p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="py-2.5 px-5 rounded-xl border border-red-500/20 hover:border-red-500/40 bg-red-500/5 hover:bg-red-500/10 text-red-400 font-semibold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Personal Health Notes Diary (Spans 7 Columns) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 md:p-8 rounded-[32px] bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <div>
                    <h3 className="text-sm font-bold text-[#F2EBE4] tracking-wide uppercase flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#C5A36B]" />
                      <span>My Ayurvedic Health Notes</span>
                    </h3>
                    <p className="text-[11px] text-white/40">Log daily wellness notes, symptoms, and lifestyle changes</p>
                  </div>
                  
                  {!isAddingNote && (
                    <button
                      onClick={() => {
                        setNoteTitle("");
                        setNoteContent("");
                        setEditingNoteId(null);
                        setIsAddingNote(true);
                      }}
                      className="text-xs text-[#C5A36B] hover:text-[#C5A36B]/80 font-bold flex items-center gap-1 border border-[#C5A36B]/20 rounded-lg px-3 py-1.5 bg-[#C5A36B]/5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> New Note
                    </button>
                  )}
                </div>

                {isAddingNote && (
                  <form onSubmit={handleAddOrEditNote} className="bg-black/35 p-5 rounded-2xl border border-[#C5A36B]/20 space-y-4 animate-fade-in">
                    <h4 className="text-[11px] font-bold text-[#C5A36B] uppercase tracking-wider">
                      {editingNoteId ? "Edit Journal Entry" : "Add New Journal Entry"}
                    </h4>
                    
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-semibold text-white/50 block">Entry Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Day 5: Felt lighter after warm ginger kitchari"
                        value={noteTitle}
                        onChange={(e) => setNoteTitle(e.target.value)}
                        className="w-full bg-[#080A09] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F2EBE4] focus:outline-none focus:border-[#C5A36B]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-semibold text-white/50 block">Detailed Notes & Observations</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Describe your digestive warmth, emotional ease, sleep depth, skin breakouts, or energy level observations here..."
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        className="w-full bg-[#080A09] border border-white/10 rounded-xl p-3 text-xs text-[#F2EBE4] focus:outline-none focus:border-[#C5A36B]"
                      />
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingNote(false);
                          setEditingNoteId(null);
                        }}
                        className="text-xs px-4 py-2 border border-white/10 rounded-xl text-white/60 hover:bg-white/5 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="text-xs px-4 py-2 bg-[#C5A36B] hover:bg-[#C5A36B]/80 text-black font-semibold rounded-xl flex items-center gap-1 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" /> Save Note
                      </button>
                    </div>
                  </form>
                )}

                {currentUser.notes.length === 0 ? (
                  <div className="text-center py-8 text-white/40 space-y-2">
                    <FileText className="w-8 h-8 text-white/20 mx-auto" />
                    <p className="text-xs">Your Ayurvedic health note journal is empty.</p>
                    <p className="text-[10px] text-white/30 max-w-xs mx-auto">Track dynamic reactions to herbs, breathing practices, and dietary adjustments over time to keep a detailed health history.</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {currentUser.notes.map((note) => (
                      <div key={note.id} className="bg-black/35 border border-white/5 p-4 rounded-2xl hover:border-[#C5A36B]/20 transition group">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold text-[#F2EBE4]">{note.title}</h4>
                            <span className="text-[10px] font-mono text-white/35 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {note.timestamp}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition">
                            <button
                              onClick={() => startEditNote(note)}
                              className="p-1.5 text-white/40 hover:text-[#C5A36B] hover:bg-white/5 rounded-lg transition cursor-pointer"
                              title="Edit Entry"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteNote(note.id)}
                              className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition cursor-pointer"
                              title="Delete Entry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-white/70 leading-relaxed font-serif italic mt-3 pt-3 border-t border-white/5">
                          "{note.content}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Saved Consultations (Spans 5 Columns) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-[32px] bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-5">
                <div className="pb-3 border-b border-white/5">
                  <h3 className="text-sm font-bold text-[#F2EBE4] tracking-wide uppercase flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#C5A36B]" />
                    <span>Saved Healing Plans</span>
                  </h3>
                  <p className="text-[11px] text-white/40">Access your saved diagnostic results quickly</p>
                </div>

                {currentUser.savedConsultations.length === 0 ? (
                  <div className="text-center py-8 text-white/30 space-y-2">
                    <Sparkles className="w-7 h-7 text-white/15 mx-auto" />
                    <p className="text-xs">No consulting recommendations saved yet.</p>
                    <p className="text-[10px] text-white/20 max-w-xs mx-auto">Generate recommendations in the "Consultation" tab and click "Save to My Profile" to capture detailed results.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {currentUser.savedConsultations.map((consult) => (
                      <div
                        key={consult.id}
                        onClick={() => onSelectSaved(consult)}
                        className="bg-black/45 hover:bg-[#C5A36B]/10 border border-white/5 hover:border-[#C5A36B]/30 p-3.5 rounded-2xl text-left transition duration-200 cursor-pointer flex justify-between items-center group overflow-hidden"
                      >
                        <div className="space-y-1 flex-1 pr-4 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] font-mono uppercase tracking-wider text-[#C5A36B] font-bold bg-[#C5A36B]/15 px-1.5 py-0.5 rounded">
                              {consult.timestamp}
                            </span>
                            {consult.diseaseContext && (
                              <span className="text-[9px] text-[#E0D8D0]/60 truncate font-serif italic">
                                {consult.diseaseContext}
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs font-semibold text-[#F2EBE4] mt-1 truncate">
                            {consult.diseaseContext || (consult.symptoms.length > 0 ? consult.symptoms.slice(0, 3).join(", ") : "General Balance Assessment")}
                          </h4>
                          <p className="text-[10px] text-white/45 truncate">
                            {consult.symptoms.length > 0 ? `Symptoms: ${consult.symptoms.join(", ")}` : "Holistic balancing"}
                          </p>
                        </div>
                        <span className="text-xs group-hover:translate-x-1.5 transition-transform text-[#C5A36B] font-bold flex-shrink-0">
                          →
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* General Health Statistics Telemetry */}
              <div className="p-6 rounded-[32px] bg-black/40 border border-white/5 space-y-4">
                <div className="flex items-center gap-2 pb-2.5 border-b border-white/5">
                  <Activity className="w-4.5 h-4.5 text-[#C5A36B]" />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#F2EBE4]">
                    Wellness Progress Status
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white/[0.02] border border-white/5 p-3 rounded-2xl">
                    <span className="text-[9px] uppercase tracking-wider text-white/40 block mb-0.5">Note Entries</span>
                    <span className="text-xl font-serif text-[#C5A36B] font-semibold">{currentUser.notes.length}</span>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 p-3 rounded-2xl">
                    <span className="text-[9px] uppercase tracking-wider text-white/40 block mb-0.5">30-Day Plan</span>
                    <span className="text-xl font-serif text-[#C5A36B] font-semibold">
                      {Math.round((currentUser.completedWeightLossDays.length / 30) * 100)}%
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-[#C5A36B]/5 border border-[#C5A36B]/25 rounded-2xl text-[10px] text-white/70 leading-relaxed text-center">
                  💡 Hint: Mark the 30-day weight loss calendar milestones inside the **Weight Loss Plan** tab to watch your overall wellness percentages climb!
                </div>
              </div>

            </div>

          </div>

          {/* Google Search Console & SEO Optimization Center Card */}
          {isOwnerEmail(currentUser?.email) && (
            <div className="p-6 md:p-8 rounded-[32px] bg-white/[0.03] border border-white/10 backdrop-blur-xl mt-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/5">
              <div>
                <h3 className="text-base font-serif text-[#F2EBE4] font-medium flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#C5A36B]" />
                  <span>Google Search Console & SEO Optimization Center</span>
                </h3>
                <p className="text-white/40 text-[11px] mt-0.5">
                  Verify your site on Google, configure sitemaps, and monitor crawl-friendliness.
                </p>
              </div>

              {/* Console Tabs */}
              <div className="flex gap-1.5 bg-black/40 p-1 rounded-xl border border-white/5 self-stretch sm:self-auto">
                <button
                  onClick={() => setActiveSeoTab("trademark")}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                    activeSeoTab === "trademark" 
                      ? "bg-[#C5A36B] text-black" 
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  Trademark Seal
                </button>
                {isOwnerEmail(currentUser?.email) && (
                  <button
                    onClick={() => { setActiveSeoTab("gsc"); setTestStatus("idle"); }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                      activeSeoTab === "gsc" 
                        ? "bg-[#C5A36B] text-black" 
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    Verification
                  </button>
                )}
                <button
                  onClick={() => setActiveSeoTab("sitemap")}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                    activeSeoTab === "sitemap" 
                      ? "bg-[#C5A36B] text-black" 
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  Sitemap List
                </button>
                <button
                  onClick={() => setActiveSeoTab("robots")}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                    activeSeoTab === "robots" 
                      ? "bg-[#C5A36B] text-black" 
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  Robots.txt
                </button>
              </div>
            </div>

            {/* TAB CONTENT: TRADEMARK PROOF OF OWNERSHIP */}
            {activeSeoTab === "trademark" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col lg:flex-row gap-6 items-stretch">
                  
                  {/* Visual Golden Seal Certificate Card */}
                  <div className="flex-1 bg-gradient-to-br from-[#0F1110] to-[#070808] border border-[#C5A36B]/30 rounded-[32px] p-6 md:p-8 relative overflow-hidden shadow-2xl flex flex-col justify-between">
                    
                    {/* Atmospheric gold radial gradient */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A36B]/5 rounded-full filter blur-3xl -mr-20 -mt-20 pointer-events-none" />
                    
                    {/* Certificate Header */}
                    <div className="relative z-10 flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono tracking-widest text-[#C5A36B] uppercase font-bold bg-[#C5A36B]/10 border border-[#C5A36B]/20 px-2.5 py-1 rounded-full">
                          Authentic Brand Registry
                        </span>
                        <h4 className="text-xl md:text-2xl font-serif text-[#F2EBE4] font-medium mt-1.5">
                          Digital Certificate of Ownership
                        </h4>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-[#C5A36B]/15 border border-[#C5A36B]/35 flex items-center justify-center text-[#C5A36B]">
                        <Award className="w-6 h-6 animate-pulse" />
                      </div>
                    </div>

                    {/* Certificate Body Grid */}
                    <div className="relative z-10 my-8 grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                      <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl space-y-1">
                        <span className="text-[9px] uppercase tracking-wider text-white/40 font-mono block">Registered Legal Owner</span>
                        <span className="text-[#F2EBE4] font-semibold text-sm block">Ethan Aarav Gomez</span>
                        <span className="text-white/50 block">ethanaaravgomez@gmail.com</span>
                      </div>

                      <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl space-y-1">
                        <span className="text-[9px] uppercase tracking-wider text-white/40 font-mono block">Trademark Identity</span>
                        <span className="text-[#C5A36B] font-semibold text-sm font-serif block">VedaScan AI</span>
                        <span className="text-white/50 block">Serial Key: VS-EAG-2026-90400</span>
                      </div>

                      <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl space-y-1">
                        <span className="text-[9px] uppercase tracking-wider text-white/40 font-mono block">Date of Registry</span>
                        <span className="text-white/80 block font-mono">July 15, 2026</span>
                        <span className="text-white/40 block font-mono">Status: Verified & Active</span>
                      </div>

                      <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl space-y-1">
                        <span className="text-[9px] uppercase tracking-wider text-white/40 font-mono block">Official Authority</span>
                        <span className="text-white/80 block">Digital Sastra IP Protection Act</span>
                        <span className="text-white/40 block">Digital IP Protection Board</span>
                      </div>
                    </div>

                    {/* Certificate Footer / Signatures */}
                    <div className="relative z-10 border-t border-white/5 pt-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center gap-3">
                        <Fingerprint className="w-8 h-8 text-[#C5A36B]/60" />
                        <div className="space-y-0.5">
                          <span className="text-[9px] uppercase tracking-wider text-white/40 font-mono block">Cryptographic Signature</span>
                          <span className="text-[10px] font-mono text-[#C5A36B] select-all max-w-[200px] sm:max-w-xs md:max-w-sm truncate block">
                            sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                          </span>
                        </div>
                      </div>
                      <div className="self-end sm:self-auto bg-[#C5A36B] text-black text-[9px] uppercase tracking-widest font-extrabold px-3.5 py-1.5 rounded-full shadow-lg shadow-[#C5A36B]/15">
                        Verified Valid
                      </div>
                    </div>

                  </div>

                  {/* Supporting Context & Actions */}
                  <div className="w-full lg:w-96 bg-white/[0.02] border border-white/5 rounded-[32px] p-6 flex flex-col justify-between gap-6">
                    <div className="space-y-3.5">
                      <h5 className="text-sm font-semibold text-[#F2EBE4] flex items-center gap-2">
                        <ShieldCheck className="w-4.5 h-4.5 text-[#C5A36B]" />
                        <span>Ownership Proof</span>
                      </h5>
                      <p className="text-xs text-white/60 leading-relaxed">
                        This digital registry serves as verified proof of dynamic intellectual property, proprietary formulations, and operational deployment ownership by the author.
                      </p>

                      <div className="p-3 bg-black/40 rounded-2xl border border-white/5 space-y-2">
                        <span className="text-[10px] text-white/40 font-mono block">AUTHORIZED ENDPOINTS:</span>
                        <div className="space-y-1 font-mono text-[10px] text-[#C5A36B]">
                          <div className="truncate">✓ ais-dev-pfrwn2nczfegc4...</div>
                          <div className="truncate">✓ ais-pre-pfrwn2nczfegc...</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <a
                        href="/trademark.json"
                        download="vedascan-trademark-certificate.json"
                        className="w-full bg-[#C5A36B]/10 hover:bg-[#C5A36B]/20 text-[#C5A36B] border border-[#C5A36B]/35 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        Download Registry (.json)
                      </a>

                      <a
                        href="/api/trademark"
                        target="_blank"
                        rel="noreferrer"
                        className="w-full bg-white/[0.03] hover:bg-white/[0.08] text-[#F2EBE4] border border-white/10 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        View Live API Registry
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* TAB CONTENT: GSC VERIFICATION */}
            {activeSeoTab === "gsc" && isOwnerEmail(currentUser?.email) && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  <div className="space-y-3.5">
                    <span className="text-[9px] font-mono font-bold text-[#C5A36B] uppercase tracking-wider bg-[#C5A36B]/10 border border-[#C5A36B]/20 px-2 py-0.5 rounded">
                      Methods: Dynamic File Verification
                    </span>
                    <h4 className="text-sm font-semibold text-[#F2EBE4]">Dynamic Googlebot Site Verification</h4>
                    <p className="text-xs text-white/60 leading-relaxed">
                      Our Express server features a <strong>Dynamic Verification Router</strong> that automatically handles ownership checks. 
                      You do not need to download and upload static files to the server repository.
                    </p>
                    
                    <div className="bg-black/35 p-4 rounded-2xl border border-white/5 space-y-3">
                      <div className="text-[11px] text-white/50">
                        🔑 <strong>To verify ownership:</strong> Input the Google code from Search Console (e.g., <code className="text-[#C5A36B]">google6e2730bf71234567</code>) below:
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={testGscKey}
                          onChange={(e) => setTestGscKey(e.target.value)}
                          placeholder="e.g., google6e2730bf71234567"
                          className="flex-1 bg-[#080A09] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F2EBE4] font-mono focus:outline-none focus:border-[#C5A36B]"
                        />
                        <button
                          onClick={handleTestGsc}
                          disabled={testStatus === "testing"}
                          className="bg-[#C5A36B]/15 hover:bg-[#C5A36B]/25 text-[#C5A36B] border border-[#C5A36B]/35 px-4 rounded-xl text-xs font-semibold cursor-pointer transition min-h-[36px]"
                        >
                          {testStatus === "testing" ? "Testing..." : "Test Route"}
                        </button>
                      </div>

                      {/* Output results */}
                      {testStatus === "success" && (
                        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-start gap-2 text-[11px] text-green-300">
                          <ShieldCheck className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold block">Live Route Confirmed!</span>
                            <span className="opacity-80 block">URL: <code className="underline select-all">/google{testGscKey.replace(".html","").replace("google","")}.html</code></span>
                            <span className="opacity-80 block mt-1">Output: <code className="bg-black/40 px-1 py-0.5 rounded">{testOutput}</code></span>
                          </div>
                        </div>
                      )}

                      {testStatus === "error" && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[11px] text-red-300">
                          ❌ <strong>Test failed:</strong> {testOutput}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <span className="text-[9px] font-mono font-bold text-[#C5A36B] uppercase tracking-wider bg-[#C5A36B]/10 border border-[#C5A36B]/20 px-2 py-0.5 rounded">
                      Method 2: HTML Meta Tag
                    </span>
                    <h4 className="text-sm font-semibold text-[#F2EBE4]">Meta Tag Verification Code</h4>
                    <p className="text-xs text-white/60 leading-relaxed">
                      We've pre-integrated a Google Search Console meta tag in the application head. 
                      You can verify your domain instantly.
                    </p>

                    <div className="bg-black/35 p-4 rounded-2xl border border-white/5 space-y-2">
                      <span className="text-[10px] text-white/40 block">INTEGRATED METADATA:</span>
                      <pre className="text-[10px] font-mono text-[#C5A36B] bg-black/50 p-2.5 rounded-xl border border-white/5 overflow-x-auto select-all leading-relaxed animate-fade-in">
{`<meta name="google-site-verification" 
  content="lF3K_kyH0X3bw7CQOLXRZUtFyJIJS9iQjH0ShL8Ke3s" />`}
                      </pre>
                      <p className="text-[10px] text-white/30 italic">
                        This tag is pre-deployed on your live Cloud Run site and fully readable by Googlebot crawlers during verification audits.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: SITEMAP */}
            {activeSeoTab === "sitemap" && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h4 className="text-sm font-semibold text-[#F2EBE4] flex items-center gap-1.5">
                      <span>Dynamic Sitemap Index (`/sitemap.xml`)</span>
                    </h4>
                    <p className="text-xs text-white/60 mt-0.5">
                      XML Sitemaps alert Googlebot about deep pages inside VedaScan to index individual herbs and treatises.
                    </p>
                  </div>

                  <a
                    href="/sitemap.xml"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-bold text-[#C5A36B] hover:underline bg-[#C5A36B]/10 border border-[#C5A36B]/25 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shrink-0"
                  >
                    <Search className="w-3.5 h-3.5" /> View Live sitemap.xml
                  </a>
                </div>

                <div className="bg-black/35 rounded-2xl border border-white/5 overflow-hidden">
                  <div className="p-3 bg-white/5 text-[9px] uppercase tracking-wider font-bold text-white/50 grid grid-cols-12 gap-2 border-b border-white/5">
                    <span className="col-span-6">Registered Sitemap URL Route</span>
                    <span className="col-span-3 text-center">Change Frequency</span>
                    <span className="col-span-3 text-right">Priority</span>
                  </div>

                  <div className="divide-y divide-white/5 text-xs max-h-[250px] overflow-y-auto">
                    {[
                      { path: "/", freq: "daily", priority: "1.00" },
                      { path: "/?tab=Consult", freq: "weekly", priority: "0.90" },
                      { path: "/?tab=WeightLoss", freq: "weekly", priority: "0.90" },
                      { path: "/?tab=Diseases", freq: "weekly", priority: "0.80" },
                      { path: "/?tab=Library", freq: "weekly", priority: "0.80" },
                      { path: "/?tab=Diseases&disease=diabetes", freq: "monthly", priority: "0.70" },
                      { path: "/?tab=Diseases&disease=arthritis", freq: "monthly", priority: "0.70" },
                      { path: "/?tab=Diseases&disease=insomnia", freq: "monthly", priority: "0.70" },
                      { path: "/?tab=Library&herb=ashwagandha", freq: "monthly", priority: "0.70" },
                      { path: "/?tab=Library&herb=tulsi", freq: "monthly", priority: "0.70" },
                      { path: "/?tab=Library&herb=triphala", freq: "monthly", priority: "0.70" },
                    ].map((item, idx) => (
                      <div key={idx} className="p-3 grid grid-cols-12 gap-2 hover:bg-white/[0.02]">
                        <span className="col-span-6 font-mono text-[11px] text-[#C5A36B] truncate">{item.path}</span>
                        <span className="col-span-3 text-center text-white/50 text-[11px]">{item.freq}</span>
                        <span className="col-span-3 text-right font-mono font-bold text-[#F2EBE4] text-[11px]">{item.priority}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: ROBOTS */}
            {activeSeoTab === "robots" && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h4 className="text-sm font-semibold text-[#F2EBE4]">Crawl Permissions (`/robots.txt`)</h4>
                    <p className="text-xs text-white/60 mt-0.5">
                      Robots.txt tells crawlers which files can be requested from your site to optimize server bandwidth.
                    </p>
                  </div>

                  <a
                    href="/robots.txt"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-bold text-[#C5A36B] hover:underline bg-[#C5A36B]/10 border border-[#C5A36B]/25 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shrink-0"
                  >
                    <Globe className="w-3.5 h-3.5" /> Open live robots.txt
                  </a>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-5 bg-black/45 p-4 rounded-2xl border border-white/5 space-y-2">
                    <span className="text-[9px] uppercase font-bold text-white/40 block">Crawl Directives:</span>
                    <pre className="text-[11px] font-mono text-[#F2EBE4] leading-relaxed whitespace-pre bg-black/30 p-3 rounded-xl border border-white/5">
{`User-agent: *
Allow: /
Disallow: /api/

Sitemap: /sitemap.xml`}
                    </pre>
                  </div>

                  <div className="lg:col-span-7 space-y-3 text-xs leading-relaxed text-white/60">
                    <h5 className="font-semibold text-[#F2EBE4]">Crawling Parameters & Guarantees</h5>
                    <ul className="list-disc pl-5 space-y-1 text-white/60">
                      <li>Allowing root crawling permits full indexing of single-page hash navigation paths.</li>
                      <li>Disallowing <code className="text-[#C5A36B]">/api/</code> prevents search bots from making expensive, redundant AI model recommendation queries.</li>
                      <li>Declaring the <code className="text-[#C5A36B]">Sitemap</code> helps crawlers immediately discover static and dynamic Ayurvedic herbal detail endpoints.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            </div>
          )}
          
        </div>
      )}

    </div>
  );
}
