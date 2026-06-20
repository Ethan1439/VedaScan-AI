import React, { useState, useEffect, useRef } from "react";
import { 
  Brain, 
  Sparkles, 
  Send,
  Flame,
  Wind,
  Compass,
  Check,
  Activity,
  User,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  Coffee,
  Volume2,
  CalendarPlus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import { getApiUrl } from "../lib/api";
import SattvaCalendarModal, { CalendarHabit } from "./SattvaCalendarModal";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface CravingAntidotes {
  physical: string;
  breathWork: string;
  mentalFocus: string;
}

interface HabitResponse {
  message: string;
  sattvaLevel: number;
  cravingAntidotes: CravingAntidotes;
  suggestedPrompts: string[];
  warning?: string;
}

const PREDEFINED_HABITS = [
  {
    id: "alcohol",
    name: "Alcohol Dependency / Drinking (Madya)",
    description: "Cool down hot, sharp properties (Teekshna/Ushna) that deplete sweet protective Ojas energy.",
    icon: Flame,
    color: "from-red-500/10 to-amber-500/5",
    border: "border-red-500/20",
    iconColor: "text-red-400"
  },
  {
    id: "smoking",
    name: "Smoking & Tobacco Urges (Dhumapana)",
    description: "Replenish moisture in dry, scorched respiratory tracks (Prana-Vaha Srotas) and ground Vata.",
    icon: Wind,
    color: "from-gray-500/10 to-red-500/5",
    border: "border-gray-500/20",
    iconColor: "text-gray-400"
  },
  {
    id: "sugar",
    name: "Sugar & Unhealthy Bingeing",
    description: "Enkindle the digestive fire (Agni) to dissolve receptor-blocking metabolic toxins (Ama) causing fake cravings.",
    icon: Coffee,
    color: "from-yellow-500/10 to-amber-500/5",
    border: "border-yellow-500/20",
    iconColor: "text-amber-400"
  },
  {
    id: "digital",
    name: "Digital Scrolling & Screen Time",
    description: "Quiet the hyperactive Vata system and constant visual alarms in the mind channels (Mano-Vaha Srotas).",
    icon: Brain,
    color: "from-blue-500/10 to-purple-500/5",
    border: "border-blue-500/20",
    iconColor: "text-blue-400"
  },
  {
    id: "procrastination",
    name: "Lethargy & Procrastination (Alasya)",
    description: "Dispel heavy Kapha and Tamas inertia, restoring clear intellect (Dhi) and courage (Dhairya).",
    icon: Compass,
    color: "from-emerald-500/10 to-teal-500/5",
    border: "border-emerald-500/20",
    iconColor: "text-emerald-400"
  }
];

export default function SattvaHabitTherapy() {
  const [selectedHabit, setSelectedHabit] = useState(PREDEFINED_HABITS[0]);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Greetings. I am here to assist you in **Sattvavajaya Chikitsa**—the traditional Ayurvedic medicine of cognitive fortitude. By recognizing the impulse to consume alcohol, smoke, or indulge in screen/sugar cravings as temporary fluctuations of **Rajas** and **Tamas**, you initiate real mindfulness.

Select a habit or describe your current craving state, and let us activate physical, respiratory, and cognitive desire counters immediately.`
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sattvaScore, setSattvaScore] = useState(60);
  const [antidotes, setAntidotes] = useState<CravingAntidotes>({
    physical: "Keep a thermos of lukewarm water infused with fennel and coriander seeds nearby. Sip this whenever a physical hand-to-mouth urge arises.",
    breathWork: "Engage in Nadi Shodhana (Alternate Nostril Breathing) for 5 minutes every morning on an empty stomach to harmonize your mental frequencies.",
    mentalFocus: "Practice 'Pratipaksha Bhavana' — when a desire surfaces, instantly conjure a vivid mental picture of how clear, energized, and deeply peaceful your mind feels at 6:00 AM on a sober morning."
  });
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([
    "I have a strong urge right now. Please guide me.",
    "Why does my body crave this under stress?",
    "Which herbs directly reduce these desires?"
  ]);
  const [antidotesCompleted, setAntidotesCompleted] = useState<{ [key: string]: boolean }>({
    physical: false,
    breath: false,
    mental: false
  });
  const [celebrate, setCelebrate] = useState(false);
  const [showCalendarSync, setShowCalendarSync] = useState(false);

  const getSattvaSyncableHabits = (): CalendarHabit[] => {
    const list: CalendarHabit[] = [
      {
        id: "ginger_water",
        title: "Ayurveda Ginger Water Ritual",
        description: "Sip warm ginger water upon waking to kindle internal digestive fire (Agni) and clear tissue metabolic residues (Ama).",
        defaultTime: "06:30"
      },
      {
        id: "pranayama",
        title: "Nadi Shodhana Pranayama Practice",
        description: "10 minutes of alternate nostril breath control to ground stress (Vata) and cultivate mental purity (Sattva).",
        defaultTime: "07:30"
      },
      {
        id: "screen_detox",
        title: "Evening Digital Screen Detox",
        description: "Disengage screen sensory inputs (Pratyahara) to soothe mental channels (Mano-Vaha Srotas) for deeper rest.",
        defaultTime: "21:30"
      }
    ];

    if (selectedHabit.id === "alcohol") {
      list.push({
        id: "sattva_antidote_alcohol",
        title: "Sattva Ojas Coolant Sip",
        description: "Counteract sharp, hot alcohol properties by sipping lukewarm fennel infusion.",
        defaultTime: "17:00"
      });
    } else if (selectedHabit.id === "smoking") {
      list.push({
        id: "sattva_antidote_smoking",
        title: "Prana Lung Somatic Breathing",
        description: "Replace tobacco impulse with 5 deep breath cycle resets to ground hyperactive Vata.",
        defaultTime: "14:00"
      });
    } else if (selectedHabit.id === "sugar") {
      list.push({
        id: "sattva_antidote_sugar",
        title: "Agni Bitter Suppressor",
        description: "Dissolve sweet desires and Ama blockages by raw cardamom or fennel chewing.",
        defaultTime: "15:30"
      });
    } else if (selectedHabit.id === "digital") {
      list.push({
        id: "sattva_antidote_digital",
        title: "Eye Wash & Screen Withdrawal",
        description: "Splash cold water onto eyelids and take a 5-minute screen-free environmental focus walk.",
        defaultTime: "13:00"
      });
    } else {
      list.push({
        id: "sattva_antidote_procrastination",
        title: "Tamas Inertia Shake",
        description: "Banish heavy Kapha fog by doing active Surya Namaskar body stretches.",
        defaultTime: "11:00"
      });
    }

    return list;
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectHabit = (habitId: string) => {
    const habit = PREDEFINED_HABITS.find(h => h.id === habitId) || PREDEFINED_HABITS[0];
    setSelectedHabit(habit);
    setAntidotesCompleted({ physical: false, breath: false, mental: false });
    
    let initialGreeting = "";
    if (habit.id === "alcohol") {
      initialGreeting = `### Welcome to your Sattva Recovery Channel for Alcohol (Madya)
Alcohol carries properties that are sharp, extremely penetrative, and dry (*Teekshna, Ushna, Ruksha*). These directly destroy your mind's sweet life essence: **Ojas**. 

Let us re-establish tranquility. Would you like to evaluate your current triggers, learn about detoxifying herbs like Guduchi, or do you have a heavy urge *right now*?`;
    } else if (habit.id === "smoking") {
      initialGreeting = `### Restoring Respiratory Freedom (Prana-Vaha)
Inhaling toxic heat and dry stimulants dries up throat structures and over-excites *Prana Vayu* (nervous energy). Breaking the nicotine reach requires replacing the deep somatic exhaling reset.

Let me know: Are you fighting a heavy smoke/vape craving *right now*, or should we plan your daily herbal lung purification path?`;
    } else if (habit.id === "sugar") {
      initialGreeting = `### Kindling your Digestive Fire (Agni) to Stop Sugar Spikes
Sugar cravings are mostly 'false hunger' fueled by heavy bodily toxins (*Ama*) blocking your cell nourishment. To quench this, we must enkindle Agni and consume 'bitter' taste (Tikta Rasa) that naturally suppresses sweets.

How can I help you restore metabolic harmony today?`;
    } else if (habit.id === "digital") {
      initialGreeting = `### Grounding the Eye Portals (Indriyas) on Screens
Flickering screens hyper-accelerate mind currents—moving you into a restless, Rajasic alert state. To cure this, we introduce neural coolants (like Brahmi) and visual withdrawal (Pratyahara).

Tell me: Do you scroll compulsively during work exhaustion, or late at night in bed?`;
    } else {
      initialGreeting = `### Dispelling Inertia & Tamas (Alasya)
When we repeatedly procrastinate, our mind is clouded by Tamas (fog and heaviness). To break it, we spark fire in the gut and clear intellect channels (*Dhi* & *Dhairya*).

What task or habit are you holding off on, and how does your physical body feel right now?`;
    }

    setMessages([
      {
        role: "assistant",
        content: initialGreeting
      }
    ]);

    // Pre-populate mock/default antidotes for immediate experience while switching
    if (habit.id === "alcohol") {
      setAntidotes({
        physical: "Drink 1 glass of cool pure coconut water or grape juice spiked with a tiny pinch of cardamom powder. Sweet and cool tastes soothe liver fire.",
        breathWork: "Perform 12 slow cycles of cooling Sheetali Pranayama. Inhale cool air through wet rolled tongue, exhale through nose.",
        mentalFocus: "Visualize your liver/mind enveloped in a cooling emerald light. Repeat: 'My body is cool, my cells are deeply hydrated, my Ojas is rich and stable.'"
      });
      setSuggestedPrompts([
        "I need help with a strong drinking urge right now.",
        "What Ayurvedic herbs help protect my liver?",
        "How can I rebuild my sweet Ojas reserves?"
      ]);
      setSattvaScore(65);
    } else if (habit.id === "smoking") {
      setAntidotes({
        physical: "Chew slowly on a small dry piece of organic Licorice root (Yashtimadhu) or a raw cardamom pod. This satisfies hand-to-mouth habits and hydrates throat linings.",
        breathWork: "Execute 5 cycles of the '4-7-8' Breath of Fortitude. Inhale through nose for 4s, hold for 7s, exhale slowly through mouth making a 'whoosh' noise for 8s.",
        mentalFocus: "Observe the somatic physical craving as if it is a wave on the sea. You are the deep oceanic floor. Let the urge crest and dissolve without responding."
      });
      setSuggestedPrompts([
        "I want to smoke right now. Intervene!",
        "How does Tulsi tea help cleanse my lungs from carbon?",
        "What routine prevents morning smoke cravings?"
      ]);
      setSattvaScore(60);
    } else if (habit.id === "sugar") {
      setAntidotes({
        physical: "Sip 1/2 cup of lukewarm water infused with ginger slice and 1/2 tsp fennel seeds. Lukewarm sweet-spiced drinks satisfy the salivary glands instantly.",
        breathWork: "Complete 30 cycles of active Kapalabhati (Skull-Shining) exhalations to kindle stomach Agni and burn off stagnant craving toxins (Ama).",
        mentalFocus: "Numb taste receptors with a bitter herbal tea (like Neem or Guduchi), rendering fake sugar cravings chemically sweetless and boring."
      });
      setSuggestedPrompts([
        "I am looking for a sweet treat right now. Help me resist!",
        "What is Shardunika (Gymnema / the sugar destroyer)?",
        "How does gut toxicity (Ama) create sweet cravings?"
      ]);
      setSattvaScore(70);
    } else if (habit.id === "digital") {
      setAntidotes({
        physical: "Cupping water splash: Splash cold clean water on your face and eyes, then cover your closed eyes with cool wet palms for 30 seconds to rest your visual center.",
        breathWork: "Execute 7 cycles of resonant Bhramari (Humming Bee) breath. Cover ears, inhale deeply, and produce a deep acoustic hum during exhalation.",
        mentalFocus: "Cast your eyes out of a window onto a single unmoving natural object (like a distant green tree/hill) for 60 seconds without blinking."
      });
      setSuggestedPrompts([
        "I cannot stop scrolling on social media. Help!",
        "How does screen light aggravate Vata Dosha in my brain?",
        "What is a healthy evening tech-free routine?"
      ]);
      setSattvaScore(58);
    } else {
      setAntidotes({
        physical: "Stand up immediately, perform an active overhead stretch, and sip 3 mouthfuls of copper-charged or normal room temperature water to break static muscle hold.",
        breathWork: "Take 10 explosive, rapid inhalation-exhalation cycles while pumping your arms vertically to force Kapha stagnation out of the lungs.",
        mentalFocus: "Pratipaksha Bhavana: Focus on your chest center, and visualize a tiny, brilliant candle flame that remains completely steady, unaffected by winds of laziness."
      });
      setSuggestedPrompts([
        "I feel extremely lazy and heavy right now.",
        "What morning teas boost energy without a caffeine crash?",
        "How do I clear Tamas (mental clouding) safely?"
      ]);
      setSattvaScore(62);
    }
  };

  const sendMessageToAPI = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const queryMessage: Message = { role: "user", content: textToSend };
    const updatedMessages = [...messages, queryMessage];
    setMessages(updatedMessages);
    setInputText("");
    setLoading(true);

    try {
      const response = await fetch(getApiUrl("/api/habits/chat"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          habit: selectedHabit.name,
          messages: updatedMessages
        })
      });

      if (!response.ok) {
        throw new Error("Sattva chat endpoint returned server status error.");
      }

      const data: HabitResponse = await response.json();
      
      setMessages(prev => [...prev, { role: "assistant", content: data.message }]);
      setSattvaScore(data.sattvaLevel);
      setAntidotes(data.cravingAntidotes);
      setSuggestedPrompts(data.suggestedPrompts);
      setAntidotesCompleted({ physical: false, breath: false, mental: false });

    } catch (err) {
      console.error("Habit chat pipeline failed:", err);
      // Fallback locally
      setTimeout(() => {
        // Run simulated response locally
        const mockData = generateLocalFallbackResponse(selectedHabit.id, textToSend);
        setMessages(prev => [...prev, { role: "assistant", content: mockData.message }]);
        setSattvaScore(mockData.sattvaLevel);
        setAntidotes(mockData.cravingAntidotes);
        setSuggestedPrompts(mockData.suggestedPrompts);
        setAntidotesCompleted({ physical: false, breath: false, mental: false });
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAntidote = (type: "physical" | "breath" | "mental") => {
    setAntidotesCompleted(prev => {
      const updated = { ...prev, [type]: !prev[type] };
      
      // Calculate score booster
      let bonus = 0;
      if (!prev[type] && updated[type]) {
        bonus = 8; // add 8 points of willpower
      } else if (prev[type] && !updated[type]) {
        bonus = -8;
      }
      setSattvaScore(val => Math.min(100, Math.max(0, val + bonus)));
      
      // If all three completed, celebrate!
      if (updated.physical && updated.breath && updated.mental) {
        setCelebrate(true);
        setTimeout(() => setCelebrate(false), 4000);
      }

      return updated;
    });
  };

  const handleResetWillpower = () => {
    setSattvaScore(60);
    setAntidotesCompleted({ physical: false, breath: false, mental: false });
    setMessages([
      {
        role: "assistant",
        content: `Mental fortess has been reset. Under stressful triggers, keep your focus on **Dhi** (awareness), **Dhairya** (grit), and **Atmadi-Vijnana** (spiritual centering). Let me know what urge you wish to confront today.`
      }
    ]);
  };

  // Local static chatbot engine for excellent resilient offline usability
  const generateLocalFallbackResponse = (habitId: string, text: string) => {
    const normalized = text.toLowerCase();
    let message = "";
    let physical = "";
    let breathWork = "";
    let mentalFocus = "";
    let suggestedPrompts: string[] = [];
    let level = 65;

    if (habitId === "alcohol") {
      level = 68;
      if (normalized.includes("urge") || normalized.includes("crave") || normalized.includes("now") || normalized.includes("drink")) {
        message = `### Intercepting the Alcohol Urge (*Madya-Trishna*)

Your call for support is registered. Take a slow, long, grounding breath.

Ayervedic science explains that alcohol is sharp, dehydrating, and burning (*Ushna, Tikshna*). It targets **Sadhaka Pitta** (heart chemical balances) and immediately dries up **Ojas** (immune life juice). When you feel an urgent itch to drink, your mind is craving a heavy, quick, fake warmth to calm inner Vata friction or fatigue.

By stopping and reviewing this dialogue instead of lifting the glass, you have won 50% of the battle. Let us deploy an instant Ayurvedic antidote right now to extinguish the fire and defend your Ojas!`;
        physical = "Consume a large cup of pure cold coconut water or Sweet Grape Juice spiked with a tiny pinch of Cardamom. This sweet, cold Rasa instantly coats and calms Pitta acidity and liver heat.";
        breathWork = "Complete 12 cycles of Sheetali (Cooling Tongue) Pranayama. Roll your tongue, inhale freezing air slowly, hold 3s, exhale out of nose.";
        mentalFocus = "Envision a heavy, cool emerald wave starting from your head and rolling down your chest, putting out all hot fires of agitation. Say: 'I am cool. I am anchored. My mind is safe.'";
      } else if (normalized.includes("herb") || normalized.includes("medicine")) {
        message = `### Traditional Herbal Allies for Rebuilding Ojas (Sober Willpower)

In Ayurvedic medicine, reversing chronic alcohol dependence utilizes specific **Sattvavajaya** nourishing herbs:

1. **Guduchi (Giloy)**: Celebrated as 'Amrit' (Nectar). It protects hepatocytes, filters blood toxins, and reduces psychological cravings.
2. **Shankhapushpi**: A profound tranquilizer that strengthens memory/attention channels and reduces evening cortisol surges.
3. **Brahmi (Gotu Kola)**: Calms hyper-Rajasic neurons, allowing you to wind down without chemical assistance.

Taking 1/2 tsp of Brahmi and Guduchi powder together with warm water twice daily before meals will gradually reset your central desire patterns.`;
        physical = "Boil 1 tsp of fennel seeds in water, strain, add 1 tsp of organic ghee, and sip while warm. This coats the stomach mucosal barrier post-detox.";
        breathWork = "Establish a routine of 10 minutes of slow Pranayama (Alternate Nostril) every morning on an empty stomach.";
        mentalFocus = "Practice Dharana (Focus): Count backwards from 100 on every slow exhalation. If your mind drifts, start again calmly.";
      } else {
        message = `### Navigating the Paths of Sattva Restitution

In the clinical treatise **Charaka Samhita**, overcoming habituation is explained as a progressive replacement of unwholesome elements (*Satmya*) with wholesome foods, schedules, and mental actions.

Rushing to quit instantly without supporting your physical nervous system can aggravate Vata, creating restless jitters. Therefore:
- Ensure you eat warm, sweet-spiced, oil-moistened lunches (Ghee, warm grains) to ground Vata.
- Feed your mind comforting, Sattva-boosting environments (green parks, soft acoustic music, calm dialogues).

What triggers your cravings most frequently—loneliness after work, social circles, or sleep anxiety?`;
        physical = "Carry raw fennel seeds in your pockets. Chew several whenever you experience a transient hand-movement desire.";
        breathWork = "Perform 5 rounds of calming cooling breaths when work triggers surge.";
        mentalFocus = "Visualize your mind as clear, unruffled mountain spring water. Pure, reflective, calm, and completely free.";
      }
      suggestedPrompts = [
        "What should I do if anxiety triggers an evening craving?",
        "How do Guduchi and Brahmi help clear internal toxins?",
        "Tell me a daily routine to reset my sleeping patterns."
      ];
    } else if (habitId === "smoking") {
      level = 62;
      if (normalized.includes("urge") || normalized.includes("crave") || normalized.includes("now") || normalized.includes("smoke")) {
        message = `### quelling the Respiratory Smoke Urge (*Dhumapana*)

You are doing great. Keep your hands relaxed, open your palms, and hold your breath for 3 seconds.

Smoking floods your **Prana-Vaha Srotas** (breath channels) with parching fire, destroying lung moisture. Tobacco triggers are actually fake demands for massive, respiratory resetting exhalations to ground hyper-inflated Vata nerves.

We can achieve that deep, relaxing lung expansion right now without introducing burning residue. Let us execute the sensory lung reset:`;
        physical = "Chew slowly on a solid slice of organic dry Licorice Root (Yashtimadhu) or a sweet Cardamom pod. The bitter-sweet woody texture engages the jaws, triggers detox saliva, and cleanses dry chest dryness.";
        breathWork = "Complete the 4-7-8 Breath of Fortitude. Inhale through the nose for 4 seconds, hold for 7 seconds, then exhale slow and whispering through mouth for 8 seconds. Run 5 complete rounds.";
        mentalFocus = "Regard the current physical discomfort as a passing storm. The sky always outperforms the storm. You are the infinite, untouched sky. Let the urge blow past.";
      } else {
        message = `### Ayurvedic Strategies to Repair your Lungs (Quit Smoke)

To naturally reverse nicotine dependencies and clear carbon, Ayurveda targets cellular repair of the chest:

1. **Yashtimadhu (Licorice)**: The ultimate lung tonic. It liquefies carbon deposits, soothes inflamed membranes, and curbs nicotine urges.
2. **Tulsi Tea**: The sacred protector. High in adaptogenic botanical compounds that clear toxic tar from bronchial cells and calm mind fatigue.
3. **Ashwagandha Ghee**: Rehydrates dry nerve endings, removing the chronic tension that initiates the smoke habit.

Would you like to explore how to perform herbal inhalation (Dhuma) or custom throat remedies?`;
        physical = "Boil Tulsi leaves with a pinch of dry ginger, strain and sip with honey daily to expel chest toxins.";
        breathWork = "Exhale actively using Bhastrika (Bellows) breath for 20 cycles every morning to push stagnant carbon deposits off your lungs.";
        mentalFocus = "Grounding: Put your feet flat on the floor, grip your knees, feel the sheer weight of your bones, and repeat: 'I am solid, I am safe, I am clear.'";
      }
      suggestedPrompts = [
        "I need a breathing technique for immediate stress release.",
        "How do I clear the heavy tar and carbon from my throat?",
        "What foods soothe highly dry and irritated lungs?"
      ];
    } else {
      // General Fallbacks
      level = 72;
      message = `### Activating Sattva (Inner Strength Matrix)
      
We have registered your query: *"${text}"*. 

In Ayurvedic psychology, breaking sticky desires relies on sharpening your mental intellect (**Dhi**), fortitude (**Dhairya**), and spiritual self-grounding (**Atmadi-Vijnana**). Any unwholesome desire gains power when the mind is clouded by **Tamas** (indecision) and manipulated by **Rajas** (compulsive action).

By discussing this openly, you have already directed Rajasic movement toward pure **Sattva** (mental clarity). Let us deploy these wellness counters immediately to maintain your momentum:`;
      physical = "Sip warm water mixed with crushed cumin, coriander, and fennel seeds (CCF Tea). This helps cleanse digestive blockages, grounding restless abdominal nerves.";
      breathWork = "Perform 10 deep, slow diaphragmatic breaths. Expand your belly fully on inhalation, and let it completely deflate on a slow, audible sigh.";
      mentalFocus = "Pratipaksha Bhavana: Replace the image of the unhealthy desire with a vivid picture of yourself running, laughing, and showing boundless physical vitality.";
      suggestedPrompts = [
        "How can I stoke my willpower during fatigue spikes?",
        "Which spices naturally clear mental fog?",
        "Guide me through a calming evening wind-down ritual."
      ];
    }

    return {
      message,
      sattvaLevel: level,
      cravingAntidotes: {
        physical,
        breathWork,
        mentalFocus
      },
      suggestedPrompts
    };
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 md:p-8 backdrop-blur-xl relative overflow-hidden" id="sattva-habits-section">
      {/* Decorative Blur Atmosphere */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#C5A36B]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Header Section */}
      <div className="mb-8 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-[#C5A36B] uppercase bg-[#C5A36B]/15 border border-[#C5A36B]/30 px-3 py-1 rounded-full">
            Sattvavajaya (Psychology Panel)
          </span>
          <h2 className="text-2xl font-serif text-[#F2EBE4] mt-3 font-semibold">
            Sattva Habit Counseling & Desire Interception
          </h2>
          <p className="text-[#E0D8D0]/70 text-xs mt-1 max-w-2xl leading-relaxed">
            Ayurvedic cognitive wellness (*Sattvavajaya*) targets the root mental forces—Rajas and Tamas—to break toxic compulsiveness, restoring sweet sovereign self-mastery (*Ojas*).
          </p>
        </div>

        <button
          onClick={handleResetWillpower}
          className="text-[10px] hover:text-red-400 text-white/50 border border-white/5 hover:border-red-500/30 px-3 py-1.5 rounded-xl bg-black/20 flex items-center gap-1.5 transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Fortitude Matrix</span>
        </button>
      </div>

      {/* Main Workspace split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Left Side: Predefined index list & Sattva status (Spans 4 cols on desktop) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="space-y-3">
            <h3 className="text-xs font-bold tracking-widest text-[#C5A36B] uppercase">
              1. Select Target Habit
            </h3>
            
            <div className="space-y-2.5 max-h-[355px] overflow-y-auto pr-1">
              {PREDEFINED_HABITS.map((habit) => {
                const isSelected = selectedHabit.id === habit.id;
                return (
                  <button
                    key={habit.id}
                    onClick={() => handleSelectHabit(habit.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-start gap-3.5 cursor-pointer group ${
                      isSelected
                        ? "bg-[#C5A36B] text-black border-[#C5A36B] shadow-lg shadow-[#C5A36B]/10"
                        : "bg-black/35 text-[#E0D8D0] border-white/5 hover:border-white/10 hover:bg-black/50"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${isSelected ? "bg-black/10 border-black/20 text-black" : "bg-white/5 border-white/5 " + habit.iconColor}`}>
                      <habit.icon className="w-4 h-4" />
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className={`text-xs font-serif font-bold ${isSelected ? "text-black" : "text-[#F2EBE4]"}`}>
                        {habit.name}
                      </h4>
                      <p className={`text-[10px] leading-relaxed ${isSelected ? "text-black/80" : "text-white/40"}`}>
                        {habit.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sattva Progress Wheel Status card */}
          <div className="bg-black/30 border border-white/5 p-5 rounded-2xl flex items-center gap-4 relative overflow-hidden">
            {/* Celebrate screen lock */}
            {celebrate && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-[#C5A36B]/20 backdrop-blur-sm z-10 flex flex-col justify-center items-center text-center p-3"
              >
                <Sparkles className="w-8 h-8 text-yellow-300 animate-bounce mb-1" />
                <h5 className="text-xs font-serif text-white font-bold uppercase tracking-wider">Antidotes Activated!</h5>
                <p className="text-[9px] text-white/90">Sattva Mindpower is rising!</p>
              </motion.div>
            )}

            {/* Circle stroke Metre */}
            <div className="relative w-18 h-18 flex items-center justify-center flex-shrink-0">
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle
                  cx="36"
                  cy="36"
                  r="30"
                  stroke="rgba(255,255,255,0.04)"
                  strokeWidth="5"
                  fill="transparent"
                />
                <circle
                  cx="36"
                  cy="36"
                  r="30"
                  stroke="#C5A36B"
                  strokeWidth="5"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 30}
                  strokeDashoffset={2 * Math.PI * 30 * (1 - sattvaScore / 100)}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="text-center">
                <span className="text-[14px] font-sans font-bold text-[#F2EBE4]">{sattvaScore}%</span>
                <span className="block text-[8px] text-[#C5A36B] tracking-tight uppercase">Sattva</span>
              </div>
            </div>

            <div className="space-y-1">
              <h5 className="text-[10px] text-[#C5A36B] font-bold uppercase tracking-widest">Fortitude Metre</h5>
              <p className="text-[11px] text-[#E0D8D0]/80 leading-relaxed font-sans">
                {sattvaScore >= 80 
                  ? "Sovereign Fortitude (Sattva). Mind is stable, aligned, and resisting desires perfectly."
                  : sattvaScore >= 60 
                  ? "Sustained Willpower (Rajasic balance). Mind is vigilant, needing active breathing checks."
                  : "Vulnerable state (Tamas/Rajas trigger). Craving potential is high; use immediate antidotes."}
              </p>
            </div>
          </div>
          
          {/* Daily Sattva Builders Checklist */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
            <h4 className="text-[9px] tracking-widest text-[#C5A36B] font-bold uppercase flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#C5A36B]" /> Daily Sattva Fortresses
            </h4>
            
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Check className="w-2.5 h-2.5" />
                </div>
                <span className="text-white/60">Sipped hot ginger water upon waking (Agni Kindle)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Check className="w-2.5 h-2.5" />
                </div>
                <span className="text-white/60">Executed 10 minutes Pranayama in morning</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Check className="w-2.5 h-2.5" />
                </div>
                <span className="text-white/60">No screen use within 30 minutes of waking</span>
              </div>
            </div>

            <button
              onClick={() => setShowCalendarSync(true)}
              id="sync-habits-calendar-btn"
              className="w-full mt-2.5 py-2 px-3 rounded-xl bg-[#C5A36B]/15 hover:bg-[#C5A36B] text-[#C5A36B] hover:text-black font-semibold text-[10px] uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 border border-[#C5A36B]/30 hover:border-transparent cursor-pointer min-h-[44px]"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              <span>Sync Habits to Calendar</span>
            </button>
          </div>

        </div>

        {/* Right Side: Interactive Chat Console & Live Remedies (Spans 8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          
          {/* Chat Bubble Interface */}
          <div className="bg-black/35 border border-white/5 rounded-2xl flex flex-col h-[400px]">
            {/* Header info */}
            <div className="px-5 py-3.5 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Brain className="w-4.5 h-4.5 text-[#C5A36B]" />
                <div>
                  <h4 className="text-xs font-serif font-bold text-[#F2EBE4] flex items-center gap-1.5">
                    <span>Sattva Therapist</span>
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                  </h4>
                  <p className="text-[10px] text-white/35">Traditional cognitive wellness active channel</p>
                </div>
              </div>
              
              <span className="text-[10px] border border-white/10 text-white/40 px-2 py-0.5 rounded backdrop-blur-md">
                Active Habit: {selectedHabit.id.toUpperCase()}
              </span>
            </div>

            {/* Chat list area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 font-sans text-xs">
              {messages.map((msg, idx) => {
                const isAssistant = msg.role === "assistant";
                return (
                  <div 
                    key={idx} 
                    className={`flex items-start gap-3 max-w-xl ${isAssistant ? "mr-auto" : "ml-auto flex-row-reverse"}`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center border flex-shrink-0 ${
                      isAssistant 
                        ? "bg-[#C5A36B]/15 border-[#C5A36B]/30 text-[#C5A36B]" 
                        : "bg-white/5 border-white/10 text-white"
                    }`}>
                      {isAssistant ? <Brain className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                    </div>

                    <div className={`p-4 rounded-2xl relative ${
                      isAssistant 
                        ? "bg-white/[0.03] text-[#E0D8D0] border border-white/5 rounded-tl-none leading-relaxed markdown-container" 
                        : "bg-[#C5A36B] text-black font-medium rounded-tr-none"
                    }`}>
                      {isAssistant ? (
                        <div className="space-y-2">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p>{msg.content}</p>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {loading && (
                <div className="flex items-center gap-3 mr-auto">
                  <div className="w-7 h-7 rounded-full bg-[#C5A36B]/15 border border-[#C5A36B]/30 text-[#C5A36B] flex items-center justify-center">
                    <Brain className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  <div className="bg-white/[0.03] text-white/40 italic px-4 py-2.5 border border-white/5 rounded-2xl rounded-tl-none">
                    Sattva therapist is consulting traditional texts...
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested prompts list */}
            {suggestedPrompts && suggestedPrompts.length > 0 && !loading && (
              <div className="px-5 py-2 background-blur-xl border-t border-white/5 flex flex-wrap gap-2">
                {suggestedPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessageToAPI(p)}
                    className="text-[10px] bg-white/5 hover:bg-[#C5A36B]/25 text-white/70 hover:text-white border border-white/5 px-2.5 py-1 rounded-lg transition text-left cursor-pointer"
                  >
                    ✦ {p}
                  </button>
                ))}
              </div>
            )}

            {/* Chat Send Form */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                sendMessageToAPI(inputText);
              }}
              className="p-3 bg-white/[0.02] border-t border-white/5 flex gap-2 rounded-b-2xl"
            >
              <input
                type="text"
                className="flex-1 bg-black/45 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F2EBE4] focus:outline-none focus:border-[#C5A36B]/50 transition"
                placeholder={`Describe your triggers, urges, or query for your ${selectedHabit.name} habit...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !inputText.trim()}
                className="w-10 h-10 bg-[#C5A36B] hover:bg-[#C5A36B]/85 text-black rounded-xl flex items-center justify-center transition cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* ACTIVE CRAVING EMERGENCY INTERCEPTORS CARD */}
          <div className="bg-gradient-to-r from-emerald-950/20 via-black/40 to-amber-950/10 border border-[#C5A36B]/30 p-5 rounded-2xl space-y-4">
            <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
              <h3 className="text-xs font-serif font-semibold text-[#F2EBE4] uppercase tracking-wide flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-[#C5A36B] animate-pulse" />
                <span>Instant Craving Interceptors (Rescue Protocols)</span>
              </h3>
              <span className="text-[9px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Physical Antidote */}
              <button 
                onClick={() => handleToggleAntidote("physical")}
                className={`text-left p-4 rounded-xl border relative transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  antidotesCompleted.physical
                    ? "bg-emerald-500/10 border-emerald-500/40 text-white"
                    : "bg-black/30 border-white/5 hover:border-white/20 text-[#E0D8D0]"
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 pb-1 select-none">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${antidotesCompleted.physical ? "bg-emerald-500 text-black border-emerald-500" : "bg-white/5 border-white/10 text-[#C5A36B]"}`}>
                      {antidotesCompleted.physical ? <Check className="w-3.5 h-3.5" /> : <CupSodaComponent />}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A36B]">1. Physics / Taste</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-white/80">{antidotes.physical}</p>
                </div>
                <div className="text-[9px] text-[#C5A36B] font-semibold mt-3 block text-right uppercase">
                  {antidotesCompleted.physical ? "✦ Antidote Taken" : "✦ Complete Task"}
                </div>
              </button>

              {/* Breath Antidote */}
              <button 
                onClick={() => handleToggleAntidote("breath")}
                className={`text-left p-4 rounded-xl border relative transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  antidotesCompleted.breath
                    ? "bg-emerald-500/10 border-emerald-500/40 text-white"
                    : "bg-black/30 border-white/5 hover:border-white/20 text-[#E0D8D0]"
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 pb-1 select-none">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${antidotesCompleted.breath ? "bg-emerald-500 text-black border-emerald-500" : "bg-white/5 border-white/10 text-emerald-400"}`}>
                      {antidotesCompleted.breath ? <Check className="w-3.5 h-3.5" /> : <Wind className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-404">2. Respiration (Vayu)</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-white/80">{antidotes.breathWork}</p>
                </div>
                <div className="text-[9px] text-[#C5A36B] font-semibold mt-3 block text-right uppercase">
                  {antidotesCompleted.breath ? "✦ Breath Complete" : "✦ Complete Task"}
                </div>
              </button>

              {/* Mind Antidote */}
              <button 
                onClick={() => handleToggleAntidote("mental")}
                className={`text-left p-4 rounded-xl border relative transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  antidotesCompleted.mental
                    ? "bg-emerald-500/10 border-emerald-500/40 text-white"
                    : "bg-black/30 border-white/5 hover:border-white/20 text-[#E0D8D0]"
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 pb-1 select-none">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${antidotesCompleted.mental ? "bg-emerald-500 text-black border-emerald-500" : "bg-white/5 border-white/10 text-purple-400"}`}>
                      {antidotesCompleted.mental ? <Check className="w-3.5 h-3.5" /> : <Brain className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400">3. Cognition (Sattva)</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-white/80">{antidotes.mentalFocus}</p>
                </div>
                <div className="text-[9px] text-[#C5A36B] font-semibold mt-3 block text-right uppercase">
                  {antidotesCompleted.mental ? "✦ Focus Centered" : "✦ Complete Task"}
                </div>
              </button>

            </div>
          </div>

        </div>

      </div>

      <SattvaCalendarModal
        isOpen={showCalendarSync}
        onClose={() => setShowCalendarSync(false)}
        habits={getSattvaSyncableHabits()}
        title="Sattvavajaya Cognitive Habit Calendar"
        subtitle="Schedule dynamic daily antidotes & habits as recurring reminders. Keep the protective energy Ojas strong!"
      />
    </div>
  );
}

// CupSoda static icon support helper
function CupSodaComponent() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 3h12" />
      <path d="m11 3 1.25 10c.05.4.35.7.75.7h2c.4 0 .7-.3.75-.7L17 3" />
      <path d="M9 9h6" />
      <path d="M10 21h4c1.1 0 2-.9 2-2V9H8v10c0 1.1.9 2 2 2Z" />
    </svg>
  );
}
