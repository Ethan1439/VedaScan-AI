import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables inside the server
dotenv.config();

// Static high-quality Ayurvedic herbs database for instant directory search
const HYDRATED_HERBS = [
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
  },
  {
    id: "turmeric",
    name: "Turmeric",
    sanskritName: "Haridra / Haldi",
    botanicalName: "Curcuma longa",
    doshaEffect: "Balances Kapha, Pitta & Vata, though in extreme excess it can kindle Pitta.",
    category: "Anti-inflammatory / Blood Cleanser",
    primaryIndications: ["Joint Pain", "Skin Conditions (Acne)", "Wound Healing", "Liver Health", "Allergies"],
    description: "An gold-colored herb famous for its exceptional coloring property, culinary status, and therapeutic role. A broad-spectrum protector that purifies blood, skin, joints, and metabolic pathways.",
    howToUse: "Add to daily cooking, or stir 1/2 tsp into warm milk with a pinch of black pepper (turmeric golden milk).",
    benefits: [
      "Provides relief in joints and eases inflammatory arthritis",
      "Promotes radiant, blemish-free skin by purging blood elements",
      "Assists liver detoxification and bile production",
      "Strengthens defense against cold, allergies, and cellular degradation"
    ],
    precautions: "Extremely dry. Those with highly aggravated Vata should combine it with healthy fats (ghee, sesame oil). Avoid high medicinal doses if using blood thinners."
  },
  {
    id: "ginger",
    name: "Ginger (Dry or Fresh)",
    sanskritName: "Ardraka / Shunthi",
    botanicalName: "Zingiber officinale",
    doshaEffect: "Balances Vata & Kapha, increases Pitta (fresh is less Pitta-aggravating than dry).",
    category: "Digestive Fire Spark (Agni Deepana)",
    primaryIndications: ["Indigestion", "Nausea", "Joint Stiffness", "Cold & Flu", "Low Appetitte", "Bloating"],
    description: "In Ayurveda, dry ginger is referred to as 'Vishwa Bheshaja' (The Universal Medicine). It is the premier spice for awakening digestion, facilitating metabolism, and carrying nutrients deeply.",
    howToUse: "Drink hot ginger water before meals to stimulate digestion, or grate fresh ginger with honey and lemon.",
    benefits: [
      "Stops nausea, motion sickness, and gastric bloating",
      "Ignites the central digestive fire (Agni) to process food properly",
      "Alleviates stiffness and promotes warmth in painful cold joints",
      "Dissolves heavy, sticky toxic waste (Ama) in the gastrointestinal loop"
    ],
    precautions: "Highly heating. Avoid or restrict heavily in cases of severe peptic ulcers, acid reflux, active internal hemorrhaging, or high fever."
  },
  {
    id: "neem",
    name: "Neem",
    sanskritName: "Nimba / Arishta",
    botanicalName: "Azadirachta indica",
    doshaEffect: "Balances Pitta & Kapha beautifully, can aggravate Vata in high or prolonged usage.",
    category: "Bitter Purifier / Coolant",
    primaryIndications: ["Acne", "Skin Rashes", "Eczema / Psoriasis", "High Internal Heat", "Blood Toxicity"],
    description: "Ayurveda describes Neem as 'Sarva Roga Nivarini' (the curer of all ailments). It is the supreme cooling bitter herb for purifying blood and clearing severe skin disorders.",
    howToUse: "Use Neem oil topically for localized skin conditions, or take neem leaf capsules for a short detox phase (1-2 weeks).",
    benefits: [
      "Reduces chronic skin conditions like acne, rashes, and burning irritation",
      "Extremely cooling to internal high Pitta heat state",
      "Promotes liver liver clearance and purifies the bloodstream",
      "Supports oral health, natural antiseptic properties"
    ],
    precautions: "Dry, light and cold. Do not use if extremely underweight, pregnant, or trying to conceive (has natural contraceptive actions). Limit internal use to short periods."
  },
  {
    id: "shatavari",
    name: "Shatavari",
    sanskritName: "Śatāvarī",
    botanicalName: "Asparagus racemosus",
    doshaEffect: "Balances Vata & Pitta, may increase Kapha if digestive fire is weak.",
    category: "Nourishing Tonic / Hormonal Balancer",
    primaryIndications: ["Hormonal Imbalance", "Menstrual Cramps", "Acidity / Ulcers", "Dehydration", "Dryness"],
    description: "The name Shatavari translates to 'she who possesses a hundred husbands', highlighting its status as the most versatile rejuvenative tonic for the female system, or any dehydrated systemic state.",
    howToUse: "1/2 to 1 tsp mixed with warm sweet milk or organic ghee, taken on an empty stomach or before bed.",
    benefits: [
      "Balances hormones, menstrual cycle, and eases transition during menopause",
      "Extremely nourishing and cooling, soothing acidic digestive tracts",
      "Hydrates dried tissues, builds healthy bodily fluids (Rasa)",
      "Strengthens immune fluids, calming to highly aggravated minds"
    ],
    precautions: "Avoid if there is high toxic buildup (Ama), high congestion, severe lung mucous, or if known allergy to asparagus exists."
  },
  {
    id: "brahmi",
    name: "Brahmi (Gotu Kola or Bacopa)",
    sanskritName: "Brahmi",
    botanicalName: "Bacopa monnieri / Centella asiatica",
    doshaEffect: "Tridoshic (Calms all three, particularly Pitta calming and Vata grounding).",
    category: "Nootropic / Nerve Tonic",
    primaryIndications: ["Mental Fatigue", "Anxiety", "Poor Focus / Memory", "Stress", "Mental Hyperactivity"],
    description: "Named after 'Brahma' (the creative energy of the universe), Brahmi is the supreme brain herb. It enhances conscious awareness, intellect, and memory, while simultaneously cooling the mental space.",
    howToUse: "Take 1/2 to 1 tsp powder or a cup of Brahmi tea once or twice daily.",
    benefits: [
      "Enhances memory consolidation, focus, and overall learning speed",
      "Calms extreme anxiety, reducing the habit of overthinking",
      "Strengthens the nervous system under sustained stress tasks",
      "Nourishes hair and promotes deeper sleep when applied as a scalp oil"
    ],
    precautions: "Often lowers heart rate slightly. Avoid in situations of severe bradycardia. Take with food or warm water to prevent slight digestive upset."
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Setup Gemini client lazily/safely based on runtime environment variable
  let ai: GoogleGenAI | null = null;
  function getGeminiClient() {
    if (!ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn("Warning: GEMINI_API_KEY is not defined. AI consultations will fallback to high-quality rule-based simulations.");
        return null;
      }
      ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return ai;
  }

  // Helper helper to handle rate limits and transient 503 high demand errors with exponential backoff
  async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    retries = 3,
    delay = 1000,
    backoffFactor = 2
  ): Promise<T> {
    try {
      return await fn();
    } catch (error: any) {
      const status = error?.status || error?.code || (error?.message && error.message.includes("503") ? 503 : 0);
      const isRetriable = 
        status === 503 || 
        status === 429 || 
        status === 502 || 
        status === 504 || 
        (error?.message && (
          error.message.toLowerCase().includes("503") || 
          error.message.toLowerCase().includes("429") || 
          error.message.toLowerCase().includes("unavailable") ||
          error.message.toLowerCase().includes("high demand") ||
          error.message.toLowerCase().includes("overloaded")
        ));

      if (retries > 0 && isRetriable) {
        console.warn(`Gemini API failed with transient/retriable error (${status || 'unknown'}). Retrying in ${delay}ms... (${retries} attempts left). Error Context:`, error.message || error);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return retryWithBackoff(fn, retries - 1, delay * backoffFactor, backoffFactor);
      }
      throw error;
    }
  }

  // --- API Routes ---

  // 1. Get static herbs database
  app.get("/api/herbs", (req, res) => {
    res.json(HYDRATED_HERBS);
  });

  // 2. Main recommendation generation route
  app.post("/api/recommend", async (req, res) => {
    const { symptoms, diseaseContext, age, gender, severity, duration, customDescription, doshaAnswers } = req.body;

    // Inputs validation
    const symptomsList = symptoms || [];
    const diseaseString = diseaseContext || "";
    const primarySeverity = severity || "Mild";
    const primaryDuration = duration || "A few days";
    const ageValue = age || "Adult";
    const genderValue = gender || "Prefer not to say";
    const userStory = customDescription || "";

    const userPrakritiDoc = doshaAnswers ? `
User Dosha self-profile assessment:
- Energy levels state: ${doshaAnswers.energy || "Moderate"}
- Appetite / digestion style: ${doshaAnswers.digestion || "Normal"}
- Sleep posture / depth: ${doshaAnswers.sleep || "Moderate/Light"}
- Skin & Hair characteristics: ${doshaAnswers.skin || "Average/Combination"}
- Mental state under stress: ${doshaAnswers.stress || "Anxious/Impatient"}
` : "Self-profile questionnaire not completed.";

    // Let's create an elegant, rich prompt instructing Gemini to analyze the situation and return structured recommendations
    const prompt = `You are an expert Ayurvedic Doctor (Vaidya) and herbalist with deep knowledge of traditional Sanskrit treatise (Charaka Samhita, Sushruta Samhita) and modern safety protocols.
You will assess the user's healthcare profile and generate an Ayurvedic Recommendation.

User Profile:
- Selected Symptoms/Disease markers: ${symptomsList.join(", ")}
- Diagnosed Conditions / Context: ${diseaseString}
- Category Severity: ${primarySeverity}
- Symptom Duration: ${primaryDuration}
- Age category: ${ageValue}
- Gender identity: ${genderValue}
- Extra context described by user: "${userStory}"
${userPrakritiDoc}

Please provide an in-depth Ayurvedic diagnostic overview and recommendations. Keep instructions highly authentic, incorporating well-known Ayurvedic herbs, simple home remedies, dietary restrictions (Ahar), and lifestyle modifications (Vihar).

You MUST return a JSON response matching the following schema. Ensure all fields are fully populated with accurate recommendations, avoiding generic filler texts or placeholders.

JSON Response Schema to produce:
{
  "dominantDoshaAnalysis": "Detailed analysis of which of the three Doshas (Vata, Pitta, Kapha) are likely aggravated, why, and how this relates to their symptoms.",
  "holisticSummary": "A reassuring summary explaining the recommended strategy and holistic approach for the individual.",
  "medicines": [
    {
      "name": "Herb Name (English)",
      "sanskritName": "Sanskrit transliterated name",
      "type": "Type of remedy (e.g., Single Herb, Churna/Powder, Arishta/Fermented liquid, Ghruta/Infused Ghee, Tablet, Home Remedy)",
      "benefits": "Precise reason why this is recommended for their specific situation and how it acts on the digestive or respiratory tract.",
      "dosageInstructions": "Specific instructions on when, how much, and with what carrier (anupana - e.g., warm water, honey, warm milk) to take it.",
      "safetyNotes": "Specific safety contraindications, who should avoid it, and when to halt."
    }
  ],
  "dietaryRecommendations": {
    "explanation": "Custom dietary philosophy to address their Dosha aggravation (e.g., favoring warming/moist foods for cold/dry Vata state).",
    "toFavor": ["Detailed food or spice to eat 1", "Detailed food or spice to eat 2", "Detailed food or spice to eat 3"],
    "toAvoid": ["Detailed item or habit to avoid 1", "Detailed item or habit to avoid 2", "Detailed item or habit to avoid 3"]
  },
  "lifestyleRecommendations": {
    "yogaAsanas": ["Specific yoga posture 1 with benefit description", "Specific posture 2 with benefit description"],
    "breathingExercises": ["Specific Pranayama technique with guidelines of cycle"],
    "lifestyleTips": ["Daily wellness tip related to sleep, routine, bathing, oiling, massage, or meditation"]
  }
}

Guidelines for Recommendations:
1. Speak with professional, compassionate authority.
2. Recommend 2 to 4 classic Ayurvedic remedies or safe herbs (e.g. Ashwagandha, Triphala, Tulsi, Turmeric, Ginger, Shatavari, Brahmi, Neem, Licorice, Pippali, Haritaki, Guduchi, etc.). Specify dosage clearly.
3. Keep ingredients accessible (e.g. kitchen spices, easily procurable Churnas).
4. Do NOT prescribe dangerous, heavy-metal based formulas (Bhasmas/Rasa Shastra); focus entirely on safe herbal recommendations (Kashayams, Churnas, tailams, single herbs, simple home brews).
5. ALWAYS formulate specific advice. Do not output anything outside of the requested JSON object format.`;

    const client = getGeminiClient();

    if (!client) {
      // Simulate high-quality Ayurvedic recommender if Key is missing
      console.log("No GEMINI_API_KEY. Simulating high-quality diagnostic rule-based engine.");
      const mockResult = generateMockRecommendation(symptomsList, diseaseString, primarySeverity, userStory);
      return res.json(mockResult);
    }

    try {
      const response = await retryWithBackoff(() =>
        client.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                dominantDoshaAnalysis: {
                  type: Type.STRING,
                  description: "The analysis of Vata, Pitta, Kapha state and aggravation relationship with symptoms."
                },
                holisticSummary: {
                  type: Type.STRING,
                  description: "An encouraging Ayurvedic action plan and overall therapeutic intent."
                },
                medicines: {
                  type: Type.ARRAY,
                  description: "List of 2-4 primary herbs, formulas, or home remedies.",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING, description: "Common English or standard Ayurvedic herb name." },
                      sanskritName: { type: Type.STRING, description: "Sanskrit botanical name transliteration." },
                      type: { type: Type.STRING, description: "Remedy Type (e.g., Single Herb, Churna Powder, Decoction, Tablet)." },
                      benefits: { type: Type.STRING, description: "Why it matches this patient's symptoms/disease." },
                      dosageInstructions: { type: Type.STRING, description: "Dosage, carrier (Anupana), frequency, and time of day." },
                      safetyNotes: { type: Type.STRING, description: "Warnings, pregnancy advice, or chronic considerations." }
                    },
                    required: ["name", "sanskritName", "type", "benefits", "dosageInstructions", "safetyNotes"]
                  }
                },
                dietaryRecommendations: {
                  type: Type.OBJECT,
                  properties: {
                    explanation: { type: Type.STRING, description: "Food guidance philosophy regarding Agni and digestive toxins." },
                    toFavor: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of optimal diets, spices, drinks to consume." },
                    toAvoid: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of foods to avoid based on symptoms." }
                  },
                  required: ["explanation", "toFavor", "toAvoid"]
                },
                lifestyleRecommendations: {
                  type: Type.OBJECT,
                  properties: {
                    yogaAsanas: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Soothed yoga stretches." },
                    breathingExercises: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Resonating Pranayama techniques." },
                    lifestyleTips: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Recommended habits, sleeping, body therapy." }
                  },
                  required: ["yogaAsanas", "breathingExercises", "lifestyleTips"]
                }
              },
              required: ["dominantDoshaAnalysis", "holisticSummary", "medicines", "dietaryRecommendations", "lifestyleRecommendations"]
            }
          }
        })
      );

      if (!response.text) {
        throw new Error("No response text from Gemini API.");
      }

      // Parse JSON from the response text
      const cleanJson = response.text.trim();
      const parsedData = JSON.parse(cleanJson);
      res.json(parsedData);

    } catch (error: any) {
      console.error("Gemini recommendation pipeline failed:", error);
      // Fail gracefully: generate matching structured mock content to shield user experience
      const fallbackResult = generateMockRecommendation(symptomsList, diseaseString, primarySeverity, userStory);
      res.json({
        ...fallbackResult,
        warning: "We've loaded standard clinical Ayurvedic guidelines because the direct live consult channel is busy."
      });
    }
  });

  // 3. Sattvavajaya Cognitive Habit Counseling Route
  app.post("/api/habits/chat", async (req, res) => {
    const { habit, messages } = req.body;
    const history = messages || [];
    const targetHabit = habit || "General Restlessness";

    const systemInstruction = `You are an expert Ayurvedic Counseling Psychologist and Sattvavajaya specialist (cognitive behavioral wellness based on ancient Sanskrit treatises).
You help individuals break unwholesome physical and mental habits (e.g., alcohol drinking, smoking, sugar binging, screen addiction, lethargy/Alasya).
Your approach is compassionate, objective, wise, and grounded in the pillars of Sattvavajaya:
1. Dhi (intellectual understanding, explaining the root causes and how unwholesome items damage Ojas).
2. Dhairya (courage, fortitude, providing targeted immediate exercises to ride out cravings).
3. Atmadi Vijnana (self-knowledge, connecting their ultimate release to their pure Sattva potential).

Always address the conversation context. Speak as an ancient yet highly logical counselor.
You must return a JSON response matching the following schema:
{
  "message": "The assistant response text explaining, soothing, or analyzing their latest query in rich markdown format.",
  "sattvaLevel": 75, // Your estimate of their active mental willpower/Sattva state from 0-100.
  "cravingAntidotes": {
    "physical": "An immediate physically ingestible or tactile Ayurvedic remedy (such as chewing cardamom/yashtimadhu, sipping warm sweet ginger-fennel, eye washing with cold rosewater, etc.) designed for their habit.",
    "breathWork": "A targeted rapid Pranayama description (such as Sheetali cooling breath, Bhastrika bellows breath, or 4-7-8 fortitude breathing) with clear, step-by-step instructions to break the cognitive desire cycle.",
    "mentalFocus": "A centering mindfulness, visualization, or Pratipaksha Bhavana (replacing desire with its joyous opposite) meditation prompt."
  },
  "suggestedPrompts": ["A follow-up prompt suggestion 1", "A follow-up prompt suggestion 2", "A follow-up prompt suggestion 3"]
}

Rule: Do not prescribe heavy metals, bhasmas, or prescription medicines. Rely on mental exercises, pranayama, supportive daily dinacharya schedules, kitchen spices, and adaptogenic safety herbs (Brahmi, Guduchi, Ashwagandha, Shankhapushpi). Do NOT output anything other than JSON.`;

    const client = getGeminiClient();

    if (!client) {
      console.log("No GEMINI_API_KEY. Simulating high-quality Sattvavajaya wellness habit chatbot.");
      const mockResult = generateMockHabitResponse(targetHabit, history);
      return res.json(mockResult);
    }

    try {
      // Map history roles into 'user' and 'model' for @google/genai SDK format
      const formattedContents = history.map((msg: any) => ({
        role: msg.role === "assistant" || msg.role === "bot" ? "model" : "user",
        parts: [{ text: msg.content || msg.text }]
      }));

      // Ensure there is at least one user content block
      if (formattedContents.length === 0) {
        formattedContents.push({
          role: "user",
          parts: [{ text: `I want helpful Ayurvedic counseling with breaking my habit of ${targetHabit}.` }]
        });
      }

      const response = await retryWithBackoff(() =>
        client.models.generateContent({
          model: "gemini-3.5-flash",
          contents: formattedContents,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                message: { type: Type.STRING, description: "Detailed supportive therapeutic dialogue text in markdown format." },
                sattvaLevel: { type: Type.INTEGER, description: "Estimated self-control/willpower index on a scale of 0 to 100." },
                cravingAntidotes: {
                  type: Type.OBJECT,
                  properties: {
                    physical: { type: Type.STRING, description: "Immediate physical herbal or sensory gesture antidote." },
                    breathWork: { type: Type.STRING, description: "Targeted crave-disruption Pranayama guidelines." },
                    mentalFocus: { type: Type.STRING, description: "Mindful cognitive focus or visualization technique." }
                  },
                  required: ["physical", "breathWork", "mentalFocus"]
                },
                suggestedPrompts: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Array of 3 logical therapeutic follow-up questions from the user's perspective."
                }
              },
              required: ["message", "sattvaLevel", "cravingAntidotes", "suggestedPrompts"]
            }
          }
        })
      );

      if (!response.text) {
        throw new Error("Empty response text from live counseling channel.");
      }

      res.json(JSON.parse(response.text.trim()));

    } catch (err: any) {
      console.error("Gemini Sattva Habit channel failed:", err);
      const fallbackResult = generateMockHabitResponse(targetHabit, history);
      res.json({
        ...fallbackResult,
        warning: "We have loaded pre-configured therapeutic guidelines because our live chat channels are currently busy."
      });
    }
  });

  // --- Vite Dev & Production Integration ---

  if (process.env.NODE_ENV !== "production") {
    // Development mode with hot reloads handled by Express proxying to Vite server
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Standalone production file server serving from the built /dist folder
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Ayurvedic Recommendation engine running on http://localhost:${PORT}`);
  });
}

// Fallback high-quality simulation helper
function generateMockRecommendation(symptoms: string[], disease: string, severity: string, story: string) {
  // Simple heuristic based symptom detection
  const normalizedText = (symptoms.join(" ") + " " + disease + " " + story).toLowerCase();
  
  let primaryDosha = "Vata & Pitta";
  let explanation = "Your symptoms suggest an aggravation of Vata (elements of Air & Ether) causing dryness and irregularity, as well as minor Pitta (elements of Fire & Water) affecting metabolism and carrying heat.";
  let remedies: any[] = [];
  let dietaryFavor: string[] = [];
  let dietaryAvoid: string[] = [];
  let asanas: string[] = [];
  let breathing: string[] = [];
  let lifestyle: string[] = [];

  if (normalizedText.includes("anxiety") || normalizedText.includes("sleep") || normalizedText.includes("insomnia") || normalizedText.includes("fatigue") || normalizedText.includes("stress")) {
    primaryDosha = "Vata Pitta";
    explanation = "Your stress, sleep disruption, or mental strain is a classic sign of hyperactive Vata Dosha disrupting Prana Vayu (the life force governing mind and nerves). It has also unsettled Pitta, causing restless sleep.";
    remedies = [
      {
        name: "Ashwagandha Powder",
        sanskritName: "Withania somnifera",
        type: "Single Herb Tonic",
        benefits: "A highly revered adaptogen that strengthens tissues, lowers stress hormones, and calms Vata directly in the nervous system.",
        dosageInstructions: "Take 1/2 teaspoon with warm sweet milk or ghee 30 minutes before bedtime.",
        safetyNotes: "Avoid in cases of severe lung congestion or active high fever."
      },
      {
        name: "Brahmi Tea",
        sanskritName: "Bacopa monnieri",
        type: "Brain & Nerve Tonic",
        benefits: "Cools the mental channel, boosts concentration, reduces persistent overthinking, and induces peaceful rest.",
        dosageInstructions: "Brew 1 tsp Brahmi leaves in warm water, drink warm twice daily on empty stomach.",
        safetyNotes: "Might lower heartbeat slightly; do not consume in excess if suffering from low heartrate."
      }
    ];
    dietaryFavor = [
      "Warming spices like cardamon, ginger, and small pinch of nutmeg",
      "Easily digestible, warm cooked grains such as basmati rice pudding and oats",
      "Heathy fats like extra virgin olive oil or clarified butter (Ghee) to moisten tissues"
    ];
    dietaryAvoid = [
      "Extremely cold salads, frozen items, or dry crackers that exacerbate dry Vata",
      "Caffeinated beverages (especially coffee and dry tea) which hyper-stimulate nerves",
      "Heavy processed fast foods"
    ];
    asanas = [
      "Balasana (Child's Pose): Provides sensory withdrawal and grounds nervous energy.",
      "Viparita Karani (Legs Up the Wall): Excellent calming pose that grounds all Vata elements.",
      "Savasana (Corpse Pose): Focus entirely on relaxing the skeletal system."
    ];
    breathing = [
      "Nadi Shodhana (Alternate Nostril Breathing): 5-10 minutes. Extremely calming to Vata, brings symmetry to left and right brain hemispheres."
    ];
    lifestyle = [
      "Abhyanga (Self Massage): Rub warm sesame oil onto your soles and scalp before sleep.",
      "Maintain a strict daily schedule (Dinacharya) for meals and sleeping times."
    ];
  } else if (normalizedText.includes("acid") || normalizedText.includes("stomach") || normalizedText.includes("acidity") || normalizedText.includes("heat") || normalizedText.includes("digest") || normalizedText.includes("acne") || normalizedText.includes("skin") || normalizedText.includes("rash")) {
    primaryDosha = "Pitta";
    explanation = "Your symptoms such as skin irritation, high acidity, or warming metabolic issues are direct signs of excessive Pitta (Fire element) aggravating Pachaka Pitta (digestive enzymes) and Bhrajaka Pitta (skin luster).";
    remedies = [
      {
        name: "Shatavari Root",
        sanskritName: "Asparagus racemosus",
        type: "Cooling Rejuvenator",
        benefits: "Deeply hydrates depleted internal layers, cools excessive stomach acidity, and soothes inflammatory digestive mucosa.",
        dosageInstructions: "Mix 1/2 teaspoon with warm sweet water or milk after your lunch and dinner daily.",
        safetyNotes: "Avoid if feeling highly heavy, congested, or with high mucus buildup."
      },
      {
        name: "Turmeric-Honey Paste",
        sanskritName: "Curcuma longa + Madhu",
        type: "Anti-inflammatory Purifier",
        benefits: "Flushes reactive blood impurities, purges stagnant skin toxins, and balances liver thermal state safely.",
        dosageInstructions: "Stir 1/3 tsp turmeric with 1 tsp raw honey; consume slowly twice daily after meals.",
        safetyNotes: "Do not take high medicinal doses of turmeric concurrently with blood thinners."
      }
    ];
    dietaryFavor = [
      "Cooling, soothing fruits like ripe sweet mangos, melons, pears, and organic coconut water",
      "Bitter, sweet, or astringent vegetables such as cucumber, zucchini, broccoli, and leafy herbs",
      "Cooling spices like fennel seeds, coriander seeds, and fresh mint leaves"
    ];
    dietaryAvoid = [
      "Highly spicy chilies, cayenne, raw garlic, raw onions, and heavy vinegar which fuel Pitta fire",
      "Fermented items like yogurt, sour cream, and aged cheeses",
      "Excessive alcohol, deep-fried food, and strong tobacco products"
    ];
    asanas = [
      "Sitali Pranayama (Cooling breath) combined with gentle chest-opening stretches.",
      "Ustrasana (Camel Pose): Stretches the abdomen and stimulates healthy thyroid/parathyroid glands.",
      "Bidalasana (Cat-Cow Stretch): Gently massages the core organs to balance liver and gut."
    ];
    breathing = [
      "Sheetali Pranayama: Inhale deeply through a rolled tongue, exhale through nose. Cooled air calms digestive inflammation instantly."
    ];
    lifestyle = [
      "Avoid intense heavy workouts under direct noon sunlight during peak heat hours.",
      "Wash your face with standard rosewater to refresh Bhrajaka Pitta skin elements."
    ];
  } else {
    // General / Digestive / Kapha Cold defaults
    primaryDosha = "Kapha & Vata";
    explanation = "Your symptom profile matches a mild imbalance in Vata and sluggish Kapha (Water & Earth elements), representing a block in kinetic flow (Vayu) and digestive fire (Agni). We need to revitalize natural metabolism.";
    remedies = [
      {
        name: "Triphala Powder",
        sanskritName: "Triphalā",
        type: "Tridoshic Cleanser",
        benefits: "A classic blend of three legendary organic fruits that naturally purges digestive blockage, regulates colon lining, and boosts cellular immunity.",
        dosageInstructions: "Take 1/2 teaspoon mixed in 1 cup of warm water just before hitting bed.",
        safetyNotes: "Temporarily halt if you experience acute loose bowel movements or diarrhea."
      },
      {
        name: "Tulsi & Fresh Ginger Tea",
        sanskritName: "Surasa + Ardraka",
        type: "Warm Infusion",
        benefits: "Rekindles sluggish digestive processes, eliminates respiratory phlegm, and drives vital blood circulation.",
        dosageInstructions: "Brew 5 tulsi leaves and 2 slices ginger in hot water for 5 minutes. Drink in the morning.",
        safetyNotes: "Take caution if you suffer from highly aggravated acid reflux."
      }
    ];
    dietaryFavor = [
      "Light, warm cooked foods spiced with ginger, black pepper, cumin, and warm cinnamon",
      "Mildly astringent grains like toasted barley, quinoa, and small servings of warm mung dal soup",
      "Warm liquids, herbal teas, and hot water throughout the day"
    ];
    dietaryAvoid = [
      "Cold, damp, heavy foods, dairy products, especially cheese and yogurt in the evening",
      "Refined white sugar, heavy deep-fried sweets, and excessive oily pastries",
      "Large quantities of heavy hard-to-digest red meat"
    ];
    asanas = [
      "Surya Namaskar (Sun Salutations): A dynamic flow that stokes Agni and counteracts cold Kapha weight.",
      "Dhanurasana (Bow Pose): Deeply compresses the spleen, liver, and digestive tract to boost movement."
    ];
    breathing = [
      "Kapalabhati (Skull Shining Breath): Active exhalation, passive inhalation. Energizes systems and expels stagnation."
    ];
    lifestyle = [
      "Engage in moderately active aerobic exercise to spark sweat glands as a toxin flush.",
      "Avoid sleeping during the daytime hours as it slows down the natural metabolic cycle."
    ];
  }

  return {
    dominantDoshaAnalysis: explanation,
    holisticSummary: `Based on your profile, the approach is focused on balancing the secondary ${primaryDosha} elements. We intend to kindle your digestive fire (Agni), eliminate internal toxic buildup (Ama), and ground your life force (Prana). Follow this comprehensive guide for 2-3 weeks to notice significant improvements.`,
    medicines: remedies,
    dietaryRecommendations: {
      explanation: "Ayurvedic diet functions of 'Ahar' are targeted around boosting Agni (metabolism) so that nourishment turns into cellular vitality (Tejas, Ojas) rather than sticky metabolic residue (Ama).",
      toFavor: dietaryFavor,
      toAvoid: dietaryAvoid
    },
    lifestyleRecommendations: {
      yogaAsanas: asanas,
      breathingExercises: breathing,
      lifestyleTips: lifestyle
    }
  };
}

function generateMockHabitResponse(habit: string, messages: any[]) {
  const lastMessage = messages[messages.length - 1]?.content || "";
  const normalizedLast = lastMessage.toLowerCase();
  const normalizedHabit = habit.toLowerCase();

  let responseMessage = "";
  let physical = "";
  let breathWork = "";
  let mentalFocus = "";
  let suggestedPrompts = [
    "How do I restore my Vata balance to stop this urge?",
    "What kitchen spices clear my mental toxins (Ama)?",
    "Can you suggest a daily morning routine (Dinacharya) to prevent this?"
  ];
  let sattvaLevel = 60;

  // Simple custom dialogue tree based on habit
  if (normalizedHabit.includes("alcohol") || normalizedHabit.includes("drink")) {
    sattvaLevel = 65;
    if (normalizedLast.includes("urge") || normalizedLast.includes("crave") || normalizedLast.includes("now") || normalizedLast.includes("help") || normalizedLast.includes("drink")) {
      responseMessage = `### Overcoming the Alcohol Urge (Madya Craving)
I hear your call, and I want you to take a slow, deep breath.

In Ayurvedic psychology, alcohol (*Madya*) carries properties that are **Ushna** (hot), **Teekshna** (sharp), and **Vyavayi** (instantly spreading). These qualities are the exact polar opposite of **Ojas** (the sweet, cooling, protective nectar of life and immunity). When the urge strikes, your mind's **Rajasic** element is searching for instant warmth and numbness to soothe underlying chronic dryness (*Vata* friction) or stagnation.

By pausing and recognizing this urge without shame, you have already initiated **Sattvavajaya** (mental mastery). Let us address this physical and sensory craving right now by cooling down the fire and replenishing your Ojas.`;
      physical = "Drink a large glass of coconut water with a pinch of organic cardamom powder, or a glass of pure organically harvested grape juice. This sweet, cooling taste (Madhura Rasa) instantly quells the sharp, toxic heat of the alcohol craving and begins to soothe the liver.";
      breathWork = "Perform 12 slow cycles of Sheetali Pranayama. Fold your tongue like a straw, inhale deeply and coolly through the mouth, hold for 2 seconds, and exhale smoothly through the nose. This quenches the internal heat of the urge.";
      mentalFocus = "Visualize your liver and heart enveloped in a luminous, cooling emerald light. Silently repeat: 'I am cooling the fire. My natural nectar (Ojas) is abundant, rich, and stable.'";
    } else {
      responseMessage = `### Ayurvedic Philosophy on Alcohol Addiction (Madya)
Welcome to your sovereign path of self-restoration. In Ayurveda, the recovery from *Madya* dependency focuses on rebuilding **Ojas** (vital juice) and calming the **Mano-Vaha Srotas** (channels of the mind).

In traditional treatises, alcohol excess directly impairs the mind's purity (**Sattva**), prompting either **Rajasic** agitation (restlessness, hyper-emotionality, anger) or **Tamasic** sedation (lethargy, escape, depression).

To progressively dismantle this habit, we recommend introducing bitter, adaptogenic herbs that naturally repair the gut-mind connection:
1. **Guduchi (Amrit)**: The 'Nectar' herb. It purifies the blood and liver, restoring cellular wisdom so you crave natural nutrients.
2. **Brahmi & Shankhapushpi**: Calm hyperactive neurons, relieving the chronic stress that triggers the evening drink.
3. **Triphala**: Taken nightly to clear gut-mind stagnation (*Ama*).

Let me know: Are you experiencing a strong urge *right now*, or are you planning your daily herbal and routine strategies?`;
      physical = "Keep a thermos of lukewarm water infused with fennel and coriander seeds nearby. Sip this whenever a physical hand-to-mouth urge arises.";
      breathWork = "Engage in Nadi Shodhana (Alternate Nostril Breathing) for 5 minutes every morning on an empty stomach to harmonize your mental frequencies.";
      mentalFocus = "Practice 'Pratipaksha Bhavana' — when a desire for alcohol surfaces, instantly conjure a vivid mental picture of how clear, energized, and deeply peaceful your mind feels at 6:00 AM on a sober morning.";
    }
  } else if (normalizedHabit.includes("smoke") || normalizedHabit.includes("tobacco") || normalizedHabit.includes("vape")) {
    sattvaLevel = 63;
    if (normalizedLast.includes("urge") || normalizedLast.includes("crave") || normalizedLast.includes("now") || normalizedLast.includes("help")) {
      responseMessage = `### Quelling the Smoking / Vape Urge (Dhumapana)
Stay right here. Let your shoulders drop.

Smoking (*Dhumapana*) introduces intense, highly drying heat directly into your **Prana-Vaha Srotas** (respiratory channels), disturbing *Prana Vayu* and creating fake expansion. When your body demands tobacco, it is actually craving a deep, resetting exhalation to regulate a frantic, dry nervous system.

We can satisfy this deep somatic demand without introducing toxic carbon and heat.`;
      physical = "Slowly chew a small piece of organic Licorice root (Yashtimadhu) or a clean cardamom pod. The woody, sweet taste creates oral sensory satisfaction, stimulates salivary cleansing enzymes, and soothes dry lung tissues.";
      breathWork = "Execute the '4-7-8' Breath of Fortitude. Inhale deeply through the nose for 4 seconds, hold the breath for 7 seconds, then exhale slowly with a whispering 'whoosh' sound through the mouth for 8 seconds. Complete 5 consecutive cycles.";
      mentalFocus = "Observe the somatic physical urge as a wave on the sea. You are the stable, deep ocean floor. Let the wave roll in, crest, and dissolve back into you. You do not need to fight it; simply outlast it.";
    } else {
      responseMessage = `### Ayurvedic Wisdom for Smoking Cessation
Welcome, traveler. Choosing to cleanse your lungs (**Prana-Vaha Srotas**) from smoke and heat is an immensely powerful step towards elevating your life-force (*Prana*).

Smoking rapidly dries the internal lining of the body, creating an imbalance of *Vata* (drying) and *Pitta* (heating). Over time, the nervous system becomes dependent on this high-potency heating stimulant to feel grounded.

To naturally ground yourself without smoke and nicotine:
1. **Yashtimadhu (Licorice Chew)**: Replaces the chewing habit, sweetens the throat, and hydrates dried lungs.
2. **Tulsi Tea**: Acts as a lung tonic, repairing heavy cellular damage and calming the neuro-chemical craving receptors.
3. **Ashwagandha**: Calms the underlying nervous exhaustion that makes you reach for tobacco.

How long have you carried this habit, and what is your greatest bottleneck when trying to quit?`;
      physical = "Carry fresh Tulsi or Mint leaves. Whenever dry cravings arise, chew them, focusing on the sensory cooling expansion in your chest.";
      breathWork = "Complete 3 minutes of Bhastrika (Bellows) breathing in the morning to oxygenate and clear heavy carbon and stale energies from lungs.";
      mentalFocus = "Soma focus: Ground your soles flat on the floor, feel the solid, ancient Earth beneath you, and say silently: 'I am stable, I am anchored, I am clean.'";
    }
  } else if (normalizedHabit.includes("sugar") || normalizedHabit.includes("food") || normalizedHabit.includes("binge") || normalizedHabit.includes("snack")) {
    sattvaLevel = 70;
    responseMessage = `### Balancing Sweet Cravings & Digestive Spark
Cravings for sugar and refined snacks are deeply tied to a sluggish digestive fire (**Agni**) or an imbalance in **Bodhaka Kapha** (the sensory element of the tongue).

In Ayurveda, when we digest food poorly, we produce a sticky residue called **Ama** (toxins). *Ama* blocks cellular receptors, preventing real nourishment from reaching the tissues. The brain misinterprets this cellular starvation as a demand for instant sugar energy, creating relentless food cravings.

To disrupt this cycle:
1. **Shardunika (Gymnema Sylvestre / Gudmar)**: Celebrated in Sanskrit as 'The Sugar Destroyer'. If taken as a churna or capsule, it temporarily numbs the tongue's sweet receptors so sweet foods taste completely plain, instantly breaking the psychological pleasure loop.
2. **Triphala**: Cleanses gut stagnation (*Ama*), restoring natural hunger signals.
3. **Cinnamon & Fennel Tea**: Naturally satisfies the craving for sweetness while active spices kindle your central Agni.

Would you like to know more about Shardunika (the sugar destroyer) or how to spark your digestive Agni?`;
    physical = "Drink half a cup of warm water infused with a slice of fresh ginger and 1/2 tsp of fennel seeds. Luke-warm sweet-spiced drinks satisfy the tongue and stoke gut enzymes.";
    breathWork = "Perform Kapalabhati (Skull-Shining) breath for 30 cycles to kindle the internal digestive fire, burning off the toxic congestion that causes sugar spikes.";
    mentalFocus = "Acknowledge the urge as 'false hunger' of the tongue, and wait exactly 10 minutes. Real metabolic hunger is constant, false hunger fades when the focus changes.";
  } else if (normalizedHabit.includes("digital") || normalizedHabit.includes("screen") || normalizedHabit.includes("phone") || normalizedHabit.includes("scroll") || normalizedHabit.includes("media") || normalizedHabit.includes("internet")) {
    sattvaLevel = 60;
    responseMessage = `### Calming Hyperactive Vata & Digital Scrolling
The habit of constant digital scrolling, checking notifications, and consuming screen content is a modern pathology that represents highly aggravated **Vata Dosha** in the **Mano-Vaha Srotas** (mental channels).

The screen operates like a rapid wind: it presents flickering lights and instant gratification elements, hyper-stimulating **Prana Vayu** (the airy movement of thoughts) and driving your mind into an emergency, hyper-Rajasic state of alertness and restlessness.

To ground your sensory portals (*Indriyas*):
1. **Brahmi (Gotu Kola)**: The ultimate neurological coolant. It repairs cognitive stamina, reduces fatigue, and calms Vata.
2. **Nasya**: Putting 2 drops of warm sesame oil or Brahmi ghee in each nostril at night hydrates the sinus nerves, directly calming Vata mental anxiety.
3. **Evening Dinacharya**: Power down all devices after 8:30 PM. Swap screens with reading, journaling, or a quiet bath.

Tell me: Do you tend to screen-scroll during stressful workday spikes, or late at night right before sleep?`;
    physical = "Perform a 2-minute clean water splash on your eyes. Close your eyes, cupping them with cool wet palms. This rests the visual Indriya (Chakshu Indriya) which is ruled by Alochaka Pitta.";
    breathWork = "Practice Bhramari Pranayama (Humming Bee Breath) for 7 cycles. Inhale deeply, block your ears with your thumbs and eyes with fingers, and exhale making a deep, resonant humming sound. This acts as an acoustic neural reset.";
    mentalFocus = "Practice Pratyahara (sensory withdrawal) by looking out a window at a distant, unmoving green tree or the sky. Rest your vision for a full minute.";
  } else {
    sattvaLevel = 65;
    responseMessage = `### Restoring Mental Focus & Sattva
Breaking unwholesome habits (*Anrita Achar*) is fundamentally about building **Sattva**—the mental quality of light, clarity, stability, and intelligence.

When we repeat an unhelpful schedule, dry patterns, or engage in a unwholesome physical habit, our mind falls under **Tamas** (inertia, ignorance, darkness). The intellect (*Dhi*) is present, but our courage/willpower (*Dhairya*) is blocked by mental fog (*Ama*).

By choosing to talk about this, you are actively moving your mind from Tamas, through Rajas (action/dialogue), and towards Sattva (peace/freedom).

To elevate your willpower:
1. **Brahmi & Ashwagandha**: Excellent combination to stabilize brain fatigue.
2. **Ginger tea in the morning**: Dispels Kapha inertia and sparks action.
3. **Pratipaksha Bhavana**: Instantly replacing negative, limiting thoughts with their exact, joyous opposites.

What is a specific habit you are focusing on right now, and how does it make you feel physically afterwards?`;
    physical = "Stand up and perform an energetic stretch. Walk around and drink 3 sips of room temperature water to reset the kinetic nervous loop.";
    breathWork = "Perform 10 explosive, deep Kapalabhati cycles to force stagnant energy out of the lungs and abdomen, sparking instant alertness.";
    mentalFocus = "Focus on the heart space. Visualize a small, stable, un-flickering flame of clean gold candle spark. The flame remains perfectly steady, untouched by winds of worry or lazy impulses.";
  }

  return {
    message: responseMessage,
    sattvaLevel,
    cravingAntidotes: {
      physical,
      breathWork,
      mentalFocus
    },
    suggestedPrompts
  };
}

startServer();
