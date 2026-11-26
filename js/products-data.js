/**
 * ALLFEAMS™ - Products & Formulation Data
 * File: js/products-data.js
 * 
 * Sourced directly from local high-resolution assets in C:\Users\Abie\Pictures\alfem.
 */

const ALLFEAMS_PRODUCTS = {
  flora: {
    id: "flora",
    name: "Advanced Flora+",
    fullName: "Advanced Flora+ Vaginal Support",
    category: "Feminine Flora & pH Balance",
    subtitle: "Targeted Probiotic & Cranberry Formula for Complete Odor & pH Equilibrium",
    price: 34.95,
    originalPrice: 49.95,
    rating: "4.9",
    reviewCount: 2410,
    badge: "94% Zero Odor in 14 Days",
    tagline: "#1 Best Seller",
    image: "assets/Advanced.jpg",
    gallery: [
      "assets/Advanced/Advanced 1.jpg",
      "assets/Advanced/Advanced 2.jpg",
      "assets/Advanced/Advanced 3.jpg",
      "assets/Advanced/Advanced 4.jpg"
    ],
    video: "assets/Advanced/video/advance potrait.mp4",
    videoLandscape: "assets/Advanced/video/advanced landscape.mp4",
    description: "Triple-action probiotic gummies infused with cranberry extract and prebiotics. Eliminates persistent odor and reinforces mucosal immunity.",
    ingredients: [
      "L. Reuteri 5B CFU",
      "Cranberry Pacs",
      "Bioactive Inulin"
    ],
    benefits: [
      "Eliminates intimate odor at the source within 7-14 days",
      "Maintains acidic, protective vaginal pH balance (3.8 - 4.5)",
      "5 Billion CFU of targeted female L. reuteri & L. rhamnosus",
      "Supports daily freshness post-exercise, intimacy, and period"
    ],
    searchTags: "odor smell flora ph discharge yeast freshness bacteria feminine gummies advanced"
  },

  harmony: {
    id: "harmony",
    name: "Harmony+ Ovarian",
    fullName: "Harmony+ Ovarian Support Capsules",
    category: "Cycle & Hormone Support",
    subtitle: "40:1 Myo & D-Chiro Inositol Complex for Hormonal & Menstrual Equilibrium",
    price: 34.95,
    originalPrice: 49.95,
    rating: "4.9",
    reviewCount: 1840,
    badge: "Predictable Cycle Support",
    tagline: "Clinical Grade",
    image: "assets/Harmony+.jpg",
    gallery: [
      "assets/harmony+/harmony 1.jpg",
      "assets/harmony+/harmony 2.jpg",
      "assets/harmony+/harmony 3.jpg",
      "assets/harmony+/harmony 4.jpg"
    ],
    video: "assets/harmony+/video/Harmony potratit.mp4",
    videoLandscape: "assets/harmony+/video/Harmony landscape.mp4",
    description: "Potent 40:1 Myo & D-Chiro Inositol ratio with folate & vitex. Regulates monthly cycles, eases intense PMS, and relieves ovarian tension.",
    ingredients: [
      "40:1 Inositol Blend",
      "Methylfolate B9",
      "CoQ10 + Zinc"
    ],
    benefits: [
      "Promotes regular, predictable 28-30 day menstrual cycles",
      "Calms ovarian discomfort, heavy cramps, and hormonal mood swings",
      "Clinical 40:1 ratio matching the body’s physiological inositol",
      "Clinically backed support for PCOS and ovarian vitality"
    ],
    searchTags: "cycle period pcos cramps ovaries hormones menstruation mood inositol harmony"
  },

  flatfemme: {
    id: "flatfemme",
    name: "FlatFeams Daily",
    fullName: "FlatFeams Craving & Bloat Support",
    category: "Debloat & Craving Harmony",
    subtitle: "Multi-Enzyme Bioactive Matrix for Rapid Digestive Ease & Fluid Balance",
    price: 34.95,
    originalPrice: 49.95,
    rating: "4.8",
    reviewCount: 1390,
    badge: "Fast 60-Min Bloat Relief",
    tagline: "Gut & Metabolic",
    image: "assets/Flatfeams.jpg",
    gallery: [
      "assets/Flatfeams/Flatfeams 1.jpg",
      "assets/Flatfeams/Flatfeams 2.jpg",
      "assets/Flatfeams/Flatfeams 3.jpg",
      "assets/Flatfeams/Flatfeams 4.jpg"
    ],
    video: "assets/Flatfeams/video/Flatfeams potrait.mp4",
    videoLandscape: "assets/Flatfeams/video/Flatfeam landscape.mp4",
    description: "Multi-enzyme matrix with dandelion root, ginger, and chromium. Breaks down water retention, soothes gut distress, and curbs evening cravings.",
    ingredients: [
      "DigeZyme® Matrix",
      "Organic Ginger",
      "Chromium Picolinate"
    ],
    benefits: [
      "Fast debloating relief within 60 minutes after meals",
      "Breaks down stubborn water retention and gas accumulation",
      "Curbs afternoon and late-night sugar & carbohydrate cravings",
      "Supports smooth, comfortable daily bowel elimination"
    ],
    searchTags: "bloat stomach gas digestion water weight cravings enzyme debloat flat stomach flatfeams"
  },

  moisture: {
    id: "moisture",
    name: "Moisture Max",
    fullName: "Moisture Max Intimate Hydration",
    category: "Menopause & Intimate Hydration",
    subtitle: "Pure Hyaluronic Acid & Sea Buckthorn for Pre/Post-Menopause Comfort",
    price: 34.95,
    originalPrice: 49.95,
    rating: "4.9",
    reviewCount: 890,
    badge: "Hormone-Free Hydration",
    tagline: "Gentle Hydration",
    image: "assets/Advanced.jpg",
    gallery: [
      "assets/Advanced/Advanced 1.jpg",
      "assets/Advanced/Advanced 2.jpg"
    ],
    video: "assets/Advanced/video/advance potrait.mp4",
    description: "Pure botanical hydration formula easing feminine sensitivity, hot flashes, and intimacy friction without synthetic hormones.",
    ingredients: [
      "Hyaluronic Acid (High MW)",
      "Sea Buckthorn Oil",
      "Vitamin E Tocopherols"
    ],
    benefits: [
      "Relieves intimate mucosal dryness and friction discomfort",
      "100% Hormone-free hydration with oral high-molecular Hyaluronic Acid",
      "Soothes temperature fluctuations and menopause sensitivity",
      "Restores natural cellular lubrication and feminine ease"
    ],
    searchTags: "dryness menopause moisture hydration intimate comfort lubrication mature"
  }
};

// Bundle Tier Offerings
const ALLFEAMS_BUNDLES = {
  tier1: {
    bottles: 1,
    label: "Starter Experience",
    title: "1 Bottle",
    subtitle: "30-Day Individual Reset",
    pricePerBottleUsd: 34.95,
    totalUsd: 34.95,
    savingsText: "Standard Price",
    shippingText: "Calculated at checkout",
    image: "assets/Advanced.jpg"
  },
  tier2: {
    bottles: 3,
    label: "Recommended by 92% of Doctors",
    badge: "Most Popular • 90-Day Reset",
    title: "3 Bottles (Save 38%)",
    subtitle: "Complete Microbiome & Odor Equilibrium",
    pricePerBottleUsd: 24.95,
    originalPerBottleUsd: 34.95,
    totalUsd: 74.85,
    savingsText: "Save $30.00 instantly",
    shippingText: "FREE Express Discreet Shipping",
    image: "assets/all-variants.jpg"
  },
  tier3: {
    bottles: 6,
    label: "Ultimate Longevity",
    title: "6 Bottles (Save 48%)",
    subtitle: "180-Day Systemic Total Balance",
    pricePerBottleUsd: 21.95,
    originalPerBottleUsd: 34.95,
    totalUsd: 131.70,
    savingsText: "Save $78.00 instantly",
    shippingText: "Free Priority Discreet Shipping + Free Luxury Pouch",
    image: "assets/all-variants.jpg"
  }
};

// Alias flatfeams to flatfemme for 100% interoperability across all components
ALLFEAMS_PRODUCTS.flatfeams = ALLFEAMS_PRODUCTS.flatfemme;
