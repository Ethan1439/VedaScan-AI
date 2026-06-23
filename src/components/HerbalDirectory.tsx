import React, { useState } from "react";
import { Herb } from "../types";
import { Search, Compass, ShieldAlert, Heart, Info, X, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HerbalDirectoryProps {
  herbs: Herb[];
  onSelectHerbKeyword?: (keyword: string) => void;
}

export default function HerbalDirectory({ herbs, onSelectHerbKeyword }: HerbalDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDosha, setSelectedDosha] = useState<"All" | "Vata" | "Pitta" | "Kapha">("All");
  const [selectedHerb, setSelectedHerb] = useState<Herb | null>(null);
  const [showDeals, setShowDeals] = useState(false);

  // Filter logic
  const filteredHerbs = herbs.filter((herb) => {
    const matchesSearch =
      herb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      herb.sanskritName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      herb.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      herb.primaryIndications.some((ind) => ind.toLowerCase().includes(searchTerm.toLowerCase())) ||
      herb.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDosha =
      selectedDosha === "All" ||
      herb.doshaEffect.toLowerCase().includes(selectedDosha.toLowerCase()) ||
      herb.doshaEffect.toLowerCase().includes("tridoshic");

    return matchesSearch && matchesDosha;
  });

  return (
    <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 md:p-8 backdrop-blur-xl relative overflow-hidden">
      {/* Decorative Blur Background Element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A36B]/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Directory Header */}
      <div className="mb-6 relative z-10">
        <span className="text-[10px] font-bold tracking-widest text-[#C5A36B] uppercase bg-[#C5A36B]/15 border border-[#C5A36B]/30 px-3 py-1 rounded-full">
          Dravyaguna Vignan
        </span>
        <h2 className="text-2xl font-serif text-[#F2EBE4] mt-3 font-semibold">
          Sanskrit Herb & Remedy Reference Library
        </h2>
        <p className="text-[#E0D8D0]/70 text-xs mt-1 max-w-2xl leading-relaxed">
          Explore clinical and natural profiles of primary single herbs, adaptogens, and traditional synergy remedies. Click any card to apply or view Sanskrit properties.
        </p>
      </div>

      {/* Filters Segment */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6 relative z-10">
        {/* Search */}
        <div className="md:col-span-6 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C5A36B]/80 w-4 h-4" />
          <input
            id="herb-search-input"
            type="text"
            className="w-full bg-black/45 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#F2EBE4] placeholder-white/30 focus:outline-none focus:border-[#C5A36B]/60 transition"
            placeholder="Search by name, category, or indication (e.g. stress, cold, joints)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              id="clear-search-button"
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 text-xs cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Dosha Filter Buttons */}
        <div className="md:col-span-6 flex flex-wrap gap-1.5 items-center justify-start md:justify-end">
          <span className="text-xs font-medium text-[#E0D8D0]/60 mr-1.5 hidden lg:inline">Target Dosha:</span>
          {(["All", "Vata", "Pitta", "Kapha"] as const).map((dosha) => (
            <button
              id={`filter-dosha-${dosha}`}
              key={dosha}
              onClick={() => setSelectedDosha(dosha)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition ${
                selectedDosha === dosha
                  ? "bg-[#C5A36B] text-black shadow-lg shadow-[#C5A36B]/15"
                  : "bg-white/5 text-[#E0D8D0] border border-white/5 hover:bg-white/10"
              }`}
            >
              {dosha}
            </button>
          ))}
        </div>
      </div>

      {/* Herbs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        <AnimatePresence mode="popLayout">
          {filteredHerbs.map((herb, index) => (
            <motion.div
              id={`herb-card-${herb.id}`}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, delay: index * 0.03 }}
              key={herb.id}
              onClick={() => setSelectedHerb(herb)}
              className="group bg-black/35 p-5 rounded-2xl border border-white/5 hover:border-[#C5A36B]/40 shadow-xs hover:shadow-lg transition-all duration-350 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[9px] font-bold text-[#C5A36B] tracking-wider uppercase bg-[#C5A36B]/10 border border-[#C5A36B]/20 px-2 py-0.5 rounded-md">
                    {herb.category}
                  </span>
                  <div className="flex items-center text-[10px] text-amber-500 font-medium">
                    <Compass className="w-3 h-3 mr-1 text-[#C5A36B]" />
                    <span>Balance</span>
                  </div>
                </div>

                <h3 className="text-base font-serif text-[#F2EBE4] font-bold group-hover:text-[#C5A36B] transition mb-1">
                  {herb.name}
                </h3>
                <p className="text-[11px] italic text-[#E0D8D0]/55 mb-3">
                  {herb.sanskritName} • {herb.botanicalName}
                </p>

                <p className="text-[#E0D8D0]/75 text-xs line-clamp-3 mb-4 leading-relaxed">
                  {herb.description}
                </p>
              </div>

              <div>
                {/* Indications Tags */}
                <div className="flex flex-wrap gap-1 mb-3.5">
                  {herb.primaryIndications.slice(0, 3).map((ind, i) => (
                    <span
                      key={i}
                      onClick={(e) => {
                        if (onSelectHerbKeyword) {
                          e.stopPropagation();
                          onSelectHerbKeyword(ind);
                        }
                      }}
                      className="text-[9px] bg-white/5 text-[#E0D8D0]/80 border border-white/5 px-2 py-0.5 rounded-full hover:bg-[#C5A36B]/20 hover:text-[#F2EBE4] transition"
                    >
                      {ind}
                    </span>
                  ))}
                  {herb.primaryIndications.length > 3 && (
                    <span className="text-[9px] text-[#E0D8D0]/40 font-medium px-1.5 self-center">
                      +{herb.primaryIndications.length - 3}
                    </span>
                  )}
                </div>

                <div className="text-xs select-none text-[#C5A36B] font-semibold group-hover:underline flex items-center gap-1">
                  Preparation & Safety profiles →
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredHerbs.length === 0 && (
          <div className="col-span-full py-16 text-center bg-black/20 rounded-2xl border border-dashed border-white/10">
            <Info className="w-8 h-8 text-white/30 mx-auto mb-2" />
            <p className="text-white/60 font-medium text-sm">No herbs matching your filters loaded.</p>
            <button
              id="reset-search-filters"
              onClick={() => {
                setSearchTerm("");
                setSelectedDosha("All");
              }}
              className="text-xs text-[#C5A36B] mt-2 hover:underline cursor-pointer font-bold"
            >
              Reset active search & filters
            </button>
          </div>
        )}
      </div>

      {/* Modal detail overlay */}
      <AnimatePresence>
        {selectedHerb && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              id="modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setSelectedHerb(null); setShowDeals(false); }}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              id="herb-detail-modal"
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-2xl bg-[#0B0E0C] border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[85vh]"
            >
              {/* Header Banner */}
              <div className="bg-gradient-to-br from-[#131A16] to-[#080A09] p-6 border-b border-white/5 relative">
                <button
                  id="close-herb-modal"
                  onClick={() => { setSelectedHerb(null); setShowDeals(false); }}
                  className="absolute right-4 top-4 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-full transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                <span className="text-[9px] font-bold tracking-widest text-[#C5A36B] uppercase block mb-1">
                  {selectedHerb.category}
                </span>
                <h3 className="text-2xl font-serif text-[#F2EBE4] font-bold">{selectedHerb.name}</h3>
                <p className="text-[#E0D8D0]/70 text-xs italic mt-1 bg-black/25 px-2.5 py-1 rounded-md inline-block">
                  Sanskrit: <span className="font-semibold text-[#C5A36B]">{selectedHerb.sanskritName}</span> • Botanical: <span className="font-semibold text-[#F2EBE4]/80 tracking-wider font-mono">{selectedHerb.botanicalName}</span>
                </p>
              </div>

              {/* Modal Content Scrollable */}
              <div className="p-6 md:p-8 overflow-y-auto space-y-5 text-sm leading-relaxed text-[#E0D8D0]">
                {/* Description */}
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-[#C5A36B] font-bold mb-1.5">Therapeutic Context</h4>
                  <p className="text-[#E0D8D0]/80">{selectedHerb.description}</p>
                </div>

                {/* Dosha Influence */}
                <div className="bg-amber-500/5 border border-[#C5A36B]/20 p-4 rounded-xl flex items-start gap-3">
                  <Compass className="w-5 h-5 text-[#C5A36B] mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest text-[#C5A36B] font-bold">Ayurvedic Dosha Effect Map</h4>
                    <p className="text-white/90 text-xs mt-1 font-medium leading-relaxed">{selectedHerb.doshaEffect}</p>
                  </div>
                </div>

                {/* Benefits List */}
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-[#C5A36B] font-bold mb-2">Key Clinical Benefits</h4>
                  <ul className="space-y-1.5">
                    {selectedHerb.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-[#E0D8D0]/85">
                        <span className="text-[#C5A36B] font-bold mt-0.5">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1.5 border-t border-white/5">
                  {/* Preparation / Usage */}
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest text-[#C5A36B] font-bold mb-1 flex items-center">
                      <Heart className="w-3.5 h-3.5 mr-1 text-[#C5A36B]" /> Standard Administration (Anupana)
                    </h4>
                    <p className="text-[#E0D8D0]/75 text-xs">{selectedHerb.howToUse}</p>
                  </div>

                  {/* Safety Warnings */}
                  <div className="bg-red-950/15 border border-red-900/10 p-3.5 rounded-xl">
                    <h4 className="text-[10px] uppercase tracking-widest text-red-400 font-bold mb-1 flex items-center">
                      <ShieldAlert className="w-3.5 h-3.5 mr-1 text-red-400" /> Cautionary Guidance
                    </h4>
                    <p className="text-red-200/80 text-xs leading-relaxed">{selectedHerb.precautions}</p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-[#111613] border-t border-white/5 flex flex-col sm:flex-row gap-3 justify-between items-center text-xs">
                <span className="text-white/40 italic hidden sm:inline">Holistic herbal profile</span>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-center">
                  <div className="w-full sm:w-auto">
                    <a
                      href={`https://linkredirect.in/visitretailer/2318?id=5388051&shareid=88qOeli&dl=${encodeURIComponent(`https://www.flipkart.com/search?q=${encodeURIComponent("planet ayurveda " + selectedHerb.name.replace(/\(.*?\)/g, "").trim())}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto bg-black/30 hover:bg-[#C5A36B]/15 text-[#C5A36B] border border-[#C5A36B]/40 font-semibold px-4 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 text-center text-xs whitespace-nowrap"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Buy on Flipkart
                    </a>
                  </div>
                  <button
                    id="modal-select-herb"
                    onClick={() => {
                      if (onSelectHerbKeyword) {
                        onSelectHerbKeyword(selectedHerb.name);
                      }
                      setSelectedHerb(null);
                      setShowDeals(false);
                    }}
                    className="bg-[#C5A36B] text-black font-semibold px-4 py-2 rounded-xl hover:bg-[#C5A36B]/80 transition cursor-pointer whitespace-nowrap w-full sm:w-auto mt-2 sm:mt-0"
                  >
                    Select & Ask Vaidya
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
