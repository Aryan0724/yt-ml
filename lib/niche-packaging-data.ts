export interface NicheBenchmark {
  slug: string
  name: string
  archetypeCode: string
  subtitle: string
  headline: string
  metaDescription: string
  targetKeywords: string[]
  benchmarks: {
    targetCtrRange: string
    optimalWordsInTitle: string
    mobileCutoffChar: number
    faceRequired: boolean
    idealColorTemp: string
    contrastRatio: string
    saturationProfile: string
  }
  openCvHeuristics: {
    rule: string
    technicalExplanation: string
  }[]
  titleFormulas: {
    formula: string
    example: string
    curiosityTrigger: string
  }[]
  packagingMistakes: {
    mistake: string
    whyItHurts: string
    theFix: string
  }[]
  faqs: {
    question: string
    answer: string
  }[]
}

export const NICHE_PACKAGING_DATA: Record<string, NicheBenchmark> = {
  "faceless-documentary": {
    slug: "faceless-documentary",
    name: "Faceless Documentary & Video Essays",
    archetypeCode: "FACELESS_DOCUMENTARY",
    subtitle: "Cinematic Tension, High Stakes & Zero-Face Packaging Architecture",
    headline: "The Science of 8%+ CTR on Faceless Video Essays",
    metaDescription: "Master YouTube packaging for faceless documentaries and video essays. Discover OpenCV cinematic contrast benchmarks, high-stakes title formulas, and how to win browse feeds without human faces.",
    targetKeywords: [
      "faceless youtube channel packaging",
      "faceless documentary thumbnail ideas",
      "video essay title formulas",
      "youtube thumbnail without face",
      "documentary thumbnail contrast"
    ],
    benchmarks: {
      targetCtrRange: "6.5% – 10.2%",
      optimalWordsInTitle: "5 – 8 words",
      mobileCutoffChar: 52,
      faceRequired: false,
      idealColorTemp: "5,200K – 6,500K (Cool Cinematic)",
      contrastRatio: "4.8:1 (Deep Vignette Separation)",
      saturationProfile: "Controlled (High micro-contrast, muted global saturation)"
    },
    openCvHeuristics: [
      {
        rule: "Zero-Face Penalty Override",
        technicalExplanation: "Legacy tools penalize thumbnails missing human faces. PreYT's archetype detector sets the face penalty weight to 0.0, evaluating instead focal depth isolation and edge silhouette clarity."
      },
      {
        rule: "Canny Edge Complexity Cap (< 18%)",
        technicalExplanation: "High-density edges (e.g. cluttered maps, busy collages) degrade into unrecognizable visual noise on 120px mobile screens. PreYT measures Laplacian edge density to enforce a single focal hero subject."
      },
      {
        rule: "Luminance Vignette & Rim Separation",
        technicalExplanation: "A 20% peripheral luminance drop (vignette) drives viewer eye movement toward the primary curiosity symbol within 120 milliseconds."
      }
    ],
    titleFormulas: [
      {
        formula: "The [Scandal / Event] YouTube Doesn't Want You to Know",
        example: "The Silicon Valley Collapse Nobody Is Talking About",
        curiosityTrigger: "Institutional conspiracy & information gatekeeping"
      },
      {
        formula: "How [Entity] Secretly Controls [Massive System]",
        example: "How 3 Investment Funds Secretly Own Global Water",
        curiosityTrigger: "Hidden mechanics of power and money"
      },
      {
        formula: "The Rise and Disastrous Fall of [Subject]",
        example: "The Rise and Disastrous Fall of Cyberpunk 2077",
        curiosityTrigger: "Hubris and high-consequence tragedy"
      }
    ],
    packagingMistakes: [
      {
        mistake: "Placing text in the bottom-right timestamp zone",
        whyItHurts: "YouTube's video duration badge covers the lower-right 15% of your canvas, hiding critical context.",
        theFix: "Keep all focal tension and typography strictly confined to the left 70% or upper-third quadrant."
      },
      {
        mistake: "Cluttering with multiple competing visual subjects",
        whyItHurts: "Mobile users take 150ms to decide whether to scroll. Two competing objects split attention and kill click conviction.",
        theFix: "Use the 'One Concept, One Subject' rule. If an element doesn't amplify the core question, delete it."
      }
    ],
    faqs: [
      {
        question: "Can faceless YouTube videos get as high CTR as channels with face reactions?",
        answer: "Yes. Top documentary channels like Fern, Moon, and Magnates Media regularly achieve 7%–11% CTR without faces. They achieve this by substituting emotional facial resonance with high-stakes visual juxtaposition (e.g., a tiny silhouette facing a towering monolith) and sharp title curiosity gaps."
      },
      {
        question: "What title length works best for video essays on mobile?",
        answer: "Titles between 40 and 52 characters perform best. Titles longer than 54 characters trigger YouTube's mobile ellipsis cutoff (...), which often truncates the core punchline."
      }
    ]
  },

  "cooking-culinary": {
    slug: "cooking-culinary",
    name: "Cooking & Culinary Arts",
    archetypeCode: "COOKING_CULINARY",
    subtitle: "Appetite Induction, Kelvin Warmth & Food Texture Forensics",
    headline: "Culinary YouTube Packaging: Color Temp & Appetite Induction Heuristics",
    metaDescription: "Master YouTube packaging for cooking and culinary channels. Learn OpenCV food texture benchmarks, Kelvin temperature optimization, and appetite-inducing title hooks.",
    targetKeywords: [
      "cooking youtube thumbnail ideas",
      "food channel packaging",
      "culinary thumbnail lighting",
      "cooking video title formula",
      "food video ctr optimization"
    ],
    benchmarks: {
      targetCtrRange: "7.0% – 11.5%",
      optimalWordsInTitle: "4 – 7 words",
      mobileCutoffChar: 50,
      faceRequired: false,
      idealColorTemp: "2,800K – 3,400K (Warm Appetite Spectrum)",
      contrastRatio: "5.2:1 (Macro Food Isolation)",
      saturationProfile: "Warm Boost (Enhanced reds, oranges, golden yellows)"
    },
    openCvHeuristics: [
      {
        rule: "Kelvin Warmth Spectrum Enforcement",
        technicalExplanation: "Cold or greenish color casts (above 5,000K) trigger subconscious subconscious aversion for food. PreYT's chromaticity analyzer rewards warm red/yellow chrominance channels (LAB space a* > +15)."
      },
      {
        rule: "Laplacian Texture Variance (> 250)",
        technicalExplanation: "Sizzling crust, melting cheese, or glistening sauce requires high micro-detail texture sharpness. PreYT calculates Laplacian variance in the central food bounding box."
      },
      {
        rule: "Bokeh Depth-of-Field Isolation",
        technicalExplanation: "Background kitchen clutter distracts from the dish. PreYT calculates foreground-to-background edge falloff to ensure the hero food plate pops."
      }
    ],
    titleFormulas: [
      {
        formula: "I Made [Dish] [Extreme Number] Times to Find the Perfect Method",
        example: "I Made 50 Steaks to Find the Ultimate Method",
        curiosityTrigger: "Extreme effort and definitive authority"
      },
      {
        formula: "Stop Making This [Ingredient / Dish] Mistake Immediately",
        example: "Stop Ruining Your Garlic Like This",
        curiosityTrigger: "Fear of culinary incompetence"
      },
      {
        formula: "[Authority / Level] Reviews the Cheapest vs Most Expensive [Dish]",
        example: "Michelin Chef Tests $1 vs $100 Ramen",
        curiosityTrigger: "Price disparity and expert judgment"
      }
    ],
    packagingMistakes: [
      {
        mistake: "Using cold or desaturated fluorescent lighting",
        whyItHurts: "Cold food looks stale and unappealing, causing viewers to scroll past in the feed.",
        theFix: "Color grade thumbnails with warm 3,000K tones and boost saturation on golden browning and sauce gloss."
      },
      {
        mistake: "Writing paragraphs of text across the dish",
        whyItHurts: "Text obscures the food texture, which is the primary emotional hook for culinary content.",
        theFix: "Use 0 to 2 words maximum (e.g., 'CRISPY' or 'NEVER AGAIN'). Let the food do the work."
      }
    ],
    faqs: [
      {
        question: "Should a chef's face be in the cooking thumbnail?",
        answer: "Only if the chef has established personal brand recognition (e.g., Gordon Ramsay, Joshua Weissman). For non-celebrity creators, a close-up macro shot of the finished dish with high texture and steam regularly outperforms a face thumbnail by 25–40% in initial browse impression pools."
      },
      {
        question: "What is the optimal background for food thumbnails?",
        answer: "Dark slate, matte dark wood, or blurred neutral kitchen backgrounds provide the highest contrast against warm food hues without drawing the eye away from the plate."
      }
    ]
  },

  "gaming-esports": {
    slug: "gaming-esports",
    name: "Gaming & Esports",
    archetypeCode: "GAMING_ESPORTS",
    subtitle: "High Neon Saturation, Character Rim Strokes & Impossible Stakes",
    headline: "Gaming YouTube Packaging: Winning High-Velocity Feed Scrollers",
    metaDescription: "Benchmark your gaming thumbnails and title hooks. Learn OpenCV neon saturation standards, character model rim lighting, and high-CTR gaming title formulas.",
    targetKeywords: [
      "gaming thumbnail design",
      "minecraft thumbnail ideas",
      "esports youtube packaging",
      "gaming title formulas",
      "how to get high ctr on gaming videos"
    ],
    benchmarks: {
      targetCtrRange: "8.0% – 13.0%",
      optimalWordsInTitle: "5 – 9 words",
      mobileCutoffChar: 48,
      faceRequired: false,
      idealColorTemp: "6,000K – 7,500K (Neon Electric)",
      contrastRatio: "6.0:1 (Extreme High Contrast)",
      saturationProfile: "Ultra-Vibrant (HSV S > 180 on focal action quadrant)"
    },
    openCvHeuristics: [
      {
        rule: "Character Model Rim Lighting Stroke",
        technicalExplanation: "OpenCV edge detection inspects character asset boundaries for high-contrast rim strokes (white, cyan, or electric yellow) ensuring 100% separation from complex gameplay backgrounds."
      },
      {
        rule: "Diagonal Composition Vectors",
        technicalExplanation: "Gaming feeds demand energy. PreYT calculates Hough line transforms to reward diagonal action trajectories over static vertical/horizontal staging."
      },
      {
        rule: "HSV Saturation Peak Thresholds",
        technicalExplanation: "Gaming thumbnails with low HSV saturation blend into the YouTube dark mode feed. PreYT verifies that key highlight pixels reach high-chroma vibrancy."
      }
    ],
    titleFormulas: [
      {
        formula: "I Survived [Extreme Time / Challenge] Using Only [Impossible Rule]",
        example: "I Survived 100 Days in Hardcore Minecraft as a Fish",
        curiosityTrigger: "Impossible self-imposed constraints"
      },
      {
        formula: "The [Glitch / Strategy] That Broke [Competitive Game] Forever",
        example: "The Weapon That Got Banned From Warzone Forever",
        curiosityTrigger: "Exploitation of game mechanics and unfair advantage"
      },
      {
        formula: "They Banned Me for Using This Impossible Strategy",
        example: "I Reached Rank 1 Using an Illegal Strategy",
        curiosityTrigger: "Forbidden knowledge and elite mastery"
      }
    ],
    packagingMistakes: [
      {
        mistake: "Using raw, unedited gameplay screenshots",
        whyItHurts: "Raw screenshots lack edge separation and look like visual mush on mobile feed resolutions.",
        theFix: "Extract character models, upscale with anti-aliasing, add glowing rim borders, and blur/darken the background map."
      },
      {
        mistake: "Placing small game HUD numbers in corners",
        whyItHurts: "Numbers smaller than 24pt are completely unreadable on a smartphone screen and get covered by timestamps.",
        theFix: "Recreate critical stats as massive, high-contrast vector badges in the upper half of the frame."
      }
    ],
    faqs: [
      {
        question: "How do top gaming creators stand out when dozens play the same game update?",
        answer: "By packaging the unique emotional narrative or constraint rather than the update itself. Instead of 'Minecraft 1.21 Update Gameplay', winners package 'I Trapped 50 Players in the New 1.21 Vault'."
      },
      {
        question: "Does having a webcam facecam in the thumbnail help gaming CTR?",
        answer: "Only if the facial expression shows genuine, extreme tension (shock, intense rage, disbelief). Mild smiling facecams decrease CTR because they take up canvas area without adding stakes."
      }
    ]
  },

  "tech-reviews": {
    slug: "tech-reviews",
    name: "Tech & Hardware Reviews",
    archetypeCode: "TECH_REVIEWS",
    subtitle: "Industrial Studio Contrast, Device Silhouettes & Contrarian Truth Hooks",
    headline: "Tech YouTube Packaging: Industrial Minimalism & Contrarian Hooks",
    metaDescription: "Master tech and hardware YouTube packaging. Benchmark your thumbnail lighting against MKBHD and Dave2D standards with OpenCV contrast forensics and contrarian title formulas.",
    targetKeywords: [
      "tech thumbnail design",
      "tech review youtube packaging",
      "gadget thumbnail lighting",
      "tech review title formulas",
      "hardware review ctr benchmarks"
    ],
    benchmarks: {
      targetCtrRange: "5.5% – 8.8%",
      optimalWordsInTitle: "4 – 7 words",
      mobileCutoffChar: 54,
      faceRequired: false,
      idealColorTemp: "4,500K – 5,500K (Clean Daylight)",
      contrastRatio: "5.5:1 (Ultra-Sharp Edge Isolation)",
      saturationProfile: "Neutral Minimalist (Studio lighting with selective pop)"
    },
    openCvHeuristics: [
      {
        rule: "Industrial Silhouette Isolation",
        technicalExplanation: "Clean edge detection tracing the phone, laptop, or camera hardware against a desaturated matte studio background with zero compression artifacts."
      },
      {
        rule: "Typography Constraint (< 3 Words)",
        technicalExplanation: "Tech viewers respond to minimalism. PreYT flags thumbnails containing more than 3 words of overlay text as cluttered."
      },
      {
        rule: "Lighting Edge Reflections",
        technicalExplanation: "Evaluating rim highlights along device chamfers and glass edges that communicate premium build quality."
      }
    ],
    titleFormulas: [
      {
        formula: "[Product Name] Review: I Was Completely Wrong",
        example: "M4 MacBook Pro Review: I Was Completely Wrong",
        curiosityTrigger: "Contrarian subversion of popular consensus"
      },
      {
        formula: "Don't Buy [Product Name] Until You Watch This",
        example: "Don't Buy the iPhone 16 Pro Until You See This",
        curiosityTrigger: "Buyer remorse prevention & urgent warning"
      },
      {
        formula: "The Truth About [Product] After [Time Period] of Real Use",
        example: "The Truth About Apple Vision Pro After 6 Months",
        curiosityTrigger: "Unbiased long-term reality vs honeymoon hype"
      }
    ],
    packagingMistakes: [
      {
        mistake: "Placing manufacturer spec sheets or bullet points on thumbnail",
        whyItHurts: "Viewers scroll past spec walls; specs are impossible to read at smartphone thumbnail size.",
        theFix: "Show one dramatic macro shot of the hardware defect, port, or design change with a single 1-word punchline."
      },
      {
        mistake: "Cloning the exact Apple or Samsung press-render look",
        whyItHurts: "Viewers think it's a paid advertisement and scroll right past it in their feed.",
        theFix: "Use real in-hand or studio lighting with honest, authentic lighting rather than sterile PR stock photos."
      }
    ],
    faqs: [
      {
        question: "Why do negative or skeptical tech review titles get higher CTR?",
        answer: "Tech purchases involve financial risk ($1,000+ smartphones/laptops). Viewers are far more motivated to avoid making a costly purchasing mistake than to hear generic praise."
      },
      {
        question: "What thumbnail aspect matters most for hardware reviews?",
        answer: "Device scale and physical depth. Showing the device interacting with human hands or under dramatic studio rim lighting grounds it in physical reality."
      }
    ]
  },

  "anime-animation": {
    slug: "anime-animation",
    name: "Anime & Animation Analysis",
    archetypeCode: "ANIME_ANIMATION",
    subtitle: "Cel-Shaded Contrast, Emotional Climax & Narrative Lore Hooks",
    headline: "Anime & Pop Culture Packaging: Edge Clarity & Climax Capture",
    metaDescription: "Optimize anime video essays and pop culture lore thumbnails. Learn cel-shade edge clarity standards, character expression benchmarks, and narrative mystery title formulas.",
    targetKeywords: [
      "anime thumbnail design",
      "anime video essay packaging",
      "animation youtube titles",
      "pop culture thumbnail contrast",
      "anime ctr benchmarks"
    ],
    benchmarks: {
      targetCtrRange: "7.2% – 12.0%",
      optimalWordsInTitle: "5 – 8 words",
      mobileCutoffChar: 52,
      faceRequired: false,
      idealColorTemp: "Varies by Scene Palette",
      contrastRatio: "5.0:1 (Dynamic Range)",
      saturationProfile: "Vivid Cel-Shaded Chrominance"
    },
    openCvHeuristics: [
      {
        rule: "Linework Edge Preservation",
        technicalExplanation: "Canny edge detection calibrated for 2D animation linework to ensure character eyes and expressions remain sharp even when downscaled to mobile feeds."
      },
      {
        rule: "Emotional Peak Capture",
        technicalExplanation: "Evaluating high-contrast facial expressions (wide eyes, shadows across the brow, tears, or sinister silhouettes) over mundane dialogue frames."
      },
      {
        rule: "Curiosity Masking / Redaction",
        technicalExplanation: "Subtle visual redaction (e.g. eyes shadowed, a mysterious silhouette overlay) driving the viewer to click to resolve the visual puzzle."
      }
    ],
    titleFormulas: [
      {
        formula: "The Dark Philosophy Behind [Anime / Arc]",
        example: "The Terrifying Philosophy Behind Attack on Titan's Ending",
        curiosityTrigger: "Deep thematic revelation"
      },
      {
        formula: "Why [Creator / Studio] Broke All the Rules in [Scene / Series]",
        example: "Why Studio MAPPA Nearly Collapsed Making Jujutsu Kaisen Season 2",
        curiosityTrigger: "Behind-the-scenes industry drama and sacrifice"
      },
      {
        formula: "The Unforgivable Betrayal of [Character]",
        example: "The Tragic Betrayal of Itachi Uchiha",
        curiosityTrigger: "Moral conflict and heartbreak"
      }
    ],
    packagingMistakes: [
      {
        mistake: "Picking a blurry mid-motion frame from the episode",
        whyItHurts: "Motion blur looks like low video quality in the feed, driving down viewer confidence.",
        theFix: "Select an official key-frame or redraw critical lines to maintain razor-sharp 2D vectors."
      },
      {
        mistake: "Spoiling the entire plot twist on the thumbnail canvas",
        whyItHurts: "If the thumbnail answers the question completely, the viewer doesn't need to watch the video.",
        theFix: "Show the tension without showing the resolution. Create a curiosity gap that demands an answer."
      }
    ],
    faqs: [
      {
        question: "How do anime video essayists avoid copyright strikes on thumbnails?",
        answer: "Transformative manipulation: combining multiple isolated layers, custom color grading, adding depth blur, custom background lighting, and unique typography creates a legally transformative asset while increasing CTR."
      },
      {
        question: "Should text be used on anime thumbnails?",
        answer: "1 to 3 words maximum (e.g. 'MONSTER', 'HE LIED', 'THE REAL ENDING'). Never put the anime title on the thumbnail; the title belongs in the metadata title."
      }
    ]
  },

  "personality-vlog": {
    slug: "personality-vlog",
    name: "Personality & Lifestyle Vlogs",
    archetypeCode: "PERSONALITY_VLOG",
    subtitle: "Eyeline Geometry, Unposed Authenticity & Story Stakes",
    headline: "Personality & Lifestyle Packaging: Eyeline Geometry & Authentic Emotion",
    metaDescription: "Master YouTube packaging for vlogs and creator personality channels. Learn OpenCV eyeline tracking, facial emotion sizing benchmarks, and authentic curiosity hooks.",
    targetKeywords: [
      "vlog thumbnail ideas",
      "lifestyle youtube packaging",
      "eyeline in youtube thumbnails",
      "daily vlog title formulas",
      "how to package lifestyle videos"
    ],
    benchmarks: {
      targetCtrRange: "6.0% – 9.5%",
      optimalWordsInTitle: "4 – 7 words",
      mobileCutoffChar: 50,
      faceRequired: true,
      idealColorTemp: "5,000K – 5,600K (Natural Daylight)",
      contrastRatio: "4.5:1 (Natural Tonal Depth)",
      saturationProfile: "True-to-Life Skin Tones (Balanced LAB chromaticity)"
    },
    openCvHeuristics: [
      {
        rule: "Facial Canvas Area (25% – 45%)",
        technicalExplanation: "Haar cascade and DNN face detection verifies that the creator's face occupies between 25% and 45% of the frame for optimal mobile recognizability without crowding secondary context."
      },
      {
        rule: "Eyeline Vector Tracking",
        technicalExplanation: "Eye gaze vector must target either the lens directly ($0^\\circ$ viewer connection) or directly look at the secondary visual mystery object with $> 45^\\circ$ gaze alignment."
      },
      {
        rule: "Natural Skin Tone Calibration",
        technicalExplanation: "Over-filtered orange skin tones trigger spam filters and viewer fatigue. PreYT checks skin tone vectors in YCrCb color space for realistic warmth."
      }
    ],
    titleFormulas: [
      {
        formula: "We Need to Talk About What Just Happened",
        example: "We Need to Talk About What Happened in Tokyo",
        curiosityTrigger: "Intimate vulnerability and urgent announcement"
      },
      {
        formula: "I Tried Living Like [Public Figure] for [Time Period]",
        example: "I Tried Living Like a Billionaire for 7 Days",
        curiosityTrigger: "Extreme experiential empathy"
      },
      {
        formula: "Why I Finally Left [City / Career / Relationship]",
        example: "Why I Finally Left Los Angeles Forever",
        curiosityTrigger: "Major life pivot and closure"
      }
    ],
    packagingMistakes: [
      {
        mistake: "Posing with a generic fake YouTube shock face ('O-Mouth')",
        whyItHurts: "Modern viewers have extreme fatigue for fake exaggerated shock. It screams low-effort clickbait.",
        theFix: "Use candid, mid-action frames showing subtle, genuine micro-expressions (curiosity, contemplation, genuine laughter)."
      },
      {
        mistake: "Titles that read like internal diary entries ('Day 42 In Bali')",
        whyItHurts: "Casual feed viewers do not care what day of your trip it is. They care about what happened that relates to them.",
        theFix: "Frame the title around the universal tension or unexpected lesson ('What Nobody Tells You About Moving to Bali')."
      }
    ],
    faqs: [
      {
        question: "How do vlogs compete with high-budget video essays in recommendations?",
        answer: "Through intimate parasocial connection. A thumbnail with natural lighting, eye contact, and an emotional curiosity hook cuts through hyper-produced corporate thumbnails by feeling human and real."
      },
      {
        question: "Does thumbnail face direction matter?",
        answer: "Yes. Gaze heuristic research confirms that viewers first look at human eyes, and then follow where those eyes are looking. If your eyes look at a package or mystery door, viewers look there next before reading the title."
      }
    ]
  }
}

export function getAllNicheSlugs(): string[] {
  return Object.keys(NICHE_PACKAGING_DATA)
}

export function getNicheData(slug: string): NicheBenchmark | undefined {
  return NICHE_PACKAGING_DATA[slug]
}
