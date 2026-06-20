import React, { useState } from "react";
import { DiseaseStudy } from "../data/diseases";
import { 
  Heart, 
  Activity, 
  Leaf, 
  Flame, 
  Compass, 
  BookOpen, 
  Sparkles, 
  Search, 
  ChevronRight, 
  ChevronDown 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DiseaseTreatisesProps {
  diseases: DiseaseStudy[];
  onApplyDiseaseToForm?: (diseaseName: string) => void;
}

export default function DiseaseTreatises({ diseases, onApplyDiseaseToForm }: DiseaseTreatisesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<string | null>(null);

  const filteredDiseases = diseases.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.sanskritName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 md:p-8 backdrop-blur-xl relative overflow-hidden">
      {/* Decorative Atmosphere Element */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#C5A36B]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="mb-6 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-[#C5A36B] uppercase bg-[#C5A36B]/15 border border-[#C5A36B]/30 px-3 py-1 rounded-full">
            Nidan Prasava (Sastra Clinic)
          </span>
          <h2 className="text-2xl font-serif text-[#F2EBE4] mt-3 font-semibold">
            Common Diseases & Ayurvedic Treatises
          </h2>
          <p className="text-[#E0D8D0]/70 text-xs mt-1 max-w-2xl leading-relaxed">
            Click any chronic pathology to read Ayurvedic diagnostic causes, aggravated Dosha structures, dietary protocols (Pathya/Apathya), and classic herb compositions.
          </p>
        </div>

        {/* Applying instructions */}
        {onApplyDiseaseToForm && (
          <span className="text-[10px] text-[#C5A36B] tracking-wide bg-[#C5A36B]/5 px-3 py-1.5 rounded-xl border border-[#C5A36B]/20">
            ✦ Quick Apply: Pre-loads state directly to your active consultation card
          </span>
        )}
      </div>

      {/* Search Input */}
      <div className="mb-6 relative z-10 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C5A36B]/80 w-4 h-4" />
        <input
          id="disease-search-input"
          type="text"
          className="w-full bg-black/45 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#F2EBE4] placeholder-white/30 focus:outline-none focus:border-[#C5A36B]/60 transition"
          placeholder="Search clinical diseases (e.g. diabetes, arthritis, acid)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 text-xs cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Grid of Diseases Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
        
        {/* Left Side: Disease List Index buttons (Spans 4 columns) */}
        <div className="md:col-span-4 space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
          {filteredDiseases.map((d) => {
            const isSelected = selectedDiseaseId === d.id;
            return (
              <button
                id={`disease-idx-btn-${d.id}`}
                key={d.id}
                onClick={() => setSelectedDiseaseId(isSelected ? null : d.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between cursor-pointer group ${
                  isSelected
                    ? "bg-[#C5A36B] text-black border-[#C5A36B] shadow-lg shadow-[#C5A36B]/10"
                    : "bg-black/35 text-[#E0D8D0] border-white/5 hover:border-white/20 hover:bg-black/50"
                }`}
              >
                <div>
                  <h4 className={`text-sm font-serif font-bold ${isSelected ? "text-black" : "text-[#F2EBE4]"}`}>
                    {d.name}
                  </h4>
                  <p className={`text-[11px] italic mt-0.5 ${isSelected ? "text-black/75" : "text-white/40"}`}>
                    Sanskrit: {d.sanskritName}
                  </p>
                </div>
                {isSelected ? (
                  <ChevronDown className="w-4 h-4 text-black flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-[#C5A36B] group-hover:translate-x-0.5 transition flex-shrink-0" />
                )}
              </button>
            );
          })}

          {filteredDiseases.length === 0 && (
            <div className="p-6 text-center text-[#E0D8D0]/50 border border-white/10 rounded-2xl">
              No diseases matching search terms.
            </div>
          )}
        </div>

        {/* Right Side: Detailed analysis panel (Spans 8 columns) */}
        <div className="md:col-span-8 h-full">
          <AnimatePresence mode="wait">
            {selectedDiseaseId ? (() => {
              const selectedItem = diseases.find((d) => d.id === selectedDiseaseId);
              if (!selectedItem) return null;
              return (
                <motion.div
                  id={`disease-detail-panel-${selectedItem.id}`}
                  key={selectedItem.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                  className="bg-black/30 border border-white/10 p-6 md:p-8 rounded-[28px] h-full space-y-6 flex flex-col justify-between"
                >
                  <div className="space-y-6">
                    {/* Header Details */}
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-white/5">
                      <div>
                        <span className="text-[9px] font-mono tracking-widest text-[#C5A36B] font-bold uppercase block mb-1">
                          PATHOLOGICAL OVERVIEW
                        </span>
                        <h3 className="text-2xl font-serif text-[#F2EBE4] font-bold">
                          {selectedItem.name} ({selectedItem.sanskritName})
                        </h3>
                      </div>
                      
                      {onApplyDiseaseToForm && (
                        <button
                          id={`apply-disease-btn-${selectedItem.id}`}
                          onClick={() => onApplyDiseaseToForm(selectedItem.name)}
                          className="bg-[#C5A36B] hover:bg-[#C5A36B]/85 text-black font-semibold text-[10px] tracking-wider uppercase px-4 py-2 rounded-xl transition cursor-pointer"
                        >
                          Apply to Consultation
                        </button>
                      )}
                    </div>

                    {/* Description Analysis */}
                    <div className="space-y-1.5">
                      <h4 className="text-[10px] uppercase tracking-widest text-[#C5A36B] font-bold">
                        Ayurvedic Background & Manifestation
                      </h4>
                      <p className="text-xs text-[#E0D8D0]/95 leading-relaxed bg-[#080A09]/40 p-4 rounded-xl border border-white/5">
                        {selectedItem.description}
                      </p>
                    </div>

                    {/* Dosha Breakdown */}
                    <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-xl flex items-start gap-3">
                      <Compass className="w-4 h-4 text-[#C5A36B] mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-[10px] uppercase font-bold text-[#C5A36B] tracking-widest">Aggravated Dosha Energy</h4>
                        <p className="text-white/85 text-xs mt-1 leading-relaxed">{selectedItem.doshaInfluence}</p>
                      </div>
                    </div>

                    {/* Dual Section Grid: Primary Herbs vs Classical Formulations */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Herbs block */}
                      <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl space-y-3">
                        <h5 className="text-[10px] font-bold tracking-widest text-[#C5A36B] uppercase flex items-center gap-1.5">
                          <Leaf className="w-3.5 h-3.5" /> Core Ayurvedic Herbs
                        </h5>
                        <ul className="space-y-2">
                          {selectedItem.primaryHerbs.map((ph, idx) => (
                            <li key={idx} className="text-xs">
                              <span className="font-serif text-[#F2EBE4] font-bold block">{ph.name}</span>
                              <span className="text-[#E0D8D0]/65 text-[11px] leading-snug block mt-0.5">{ph.action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Classical Formulations */}
                      <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl space-y-3">
                        <h5 className="text-[10px] font-bold tracking-widest text-[#C5A36B] uppercase flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5" /> Classical Sastric Remedies
                        </h5>
                        <ul className="space-y-2">
                          {selectedItem.classicalFormulations.map((cf, idx) => (
                            <li key={idx} className="text-xs">
                              <span className="font-serif text-[#F2EBE4] font-bold block">{cf.name}</span>
                              <span className="text-[#C5A36B] text-[10px] leading-snug block mt-0.5">Administer: {cf.administration}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Dual Section Grid: Diet (Ahar) vs Lifestyle (Vihar) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
                      {/* Diet Pathya & Apathya */}
                      <div className="space-y-3">
                        <h5 className="text-[10px] font-bold tracking-widest text-[#C5A36B] uppercase">
                          Dietary Regimen (Ahar)
                        </h5>
                        <div className="space-y-2">
                          <div className="text-[11px]">
                            <span className="text-emerald-400 font-bold bg-emerald-500/5 px-2 py-0.5 rounded mr-1">FAVOR</span>
                            <ul className="list-disc pl-4 mt-1 text-[#E0D8D0]/80 space-y-1">
                              {selectedItem.dietaryPathya.slice(0, 2).map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="text-[11px]">
                            <span className="text-red-400 font-bold bg-red-500/5 px-2 py-0.5 rounded mr-1">AVOID</span>
                            <ul className="list-disc pl-4 mt-1 text-[#E0D8D0]/80 space-y-1">
                              {selectedItem.dietaryApathya.slice(0, 2).map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Lifestyle (Vihar) Postures / Breathing */}
                      <div className="space-y-3">
                        <h5 className="text-[10px] font-bold tracking-widest text-[#C5A36B] uppercase">
                          Habits, Yoga & Pranayama (Vihar)
                        </h5>
                        <ul className="space-y-2">
                          {selectedItem.lifestyleVihar.map((tip, idx) => (
                            <li key={idx} className="text-xs text-[#E0D8D0]/85 flex items-start gap-1.5">
                              <span className="text-[#C5A36B] font-bold mt-0.5">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                  </div>

                  <div className="text-[10px] text-white/40 leading-relaxed text-center bg-black/40 p-3 rounded-xl border border-white/5">
                    Traditional overview provided according to Ayurvedic pharmacopoeia specifications. Ensure to seek qualified consultation before beginning medicinal therapies.
                  </div>
                </motion.div>
              );
            })() : (
              <div className="h-full min-h-[380px] bg-black/20 border border-white/5 border-dashed rounded-[28px] flex flex-col justify-center items-center text-center p-6">
                <BookOpen className="w-10 h-10 text-white/30 mb-3" />
                <h4 className="text-base text-white/80 font-serif">Pathology Index Panel</h4>
                <p className="text-xs text-white/50 max-w-sm mt-1 mb-4">
                  Please select one of the common clinical conditions from the list to reveal their comprehensive Ayurvedic treatment files.
                </p>
                <div className="flex gap-2">
                  {diseases.slice(0, 3).map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setSelectedDiseaseId(d.id)}
                      className="text-[10px] bg-white/5 text-white/60 px-3 py-1.5 rounded-lg border border-white/5 hover:bg-[#C5A36B]/20 hover:text-white transition cursor-pointer"
                    >
                      {d.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
