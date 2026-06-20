export interface DiseaseStudy {
  id: string;
  name: string;
  sanskritName: string;
  description: string;
  doshaInfluence: string;
  primaryHerbs: {
    name: string;
    action: string;
  }[];
  classicalFormulations: {
    name: string;
    administration: string;
  }[];
  dietaryPathya: string[]; // To Favor
  dietaryApathya: string[]; // To Avoid
  lifestyleVihar: string[]; // Habits, Yoga or Pranayama
}

export const COMMON_DISEASES_DB: DiseaseStudy[] = [
  {
    id: "diabetes",
    name: "Diabetes Melitus",
    sanskritName: "Madhumeha",
    description: "In Ayurveda, diabetes is categorized under 'Prameha' (urinary disorders), specifically 'Madhumeha' (sweet urine). It is primarily a disease of Kapha imbalance disrupting Meda (fat tissues) and Agni (digestive fire), eventually involving Vata deterioration if untreated over years.",
    doshaInfluence: "Predominantly Kapha aggravation with subsequent secondary Vata deterioration leading to dry tissue wasting.",
    primaryHerbs: [
      {
        name: "Gurmar (Gymnema sylvestre)",
        action: "Literally 'Sugar Destroyer'. Suppresses sweet taste reception on tongue and aids pancreatic health."
      },
      {
        name: "Amalaki (Phyllanthus emblica)",
        action: "High-grade antioxidant rich fruit that balances blood glucose fluctuations and supports metabolic tissues."
      },
      {
        name: "Turmeric (Curcuma longa)",
        action: "When paired with Amla (known as 'Nisha-Amalaki'), represents the gold standard Ayurvedic synergy for Prameha."
      }
    ],
    classicalFormulations: [
      {
        name: "Chandraprabha Vati",
        administration: "1-2 tablets twice daily with warm water (supports urinary system and lipid pathways)."
      },
      {
        name: "Vasant Kusumakar Ras",
        administration: "Under close guidance of BAMS doctor, to rejuvenate tissues suffering from extreme glucose exhaustion."
      }
    ],
    dietaryPathya: [
      "Favor astringent and bitter grains such as barley (Yava), millet, and roasted oats",
      "Incorporate bitter vegetables like raw bitter melon (Karela), fenugreek greens, and garlic",
      "Cook with warm spices: cinnamon, turmeric, mustard seed, and fenugreek seeds"
    ],
    dietaryApathya: [
      "Avoid all heavy desserts, refined white sugarcane sugars, and sweet juices",
      "Avoid sleeping immediately after lunch (diurnal sleep heavily increases Kapha and aggravates Madhumeha)",
      "Strictly minimize refined white rice, excess potatoes, and sweet heavy fruits (like ripe bananas)"
    ],
    lifestyleVihar: [
      "Dhanurasana (Bow Pose) and Paschimottanasana (Seated Forward Bend) to squeeze and stimulate the abdominal pancreas",
      "Kapalabhati Pranayama: Strong rhythmic abdominal exhalations to rekindle cellular metabolism",
      "Engage in brisk walking for at least some distance at sunset to burn damp subcutaneous fluid"
    ]
  },
  {
    id: "arthritis",
    name: "Arthritis & Joint Inflammation",
    sanskritName: "Amavata / Sandhigata Vata",
    description: "Ayurveda classifies joint issues into two distinct categories: 'Amavata' (Rheumatoid Arthritis - caused by accumulation of toxic digestive residue 'Ama' in joint fields) or 'Sandhigata Vata' (Osteoarthritis - caused by bone cushion wear resulting from cold, dry Vata aggravation).",
    doshaInfluence: "Amavata represents joint toxins ignited by weak digestion combined with Kapha/Vata. Sandhigata Vata is pure desiccating Vata.",
    primaryHerbs: [
      {
        name: "Guggulu (Commiphora mukul)",
        action: "A supreme oleo-resin that binds and scrapes heavy toxins (Ama) from joint sockets while reducing swelling."
      },
      {
        name: "Shunthi (Dry Ginger)",
        action: "Warming spark that burns the sticky, heavy metabolic waste (Ama) clogging joint circulation channel systems."
      },
      {
        name: "Shallaki (Boswellia serrata)",
        action: "Highly anti-inflammatory resin that nourishes dry joint tissues and restores mobility."
      }
    ],
    classicalFormulations: [
      {
        name: "Yogaraj Guggulu",
        administration: "1-2 tablets twice daily with warm ginger water after meals."
      },
      {
        name: "Mahanarayan Taila",
        administration: "Warming medicated sesame oil for gentle local massage over stiff joint spaces (mainly osteoarthritis)."
      }
    ],
    dietaryPathya: [
      "Incorporate warming, light, easily digestible food like mung dal soup with fresh grated ginger",
      "Favor hot water or ginger tea instead of cold carbonated drinks",
      "Use small amounts of pure cow's Ghee or warm sesame oil to lubricate inner dry passages"
    ],
    dietaryApathya: [
      "Avoid heavy bloating nightshades (potatoes, tomatoes, eggplants) especially in Rheumatoid Arthritis",
      "Never consume curd (yogurt) at night as it blocks the micro-circulatory channels (Srotas)",
      "Stop eating stale leftovers, frozen ready-to-eat meals, and cold raw salads"
    ],
    lifestyleVihar: [
      "Prasarita Padottanasana or gentle cat-cow stretches to restore spinal fluid mobility",
      "Apply localized dry heat fomentation (such as warm sand bag bags or Epsom salt wraps) on swollen joints",
      "Nadi Shodhana Pranayama: 10 minutes to soothe high pain signals guided by hyper-aroused nerves"
    ]
  },
  {
    id: "insomnia",
    name: "Insomnia & Chronic Sleep Issues",
    sanskritName: "Anidra / Nidranasha",
    description: "In Ayurvedic neurology, sleep is one of the three primary pillars of life (Upastambhas). Insomnia (Anidra) is caused by hyperactive Vata (specifically Prana Vayu) causing high mental circulation and nervous system dryness, or elevated Pitta causing hyper-vigilance.",
    doshaInfluence: "Highly aggravated Vata (mental air currents) and Pitta (cerebral overheating) leading to lack of Kapha's naturally stabilizing heavy quality.",
    primaryHerbs: [
      {
        name: "Brahmi (Bacopa monnieri)",
        action: "Cools the mind, pacifies restless neural activity, and nourishes brain tissue, inducing deep sleep pathways."
      },
      {
        name: "Ashwagandha (Withania somnifera)",
        action: "Soothes tired adrenal reserves, reduces excessive stress hormones, and grounds flighty Vata energy."
      },
      {
        name: "Tagara (Valeriana wallichii)",
        action: "A powerful sedative herb that calms hyperactive brain electrical impulses, bringing sleep-onset speed."
      }
    ],
    classicalFormulations: [
      {
        name: "Saraswatarishta",
        administration: "15ml with equal quantity of warm water after dinner before sleep."
      },
      {
        name: "Ksheerabala Taila",
        administration: "Add 1-2 drops on soles of feet and massage deeply before hitting bed (Pada-Abhyanga)."
      }
    ],
    dietaryPathya: [
      "Drink warm milk mixed with a tiny pinch of nutmeg and cardamom 30 minutes before bed",
      "Favor sweet, soothing warm foods like sweet potato soup, hot cream of wheat, and basmati rice",
      "Season meals with cumin, coriander, and gentle fennel seeds to prevent gaseous sleep disruptions"
    ],
    dietaryApathya: [
      "Avoid dark chocolate, coffee, decaf tea, and energy pills near afternoon or evening",
      "Avoid raw dry foods (crackers, raw broccoli, dry chips) which aggravate light Vata qualities",
      "Do not go to bed with a completely heavy or overstuffed stomach (no fatty heavy dinners past 7:30 PM)"
    ],
    lifestyleVihar: [
      "Pada Abhyanga: Deep, slow massage of foot soles with warm sesame/coconut oil before sleep",
      "Viparita Karani (Legs up the Wall) for 10-15 minutes in a pitch dark room prior to bed",
      "Digital Detox: Completely close phones/screens 1 hour before sleep to avoid stimulating Bhrajaka Pitta skin/eyes"
    ]
  },
  {
    id: "acid_reflux",
    name: "Acid Reflux & Heartburn",
    sanskritName: "Amlapitta",
    description: "Amlapitta is a very common gastrointestinal disorder in Ayurveda. It represents an increase in the liquid and sour attributes of Pitta (digestive fire), causing the digestive gastric acids to overheat and spill upwards.",
    doshaInfluence: "Highly aggravated Pitta (specifically Pachaka Pitta) along with a minor block of Vata directing flow upward (Udavarta).",
    primaryHerbs: [
      {
        name: "Amalaki (Amla fruit)",
        action: "Soothes internal acidity instantly, high vitamin C content without being acidic because of highly cooling energy."
      },
      {
        name: "Yashtimadhu (Licorice root)",
        action: "Acts as a powerful natural demulcent, coating inflamed esophagus walls and healing peptic ulcers."
      },
      {
        name: "Shatavari (Asparagus racemosus)",
        action: "Cooling, sweet root that moisturizes and reduces toxic hot Pitta buildup."
      }
    ],
    classicalFormulations: [
      {
        name: "Avipattikar Churna",
        administration: "1/2 to 1 teaspoon with lukewarm water or honey before principal meals."
      },
      {
        name: "Kamadugha Ras",
        administration: "Classic mineral-calcium compound, taken 1 tab with milk (deep, gentle cooling balance)."
      }
    ],
    dietaryPathya: [
      "Favor cooling, sweet fruits like sweet melons, ripe pears, and fresh young coconut flesh/water",
      "Eat plenty of bitter green cooling vegetables (zucchini, cucumber, asparagus)",
      "Incorporate cooling dairy items such as buttermilk diluted with water and toasted fennel seeds"
    ],
    dietaryApathya: [
      "Strictly avoid hot chilies, dynamic black pepper, raw radishes, hot mustard, and raw garlic",
      "Avoid carbonated mixers, strong liquors, carbonated sodas, and heavy deep-fried items",
      "Stop eating citrus fruits like raw lemons, sour oranges, and heavy vinegars or pickles"
    ],
    lifestyleVihar: [
      "Sheetali Pranayama (Cooling Tongue Breath) for 10-15 cycles to cool internal furnace heat",
      "Savasana and gentle spinal movements; avoid backbends immediately after meals",
      "Never sleep on your right side immediately; prefer lying on your left side to maintain natural gastric layout"
    ]
  },
  {
    id: "asthma",
    name: "Asthma & Respiratory Allergies",
    sanskritName: "Tamaka Shwasa",
    description: "Tamaka Shwasa is an Ayurvedic respiratory respiratory condition. It is initiated in the digestive tract but shows symptoms in the respiratory channels (Pranavaha Srotas). Excess Kapha (mucus element) blocks Vata (air movement) causing heavy respiratory spasms.",
    doshaInfluence: "Kapha congestion blocking the normal downward flow of Vata (Prana Vayu), causing gasping and reactive spasms.",
    primaryHerbs: [
      {
        name: "Vasa (Adhatoda vasica)",
        action: "A supreme bronchodilator herb that liquifies thick mucus blockages, easing lung chest expansion."
      },
      {
        name: "Pippali (Long Pepper)",
        action: "Strongly heating herb that dispels respiratory Kapha, rejuvenates bronchial tissues, and aids digestion."
      },
      {
        name: "Kantakari (Solanum xanthocarpum)",
        action: "Reduces throat irritation, works as a safe expectorant, and calms histamine hyper-responses."
      }
    ],
    classicalFormulations: [
      {
        name: "Chyawanprash",
        administration: "1 teaspoon daily in the morning with warm water (builds seasonal pulmonary immunity)."
      },
      {
        name: "Sitopaladi Churna",
        administration: "Mix 1/2 tsp with honey, twice daily after principal meals (expert throat soother)."
      }
    ],
    dietaryPathya: [
      "Favor hot, dry, light food cooked with black pepper, dry ginger, cloves, and cardamom",
      "Consume steamed foods, vegetable broths, and sip hot water throughout the day",
      "Consume active warm vegetable soups spiced with a tiny pinch of asafoetida (Hing)"
    ],
    dietaryApathya: [
      "Strictly avoid cold refrigerated water, carbonated drinks, ice creams, and cold desserts",
      "Minimize heavy mucus-forming foods like thick curd (yogurt), hard yellow cheese, and heavy cream",
      "Avoid eating bananas, raw avocados, and high volumes of raw wheat flour in the evening"
    ],
    lifestyleVihar: [
      "Warm sesame oil oiling (Abhyanga) on chest + upper back, followed by warm towel heating pad compress",
      "Anulom Vilom (Alternate Nostril breathing) to soothe hypersensitive bronchi",
      "Avoid exposure to direct cold winds or moist morning air; cover the chest warmly during change of seasons"
    ]
  }
];
