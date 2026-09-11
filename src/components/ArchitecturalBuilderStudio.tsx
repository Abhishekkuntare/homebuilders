import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { motion, AnimatePresence } from "motion/react";
import * as THREE from "three";
import gsap from "gsap";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import {
  Building2,
  Home,
  Crown,
  Layers,
  Sparkles,
  Compass,
  Maximize2,
  Minimize2,
  Sun,
  Sunset,
  Moon,
  Eye,
  RotateCcw,
  CheckCircle2,
  Calendar,
  DollarSign,
  Clock,
  Shield,
  ArrowRight,
  TrendingUp,
  Download,
  Share2,
  Check,
  ChevronRight,
  Info
} from "lucide-react";

// =========================================================================
// TYPES & DATA DEFINITIONS FOR 6 ARCHITECTURAL TYPOLOGIES
// =========================================================================

export type BuildingTypologyId =
  | "home"
  | "building"
  | "apartment"
  | "triplex"
  | "villa"
  | "royal";

export interface BuildingHotspot {
  id: string;
  name: string;
  category: string;
  position: [number, number, number];
  cameraTarget: [number, number, number];
  lookAt: [number, number, number];
  description: string;
  dimensions: string;
}

export interface BuildingTypology {
  id: BuildingTypologyId;
  title: string;
  subtitle: string;
  badge: string;
  icon: React.ReactNode;
  tagline: string;
  overview: string;
  defaultCameraPos: [number, number, number];
  defaultLookAt: [number, number, number];
  specs: {
    grossArea: string;
    footprint: string;
    levels: string;
    ceilingClearance: string;
    constructionTimeline: string;
    estInvestmentRange: string;
    pricePerSqFt: string;
    structuralFrame: string;
    sustainabilityRating: string;
  };
  hotspots: BuildingHotspot[];
  spaceAllocation: { name: string; value: number; color: string }[];
  costBreakdown: { category: string; cost: number }[];
  constructionPhases: { phase: string; duration: string; task: string }[];
  keyFeatures: string[];
}

export const BUILDING_TYPOLOGIES: BuildingTypology[] = [
  {
    id: "home",
    title: "Contemporary Minimalist Home",
    subtitle: "Single-Family Luxury Residence",
    badge: "Private Sanctuary",
    icon: <Home className="w-4 h-4" />,
    tagline: "Cantilevered floating roof planes with seamless indoor-outdoor courtyards",
    overview:
      "A serene, low-profile modern architectural residence designed for harmonious living. Characterized by wide-span glazing, a floating carport pavilion, cantilevered eaves, and integrated Japanese-inspired stepping stone gardens.",
    defaultCameraPos: [14, 8, 14],
    defaultLookAt: [0, 2, 0],
    specs: {
      grossArea: "4,850 SQ FT",
      footprint: "65 FT x 85 FT Lot",
      levels: "2 Levels + Sunken Garden",
      ceilingClearance: "12 - 14 FT",
      constructionTimeline: "14 - 18 Months",
      estInvestmentRange: "$2.8M - $3.6M",
      pricePerSqFt: "$650 / SQ FT",
      structuralFrame: "Post-Tensioned Concrete & Steel",
      sustainabilityRating: "LEED Gold · Solar Integrated"
    },
    hotspots: [
      {
        id: "home-living",
        name: "Double-Height Glass Living Pavilion",
        category: "Social",
        position: [1.2, 1.6, 1.8],
        cameraTarget: [7.2, 3.8, 7.5],
        lookAt: [1.2, 1.5, 1.2],
        description: "Expansive 14-foot motorized pocket doors dissolving the boundary between salon and zen courtyard.",
        dimensions: "1,150 SQ FT"
      },
      {
        id: "home-carport",
        name: "Floating Cantilever Carport & EV Bay",
        category: "Utility",
        position: [-4.2, 1.2, 2.8],
        cameraTarget: [-8.5, 4.0, 7.0],
        lookAt: [-3.8, 1.2, 2.0],
        description: "Column-free architectural steel cantilever sheltering dual luxury vehicles with concealed high-speed induction charging.",
        dimensions: "620 SQ FT"
      },
      {
        id: "home-patio",
        name: "Zen Stepping Stone Reflecting Garden",
        category: "Landscape",
        position: [-1.8, 0.4, 5.2],
        cameraTarget: [-1.0, 3.5, 9.8],
        lookAt: [-1.5, 0.5, 4.0],
        description: "Black flamed basalt stepping stones suspended over dark granite reflecting pool with bonsai specimen tree.",
        dimensions: "780 SQ FT"
      },
      {
        id: "home-master",
        name: "Upper Cantilever Master Suite",
        category: "Private",
        position: [2.5, 4.2, -0.8],
        cameraTarget: [6.5, 5.8, 3.5],
        lookAt: [2.2, 4.0, -0.8],
        description: "Floating upper volume clad in brushed teak battens featuring wraparound private viewing terrace.",
        dimensions: "840 SQ FT"
      }
    ],
    spaceAllocation: [
      { name: "Living & Entertaining", value: 35, color: "#c5a880" },
      { name: "Private Bedroom Suites", value: 30, color: "#818cf8" },
      { name: "Landscaped Gardens & Patios", value: 20, color: "#34d399" },
      { name: "Carport & Utility", value: 15, color: "#94a3b8" }
    ],
    costBreakdown: [
      { category: "Structural & Shell", cost: 1050 },
      { category: "Glazing & Facades", cost: 680 },
      { category: "Bespoke Millwork", cost: 580 },
      { category: "Smart MEP & Solar", cost: 420 },
      { category: "Zen Landscaping", cost: 320 }
    ],
    constructionPhases: [
      { phase: "Phase 1: Foundation", duration: "M 1-3", task: "Site excavation, geotechnical grading & post-tension foundation slab" },
      { phase: "Phase 2: Structural Superstructure", duration: "M 4-7", task: "Steel moment frame, cantilevered floors & thermal envelope" },
      { phase: "Phase 3: Facade & Glazing", duration: "M 8-11", task: "Custom minimal-profile motorized glass walls & teak exterior cladding" },
      { phase: "Phase 4: Interior Joinery & MEP", duration: "M 12-15", task: "Bookmatched stone finishes, Lutron automation & HVAC commissioning" },
      { phase: "Phase 5: Landscape & Handover", duration: "M 16-18", task: "Zen reflection pools, architectural lighting & white-glove inspection" }
    ],
    keyFeatures: [
      "Motorized pocket glass facade sliding into wall pockets",
      "Integrated rooftop solar photovoltaic micro-inverter matrix",
      "Concealed flush-to-ceiling hydronic radiant heating & cooling",
      "Column-free 28-foot cantilevered carport structure"
    ]
  },
  {
    id: "building",
    title: "Commercial Glass High-Rise Tower",
    subtitle: "Grade-A Corporate Headquarters & Sky Deck",
    badge: "Commercial Skyscraper",
    icon: <Building2 className="w-4 h-4" />,
    tagline: "Parametric solar-shading louvers with illuminated spire & executive sky lounge",
    overview:
      "A monumental corporate skyscraper featuring double-skin insulated glass curtain walls, vertical structural fins, a double-height street level atrium, and a cantilevered crown sky lounge crowned with a private executive helipad.",
    defaultCameraPos: [20, 22, 22],
    defaultLookAt: [0, 8, 0],
    specs: {
      grossArea: "185,000 SQ FT",
      footprint: "120 FT x 120 FT Urban Core",
      levels: "24 Stories + 3 Basements",
      ceilingClearance: "14 - 18 FT Finished",
      constructionTimeline: "28 - 36 Months",
      estInvestmentRange: "$68M - $85M",
      pricePerSqFt: "$420 / SQ FT",
      structuralFrame: "Reinforced Concrete Core & Steel Truss",
      sustainabilityRating: "LEED Platinum · WELL Certified Gold"
    },
    hotspots: [
      {
        id: "bldg-spire",
        name: "Illuminated Spire & Executive Helipad",
        category: "Crown",
        position: [0, 20.2, 0],
        cameraTarget: [8.5, 23.0, 9.5],
        lookAt: [0, 19.5, 0],
        description: "Architectural illuminated crown structure with dual-engine certified private helicopter touch-down pad.",
        dimensions: "4,500 SQ FT"
      },
      {
        id: "bldg-skydeck",
        name: "Double-Height Sky Lounge & Atrium",
        category: "Executive",
        position: [0, 14.8, 1.8],
        cameraTarget: [7.0, 16.5, 7.0],
        lookAt: [0, 14.0, 0],
        description: "Observation floor with 360-degree metropolitan panoramas, executive boardroom suites, and private cocktail club.",
        dimensions: "7,800 SQ FT"
      },
      {
        id: "bldg-floors",
        name: "Column-Free Corporate Office Floor Plates",
        category: "Workspace",
        position: [2.2, 9.2, -1.8],
        cameraTarget: [11.0, 10.5, 9.0],
        lookAt: [1.5, 9.0, 0],
        description: "Open-plan flexible workspaces with 15-foot finished clearances and high-performance acoustic ceiling baffles.",
        dimensions: "8,200 SQ FT / Floor"
      },
      {
        id: "bldg-plaza",
        name: "Grand Street-Level Urban Plaza & Canopy",
        category: "Public",
        position: [0, 0.8, 4.5],
        cameraTarget: [0, 3.2, 12.0],
        lookAt: [0, 1.2, 3.0],
        description: "Sculptural bronze entry canopy, revolving glass portals, reflecting pools, and biometric security turnstiles.",
        dimensions: "12,400 SQ FT"
      }
    ],
    spaceAllocation: [
      { name: "Office Suites & Workspaces", value: 60, color: "#38bdf8" },
      { name: "Executive Sky Lounge & Crown", value: 15, color: "#c5a880" },
      { name: "Atrium Lobby & Public Plaza", value: 15, color: "#a855f7" },
      { name: "Elevator Core & Mechanical", value: 10, color: "#64748b" }
    ],
    costBreakdown: [
      { category: "Concrete Core & Steel Superstructure", cost: 28500 },
      { category: "Unitized Glass Curtain Wall", cost: 16800 },
      { category: "Elevator Banks (High-Speed)", cost: 7200 },
      { category: "HVAC & Intelligent Building MEP", cost: 9400 },
      { category: "Crown Helipad & Fit-out", cost: 6500 }
    ],
    constructionPhases: [
      { phase: "Phase 1: Deep Piling & Basement", duration: "M 1-8", task: "Diaphragm walls, deep bored piles & 3-level subterranean basement" },
      { phase: "Phase 2: Slipform Core Rising", duration: "M 9-16", task: "Self-climbing hydraulic core formwork rising to level 24" },
      { phase: "Phase 3: Steel Floor Framing & Curtain Wall", duration: "M 17-24", task: "Structural steel perimeter framing & unitized triple-glazed panels" },
      { phase: "Phase 4: Elevators & Mechanical Systems", duration: "M 25-30", task: "Destination dispatch elevator installation & central chiller plant" },
      { phase: "Phase 5: Crown Spire & Commissioning", duration: "M 31-36", task: "Helipad certification, facade light test & tenant shell handover" }
    ],
    keyFeatures: [
      "Low-iron triple-insulated glass curtain with low-E ceramic frit",
      "High-speed regenerative destination-dispatch elevators (8 m/s)",
      "Dedicated rooftop helipad with integrated night navigation lighting",
      "Subterranean automated valet parking for 180 vehicles"
    ]
  },
  {
    id: "apartment",
    title: "Luxury High-Rise Apartment Complex",
    subtitle: "Boutique Multi-Unit Residential Residences",
    badge: "Multi-Residential",
    icon: <Layers className="w-4 h-4" />,
    tagline: "Cascading perimeter garden balconies with rooftop horizon infinity pool",
    overview:
      "A stepped luxury residential tower offering curated two-, three-, and four-bedroom sky homes. Featuring cascading landscaped private balconies, acoustic isolation slabs, and a breathtaking rooftop infinity wellness club.",
    defaultCameraPos: [16, 12, 16],
    defaultLookAt: [0, 4, 0],
    specs: {
      grossArea: "68,000 SQ FT",
      footprint: "90 FT x 100 FT Footprint",
      levels: "8 Floors · 18 Private Residences",
      ceilingClearance: "11.5 - 13 FT",
      constructionTimeline: "20 - 24 Months",
      estInvestmentRange: "$24M - $30M",
      pricePerSqFt: "$520 / SQ FT",
      structuralFrame: "Post-Tensioned Flat Plate Concrete",
      sustainabilityRating: "Passivhaus Principles · Carbon Neutral"
    },
    hotspots: [
      {
        id: "apt-pool",
        name: "Rooftop Sky Pool & Wellness Solarium",
        category: "Amenity",
        position: [0, 9.8, 0],
        cameraTarget: [6.5, 12.0, 7.0],
        lookAt: [0, 9.2, 0],
        description: "Zero-edge 20-meter heated lap pool with underwater observation portholes and cedar dry sauna.",
        dimensions: "3,800 SQ FT"
      },
      {
        id: "apt-balcony",
        name: "Cascading Garden Balconies",
        category: "Private Outdoor",
        position: [3.4, 5.8, 2.2],
        cameraTarget: [7.5, 7.2, 5.5],
        lookAt: [2.8, 5.5, 1.8],
        description: "Deep 12-foot cantilevered balconies with integrated drip-irrigated olive trees and bronze privacy louvers.",
        dimensions: "450 SQ FT / Unit"
      },
      {
        id: "apt-penthouse",
        name: "Duplex Penthouse Residence",
        category: "Penthouse",
        position: [-1.8, 7.8, -1.2],
        cameraTarget: [-6.2, 9.5, 4.5],
        lookAt: [-1.5, 7.5, -0.8],
        description: "Double-height open living space with private internal spiral staircase and panoramic corner glass walls.",
        dimensions: "4,200 SQ FT"
      },
      {
        id: "apt-lobby",
        name: "Resident Concierge Lounge & Porte-Cochère",
        category: "Ground",
        position: [0, 0.8, 3.8],
        cameraTarget: [0, 2.8, 9.5],
        lookAt: [0, 1.0, 3.0],
        description: "Covered arrival motor court, 24/7 concierge reception desk, private mail salon, and resident café lounge.",
        dimensions: "2,400 SQ FT"
      }
    ],
    spaceAllocation: [
      { name: "Private Residential Units", value: 65, color: "#f59e0b" },
      { name: "Terrace & Balcony Gardens", value: 15, color: "#10b981" },
      { name: "Rooftop Pool & Spa Club", value: 12, color: "#06b6d4" },
      { name: "Lobby & Concierge Services", value: 8, color: "#6366f1" }
    ],
    costBreakdown: [
      { category: "Structural Cast Concrete & Slabs", cost: 8900 },
      { category: "Balcony Balustrades & Planters", cost: 3800 },
      { category: "Rooftop Infinity Pool Engineering", cost: 2400 },
      { category: "Interior High-End Fitout", cost: 7200 },
      { category: "Acoustic Flooring & MEP", cost: 3100 }
    ],
    constructionPhases: [
      { phase: "Phase 1: Earthwork & Foundation", duration: "M 1-4", task: "Excavation, ground anchor retention & waterproof foundation" },
      { phase: "Phase 2: Post-Tensioned Slabs", duration: "M 5-11", task: "Cycle of 1 floor every 12 days with post-tensioned tendon cables" },
      { phase: "Phase 3: Enclosure & Balconies", duration: "M 12-16", task: "Double glazed acoustic curtain walls & glass balustrades" },
      { phase: "Phase 4: Interior Residential Fitout", duration: "M 17-21", task: "Custom Italian kitchens, marble bathrooms & private elevators" },
      { phase: "Phase 5: Rooftop Club & Handover", duration: "M 22-24", task: "Pool water testing, landscaping vegetation & individual unit snagging" }
    ],
    keyFeatures: [
      "Dual private keycard elevator access opening directly into foyer",
      "Calibrated 65-dB acoustic floor dampening between residential units",
      "Individual high-capacity filtered fresh air exchange per residence",
      "Automated subsurface greywater recovery for terrace planters"
    ]
  },
  {
    id: "triplex",
    title: "3-Layer Architectural Tiered Pavilion",
    subtitle: "Sculptural Tri-Level Cantilevered Residence",
    badge: "3-Layer Architecture",
    icon: <Layers className="w-4 h-4" />,
    tagline: "Three distinct stacked volumes rotating 15 degrees with shaded rooftop terraces",
    overview:
      "A breathtaking 3-layer modernist architectural statement. Level 1 forms a raw board-formed concrete gallery base; Level 2 projects outward in bronze and glass as the living salon; Level 3 floats as an intimate master studio with sky terrace.",
    defaultCameraPos: [15, 10, 15],
    defaultLookAt: [0, 3.5, 0],
    specs: {
      grossArea: "6,200 SQ FT",
      footprint: "55 FT x 75 FT Plot",
      levels: "3 Distinct Architectural Tiers",
      ceilingClearance: "13 - 16 FT Open Volumes",
      constructionTimeline: "16 - 20 Months",
      estInvestmentRange: "$4.5M - $5.8M",
      pricePerSqFt: "$780 / SQ FT",
      structuralFrame: "Sculptural Board-Formed Concrete & Box Girders",
      sustainabilityRating: "Net-Zero Ready · Geothermal Loops"
    },
    hotspots: [
      {
        id: "tri-level1",
        name: "Layer 1: Board-Formed Raw Concrete Gallery",
        category: "Base Layer",
        position: [-1.2, 0.9, 0],
        cameraTarget: [-6.5, 2.5, 6.0],
        lookAt: [-1.0, 1.0, 0],
        description: "Ground tier anchored by architectural concrete slabs housing private art gallery, wine vault, and 4-car sunken gallery garage.",
        dimensions: "2,400 SQ FT"
      },
      {
        id: "tri-level2",
        name: "Layer 2: Cantilevered Bronze Social Pavilion",
        category: "Middle Layer",
        position: [1.8, 3.2, 0.8],
        cameraTarget: [7.2, 5.0, 6.5],
        lookAt: [1.5, 3.2, 0.5],
        description: "Middle tier cantilevered 16 feet past the foundation, housing the chef's culinary atelier, formal salon, and viewing terrace.",
        dimensions: "2,200 SQ FT"
      },
      {
        id: "tri-level3",
        name: "Layer 3: Floating Timber Master Sky Studio",
        category: "Top Layer",
        position: [0.2, 5.6, -1.2],
        cameraTarget: [4.5, 7.8, 4.0],
        lookAt: [0.2, 5.4, -1.0],
        description: "Topmost tier clad in charred Shou Sugi Ban cedar with private stargazing hot tub terrace and panoramic glass bedroom.",
        dimensions: "1,600 SQ FT"
      },
      {
        id: "tri-stairs",
        name: "Sculptural Exterior Floating Staircase",
        category: "Circulation",
        position: [-3.2, 2.8, 2.2],
        cameraTarget: [-6.8, 4.2, 5.8],
        lookAt: [-3.0, 2.8, 1.8],
        description: "Dramatic cantilevered steel and stone stair spine connecting all three levels through open exterior garden voids.",
        dimensions: "Vertical Spine"
      }
    ],
    spaceAllocation: [
      { name: "Layer 1 Gallery & Car Vault", value: 38, color: "#64748b" },
      { name: "Layer 2 Cantilever Salon", value: 35, color: "#c5a880" },
      { name: "Layer 3 Master Sky Studio", value: 27, color: "#38bdf8" }
    ],
    costBreakdown: [
      { category: "Custom Architectural Formwork", cost: 1650 },
      { category: "Cantilever Steel Box Girders", cost: 1400 },
      { category: "High-Span Structural Glazing", cost: 980 },
      { category: "Shou Sugi Ban Cedar Cladding", cost: 420 },
      { category: "Geothermal & Radiant Systems", cost: 550 }
    ],
    constructionPhases: [
      { phase: "Phase 1: Substructure & Deep Piers", duration: "M 1-3", task: "Rock-socketed micropiles to counterbalance cantilever loads" },
      { phase: "Phase 2: Tier 1 Board-Formed Concrete", duration: "M 4-7", task: "Precision timber-grain architectural concrete pour" },
      { phase: "Phase 3: Tier 2 Steel Cantilever Trusses", duration: "M 8-11", task: "Placement of 16-foot moment-resisting steel box girders" },
      { phase: "Phase 4: Tier 3 Timber Crown & Glazing", duration: "M 12-15", task: "Glulam roof framework & Japanese charred timber exterior" },
      { phase: "Phase 5: Interior Finishes & Terraces", duration: "M 16-19", task: "Poured terrazzo floors, heated pool terrace & final certification" }
    ],
    keyFeatures: [
      "16-foot unsupported structural cantilever with zero ground pillars",
      "Distinct material palette per layer: Concrete -> Bronze -> Charred Timber",
      "Passive solar shading created by upper volumes shading lower rooms",
      "Private outdoor garden terrace at every distinct floor level"
    ]
  },
  {
    id: "villa",
    title: "Mediterranean Luxury Villa Estate",
    subtitle: "Resort-Style Sprawling Private Compound",
    badge: "Luxury Villa",
    icon: <Sparkles className="w-4 h-4" />,
    tagline: "Zero-edge 25m swimming lagoon, sunken firepit lounge & detached guest casita",
    overview:
      "An idyllic Mediterranean-modern compound designed for grand entertaining and supreme privacy. Wrapped around a central courtyard with zero-edge azure pool, outdoor teak dining pergola, sunken fire lounge, and palm garden.",
    defaultCameraPos: [18, 10, 18],
    defaultLookAt: [0, 1.5, 0],
    specs: {
      grossArea: "8,800 SQ FT",
      footprint: "1.2 Acre Private Grounds",
      levels: "1 - 2 Levels Courtyard Compound",
      ceilingClearance: "14 - 18 FT Timber Beamed",
      constructionTimeline: "18 - 22 Months",
      estInvestmentRange: "$6.2M - $8.0M",
      pricePerSqFt: "$750 / SQ FT",
      structuralFrame: "Insulated Concrete Form (ICF) & Exposed Douglas Fir Timber",
      sustainabilityRating: "Rainwater Harvesting · Solar Storage"
    },
    hotspots: [
      {
        id: "villa-pool",
        name: "25-Meter Zero-Edge Lagoon Pool",
        category: "Aquatic",
        position: [-3.2, 0.4, 1.8],
        cameraTarget: [-9.0, 3.8, 7.5],
        lookAt: [-3.0, 0.5, 1.5],
        description: "Natural volcanic Sukabumi green stone pool with heated spa, underwater sound transducers, and seamless perimeter overflow.",
        dimensions: "1,850 SQ FT"
      },
      {
        id: "villa-firepit",
        name: "Sunken Outdoor Fire Lounge",
        category: "Outdoor Living",
        position: [-6.8, 0.3, -1.8],
        cameraTarget: [-10.5, 3.2, 1.5],
        lookAt: [-6.5, 0.3, -1.5],
        description: "Circular sunken seating pit framed by honed travertine with natural gas linear flame burner and illuminated planters.",
        dimensions: "320 SQ FT"
      },
      {
        id: "villa-pergola",
        name: "Teak Dining Pergola & Outdoor Kitchen",
        category: "Culinary",
        position: [2.5, 1.4, 4.2],
        cameraTarget: [4.5, 3.8, 8.5],
        lookAt: [2.2, 1.2, 3.8],
        description: "Sheltered outdoor gourmet kitchen equipped with wood-fired pizza oven, Argentine grill, and 14-seat teak banquet table.",
        dimensions: "720 SQ FT"
      },
      {
        id: "villa-main",
        name: "Grand Salon & Beamed Vaulted Great Room",
        category: "Interior",
        position: [2.8, 1.8, -1.5],
        cameraTarget: [7.8, 4.2, 3.0],
        lookAt: [2.5, 1.6, -1.5],
        description: "18-foot soaring cathedral ceiling with exposed reclaimed fir beams, oversized hearth, and pocket glass sliders.",
        dimensions: "2,100 SQ FT"
      }
    ],
    spaceAllocation: [
      { name: "Main Villa Living & Suites", value: 45, color: "#c5a880" },
      { name: "Infinity Pool & Sun Terraces", value: 25, color: "#38bdf8" },
      { name: "Outdoor Kitchen & Lounges", value: 18, color: "#fb923c" },
      { name: "Guest Casita & Staff Suite", value: 12, color: "#a855f7" }
    ],
    costBreakdown: [
      { category: "Villa Building Envelope & Roof", cost: 2400 },
      { category: "Resort Infinity Pool & Water Features", cost: 1100 },
      { category: "Exposed Timber Framing & Stone", cost: 1350 },
      { category: "Gourmet Indoor/Outdoor Kitchens", cost: 850 },
      { category: "Estate Landscaping & Irrigation", cost: 950 }
    ],
    constructionPhases: [
      { phase: "Phase 1: Estate Grading & Infrastructure", duration: "M 1-3", task: "Plot perimeter wall, subterranean utility trenches & pool excavation" },
      { phase: "Phase 2: ICF Walls & Timber Trusses", duration: "M 4-8", task: "Insulated concrete forms & crane installation of heavy timber beams" },
      { phase: "Phase 3: Terracotta Roofing & Pool Shell", duration: "M 9-13", task: "Handmade Portuguese barrel tiles & shotcrete pool structure" },
      { phase: "Phase 4: Travertine Paving & Joinery", duration: "M 14-18", task: "Continuous indoor/outdoor honed travertine & custom walnut cabinetry" },
      { phase: "Phase 5: Palm Landscaping & Handover", duration: "M 19-22", task: "Mature olive & palm tree planting, smart pool automation setup" }
    ],
    keyFeatures: [
      "25-meter zero-edge heated lap pool with ozone saline purification",
      "Detached 2-bedroom guest casita with private kitchenette and patio",
      "Handmade reclaimed clay roof tiles with deep insulated overhangs",
      "Integrated smart irrigation harvesting 100% of estate rainwater"
    ]
  },
  {
    id: "royal",
    title: "Grand Royal Neoclassical Palace",
    subtitle: "Imperial Heritage Monumental Estate",
    badge: "Royal Palace",
    icon: <Crown className="w-4 h-4" />,
    tagline: "Monumental Corinthian colonnade with ceremonial dome & tiered water fountains",
    overview:
      "A masterpiece of imperial neoclassical architecture crafted for generational royalty. Featuring monumental fluted colonnades, a grand copper/gold central dome, symmetrical sovereign wings, and a cobblestone ceremonial motor court with tiered water cascades.",
    defaultCameraPos: [22, 14, 22],
    defaultLookAt: [0, 3.5, 0],
    specs: {
      grossArea: "24,000 SQ FT",
      footprint: "3.5 Acre Gated Grounds",
      levels: "3 Grand Imperial Levels",
      ceilingClearance: "16 - 24 FT Soaring Vaults",
      constructionTimeline: "32 - 40 Months",
      estInvestmentRange: "$18M - $26M",
      pricePerSqFt: "$950 / SQ FT",
      structuralFrame: "Reinforced Concrete Core Clad in Solid French Limestone",
      sustainabilityRating: "Generational 200-Year Life Cycle Rating"
    },
    hotspots: [
      {
        id: "royal-dome",
        name: "Imperial Gilded Central Dome & Oculus",
        category: "Crown",
        position: [0, 9.4, 0],
        cameraTarget: [8.5, 12.0, 9.5],
        lookAt: [0, 8.5, 0],
        description: "Soaring 24-meter copper and 24-karat gold-accented dome illuminating the 3-story marble rotunda below.",
        dimensions: "Central Rotunda"
      },
      {
        id: "royal-colonnade",
        name: "Monumental Corinthian Portico Colonnade",
        category: "Facade",
        position: [0, 4.0, 5.2],
        cameraTarget: [0, 5.5, 13.5],
        lookAt: [0, 3.8, 4.5],
        description: "Twelve monolithic 18-foot hand-carved French limestone columns supporting a classical sculptured pediment.",
        dimensions: "1,800 SQ FT Portico"
      },
      {
        id: "royal-ballroom",
        name: "Grand Sovereign Ballroom & Banquet Hall",
        category: "State Rooms",
        position: [5.2, 2.5, 0],
        cameraTarget: [10.5, 5.0, 5.5],
        lookAt: [5.0, 2.2, 0],
        description: "Gilded rococo ceiling mouldings, Baccarat crystal chandeliers, and parquet de Versailles French oak flooring.",
        dimensions: "3,800 SQ FT"
      },
      {
        id: "royal-fountain",
        name: "Ceremonial Tiered Fountain Motor Court",
        category: "Courtyard",
        position: [0, 0.8, 9.5],
        cameraTarget: [0, 4.0, 17.5],
        lookAt: [0, 1.0, 9.0],
        description: "Hand-sculpted white Carrara marble three-tier fountain with illuminated water jets in a circular granite court.",
        dimensions: "14,500 SQ FT Court"
      }
    ],
    spaceAllocation: [
      { name: "Grand State Rooms & Ballroom", value: 38, color: "#eab308" },
      { name: "Royal Family Private Suites", value: 30, color: "#8b5cf6" },
      { name: "Ceremonial Colonnade & Courtyard", value: 20, color: "#c5a880" },
      { name: "Staff Headquarters & Security Vault", value: 12, color: "#475569" }
    ],
    costBreakdown: [
      { category: "Solid French Limestone Facade", cost: 6800 },
      { category: "Gilded Dome & Classical Carvings", cost: 3900 },
      { category: "Imported Marble Rotunda & Ballroom", cost: 4200 },
      { category: "Tiered Fountain & Estate Grounds", cost: 2400 },
      { category: "Fortified Security & Vaults", cost: 1800 }
    ],
    constructionPhases: [
      { phase: "Phase 1: Deep Caissons & Fortified Core", duration: "M 1-6", task: "Bedrock anchor piling, reinforced concrete subterranean vault" },
      { phase: "Phase 2: Grand Structural Frame", duration: "M 7-14", task: "High-load concrete arches, steel dome ring girder & floor plates" },
      { phase: "Phase 3: Limestone Masonry & Portico", duration: "M 15-22", task: "Installation of monolithic Corinthian columns & pediment reliefs" },
      { phase: "Phase 4: Dome Gilding & State Interiors", duration: "M 23-30", task: "Gold leaf guilding, Baccarat lighting rigging, Versailles parquet" },
      { phase: "Phase 5: Fountain Hydraulics & Royal Gates", duration: "M 31-36", task: "Water fountain pump commissioning, bronze perimeter estate gates" }
    ],
    keyFeatures: [
      "Solid hand-carved French Chauvigny limestone exterior envelope",
      "Monolithic 3-tier Carrara marble fountain with choreographed water jets",
      "Ballistic-rated reinforced safe room vault with independent life support",
      "Gilded dome engineered to endure over two centuries with zero degradation"
    ]
  }
];

// =========================================================================
// 3D MODELS PROCEDURALLY GENERATED IN THREE.JS FOR EACH TYPOLOGY
// =========================================================================

// Shared materials generator
const useArchMaterials = (lightingMode: "day" | "sunset" | "night" | "wireframe") => {
  return useMemo(() => {
    const isWire = lightingMode === "wireframe";
    return {
      podium: new THREE.MeshStandardMaterial({
        color: 0x14161f,
        roughness: 0.9,
        wireframe: isWire
      }),
      concrete: new THREE.MeshStandardMaterial({
        color: 0x9ca3af,
        roughness: 0.65,
        wireframe: isWire
      }),
      darkStone: new THREE.MeshStandardMaterial({
        color: 0x1e222a,
        roughness: 0.3,
        metalness: 0.2,
        wireframe: isWire
      }),
      limestone: new THREE.MeshStandardMaterial({
        color: 0xede8df,
        roughness: 0.45,
        metalness: 0.05,
        wireframe: isWire
      }),
      travertine: new THREE.MeshStandardMaterial({
        color: 0xd6cbbd,
        roughness: 0.4,
        wireframe: isWire
      }),
      goldBrass: new THREE.MeshStandardMaterial({
        color: 0xc5a880,
        roughness: 0.25,
        metalness: 0.85,
        wireframe: isWire
      }),
      bronze: new THREE.MeshStandardMaterial({
        color: 0x8a6237,
        roughness: 0.35,
        metalness: 0.8,
        wireframe: isWire
      }),
      teakWood: new THREE.MeshStandardMaterial({
        color: 0x6e4321,
        roughness: 0.7,
        wireframe: isWire
      }),
      glass: new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: isWire ? 0.9 : 0.25,
        roughness: 0.05,
        metalness: 0.1,
        transmission: isWire ? 0 : 0.88,
        ior: 1.5,
        wireframe: isWire
      }),
      blueGlass: new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: isWire ? 0.9 : 0.32,
        roughness: 0.08,
        metalness: 0.3,
        transmission: isWire ? 0 : 0.85,
        ior: 1.52,
        wireframe: isWire
      }),
      poolWater: new THREE.MeshStandardMaterial({
        color: 0x0ea5e9,
        roughness: 0.1,
        metalness: 0.5,
        transparent: true,
        opacity: 0.8,
        wireframe: isWire
      }),
      fountainWater: new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        roughness: 0.15,
        metalness: 0.4,
        transparent: true,
        opacity: 0.85,
        wireframe: isWire
      }),
      lawn: new THREE.MeshStandardMaterial({
        color: 0x2e4917,
        roughness: 0.95,
        wireframe: isWire
      }),
      carMetal: new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.2,
        metalness: 0.9,
        wireframe: isWire
      })
    };
  }, [lightingMode]);
};

// 1. HOME MODEL
const ModelHome: React.FC<{ materials: ReturnType<typeof useArchMaterials> }> = ({ materials }) => {
  return (
    <group>
      {/* Ground Base */}
      <mesh position={[0, -0.25, 0]} receiveShadow material={materials.podium}>
        <boxGeometry args={[26, 0.5, 24]} />
      </mesh>
      {/* Front Manicured Lawn */}
      <mesh position={[-1.5, 0.05, 5.5]} receiveShadow material={materials.lawn}>
        <boxGeometry args={[14, 0.1, 8]} />
      </mesh>
      {/* Stepping Stones */}
      {[-3, -1.5, 0, 1.5].map((z, i) => (
        <mesh key={i} position={[-1.5, 0.12, 3 + z]} receiveShadow material={materials.darkStone}>
          <boxGeometry args={[1.6, 0.06, 0.8]} />
        </mesh>
      ))}

      {/* Main Ground Floor Volume */}
      <mesh position={[1.5, 1.5, 0.5]} castShadow receiveShadow material={materials.travertine}>
        <boxGeometry args={[11, 2.8, 10]} />
      </mesh>
      {/* Large Minimal Glazing */}
      <mesh position={[1.5, 1.5, 5.52]} material={materials.glass}>
        <boxGeometry args={[9.5, 2.6, 0.08]} />
      </mesh>

      {/* Upper Floating Cantilever Floor */}
      <mesh position={[2.8, 3.8, -0.5]} castShadow receiveShadow material={materials.limestone}>
        <boxGeometry args={[9, 2.2, 8]} />
      </mesh>
      {/* Upper Floor Teak Slats */}
      <mesh position={[2.8, 3.8, 3.52]} castShadow material={materials.teakWood}>
        <boxGeometry args={[8.8, 2.0, 0.1]} />
      </mesh>

      {/* Cantilever Carport Pavilion */}
      <mesh position={[-5.5, 2.5, 2.8]} castShadow material={materials.darkStone}>
        <boxGeometry args={[6.5, 0.25, 6.5]} />
      </mesh>
      {/* Slender Steel Columns */}
      <mesh position={[-8.5, 1.25, 5.8]} castShadow material={materials.goldBrass}>
        <cylinderGeometry args={[0.08, 0.08, 2.5, 16]} />
      </mesh>
      <mesh position={[-8.5, 1.25, -0.2]} castShadow material={materials.goldBrass}>
        <cylinderGeometry args={[0.08, 0.08, 2.5, 16]} />
      </mesh>

      {/* Luxury Coupe in Carport */}
      <group position={[-5.5, 0.4, 2.8]}>
        <mesh castShadow material={materials.carMetal}>
          <boxGeometry args={[2.2, 0.6, 4.4]} />
        </mesh>
        <mesh position={[0, 0.45, -0.2]} castShadow material={materials.darkStone}>
          <boxGeometry args={[1.8, 0.45, 2.4]} />
        </mesh>
      </group>

      {/* Bonsai Specimen Tree in courtyard */}
      <group position={[-1.5, 0, 7.5]}>
        <mesh position={[0, 0.8, 0]} castShadow material={materials.bronze}>
          <cylinderGeometry args={[0.1, 0.16, 1.6, 8]} />
        </mesh>
        <mesh position={[0, 1.8, 0]} castShadow material={materials.lawn}>
          <sphereGeometry args={[0.9, 12, 12]} />
        </mesh>
      </group>
    </group>
  );
};

// 2. COMMERCIAL BUILDING MODEL (High-Rise Skyscraper)
const ModelBuilding: React.FC<{ materials: ReturnType<typeof useArchMaterials> }> = ({ materials }) => {
  return (
    <group>
      {/* Urban Plaza Base */}
      <mesh position={[0, -0.4, 0]} receiveShadow material={materials.podium}>
        <boxGeometry args={[28, 0.8, 28]} />
      </mesh>
      {/* Grand Entrance Canopy */}
      <mesh position={[0, 1.6, 7]} castShadow material={materials.goldBrass}>
        <boxGeometry args={[12, 0.25, 6]} />
      </mesh>
      {/* Entrance Glass Rotunda */}
      <mesh position={[0, 1.2, 4]} material={materials.glass}>
        <cylinderGeometry args={[3.5, 3.5, 2.4, 32]} />
      </mesh>

      {/* Main Skyscraper Lower Section */}
      <mesh position={[0, 6, 0]} castShadow receiveShadow material={materials.blueGlass}>
        <boxGeometry args={[9, 12, 9]} />
      </mesh>
      {/* Vertical Metal Mullion Fins */}
      {[-4.2, -2.1, 0, 2.1, 4.2].map((x, i) => (
        <mesh key={i} position={[x, 6, 4.55]} castShadow material={materials.bronze}>
          <boxGeometry args={[0.12, 12, 0.25]} />
        </mesh>
      ))}

      {/* Mid-Tower Setback / Sky Terrace */}
      <mesh position={[0, 12.1, 0]} castShadow material={materials.concrete}>
        <boxGeometry args={[9.4, 0.4, 9.4]} />
      </mesh>

      {/* Upper Skyscraper Section */}
      <mesh position={[0, 15.5, 0]} castShadow receiveShadow material={materials.blueGlass}>
        <boxGeometry args={[7.2, 6.5, 7.2]} />
      </mesh>

      {/* Rooftop Crown Structure */}
      <mesh position={[0, 19.0, 0]} castShadow material={materials.darkStone}>
        <boxGeometry args={[7.6, 0.6, 7.6]} />
      </mesh>
      {/* Helipad Circular Platform */}
      <mesh position={[0, 19.4, 0]} castShadow material={materials.goldBrass}>
        <cylinderGeometry args={[3.2, 3.2, 0.15, 32]} />
      </mesh>
      {/* Spire */}
      <mesh position={[0, 22.0, 0]} castShadow material={materials.goldBrass}>
        <cylinderGeometry args={[0.08, 0.25, 5.0, 16]} />
      </mesh>
    </group>
  );
};

// 3. APARTMENT COMPLEX MODEL
const ModelApartment: React.FC<{ materials: ReturnType<typeof useArchMaterials> }> = ({ materials }) => {
  return (
    <group>
      {/* Podium Base */}
      <mesh position={[0, -0.3, 0]} receiveShadow material={materials.podium}>
        <boxGeometry args={[26, 0.6, 26]} />
      </mesh>
      {/* Ground Lobby */}
      <mesh position={[0, 1.0, 0]} castShadow receiveShadow material={materials.travertine}>
        <boxGeometry args={[13, 2.0, 13]} />
      </mesh>
      <mesh position={[0, 1.0, 6.52]} material={materials.glass}>
        <boxGeometry args={[9, 1.8, 0.08]} />
      </mesh>

      {/* 5 Stacked Residential Floors with Balconies */}
      {[2.8, 4.4, 6.0, 7.6].map((y, idx) => (
        <group key={idx} position={[0, y, 0]}>
          {/* Main unit core */}
          <mesh castShadow receiveShadow material={materials.limestone}>
            <boxGeometry args={[11, 1.4, 11]} />
          </mesh>
          {/* Wraparound Glass Balcony */}
          <mesh position={[0, -0.5, 0]} castShadow material={materials.concrete}>
            <boxGeometry args={[13.2, 0.18, 13.2]} />
          </mesh>
          <mesh position={[0, -0.1, 6.6]} material={materials.glass}>
            <boxGeometry args={[13, 0.6, 0.05]} />
          </mesh>
          <mesh position={[6.6, -0.1, 0]} material={materials.glass}>
            <boxGeometry args={[0.05, 0.6, 13]} />
          </mesh>
          {/* Planters on balcony */}
          <mesh position={[-4.5, -0.2, 6.2]} castShadow material={materials.lawn}>
            <boxGeometry args={[2.5, 0.35, 0.4]} />
          </mesh>
        </group>
      ))}

      {/* Rooftop Penthouse & Pool Deck */}
      <mesh position={[0, 9.2, 0]} castShadow material={materials.darkStone}>
        <boxGeometry args={[13.4, 0.3, 13.4]} />
      </mesh>
      {/* Rooftop Lap Pool Basin & Water */}
      <mesh position={[-2.5, 9.5, 2.5]} castShadow material={materials.concrete}>
        <boxGeometry args={[6.5, 0.5, 3.2]} />
      </mesh>
      <mesh position={[-2.5, 9.76, 2.5]} material={materials.poolWater}>
        <boxGeometry args={[6.2, 0.05, 2.9]} />
      </mesh>
      {/* Penthouse Glass Pavilion */}
      <mesh position={[2.5, 10.3, -1.5]} castShadow material={materials.limestone}>
        <boxGeometry args={[6.0, 1.8, 6.0]} />
      </mesh>
      <mesh position={[2.5, 10.3, 1.52]} material={materials.glass}>
        <boxGeometry args={[5.6, 1.6, 0.08]} />
      </mesh>
    </group>
  );
};

// 4. 3-LAYER BUILDING MODEL (Triplex Cantilevered Volumes)
const ModelTriplex: React.FC<{ materials: ReturnType<typeof useArchMaterials> }> = ({ materials }) => {
  return (
    <group>
      {/* Foundation Ground */}
      <mesh position={[0, -0.3, 0]} receiveShadow material={materials.podium}>
        <boxGeometry args={[26, 0.6, 24]} />
      </mesh>

      {/* LAYER 1: Raw Concrete Base & Art Gallery */}
      <mesh position={[-1.2, 1.2, 0]} castShadow receiveShadow material={materials.concrete}>
        <boxGeometry args={[9.5, 2.4, 8.5]} />
      </mesh>
      <mesh position={[-1.2, 1.2, 4.3]} material={materials.glass}>
        <boxGeometry args={[7.5, 2.0, 0.08]} />
      </mesh>

      {/* LAYER 2: Cantilevered Bronze & Glass Social Volume (Rotated & Offset) */}
      <group position={[1.8, 3.3, 0.5]} rotation={[0, 0.08, 0]}>
        <mesh castShadow receiveShadow material={materials.bronze}>
          <boxGeometry args={[10.5, 2.0, 7.5]} />
        </mesh>
        <mesh position={[0, 0, 3.8]} material={materials.glass}>
          <boxGeometry args={[9.8, 1.8, 0.08]} />
        </mesh>
        {/* Cantilever support beam underneath */}
        <mesh position={[4.2, -1.1, 0]} castShadow material={materials.darkStone}>
          <boxGeometry args={[1.2, 0.35, 7.2]} />
        </mesh>
      </group>

      {/* LAYER 3: Charred Timber Master Sky Studio (Further Offset) */}
      <group position={[0.2, 5.2, -1.2]} rotation={[0, -0.06, 0]}>
        <mesh castShadow receiveShadow material={materials.teakWood}>
          <boxGeometry args={[7.5, 1.8, 6.2]} />
        </mesh>
        <mesh position={[0, 0, 3.15]} material={materials.glass}>
          <boxGeometry args={[6.8, 1.5, 0.08]} />
        </mesh>
        {/* Rooftop Stargazing Terrace Deck */}
        <mesh position={[-2.2, 0.95, 0]} castShadow material={materials.darkStone}>
          <boxGeometry args={[2.5, 0.1, 5.5]} />
        </mesh>
      </group>

      {/* Exterior Sculptural Floating Staircase Spine */}
      {[-2.8, -2.4, -2.0, -1.6, -1.2, -0.8].map((x, i) => (
        <mesh key={i} position={[x, 0.4 + i * 0.45, 4.8 - i * 0.3]} castShadow material={materials.goldBrass}>
          <boxGeometry args={[0.9, 0.12, 0.4]} />
        </mesh>
      ))}
    </group>
  );
};

// 5. VILLA ESTATE MODEL
const ModelVilla: React.FC<{ materials: ReturnType<typeof useArchMaterials> }> = ({ materials }) => {
  const waterRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (waterRef.current) {
      waterRef.current.position.y = 0.28 + Math.sin(clock.getElapsedTime() * 2) * 0.01;
    }
  });

  return (
    <group>
      {/* Sprawling Estate Grounds */}
      <mesh position={[0, -0.3, 0]} receiveShadow material={materials.podium}>
        <boxGeometry args={[30, 0.6, 28]} />
      </mesh>
      {/* Manicured Lawn */}
      <mesh position={[-6, 0.05, 5]} receiveShadow material={materials.lawn}>
        <boxGeometry args={[12, 0.1, 12]} />
      </mesh>

      {/* Main Villa Central Pavilion */}
      <mesh position={[3.2, 1.5, -1.5]} castShadow receiveShadow material={materials.limestone}>
        <boxGeometry args={[11.5, 3.0, 8.5]} />
      </mesh>
      {/* Terracotta pitched roof */}
      <mesh position={[3.2, 3.5, -1.5]} rotation={[0, Math.PI / 4, 0]} castShadow material={materials.teakWood}>
        <coneGeometry args={[7.5, 1.5, 4]} />
      </mesh>
      <mesh position={[3.2, 1.5, 2.8]} material={materials.glass}>
        <boxGeometry args={[9.5, 2.6, 0.08]} />
      </mesh>

      {/* Guest Wing Casita */}
      <mesh position={[7.5, 1.2, 5.0]} castShadow receiveShadow material={materials.travertine}>
        <boxGeometry args={[5.5, 2.4, 4.5]} />
      </mesh>

      {/* 25-Meter Lagoon Pool (L-Shaped) */}
      <mesh position={[-3.8, 0.1, 1.5]} receiveShadow material={materials.concrete}>
        <boxGeometry args={[8.5, 0.4, 12.5]} />
      </mesh>
      <mesh ref={waterRef} position={[-3.8, 0.28, 1.5]} material={materials.poolWater}>
        <boxGeometry args={[8.0, 0.05, 12.0]} />
      </mesh>

      {/* Teak Dining Pergola */}
      <group position={[2.5, 1.5, 5.2]}>
        <mesh position={[0, 1.2, 0]} castShadow material={materials.teakWood}>
          <boxGeometry args={[4.5, 0.2, 3.2]} />
        </mesh>
        {[-2.0, 2.0].map((px, i) =>
          [-1.4, 1.4].map((pz, j) => (
            <mesh key={`${i}-${j}`} position={[px, 0, pz]} castShadow material={materials.bronze}>
              <cylinderGeometry args={[0.08, 0.08, 2.4, 8]} />
            </mesh>
          ))
        )}
      </group>

      {/* Sunken Firepit Lounge */}
      <group position={[-6.8, 0.2, -3.2]}>
        <mesh castShadow material={materials.travertine}>
          <cylinderGeometry args={[2.2, 2.2, 0.4, 24]} />
        </mesh>
        <mesh position={[0, 0.25, 0]} material={materials.bronze}>
          <cylinderGeometry args={[0.6, 0.6, 0.15, 16]} />
        </mesh>
        <pointLight position={[0, 0.6, 0]} color={0xf97316} intensity={1.6} distance={6} />
      </group>
    </group>
  );
};

// 6. ROYAL NEOCLASSICAL PALACE MODEL
const ModelRoyal: React.FC<{ materials: ReturnType<typeof useArchMaterials> }> = ({ materials }) => {
  return (
    <group>
      {/* Monumental Estate Ground */}
      <mesh position={[0, -0.4, 0]} receiveShadow material={materials.podium}>
        <boxGeometry args={[32, 0.8, 30]} />
      </mesh>

      {/* Central Grand Palace Core */}
      <mesh position={[0, 2.8, -1.0]} castShadow receiveShadow material={materials.limestone}>
        <boxGeometry args={[14, 5.6, 9]} />
      </mesh>

      {/* Imperial Gilded Central Dome */}
      <mesh position={[0, 6.2, -1.0]} castShadow material={materials.goldBrass}>
        <cylinderGeometry args={[3.4, 3.8, 1.2, 32]} />
      </mesh>
      <mesh position={[0, 7.8, -1.0]} castShadow material={materials.goldBrass}>
        <sphereGeometry args={[3.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      {/* Finial spire on dome */}
      <mesh position={[0, 11.2, -1.0]} castShadow material={materials.goldBrass}>
        <cylinderGeometry args={[0.08, 0.18, 1.6, 12]} />
      </mesh>

      {/* Monumental Corinthian Colonnade Portico */}
      <mesh position={[0, 5.2, 4.2]} castShadow material={materials.limestone}>
        <boxGeometry args={[10, 0.6, 3.5]} />
      </mesh>
      {/* Classical Triangular Pediment */}
      <mesh position={[0, 6.0, 4.2]} rotation={[0, Math.PI / 4, 0]} castShadow material={materials.limestone}>
        <coneGeometry args={[5.2, 1.2, 4]} />
      </mesh>
      {/* 6 Corinthian Limestone Columns */}
      {[-4.0, -2.4, -0.8, 0.8, 2.4, 4.0].map((cx, i) => (
        <mesh key={i} position={[cx, 2.5, 5.6]} castShadow material={materials.limestone}>
          <cylinderGeometry args={[0.22, 0.26, 4.8, 16]} />
        </mesh>
      ))}

      {/* Symmetrical Left Wing */}
      <mesh position={[-9.5, 2.2, 0]} castShadow receiveShadow material={materials.travertine}>
        <boxGeometry args={[7, 4.4, 7]} />
      </mesh>
      {/* Symmetrical Right Wing */}
      <mesh position={[9.5, 2.2, 0]} castShadow receiveShadow material={materials.travertine}>
        <boxGeometry args={[7, 4.4, 7]} />
      </mesh>

      {/* Ceremonial Motor Court & Tiered Fountain */}
      <mesh position={[0, 0.1, 9.5]} receiveShadow material={materials.darkStone}>
        <cylinderGeometry args={[6.5, 6.5, 0.2, 32]} />
      </mesh>
      {/* Tier 1 Fountain Basin */}
      <mesh position={[0, 0.4, 9.5]} castShadow material={materials.limestone}>
        <cylinderGeometry args={[3.2, 3.4, 0.4, 24]} />
      </mesh>
      <mesh position={[0, 0.62, 9.5]} material={materials.fountainWater}>
        <cylinderGeometry args={[3.0, 3.0, 0.06, 24]} />
      </mesh>
      {/* Tier 2 Fountain */}
      <mesh position={[0, 1.1, 9.5]} castShadow material={materials.limestone}>
        <cylinderGeometry args={[1.6, 1.8, 0.5, 20]} />
      </mesh>
      {/* Tier 3 Spout with water glow */}
      <mesh position={[0, 1.8, 9.5]} castShadow material={materials.goldBrass}>
        <cylinderGeometry args={[0.4, 0.5, 0.8, 16]} />
      </mesh>
      <pointLight position={[0, 2.2, 9.5]} color={0x38bdf8} intensity={2.0} distance={8} />
    </group>
  );
};

// =========================================================================
// 3D SCENE CONTROLLER & HOTSPOTS (R3F)
// =========================================================================

interface SceneProps {
  typology: BuildingTypology;
  lightingMode: "day" | "sunset" | "night" | "wireframe";
  activeHotspot: BuildingHotspot | null;
  onSelectHotspot: (h: BuildingHotspot) => void;
  controlsRef: React.RefObject<any>;
}

const ArchScene: React.FC<SceneProps> = ({
  typology,
  lightingMode,
  activeHotspot,
  onSelectHotspot,
  controlsRef
}) => {
  const materials = useArchMaterials(lightingMode);
  const { camera } = useThree();

  // Handle GSAP camera transition when activeHotspot or typology changes
  useEffect(() => {
    const targetPos = activeHotspot ? activeHotspot.cameraTarget : typology.defaultCameraPos;
    const targetLook = activeHotspot ? activeHotspot.lookAt : typology.defaultLookAt;

    const currentTarget = controlsRef.current
      ? controlsRef.current.target
      : new THREE.Vector3(0, 2, 0);

    const tweenObj = {
      cx: camera.position.x,
      cy: camera.position.y,
      cz: camera.position.z,
      lx: currentTarget.x,
      ly: currentTarget.y,
      lz: currentTarget.z
    };

    const tween = gsap.to(tweenObj, {
      cx: targetPos[0],
      cy: targetPos[1],
      cz: targetPos[2],
      lx: targetLook[0],
      ly: targetLook[1],
      lz: targetLook[2],
      duration: 1.6,
      ease: "power2.inOut",
      onUpdate: () => {
        camera.position.set(tweenObj.cx, tweenObj.cy, tweenObj.cz);
        if (controlsRef.current) {
          controlsRef.current.target.set(tweenObj.lx, tweenObj.ly, tweenObj.lz);
          controlsRef.current.update();
        } else {
          camera.lookAt(tweenObj.lx, tweenObj.ly, tweenObj.lz);
        }
      }
    });

    return () => {
      tween.kill();
    };
  }, [typology, activeHotspot, camera, controlsRef]);

  // Render appropriate 3D model
  const renderModel = () => {
    switch (typology.id) {
      case "home":
        return <ModelHome materials={materials} />;
      case "building":
        return <ModelBuilding materials={materials} />;
      case "apartment":
        return <ModelApartment materials={materials} />;
      case "triplex":
        return <ModelTriplex materials={materials} />;
      case "villa":
        return <ModelVilla materials={materials} />;
      case "royal":
        return <ModelRoyal materials={materials} />;
      default:
        return <ModelHome materials={materials} />;
    }
  };

  return (
    <group>
      {/* Render the 3D Building */}
      {renderModel()}

      {/* Render Hotspot Pins */}
      {typology.hotspots.map((spot) => {
        const isActive = activeHotspot?.id === spot.id;
        return (
          <group key={spot.id} position={spot.position}>
            {/* Glowing 3D Orb */}
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                onSelectHotspot(spot);
              }}
            >
              <sphereGeometry args={[0.25, 16, 16]} />
              <meshStandardMaterial
                color={isActive ? "#c5a880" : "#ffffff"}
                emissive={isActive ? "#c5a880" : "#d97706"}
                emissiveIntensity={isActive ? 1.2 : 0.6}
              />
            </mesh>

            {/* Floating Pulsing Ring */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.35, 0.48, 24]} />
              <meshBasicMaterial
                color={isActive ? "#c5a880" : "#ffffff"}
                transparent
                opacity={isActive ? 0.9 : 0.5}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Screen-Projected HTML Label Badge */}
            <Html position={[0, 0.55, 0]} center distanceFactor={16}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectHotspot(spot);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-xl border shadow-2xl transition-all duration-300 transform -translate-y-2 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-[#c5a880] text-[#0c0d11] border-[#c5a880] font-semibold scale-110 shadow-[#c5a880]/50"
                    : "bg-[#0c0d12]/90 text-neutral-200 border-neutral-700/80 hover:border-[#c5a880] hover:text-white"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[11px] font-mono uppercase tracking-wider">{spot.name}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono ${
                    isActive ? "bg-black/20 text-[#0c0d11]" : "bg-neutral-800 text-neutral-400"
                  }`}
                >
                  {spot.dimensions}
                </span>
              </button>
            </Html>
          </group>
        );
      })}
    </group>
  );
};

// =========================================================================
// MAIN EXPORT COMPONENT: ArchitecturalBuilderStudio
// =========================================================================

interface ArchitecturalBuilderStudioProps {
  onBookConsultation?: (buildingTitle: string, zone?: string) => void;
  onWhatsApp?: (buildingTitle: string, zone?: string) => void;
}

export const ArchitecturalBuilderStudio: React.FC<ArchitecturalBuilderStudioProps> = ({
  onBookConsultation,
  onWhatsApp
}) => {
  const [selectedTypologyId, setSelectedTypologyId] = useState<BuildingTypologyId>("home");
  const [activeHotspot, setActiveHotspot] = useState<BuildingHotspot | null>(null);
  const [lightingMode, setLightingMode] = useState<"day" | "sunset" | "night" | "wireframe">("sunset");
  const [activeTab, setActiveTab] = useState<"specs" | "charts" | "timeline">("specs");
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const controlsRef = useRef<any>(null);

  const currentTypology = useMemo(() => {
    return (
      BUILDING_TYPOLOGIES.find((t) => t.id === selectedTypologyId) ||
      BUILDING_TYPOLOGIES[0]
    );
  }, [selectedTypologyId]);

  // When typology changes, reset active hotspot
  const handleSelectTypology = (id: BuildingTypologyId) => {
    setSelectedTypologyId(id);
    setActiveHotspot(null);
  };

  // Camera presets trigger
  const handleCameraPreset = (preset: "drone" | "front" | "top" | "side") => {
    if (!controlsRef.current) return;
    const targets = {
      drone: [16, 12, 16],
      front: [0, 4, 18],
      top: [0, 25, 1],
      side: [18, 5, 0]
    };
    const target = targets[preset] || targets.drone;
    gsap.to(controlsRef.current.object.position, {
      x: target[0],
      y: target[1],
      z: target[2],
      duration: 1.4,
      ease: "power2.inOut"
    });
    controlsRef.current.target.set(0, 2, 0);
  };

  // Lighting parameters
  const lightingConfigs = useMemo(() => {
    switch (lightingMode) {
      case "day":
        return {
          bg: "#0c131f",
          ambient: "#ffffff",
          ambientIntensity: 1.1,
          sun: "#fef3c7",
          sunIntensity: 2.2,
          sunPos: [20, 30, 20] as [number, number, number]
        };
      case "night":
        return {
          bg: "#050608",
          ambient: "#1e293b",
          ambientIntensity: 0.55,
          sun: "#38bdf8",
          sunIntensity: 0.9,
          sunPos: [15, 20, -10] as [number, number, number]
        };
      case "wireframe":
        return {
          bg: "#060a12",
          ambient: "#60a5fa",
          ambientIntensity: 1.4,
          sun: "#93c5fd",
          sunIntensity: 1.2,
          sunPos: [10, 25, 10] as [number, number, number]
        };
      case "sunset":
      default:
        return {
          bg: "#090a10",
          ambient: "#fed7aa",
          ambientIntensity: 0.85,
          sun: "#fb923c",
          sunIntensity: 2.1,
          sunPos: [24, 16, 16] as [number, number, number]
        };
    }
  }, [lightingMode]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <section id="architectural-builder" className="py-24 bg-[#07080b] text-neutral-100 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-neutral-800/80 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#c5a880] animate-ping" />
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#c5a880]">
                Design & Build · Architectural Concepts
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-5xl text-white font-normal tracking-tight">
              What Do You Want to Build?
            </h2>
            <p className="text-neutral-400 text-sm md:text-base mt-2 max-w-2xl font-light">
              Explore bespoke architectural archetypes with live interactive 3D models, space allocation charts, estimated investment matrixes, and room hotspots.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-4 bg-[#12141c] px-4 py-2.5 rounded-2xl border border-neutral-800 self-start md:self-auto text-xs font-mono">
            <div>
              <span className="text-neutral-500 block text-[10px] uppercase">GFA Capacity</span>
              <span className="text-white font-semibold">{currentTypology.specs.grossArea}</span>
            </div>
            <div className="w-px h-6 bg-neutral-800" />
            <div>
              <span className="text-neutral-500 block text-[10px] uppercase">Build Timeline</span>
              <span className="text-[#c5a880] font-semibold">{currentTypology.specs.constructionTimeline}</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ARCHITECTURAL TYPOLOGY SELECTION BUTTON BAR */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-8">
          {BUILDING_TYPOLOGIES.map((typology) => {
            const isSelected = typology.id === selectedTypologyId;
            return (
              <motion.button
                key={typology.id}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectTypology(typology.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-300 relative group flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? "bg-[#161822] border-[#c5a880] shadow-xl shadow-[#c5a880]/10 ring-1 ring-[#c5a880]"
                    : "bg-[#0c0d12]/90 border-neutral-800/80 hover:border-neutral-700 hover:bg-[#12141b]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      isSelected ? "bg-[#c5a880] text-[#0c0d11]" : "bg-neutral-800 text-neutral-400 group-hover:text-white"
                    }`}
                  >
                    {typology.icon}
                  </div>
                  <span
                    className={`text-[9px] uppercase tracking-wider font-mono px-1.5 py-0.5 rounded ${
                      isSelected ? "bg-[#c5a880]/20 text-[#c5a880]" : "text-neutral-500"
                    }`}
                  >
                    {typology.badge}
                  </span>
                </div>

                <div>
                  <h3 className={`text-xs font-semibold tracking-wide ${isSelected ? "text-white" : "text-neutral-300"}`}>
                    {typology.title.split(" ")[0]} {typology.title.split(" ")[1] || ""}
                  </h3>
                  <span className="text-[10px] text-neutral-500 font-mono block truncate">
                    {typology.specs.grossArea}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* MAIN INTERACTIVE 3D VIEWER + ARCHITECTURAL CHARTS GRID */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left / Center 8 Columns: 3D WebGL Canvas */}
          <div className="lg:col-span-8 relative h-[560px] md:h-[680px] bg-[#090a0e] rounded-3xl overflow-hidden border border-neutral-800/90 shadow-2xl">
            {/* 3D Canvas */}
            <Canvas
              shadows
              camera={{ position: [18, 12, 18], fov: 42, near: 0.1, far: 1000 }}
              className="w-full h-full cursor-grab active:cursor-grabbing"
            >
              <color attach="background" args={[lightingConfigs.bg]} />
              <fog attach="fog" args={[lightingConfigs.bg, 15, 75]} />

              <ambientLight color={lightingConfigs.ambient} intensity={lightingConfigs.ambientIntensity} />
              <directionalLight
                position={lightingConfigs.sunPos}
                color={lightingConfigs.sun}
                intensity={lightingConfigs.sunIntensity}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
              />

              {/* Architectural Scene and Active Hotspots */}
              <ArchScene
                typology={currentTypology}
                lightingMode={lightingMode}
                activeHotspot={activeHotspot}
                onSelectHotspot={(h) => setActiveHotspot(h)}
                controlsRef={controlsRef}
              />

              <OrbitControls
                ref={controlsRef}
                enableDamping
                dampingFactor={0.06}
                maxPolarAngle={Math.PI / 2 - 0.02}
                minDistance={4}
                maxDistance={50}
              />
            </Canvas>

            {/* Top Bar HUD Controls */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
              {/* Active Model Indicator */}
              <div className="pointer-events-auto bg-[#0c0d12]/90 backdrop-blur-xl px-3.5 py-2 rounded-2xl border border-neutral-800 shadow-xl flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#c5a880]" />
                <div>
                  <h4 className="text-xs font-semibold text-white font-serif leading-tight">
                    {currentTypology.title}
                  </h4>
                  <span className="text-[10px] text-[#c5a880] font-mono">
                    {activeHotspot ? `Focused: ${activeHotspot.name}` : currentTypology.subtitle}
                  </span>
                </div>
              </div>

              {/* Lighting & Camera HUD */}
              <div className="pointer-events-auto flex items-center gap-1.5 bg-[#0c0d12]/90 backdrop-blur-xl p-1.5 rounded-2xl border border-neutral-800 shadow-xl">
                {/* Lighting Presets */}
                <div className="flex items-center bg-[#151722] p-0.5 rounded-xl border border-neutral-800 text-xs">
                  <button
                    onClick={() => setLightingMode("day")}
                    className={`p-1.5 rounded-lg transition-colors ${
                      lightingMode === "day" ? "bg-[#c5a880] text-[#0c0d11]" : "text-neutral-400 hover:text-white"
                    }`}
                    title="Daylight Architecture"
                  >
                    <Sun className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setLightingMode("sunset")}
                    className={`p-1.5 rounded-lg transition-colors ${
                      lightingMode === "sunset" ? "bg-[#c5a880] text-[#0c0d11]" : "text-neutral-400 hover:text-white"
                    }`}
                    title="Golden Sunset"
                  >
                    <Sunset className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setLightingMode("night")}
                    className={`p-1.5 rounded-lg transition-colors ${
                      lightingMode === "night" ? "bg-[#c5a880] text-[#0c0d11]" : "text-neutral-400 hover:text-white"
                    }`}
                    title="Night Illumination"
                  >
                    <Moon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setLightingMode("wireframe")}
                    className={`p-1.5 rounded-lg transition-colors ${
                      lightingMode === "wireframe" ? "bg-[#38bdf8] text-[#0c0d11]" : "text-neutral-400 hover:text-white"
                    }`}
                    title="Structural Blueprint Wireframe"
                  >
                    <Layers className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Reset Camera Orbit */}
                <button
                  onClick={() => {
                    setActiveHotspot(null);
                    handleCameraPreset("drone");
                  }}
                  className="p-2 text-neutral-400 hover:text-white rounded-xl transition-colors"
                  title="Reset Aerial Orbit"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Bottom Camera Angle Presets Toolbar */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row items-center justify-between gap-2 pointer-events-none z-10">
              {/* Camera Presets */}
              <div className="pointer-events-auto flex items-center gap-1 bg-[#0c0d12]/90 backdrop-blur-xl p-1 rounded-2xl border border-neutral-800 text-[11px] font-mono">
                <button
                  onClick={() => handleCameraPreset("drone")}
                  className="px-2.5 py-1 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-800/60 transition-colors"
                >
                  Aerial 3D
                </button>
                <button
                  onClick={() => handleCameraPreset("front")}
                  className="px-2.5 py-1 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-800/60 transition-colors"
                >
                  Facade
                </button>
                <button
                  onClick={() => handleCameraPreset("side")}
                  className="px-2.5 py-1 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-800/60 transition-colors"
                >
                  Elevation
                </button>
                <button
                  onClick={() => handleCameraPreset("top")}
                  className="px-2.5 py-1 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-800/60 transition-colors"
                >
                  Floor Plan
                </button>
              </div>

              {/* Hotspot Pills */}
              <div className="pointer-events-auto flex items-center gap-1.5 overflow-x-auto max-w-full scrollbar-none bg-[#0c0d12]/90 backdrop-blur-xl p-1 rounded-2xl border border-neutral-800">
                {currentTypology.hotspots.map((spot) => {
                  const isActive = activeHotspot?.id === spot.id;
                  return (
                    <button
                      key={spot.id}
                      onClick={() => setActiveHotspot(spot)}
                      className={`px-3 py-1 rounded-xl text-xs whitespace-nowrap transition-all ${
                        isActive
                          ? "bg-[#c5a880] text-[#0c0d11] font-semibold shadow-lg shadow-[#c5a880]/20"
                          : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                      }`}
                    >
                      {spot.name.split(" ")[0]} {spot.name.split(" ")[1] || ""}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right 4 Columns: Interactive Specifications, Charts & Timeline */}
          <div className="lg:col-span-4 bg-[#0c0d12]/95 border border-neutral-800/90 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
            <div>
              {/* Category Navigation Tabs */}
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-5">
                <div className="flex items-center gap-2 text-xs">
                  {(["specs", "charts", "timeline"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-2 font-medium capitalize transition-all relative ${
                        activeTab === tab ? "text-[#c5a880]" : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      {tab === "specs"
                        ? "Specifications"
                        : tab === "charts"
                        ? "Space & Cost Charts"
                        : "Timeline"}
                      {activeTab === tab && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c5a880]" />
                      )}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleShare}
                  className="p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors"
                  title="Share Blueprint"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>

              {/* ========================================================= */}
              {/* ANIMATED TAB CONTENTS WITH ANIMATEPRESENCE */}
              {/* ========================================================= */}
              <AnimatePresence mode="wait">
                {/* TAB 1: SPECIFICATIONS & ACTIVE HOTSPOT DETAILS */}
                {activeTab === "specs" && (
                  <motion.div
                    key="specs"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="space-y-4"
                  >
                    {/* If hotspot is active, show focused details */}
                    {activeHotspot ? (
                      <div className="p-4 rounded-2xl bg-[#141622] border border-[#c5a880]/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-mono tracking-wider text-[#c5a880] font-semibold">
                            ✦ Active 3D Zone: {activeHotspot.category}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded">
                            {activeHotspot.dimensions}
                          </span>
                        </div>
                        <h4 className="text-white font-serif text-base font-normal">
                          {activeHotspot.name}
                        </h4>
                        <p className="text-xs text-neutral-300 font-light leading-relaxed">
                          {activeHotspot.description}
                        </p>
                        <button
                          onClick={() => setActiveHotspot(null)}
                          className="text-[11px] text-[#c5a880] hover:underline font-mono pt-1 inline-block cursor-pointer"
                        >
                          ← Back to overall building specs
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs text-neutral-300 leading-relaxed font-light mb-4">
                          {currentTypology.overview}
                        </p>

                        {/* Specs Matrix 4-Box Grid */}
                        <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-4">
                          <div className="p-3 rounded-xl bg-[#12141c] border border-neutral-800">
                            <span className="text-neutral-500 text-[10px] uppercase block mb-0.5">
                              Gross Built Area
                            </span>
                            <span className="text-white font-semibold text-sm">
                              {currentTypology.specs.grossArea}
                            </span>
                          </div>
                          <div className="p-3 rounded-xl bg-[#12141c] border border-neutral-800">
                            <span className="text-neutral-500 text-[10px] uppercase block mb-0.5">
                              Est. Investment
                            </span>
                            <span className="text-[#c5a880] font-semibold text-sm">
                              {currentTypology.specs.estInvestmentRange}
                            </span>
                          </div>
                          <div className="p-3 rounded-xl bg-[#12141c] border border-neutral-800">
                            <span className="text-neutral-500 text-[10px] uppercase block mb-0.5">
                              Clearance Height
                            </span>
                            <span className="text-white font-semibold text-xs">
                              {currentTypology.specs.ceilingClearance}
                            </span>
                          </div>
                          <div className="p-3 rounded-xl bg-[#12141c] border border-neutral-800">
                            <span className="text-neutral-500 text-[10px] uppercase block mb-0.5">
                              Price Estimate
                            </span>
                            <span className="text-white font-semibold text-xs">
                              {currentTypology.specs.pricePerSqFt}
                            </span>
                          </div>
                        </div>

                        {/* Key Architectural Inclusions */}
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-2 font-semibold">
                            Key Architectural Features
                          </span>
                          <ul className="space-y-1.5 text-xs text-neutral-300">
                            {currentTypology.keyFeatures.map((feat, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#c5a880] mt-0.5 flex-shrink-0" />
                                <span className="font-light">{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* TAB 2: INTERACTIVE RECHARTS (SPACE ALLOCATION & COST) */}
                {activeTab === "charts" && (
                  <motion.div
                    key="charts"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="space-y-5"
                  >
                    {/* Space Allocation Donut Chart */}
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-2 font-semibold">
                        Spatial Area Allocation Breakdown (%)
                      </span>
                      <div className="h-44 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={currentTypology.spaceAllocation}
                              cx="50%"
                              cy="50%"
                              innerRadius={42}
                              outerRadius={68}
                              paddingAngle={3}
                              dataKey="value"
                            >
                              {currentTypology.spaceAllocation.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#0c0d12",
                                borderColor: "#333",
                                borderRadius: "12px",
                                fontSize: "12px",
                                color: "#fff"
                              }}
                              formatter={(value: any) => [`${value}%`, "Area Share"]}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Chart Legend */}
                      <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono text-neutral-300 mt-2">
                        {currentTypology.spaceAllocation.map((item, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <span
                              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="truncate">{item.name}</span>
                            <span className="text-neutral-500 ml-auto">{item.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Cost Allocation Bar Chart */}
                    <div className="pt-2 border-t border-neutral-800">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-2 font-semibold">
                        Estimated Cost Breakdown ($k)
                      </span>
                      <div className="h-36 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={currentTypology.costBreakdown}
                            margin={{ top: 5, right: 5, left: -20, bottom: 20 }}
                          >
                            <XAxis
                              dataKey="category"
                              tick={{ fill: "#737373", fontSize: 9 }}
                              interval={0}
                              angle={-20}
                              textAnchor="end"
                            />
                            <YAxis tick={{ fill: "#737373", fontSize: 9 }} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#0c0d12",
                                borderColor: "#333",
                                borderRadius: "12px",
                                fontSize: "12px",
                                color: "#fff"
                              }}
                              formatter={(value: any) => [`$${value}k`, "Est. Budget"]}
                            />
                            <Bar dataKey="cost" fill="#c5a880" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TAB 3: CONSTRUCTION PHASES TIMELINE */}
                {activeTab === "timeline" && (
                  <motion.div
                    key="timeline"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="space-y-3 text-xs"
                  >
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-2 font-semibold">
                      Construction Milestones ({currentTypology.specs.constructionTimeline})
                    </span>
                    <div className="relative border-l border-neutral-800 ml-2.5 pl-4 space-y-4">
                      {currentTypology.constructionPhases.map((phase, idx) => (
                        <div key={idx} className="relative group">
                          {/* Dot */}
                          <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#181a24] border border-[#c5a880] group-hover:bg-[#c5a880] transition-colors" />
                          <div className="flex items-center justify-between">
                            <span className="text-white font-medium">{phase.phase}</span>
                            <span className="text-[10px] font-mono text-[#c5a880] bg-[#1a1c28] px-2 py-0.5 rounded">
                              {phase.duration}
                            </span>
                          </div>
                          <p className="text-neutral-400 text-[11px] font-light mt-0.5 leading-relaxed">
                            {phase.task}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Actions CTAs */}
            <div className="pt-5 mt-6 border-t border-neutral-800 space-y-2.5">
              <button
                onClick={() =>
                  onBookConsultation?.(
                    currentTypology.title,
                    activeHotspot ? activeHotspot.name : undefined
                  )
                }
                className="w-full py-3.5 rounded-xl bg-[#c5a880] hover:bg-[#d6bc96] text-[#0c0d11] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#c5a880]/20"
              >
                <Calendar className="w-4 h-4" />
                <span>Consult Architect on this Design</span>
              </button>

              <button
                onClick={() =>
                  onWhatsApp?.(
                    currentTypology.title,
                    activeHotspot ? activeHotspot.name : undefined
                  )
                }
                className="w-full py-2.5 rounded-xl bg-[#141620] hover:bg-[#1d202e] text-neutral-300 hover:text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors border border-neutral-800"
              >
                <span>Inquire Custom Blueprint on WhatsApp</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#c5a880]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
