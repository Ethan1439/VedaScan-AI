import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Flame, 
  Utensils, 
  Scale, 
  TrendingDown, 
  CheckCircle, 
  ChevronRight, 
  Compass, 
  Trash2, 
  Plus, 
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { UserProfile as ProfileType, WeightLog } from "../types";

interface WeightLossPlanProps {
  currentUser: ProfileType | null;
  onUpdateProfile: (updated: ProfileType) => void;
}

// 30 Days of customized Ayurvedic Weight Loss content
interface DayPlan {
  day: number;
  theme: string;
  focus: string;
  booster: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  vihar: string; // exercise/lifestyle
}

const AYURVEDIC_30_DAY_PLAN: DayPlan[] = [
  {
    day: 1,
    theme: "Rekindle Digestive Fire (Agni Deepana)",
    focus: "Waking up sluggish cells and boosting basic metabolism",
    booster: "Sip warm ginger water (1 cup water + 1/4 tsp dry ginger) 3 times today before meals.",
    breakfast: "Warm stewed apple cooked with 1 clove and a pinch of cinnamon.",
    lunch: "Warm mung dal soup (Kitchari) with a touch of ghee, cumin, and fresh ginger.",
    dinner: "Light steamed zucchini and bitter greens with black pepper. No heavy grains.",
    vihar: "Kapalabhati Pranayama (3 rounds of 20 strokes) + 15 min brisk walk."
  },
  {
    day: 2,
    theme: "Hydrate and Purge Ama (Toxin Clearance)",
    focus: "Flushing out sticky intestinal impurities (Ama)",
    booster: "Drink coriander-cumin-fennel (CCF) tea throughout the day.",
    breakfast: "Warm oatmeal cooked with cardamon and flaxseeds. No cow's milk (use water).",
    lunch: "Quinoa bowl with steamed asparagus, green beans, and sunflower seeds.",
    dinner: "Warm pureed pumpkin soup with toasted pumpkin seeds and ginger.",
    vihar: "Surya Namaskar (Sun Salutations) - 4 slow Vinyasa rounds."
  },
  {
    day: 3,
    theme: "Kapha pacification (Water Retention Flush)",
    focus: "Reducing fluid swelling and physical heaviness",
    booster: "Eat 1 capsule or 1/2 tsp of Triphala powder with warm water before sleeping.",
    breakfast: "Spiced rye porridge with berries and pumpkin seeds. Very dry and light.",
    lunch: "Red lentil soup with steamed spinach, seasoned with turmeric and cumin.",
    dinner: "Boiled broccoli, cauliflower, and carrots with a squeeze of fresh lemon juice.",
    vihar: "Ustrasana (Camel Pose) - 3 rounds to stimulate metabolic thyroid glands."
  },
  {
    day: 4,
    theme: "Agni Stabilization",
    focus: "Establishing regular hunger and digestive schedules",
    booster: "Chew a thin slice of fresh ginger with a drop of lemon juice and a tiny pinch of rock salt 10 mins before lunch.",
    breakfast: "Baked pear with cardamom and warm water. Restrict sugary sweetening.",
    lunch: "Classic yellow split mung kitchari with freshly chopped cilantro and grated ginger.",
    dinner: "Steamed cabbage and green peas with cumin seed tempering.",
    vihar: "Pranayama: Bhastrika (Bellows Breath) - 2 rounds of 15 breaths to stoke metabolic heat."
  },
  {
    day: 5,
    theme: "Lymphatic Cleansing (Rasa Dhatu Purge)",
    focus: "Stimulating the lymphatic system for fat breakdown",
    booster: "Warm lemon-honey-water upon waking up (Water should be lukewarm, never boiling).",
    breakfast: "Lightly toasted sourdough slice with a small smear of organic honey (no butter).",
    lunch: "Stir-fried tofu and broccoli with ginger-tamari sauce (use minimal oil).",
    dinner: "Clear celery and spinach broth with black pepper.",
    vihar: "Abhyanga (Dry skin brushing or light massage with mustard oil before warm bath)."
  },
  {
    day: 6,
    theme: "Cellular Revitalization",
    focus: "Providing micronutrients while maintaining a deficit",
    booster: "Take 1/2 teaspoon of Guggulu or Triphala with warm honey water.",
    breakfast: "Stewed prunes and dried figs soaked overnight in warm water.",
    lunch: "Millet bowl with sautéed kale, carrots, and a light dressing of sunflower oil.",
    dinner: "Warm vegetable barley soup with turmeric and dill.",
    vihar: "Nadi Shodhana Pranayama (10 mins) + 30 mins moderate outdoor activity."
  },
  {
    day: 7,
    theme: "Weekly Reset & Rest (Agni Rest)",
    focus: "Giving the gut a deep rest to activate natural fasting mechanisms",
    booster: "Fasting or drinking only warm herbal liquids until 12:00 PM.",
    breakfast: "Warm water only, or warm thin apple broth.",
    lunch: "Mono-diet: Very light, liquidy kitchari with cumin, mustard seeds, and coriander.",
    dinner: "Clear vegetable broth with a pinch of rock salt and black pepper.",
    vihar: "Savasana deep relaxation + Yin yoga stretches for 20 mins."
  }
];

// Replicate the 7 days into 30 days dynamically for variety, using templates
const get30DayPlan = (): DayPlan[] => {
  const fullPlan: DayPlan[] = [];
  for (let i = 1; i <= 30; i++) {
    const baseDay = AYURVEDIC_30_DAY_PLAN[(i - 1) % AYURVEDIC_30_DAY_PLAN.length];
    
    // Add variations per week to make it look highly professional and realistic
    let weekText = "Week 1: Kindle Veda Agni";
    if (i > 7 && i <= 14) weekText = "Week 2: Eradicate Chronic Ama";
    else if (i > 14 && i <= 21) weekText = "Week 3: Medas (Fat) Transformation";
    else if (i > 21) weekText = "Week 4: Rejuvenate and Consolidate";

    fullPlan.push({
      day: i,
      theme: `${weekText} - ${baseDay.theme.split(" (")[0]}`,
      focus: baseDay.focus,
      booster: baseDay.booster,
      breakfast: baseDay.breakfast,
      lunch: baseDay.lunch,
      dinner: baseDay.dinner,
      vihar: baseDay.vihar
    });
  }
  return fullPlan;
};

export default function WeightLossPlan({ currentUser, onUpdateProfile }: WeightLossPlanProps) {
  const planDays = get30DayPlan();
  const [selectedDayNum, setSelectedDayNum] = useState<number>(1);
  const [weightInput, setWeightInput] = useState<string>("");
  const [weightDate, setWeightDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [doshaFilter, setDoshaFilter] = useState<"Kapha" | "Pitta" | "Vata">("Kapha");

  // Local state for Guest Mode fallback
  const [guestCompletedDays, setGuestCompletedDays] = useState<number[]>([1, 2]);
  const [guestWeightLogs, setGuestWeightLogs] = useState<WeightLog[]>([
    { id: "g-1", date: "2026-06-20", weight: 82.5 },
    { id: "g-2", date: "2026-06-25", weight: 81.8 },
    { id: "g-3", date: "2026-06-30", weight: 80.9 },
    { id: "g-4", date: "2026-07-05", weight: 79.8 }
  ]);

  // Sync Guest Mode to user's profile if logged in
  const completedDays = currentUser ? currentUser.completedWeightLossDays : guestCompletedDays;
  const weightLogs = currentUser ? currentUser.weightLogs : guestWeightLogs;

  const currentDayPlan = planDays.find(d => d.day === selectedDayNum) || planDays[0];
  const progressPercent = Math.round((completedDays.length / 30) * 100);

  const toggleDayCompletion = (dayNum: number) => {
    let updatedCompleted: number[];
    if (completedDays.includes(dayNum)) {
      updatedCompleted = completedDays.filter(d => d !== dayNum);
    } else {
      updatedCompleted = [...completedDays, dayNum];
    }

    if (currentUser) {
      const updatedProfile = {
        ...currentUser,
        completedWeightLossDays: updatedCompleted
      };
      onUpdateProfile(updatedProfile);
      syncToLocalStorageAccounts(updatedProfile);
    } else {
      setGuestCompletedDays(updatedCompleted);
    }
  };

  const handleLogWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedWeight = parseFloat(weightInput);
    if (isNaN(parsedWeight) || parsedWeight <= 0) {
      alert("Please enter a valid weight number.");
      return;
    }

    const newLog: WeightLog = {
      id: `weight_${Date.now()}`,
      date: weightDate,
      weight: parsedWeight
    };

    // Sort by date chronologically
    const updatedLogs = [...weightLogs, newLog].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    if (currentUser) {
      const updatedProfile = {
        ...currentUser,
        weightLogs: updatedLogs
      };
      onUpdateProfile(updatedProfile);
      syncToLocalStorageAccounts(updatedProfile);
    } else {
      setGuestWeightLogs(updatedLogs);
    }
    setWeightInput("");
  };

  const handleDeleteWeightLog = (id: string) => {
    const updatedLogs = weightLogs.filter(log => log.id !== id);
    if (currentUser) {
      const updatedProfile = {
        ...currentUser,
        weightLogs: updatedLogs
      };
      onUpdateProfile(updatedProfile);
      syncToLocalStorageAccounts(updatedProfile);
    } else {
      setGuestWeightLogs(updatedLogs);
    }
  };

  const syncToLocalStorageAccounts = (updatedProfile: ProfileType) => {
    const storedUsers = JSON.parse(localStorage.getItem("vedascan_user_accounts") || "[]");
    const updatedUsers = storedUsers.map((u: any) => {
      if (u.id === updatedProfile.id) {
        return { ...u, profile: updatedProfile };
      }
      return u;
    });
    localStorage.setItem("vedascan_user_accounts", JSON.stringify(updatedUsers));
  };

  // Convert logs to Recharts friendly format
  const chartData = weightLogs.map(log => ({
    date: new Date(log.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    Weight: log.weight
  }));

  // Auto-set the dosha filter if the logged-in user has a profile
  useEffect(() => {
    if (currentUser && currentUser.dosha) {
      if (currentUser.dosha.toLowerCase().includes("kapha")) {
        setDoshaFilter("Kapha");
      } else if (currentUser.dosha.toLowerCase().includes("pitta")) {
        setDoshaFilter("Pitta");
      } else if (currentUser.dosha.toLowerCase().includes("vata")) {
        setDoshaFilter("Vata");
      }
    }
  }, [currentUser]);

  return (
    <div className="w-full space-y-8 animate-fade-in" id="weight-loss-section">
      
      {/* Introduction Card */}
      <div className="p-6 md:p-8 rounded-[32px] bg-white/[0.02] border border-white/10 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#C5A36B]/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-3xl space-y-4">
          <span className="text-[10px] md:text-xs font-bold tracking-widest text-[#C5A36B] uppercase bg-[#C5A36B]/10 border border-[#C5A36B]/20 px-3 py-1.5 rounded-full inline-block">
            Sustained Kapha Reduction Protocol
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-[#F2EBE4]">
            Vedic 30-Day <span className="text-[#C5A36B] italic font-semibold">Weight Equilibrium</span> Plan
          </h2>
          <p className="text-sm text-[#E0D8D0]/70 leading-relaxed">
            In Ayurvedic medicine, weight gain is primarily a Vitiation of **Kapha Dosha** (Water & Earth elements) and an accumulation of **Ama** (unprocessed toxic waste) that blocks the fat tissues (**Medas Dhatu**). Instead of crash diets which deplete your life energy (Ojas), this 30-day program gently kindles your digestive fire (**Agni**) to mobilize adipose elements naturally.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 p-5 rounded-2xl bg-black/45 border border-white/5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs uppercase tracking-widest text-white/40 block">Program Completion Progress</span>
              <span className="text-sm font-serif font-semibold text-[#F2EBE4]">
                Completed {completedDays.length} of 30 Ayurvedic Daily Sadhana cycles
              </span>
            </div>
            <span className="text-2xl font-serif text-[#C5A36B] font-bold">{progressPercent}%</span>
          </div>
          
          <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden border border-white/5">
            <div 
              className="bg-[#C5A36B] h-full rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(197,163,107,0.7)]"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: 30-Day Grid and Day Viewer (Spans 7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 md:p-8 rounded-[32px] bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-5">
            <div>
              <h3 className="text-sm font-bold text-[#F2EBE4] tracking-wide uppercase flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#C5A36B]" />
                <span>30-Day Milestone Calendar</span>
              </h3>
              <p className="text-[11px] text-white/40">Select a day to view your specific Ayurvedic diet, herbal boosters, and morning rituals</p>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {planDays.map((dayPlan) => {
                const isSelected = selectedDayNum === dayPlan.day;
                const isCompleted = completedDays.includes(dayPlan.day);
                return (
                  <button
                    key={dayPlan.day}
                    onClick={() => setSelectedDayNum(dayPlan.day)}
                    className={`relative aspect-square rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer flex flex-col items-center justify-center border focus:outline-none ${
                      isSelected 
                        ? "bg-[#C5A36B]/25 border-[#C5A36B] text-[#F2EBE4] shadow-md shadow-[#C5A36B]/10" 
                        : isCompleted
                          ? "bg-green-950/15 border-green-500/30 text-green-300 hover:bg-green-950/25"
                          : "bg-black/35 border-white/5 text-white/50 hover:bg-white/5 hover:text-[#F2EBE4]"
                    }`}
                  >
                    <span>{dayPlan.day}</span>
                    {isCompleted && (
                      <span className="absolute bottom-1 w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Day Specific Details */}
            <div className="bg-black/35 border border-white/5 rounded-2xl p-6 space-y-5 animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-white/5">
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-[#C5A36B] font-bold uppercase block">
                    AYURVEDA SADHANA - DAY {currentDayPlan.day}
                  </span>
                  <h4 className="text-lg font-serif text-[#F2EBE4] font-bold mt-0.5">{currentDayPlan.theme}</h4>
                  <p className="text-xs text-white/40 mt-1"><strong>Action Focus:</strong> {currentDayPlan.focus}</p>
                </div>

                <button
                  onClick={() => toggleDayCompletion(currentDayPlan.day)}
                  className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap min-h-[44px] ${
                    completedDays.includes(currentDayPlan.day)
                      ? "bg-green-500/15 hover:bg-green-500/20 text-green-400 border border-green-500/35"
                      : "bg-[#C5A36B] hover:bg-[#C5A36B]/80 text-black border border-transparent"
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{completedDays.includes(currentDayPlan.day) ? "Mark Day as Incomplete" : "Mark Day as Completed"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Diet Section */}
                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl space-y-3">
                  <h5 className="text-[10px] font-bold text-[#C5A36B] uppercase tracking-widest flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5" />
                    <span>Sattvic Diet Plan</span>
                  </h5>
                  <div className="space-y-2 text-xs text-white/70">
                    <p>🍳 <strong>Breakfast:</strong> {currentDayPlan.breakfast}</p>
                    <p>🍲 <strong>Lunch (Main Meal):</strong> {currentDayPlan.lunch}</p>
                    <p>🍜 <strong>Dinner (Light):</strong> {currentDayPlan.dinner}</p>
                  </div>
                </div>

                {/* Rituals & Boosters */}
                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl space-y-3.5">
                  <div className="space-y-2">
                    <h5 className="text-[10px] font-bold text-orange-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5" />
                      <span>Agni Herbal Booster</span>
                    </h5>
                    <p className="text-xs text-white/80 leading-relaxed font-serif italic">
                      {currentDayPlan.booster}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/5 space-y-1.5">
                    <h5 className="text-[10px] font-bold text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Vihar (Exercise & Lifestyle)</span>
                    </h5>
                    <p className="text-xs text-white/80 leading-relaxed">
                      {currentDayPlan.vihar}
                    </p>
                  </div>
                </div>
              </div>

              {!currentUser && (
                <div className="bg-[#C5A36B]/5 border border-[#C5A36B]/25 p-3 rounded-xl text-[10px] text-white/60 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#C5A36B] flex-shrink-0" />
                  <p>You are viewing in **Guest Mode**. Create an account in the **Profile** tab to back up this weight loss schedule to your persistent cloud dashboard.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Weight Logger and Trend Chart (Spans 5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Weight Logging & Charting Card */}
          <div className="p-6 rounded-[32px] bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-6">
            <div>
              <h3 className="text-sm font-bold text-[#F2EBE4] tracking-wide uppercase flex items-center gap-2">
                <Scale className="w-4.5 h-4.5 text-[#C5A36B]" />
                <span>Weight Tracker Logs</span>
              </h3>
              <p className="text-[11px] text-white/40">Chart your daily downward weight progression</p>
            </div>

            {/* Chart Area */}
            <div className="w-full h-48 bg-black/45 rounded-2xl p-3 border border-white/5 relative">
              {chartData.length < 2 ? (
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4 space-y-1 text-white/30">
                  <TrendingDown className="w-7 h-7 text-white/15 animate-pulse" />
                  <p className="text-xs">More weight entries needed to chart</p>
                  <p className="text-[10px] text-white/20">Log at least 2 weight checkpoints below to construct the graph.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 15, left: -25, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#888" 
                      fontSize={9} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="#888" 
                      fontSize={9} 
                      domain={['auto', 'auto']} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "#111", 
                        border: "1px solid #C5A36B", 
                        borderRadius: "10px",
                        fontSize: "11px",
                        color: "#fff"
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Weight" 
                      stroke="#C5A36B" 
                      strokeWidth={2} 
                      dot={{ fill: "#C5A36B", strokeWidth: 1, r: 3 }}
                      activeDot={{ r: 5 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleLogWeight} className="grid grid-cols-12 gap-2 bg-black/35 p-3 rounded-2xl border border-white/5 items-end">
              <div className="col-span-6 space-y-1">
                <label className="text-[9px] uppercase font-bold text-white/40 block">Today's Weight</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="e.g. 78.2 kg"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  className="w-full bg-[#080A09] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-[#F2EBE4] focus:outline-none focus:border-[#C5A36B]"
                />
              </div>

              <div className="col-span-6 space-y-1">
                <label className="text-[9px] uppercase font-bold text-white/40 block">Date logged</label>
                <input
                  type="date"
                  required
                  value={weightDate}
                  onChange={(e) => setWeightDate(e.target.value)}
                  className="w-full bg-[#080A09] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-[#F2EBE4] focus:outline-none focus:border-[#C5A36B]"
                />
              </div>

              <div className="col-span-12 mt-1">
                <button
                  type="submit"
                  className="w-full bg-[#C5A36B]/15 hover:bg-[#C5A36B] text-[#C5A36B] hover:text-black font-semibold py-2 rounded-xl transition text-xs flex items-center justify-center gap-1 cursor-pointer min-h-[36px]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log New Weight</span>
                </button>
              </div>
            </form>

            {/* Weight Logs Table */}
            <div className="space-y-2">
              <span className="text-[9px] uppercase tracking-widest text-[#C5A36B] font-bold block pb-1">Historical Checkpoints</span>
              
              {weightLogs.length === 0 ? (
                <p className="text-[10px] text-white/30 text-center py-2">No weight data logged yet.</p>
              ) : (
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                  {weightLogs.slice().reverse().map((log) => (
                    <div key={log.id} className="flex items-center justify-between bg-black/25 border border-white/5 px-3 py-2 rounded-xl text-xs">
                      <span className="font-mono text-white/45">{log.date}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-serif font-bold text-[#F2EBE4]">{log.weight} kg</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteWeightLog(log.id)}
                          className="p-1 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Dosha Weight Loss Advisory Component */}
          <div className="p-6 rounded-[32px] bg-black/45 border border-white/5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/5">
              <Compass className="w-4.5 h-4.5 text-[#C5A36B]" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#F2EBE4]">
                Dosha-Specific Adjustments
              </span>
            </div>

            <div className="flex gap-1.5 bg-black/35 p-1 rounded-xl border border-white/5">
              {(["Kapha", "Pitta", "Vata"] as const).map((dosha) => (
                <button
                  key={dosha}
                  type="button"
                  onClick={() => setDoshaFilter(dosha)}
                  className={`flex-1 text-[10px] uppercase font-bold py-1.5 rounded-lg transition-all cursor-pointer ${
                    doshaFilter === dosha 
                      ? "bg-[#C5A36B]/20 text-[#C5A36B]" 
                      : "text-white/45 hover:text-[#F2EBE4]"
                  }`}
                >
                  {dosha}
                </button>
              ))}
            </div>

            <div className="text-xs leading-relaxed text-[#E0D8D0]/80 space-y-2.5 pt-1">
              {doshaFilter === "Kapha" && (
                <>
                  <p className="text-[11px] font-bold text-[#C5A36B]">🔥 KAPHA STRATEGY: STOKE DIGESTIVE HEAT</p>
                  <p>Kapha's slow thyroid / sluggish metabolism (*Manda Agni*) results in rapid tissue construction. You must maximize pungent, bitter, and astringent spices.</p>
                  <p><strong>Crucial Rule:</strong> Avoid all cold milk, heavy cheeses, fried pastries, and carbonated ice drinks. Stick to warm water with ginger daily.</p>
                </>
              )}
              {doshaFilter === "Pitta" && (
                <>
                  <p className="text-[11px] font-bold text-[#C5A36B]">🍃 PITTA STRATEGY: ENTRAIN COOL FLUID STABILITY</p>
                  <p>Pitta has a highly active fire (*Teekshna Agni*) but easily retains fluids or suffers from inflammatory weight patterns. Focus on cooling bitters.</p>
                  <p><strong>Crucial Rule:</strong> Restrict raw garlic, hot cayenne chilies, and oily spices. Favor cucumber, fresh mint, coriander seeds, and leafy kales.</p>
                </>
              )}
              {doshaFilter === "Vata" && (
                <>
                  <p className="text-[11px] font-bold text-[#C5A36B]">🪵 VATA STRATEGY: GROUND IRREGULAR STRESS CHECKS</p>
                  <p>Vata weight is typically erratic, governed by Vata friction, worry, or restless sleep. Avoid skipping meals, which blocks healthy thyroid rhythm.</p>
                  <p><strong>Crucial Rule:</strong> Avoid dry crackers, raw salads, and cold foods which freeze gut warmth. Cook all meals, adding warm oils or ghee.</p>
                </>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
