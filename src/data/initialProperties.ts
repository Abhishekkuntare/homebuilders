import { Property } from "../types";

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: "prop-1",
    slug: "the-oak-residence",
    title: "The Oak Residence",
    tagline: "Architectural Haven Amidst Heritage Trees",
    location: "Bandra West",
    city: "Mumbai",
    country: "India",
    price: 28500000,
    priceFormatted: "₹2.85 Cr",
    propertyType: "Apartment",
    status: "For Sale",
    bedrooms: 4,
    bathrooms: 4,
    area: 3250,
    areaFormatted: "3,250 SQ FT",
    possession: "Immediate Possession",
    furnished: "Semi-Furnished (Italian Millwork)",
    parking: "3 Dedicated Covered Bays",
    description: "Designed by renowned studio Studio Mumbai, The Oak Residence bridges brutalist raw concrete textures with warm Burmese teak finishes and double-height ceiling voids. Overlooking Arabian sea breezes in peaceful Pali Hill, Bandra West.",
    heroImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85",
    videoPoster: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=85",
    cinematicStages: [
      {
        stage: "Arrive",
        title: "The Gated Threshold",
        subtitle: "Monolithic travertine gate and private water court",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85",
        spec: "Private Vehicular Courtyard · 24/7 Diplomatic Security"
      },
      {
        stage: "Enter",
        title: "Double-Height Foyer",
        subtitle: "Pivot bronze entrance door opening to natural slate flooring",
        image: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=2000&q=85",
        spec: "14-ft Ceiling Clearances · Sculptural Teak Staircase"
      },
      {
        stage: "Live",
        title: "The Great Living Salon",
        subtitle: "Expansive open-plan living surrounded by acoustic glass",
        image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=85",
        spec: "Boffi Minimalist Joinery · Integrated Sonance Architectural Audio"
      },
      {
        stage: "Feast",
        title: "Culinary Atelier & Kitchen",
        subtitle: "Honed Nero Marquina marble island with Gaggenau 400 series",
        image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=2000&q=85",
        spec: "Sub-Zero Dual Temperature Wine Reserve · Butler Pantry"
      },
      {
        stage: "Rest",
        title: "The Primary Sanctuary",
        subtitle: "Private balcony wing with soundproofed French oak parquet",
        image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=2000&q=85",
        spec: "Poliform Walk-in Wardrobe · Motorized Sheer & Blackout Drapes"
      },
      {
        stage: "Rejuvenate",
        title: "Freestanding Stone Bath Suite",
        subtitle: "Single-block carved limestone soaking tub looking out at the canopy",
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=2000&q=85",
        spec: "Dornbracht Tara Brushed Platinum Fixtures · Rain Sky Shower"
      },
      {
        stage: "Experience",
        title: "Skyline Sunset Terrace",
        subtitle: "Sprawling terrace garden framing panoramic views of Bandra coastline",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=85",
        spec: "Private Plunge Spa · Outdoor Teppanyaki Lounge"
      }
    ],
    gallery: [
      { category: "EXTERIOR", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=80", title: "Cantilevered Exterior Facade" },
      { category: "LIVING", url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=80", title: "Sunken Conversation Pit" },
      { category: "KITCHEN", url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1800&q=80", title: "Minimalist Italian Kitchen" },
      { category: "BEDROOM", url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1800&q=80", title: "Master Bed overlooking Gulmohar Trees" },
      { category: "BATHROOM", url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1800&q=80", title: "Honed Travertine Bath Suite" },
      { category: "OUTDOOR", url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1800&q=80", title: "Terrace Plunge Pool & Deck" }
    ],
    floorPlans: [
      {
        level: "Ground Floor",
        area: "1,450 SQ FT",
        rooms: [
          { name: "Double-Height Foyer", size: "240 SQ FT", highlight: "Private elevator foyer and gallery" },
          { name: "Grand Salon & Dining", size: "780 SQ FT", highlight: "Floor-to-ceiling glass wall opening to deck" },
          { name: "Chef's Atelier Kitchen", size: "290 SQ FT", highlight: "Separate prep kitchen and wine cellar" },
          { name: "Powder Room", size: "75 SQ FT", highlight: "Single carved granite wash basin" },
          { name: "Verandah & Pool Deck", size: "380 SQ FT", highlight: "Shaded outdoor seating" }
        ]
      },
      {
        level: "First Floor",
        area: "1,800 SQ FT",
        rooms: [
          { name: "Primary Master Suite", size: "540 SQ FT", highlight: "Wraparound terrace and morning bar" },
          { name: "Poliform Dressing Room", size: "210 SQ FT", highlight: "Custom illuminated glass wardrobes" },
          { name: "Ensuite Master Spa", size: "190 SQ FT", highlight: "Dornbracht rain shower and twin vanities" },
          { name: "Junior Suite 02", size: "380 SQ FT", highlight: "Ensuite bathroom with garden view" },
          { name: "Executive Library / Study", size: "260 SQ FT", highlight: "Acoustic timber wall paneling" }
        ]
      },
      {
        level: "Terrace Deck",
        area: "850 SQ FT",
        rooms: [
          { name: "Sky Lounge & Sunken Firepit", size: "480 SQ FT", highlight: "Built-in banquette seating for 12" },
          { name: "Infinity Heated Plunge Pool", size: "220 SQ FT", highlight: "Glass cantilevered edge facing the horizon" },
          { name: "Bar & Teppanyaki Counter", size: "150 SQ FT", highlight: "Stainless marine-grade outdoor kitchen" }
        ]
      }
    ],
    amenities: [
      "Private Heated Plunge Pool",
      "Private High-Speed Elevator",
      "Smart Home Biometric Automation",
      "Gaggenau & Sub-Zero Fitted Kitchen",
      "Sonance Architectural In-Wall Audio",
      "Italian Travertine & Parquet Floors",
      "24/7 Concierge & Valet Service",
      "Electric Vehicle Multi-Charger"
    ],
    coordinates: { lat: 19.0596, lng: 72.8295 },
    agent: {
      name: "Devika Singhania",
      title: "Senior Partner, Luxury Estates",
      phone: "+91 98201 54321",
      email: "devika@smithstone.luxury",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      experience: "14+ Years · Bandra & South Mumbai Specialist"
    },
    featured: true,
    createdAt: "2026-01-15"
  },
  {
    id: "prop-2",
    slug: "azure-heights",
    title: "Azure Heights",
    tagline: "Sky-High Horizon Sanctuary with Palm Jumeirah Vistas",
    location: "Downtown / Marina Axis",
    city: "Dubai",
    country: "UAE",
    price: 68500000,
    priceFormatted: "$8.2M / AED 30.1M",
    propertyType: "Penthouse",
    status: "For Sale",
    bedrooms: 5,
    bathrooms: 6,
    area: 5400,
    areaFormatted: "5,400 SQ FT",
    possession: "Q4 2026 Ready",
    furnished: "Fully Furnished by Minotti",
    parking: "4 Basement Climate-Controlled Stalls",
    description: "Floating 64 storeys above the Arabian Gulf, Azure Heights features 360-degree curved curtain walls, double-height 22ft living voids, and an infinity pool on a cantilevered terrace.",
    heroImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=85",
    videoPoster: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=85",
    cinematicStages: [
      {
        stage: "Arrive",
        title: "Private Porte-Cochère",
        subtitle: "Helipad access and direct biometric private high-speed lift",
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2000&q=85",
        spec: "Direct 64th Floor Express Transit · Facial Recognition Gate"
      },
      {
        stage: "Enter",
        title: "The Sky Rotunda",
        subtitle: "White Statuario marble with curved floor-to-ceiling glass",
        image: "https://images.unsplash.com/photo-160058515526-990dced4db0d?auto=format&fit=crop&w=2000&q=85",
        spec: "22-Foot Double Height Ceiling · Hand-Blown Lasvit Chandelier"
      },
      {
        stage: "Live",
        title: "The Grand Panoramic Salon",
        subtitle: "Seamless 360° views across Burj Khalifa and the Palm archipelago",
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=85",
        spec: "Minotti Custom Furniture Suite · Crestron Architectural Lighting"
      },
      {
        stage: "Experience",
        title: "Cantilevered Sky Pool",
        subtitle: "Suspended 200m above the marina skyline with acrylic see-through floor",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=85",
        spec: "Temperature Regulated · Built-In Jacuzzi Jets & Fire Pits"
      }
    ],
    gallery: [
      { category: "EXTERIOR", url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1800&q=80", title: "Tower Silhouette at Twilight" },
      { category: "LIVING", url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=80", title: "Double-Height Glass Lounge" },
      { category: "KITCHEN", url: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1800&q=80", title: "Poliform Varenna Show Kitchen" },
      { category: "BEDROOM", url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1800&q=80", title: "Horizon Suite with Sunrise View" },
      { category: "BATHROOM", url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1800&q=80", title: "Bookmatched Calacatta Gold Bath" },
      { category: "OUTDOOR", url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1800&q=80", title: "Floating Sky Deck & Infinity Pool" }
    ],
    floorPlans: [
      {
        level: "Level 64 — Social Floor",
        area: "3,200 SQ FT",
        rooms: [
          { name: "Grand Salon & Dining", size: "1,400 SQ FT", highlight: "Double-height void with 360° views" },
          { name: "Show Kitchen & Bar", size: "380 SQ FT", highlight: "Calacatta marble breakfast bar" },
          { name: "Wine Tasting Room", size: "180 SQ FT", highlight: "Glass temperature controlled cellars" },
          { name: "Sky Terrace & Infinity Pool", size: "950 SQ FT", highlight: "Direct sea facing deck" }
        ]
      },
      {
        level: "Level 65 — Private Quarters",
        area: "2,200 SQ FT",
        rooms: [
          { name: "Presidential Master Suite", size: "850 SQ FT", highlight: "Dual baths and walk-in dressing salon" },
          { name: "Guest Suites 02 & 03", size: "720 SQ FT", highlight: "Ensuite marble baths" },
          { name: "Private Wellness & Spa", size: "360 SQ FT", highlight: "Finnish sauna & steam room" }
        ]
      }
    ],
    amenities: [
      "Cantilevered Sky Infinity Pool",
      "Helipad Landing Access",
      "Dedicated Private High-Speed Lift",
      "Private Cinema Screening Room",
      "Personal Wellness Spa & Finnish Sauna",
      "Sub-Zero & Poliform Custom Kitchen",
      "Climate Controlled 4-Car Stalls",
      "Chauffeur & Yacht Mooring Privileges"
    ],
    coordinates: { lat: 25.0772, lng: 55.1332 },
    agent: {
      name: "Tariq Al-Mansoor",
      title: "Managing Director, Middle East",
      phone: "+971 50 123 4567",
      email: "tariq@smithstone.luxury",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      experience: "16+ Years · Prime Dubai & Marina Ultra-Luxury"
    },
    featured: true,
    createdAt: "2026-02-01"
  },
  {
    id: "prop-3",
    slug: "the-palm-villa",
    title: "The Palm Villa",
    tagline: "Tropical Minimalist Courtyard Estate with Private Lagoon",
    location: "Anjuna / Assagao",
    city: "Goa",
    country: "India",
    price: 18500000,
    priceFormatted: "₹18.5 Cr",
    propertyType: "Villa",
    status: "For Sale",
    bedrooms: 5,
    bathrooms: 6,
    area: 6800,
    areaFormatted: "6,800 SQ FT",
    possession: "Ready to Move",
    furnished: "Fully Furnished with Reclaimed Teak & Linen",
    parking: "Private Portico for 4 SUVs",
    description: "Nestled among century-old banyan and coconut groves, The Palm Villa is an eco-luxury masterpiece crafted with laterite stone walls, cascading water pools, and indoor-outdoor living pavilions.",
    heroImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2000&q=85",
    videoPoster: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=2000&q=85",
    cinematicStages: [
      {
        stage: "Arrive",
        title: "Banyan Driveway & Gate",
        subtitle: "Dense bamboo canopy leading to heavy weathered brass gates",
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2000&q=85",
        spec: "1.2 Acre Lush Gated Compound · Private Guard Lodge"
      },
      {
        stage: "Enter",
        title: "Reflecting Water Pavilion",
        subtitle: "Open-air walkways over calm lily ponds with laterite stone walls",
        image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=2000&q=85",
        spec: "Bio-Filtered Natural Pools · Louvered Teak Privacy Screens"
      },
      {
        stage: "Live",
        title: "The Open Verandah Salon",
        subtitle: "18-foot pitched ceilings with antique timber rafters and breeze corridors",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85",
        spec: "Custom Handcrafted Rattan & Linen Furniture · Terrazzo Floors"
      },
      {
        stage: "Experience",
        title: "Black Granite Lap Pool",
        subtitle: "25-meter Olympic-grade pool surrounded by frangipani blossoms",
        image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=2000&q=85",
        spec: "Sunken Wet Bar · Timber Sun Loungers · Alfresco Wood Oven"
      }
    ],
    gallery: [
      { category: "EXTERIOR", url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1800&q=80", title: "Villa Pavilion from Pool Deck" },
      { category: "LIVING", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=80", title: "Open-Air Verandah Lounge" },
      { category: "KITCHEN", url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1800&q=80", title: "Indoor-Outdoor Dining Kitchen" },
      { category: "BEDROOM", url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1800&q=80", title: "Master Suite Opening to Lily Pond" },
      { category: "BATHROOM", url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1800&q=80", title: "Open Sky Rain Shower Garden" },
      { category: "OUTDOOR", url: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1800&q=80", title: "25m Black Granite Lap Pool" }
    ],
    floorPlans: [
      {
        level: "Ground Pavilions",
        area: "4,400 SQ FT",
        rooms: [
          { name: "Living & Dining Pavilion", size: "1,200 SQ FT", highlight: "Triple-height timber rafter ceiling" },
          { name: "Courtyard Pool & Sunken Deck", size: "1,800 SQ FT", highlight: "25m lap pool with natural stone coping" },
          { name: "Chef's Kitchen & Wine Room", size: "350 SQ FT", highlight: "Commercial grade appliances" },
          { name: "Guest Pavilion 01 & 02", size: "850 SQ FT", highlight: "Open private outdoor baths" }
        ]
      },
      {
        level: "Upper Sanctuary",
        area: "2,400 SQ FT",
        rooms: [
          { name: "Master Suite & Private Garden", size: "1,100 SQ FT", highlight: "Balcony looking over coconut grove" },
          { name: "Study & Cigar Lounge", size: "400 SQ FT", highlight: "Acoustic ceiling and private bar" },
          { name: "Junior Suites 03 & 04", size: "750 SQ FT", highlight: "Ensuite open-sky showers" }
        ]
      }
    ],
    amenities: [
      "25-Meter Heated Black Granite Pool",
      "Open-Sky Tropical Rain Showers",
      "1.2 Acre Lush Botanical Landscape",
      "Solar Micro-Grid & Backup Battery",
      "Full Housekeeping & Private Chef Quarters",
      "Artisan Handcrafted Furniture Suite",
      "High-Fidelity Outdoor Audio Network",
      "Yoga Shala & Meditation Garden"
    ],
    coordinates: { lat: 15.5898, lng: 73.7432 },
    agent: {
      name: "Rohan D'Souza",
      title: "Head of Coastal Acquisitions",
      phone: "+91 98902 33445",
      email: "rohan@smithstone.luxury",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      experience: "12+ Years · Goa Heritage & Luxury Coastal Plots"
    },
    featured: true,
    createdAt: "2026-01-28"
  },
  {
    id: "prop-4",
    slug: "skyline-penthouse",
    title: "Skyline Penthouse",
    tagline: "Biophilic Urban Masterpiece with Private Glass Solarium",
    location: "Indiranagar",
    city: "Bangalore",
    country: "India",
    price: 21500000,
    priceFormatted: "₹21.5 Cr",
    propertyType: "Penthouse",
    status: "For Sale",
    bedrooms: 4,
    bathrooms: 5,
    area: 4800,
    areaFormatted: "4,800 SQ FT",
    possession: "Immediate",
    furnished: "Designer Italian Furnishings",
    parking: "3 Dedicated EV Bays",
    description: "Suspended over Indiranagar's lush tree canopies, this duplex penthouse marries Scandinavian light woods with Japanese joinery and a 1,200 sq ft glass solarium garden.",
    heroImage: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2000&q=85",
    videoPoster: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=2000&q=85",
    cinematicStages: [
      {
        stage: "Arrive",
        title: "Private Sky Lobby",
        subtitle: "Fluted limestone walls with ambient backlit brass sconces",
        image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=2000&q=85",
        spec: "Dedicated Express Elevator · Biometric Keyless Entry"
      },
      {
        stage: "Live",
        title: "The Glass Atrium Lounge",
        subtitle: "20-foot soaring windows framing the garden city's leafy green blanket",
        image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2000&q=85",
        spec: "Scandinavian White Ash Wood Floors · Bang & Olufsen Sound"
      },
      {
        stage: "Feast",
        title: "Boffi Architectural Kitchen",
        subtitle: "Monolithic quartz counters with seamless induction cooktops",
        image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=2000&q=85",
        spec: "Miele MasterCool Refrigeration · Custom Walnut Island"
      },
      {
        stage: "Experience",
        title: "Sky Solarium & Plunge Pool",
        subtitle: "Hydrotherapy pool surrounded by olive trees and vertical gardens",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=85",
        spec: "Glass Cantilever Edge · Heated Hydro Jets"
      }
    ],
    gallery: [
      { category: "EXTERIOR", url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=80", title: "Glass Atrium Duplex" },
      { category: "LIVING", url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=80", title: "Double-Height Scandinavian Living" },
      { category: "KITCHEN", url: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1800&q=80", title: "Boffi Monolithic Kitchen" },
      { category: "BEDROOM", url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1800&q=80", title: "Master Bed with Sky Views" },
      { category: "BATHROOM", url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1800&q=80", title: "Honed Quartz Spa Bath" },
      { category: "OUTDOOR", url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1800&q=80", title: "Solarium Plunge Terrace" }
    ],
    floorPlans: [
      {
        level: "Lower Duplex",
        area: "2,600 SQ FT",
        rooms: [
          { name: "Great Living & Double Atrium", size: "980 SQ FT", highlight: "20ft high glass curtain" },
          { name: "Culinary Island & Prep Kitchen", size: "320 SQ FT", highlight: "Integrated wine cellar" },
          { name: "Guest Suites 01 & 02", size: "640 SQ FT", highlight: "Attached marble ensuites" },
          { name: "Outdoor Breakfast Verandah", size: "260 SQ FT", highlight: "Private morning herb garden" }
        ]
      },
      {
        level: "Upper Solarium & Master",
        area: "2,200 SQ FT",
        rooms: [
          { name: "Primary Master Suite", size: "780 SQ FT", highlight: "Walk-through wardrobe & private study" },
          { name: "Solarium Garden & Jacuzzi", size: "620 SQ FT", highlight: "Retractable glass motorized roof" },
          { name: "Media & Listening Den", size: "350 SQ FT", highlight: "Acoustically isolated screening space" }
        ]
      }
    ],
    amenities: [
      "Retractable Glass Solarium Roof",
      "Private Heated Sky Jacuzzi",
      "Dedicated High-Speed Private Elevator",
      "Integrated Bang & Olufsen Acoustics",
      "Miele & Boffi Culinary Atelier",
      "Japanese Soaking Tub & Steam Shower",
      "Tesla / Multi-EV Supercharging Stations",
      "24/7 White-Glove Security & Valet"
    ],
    coordinates: { lat: 12.9784, lng: 77.6408 },
    agent: {
      name: "Ananya Rao",
      title: "Director of Tech & Executive Estates",
      phone: "+91 98450 78901",
      email: "ananya@smithstone.luxury",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
      experience: "11+ Years · Central Bangalore Ultra-Penthouses"
    },
    featured: true,
    createdAt: "2026-02-10"
  },
  {
    id: "prop-5",
    slug: "emerald-courtyard",
    title: "Emerald Courtyard",
    tagline: "Serene Mid-Century Estate in Heritage Koregaon Park",
    location: "Koregaon Park",
    city: "Pune",
    country: "India",
    price: 14500000,
    priceFormatted: "₹14.5 Cr",
    propertyType: "Bungalow",
    status: "For Sale",
    bedrooms: 5,
    bathrooms: 5,
    area: 5200,
    areaFormatted: "5,200 SQ FT",
    possession: "Ready",
    furnished: "Curated Scandinavian & Mid-Century Antiques",
    parking: "Private 4-Car Carport",
    description: "Spread over a tranquil half-acre corner plot lined with mahogany trees in Koregaon Park Lane 5. Features a serene central courtyard, reflecting pool, and floor-to-ceiling sliding glass screens.",
    heroImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=85",
    videoPoster: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85",
    cinematicStages: [
      {
        stage: "Arrive",
        title: "The Mahogany Alley",
        subtitle: "Lush botanical hedge framing hand-cast bronze gate",
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=85",
        spec: "Half-Acre Gated Sanctuary · 24-Hour Physical Security"
      },
      {
        stage: "Live",
        title: "The Central Courtyard",
        subtitle: "Internal garden with ancient olive tree and tranquil water channel",
        image: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=2000&q=85",
        spec: "Natural Air Circulation · Hand-Cut Basalt Paving"
      },
      {
        stage: "Experience",
        title: "Pergola Dining Pavilion",
        subtitle: "Covered outdoor dining area facing heated lap pool and sculpture lawn",
        image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=2000&q=85",
        spec: "Outdoor Wood Fireplace · Custom Brass Barbecue Station"
      }
    ],
    gallery: [
      { category: "EXTERIOR", url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=80", title: "Mid-Century Bungalow Facade" },
      { category: "LIVING", url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=80", title: "Glass Living overlooking Courtyard" },
      { category: "KITCHEN", url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1800&q=80", title: "Custom Oak & Brass Kitchen" },
      { category: "BEDROOM", url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1800&q=80", title: "Garden Bedroom with Private Deck" },
      { category: "BATHROOM", url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1800&q=80", title: "Minimalist Terrazzo Shower Suite" },
      { category: "OUTDOOR", url: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1800&q=80", title: "Sculpture Garden & Lap Pool" }
    ],
    floorPlans: [
      {
        level: "Ground Floor",
        area: "3,800 SQ FT",
        rooms: [
          { name: "Central Garden Courtyard", size: "900 SQ FT", highlight: "Open-sky tranquil water atrium" },
          { name: "Main Salon & Library", size: "850 SQ FT", highlight: "Floor to ceiling timber louvers" },
          { name: "Culinary Suite & Pantry", size: "320 SQ FT", highlight: "Separate staff prep quarters" },
          { name: "Primary Master Suite", size: "620 SQ FT", highlight: "Walkout to private garden terrace" }
        ]
      },
      {
        level: "First Floor",
        area: "1,400 SQ FT",
        rooms: [
          { name: "Guest Suites 02, 03 & 04", size: "880 SQ FT", highlight: "Private balconies overlooking canopies" },
          { name: "Art Studio / Yoga Pavilion", size: "320 SQ FT", highlight: "North-facing natural skylights" }
        ]
      }
    ],
    amenities: [
      "Tranquil Central Open-Sky Courtyard",
      "Heated Basalt Lap Pool",
      "Curated Mid-Century Scandinavian Furnishings",
      "Solar Water Heating & Inverter Backup",
      "Lush Landscaped Lawn & Bonsai Garden",
      "Dedicated Staff & Chauffeur Quarters",
      "Perimeter Infrared Security Grid",
      "High-Fidelity Architectural Acoustic System"
    ],
    coordinates: { lat: 18.5362, lng: 73.894 },
    agent: {
      name: "Vikram Kirloskar",
      title: "Partner, Heritage & Modern Homes",
      phone: "+91 98220 11223",
      email: "vikram@smithstone.luxury",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
      experience: "15+ Years · Pune Prime Heritage Properties"
    },
    featured: false,
    createdAt: "2026-02-14"
  },
  {
    id: "prop-6",
    slug: "the-grand-estate",
    title: "The Grand Estate",
    tagline: "Diplomatic Enclave Manor with Private Tennis Court & Parkland",
    location: "Golf Links / Lutyens Border",
    city: "Delhi NCR",
    country: "India",
    price: 48500000,
    priceFormatted: "₹48.5 Cr",
    propertyType: "Estate",
    status: "For Sale",
    bedrooms: 6,
    bathrooms: 8,
    area: 9800,
    areaFormatted: "9,800 SQ FT",
    possession: "Immediate",
    furnished: "Bespoke Classical-Contemporary Fitout",
    parking: "Subterranean Motor Court for 8 Vehicles",
    description: "A generational trophy asset situated on an expansive private 1.5-acre manicured parkland parcel adjacent to the Delhi Golf Club. Features classical stone symmetry, double-tier security, and Olympic sports amenities.",
    heroImage: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=2000&q=85",
    videoPoster: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85",
    cinematicStages: [
      {
        stage: "Arrive",
        title: "Monumental Wrought-Iron Gate",
        subtitle: "Cypress-lined driveway opening to neoclassical stone portico",
        image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=2000&q=85",
        spec: "1.5 Acre Sovereign Compound · Armed Security Protocol"
      },
      {
        stage: "Enter",
        title: "The Grand Rotunda Gallery",
        subtitle: "Bookmatched Greek Thassos marble and dual sweeping cantilever stairs",
        image: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=2000&q=85",
        spec: "28-Foot Cupola Skylight · Custom Murano Glass Sconces"
      },
      {
        stage: "Live",
        title: "The Ballroom Salon",
        subtitle: "Formal entertaining reception with hand-carved limestone fireplaces",
        image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=85",
        spec: "Seats 40 Guests · Temperature-Controlled Cigar Humidor Room"
      },
      {
        stage: "Experience",
        title: "Championship Clay Tennis Court & Pavilion",
        subtitle: "Private regulation court bordered by manicured topiary and rose gardens",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=85",
        spec: "Submerged Lighting · Spectator Verandah & Locker Rooms"
      }
    ],
    gallery: [
      { category: "EXTERIOR", url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1800&q=80", title: "Neoclassical Limestone Estate" },
      { category: "LIVING", url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=80", title: "The Grand Reception Salon" },
      { category: "KITCHEN", url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1800&q=80", title: "Industrial Prep & Show Kitchen" },
      { category: "BEDROOM", url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1800&q=80", title: "Presidential Master Suite with Sitting Room" },
      { category: "BATHROOM", url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1800&q=80", title: "Greek Thassos Marble Bathroom" },
      { category: "OUTDOOR", url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1800&q=80", title: "Private Championship Tennis Court" }
    ],
    floorPlans: [
      {
        level: "Ground Manor",
        area: "5,400 SQ FT",
        rooms: [
          { name: "Grand Rotunda & Foyer", size: "650 SQ FT", highlight: "28ft high dome ceiling" },
          { name: "Ballroom & Formal Dining", size: "1,800 SQ FT", highlight: "French doors opening to parkland" },
          { name: "Culinary Wing & Service Corridor", size: "750 SQ FT", highlight: "Chef's commercial kitchen" },
          { name: "Diplomatic Meeting Study", size: "480 SQ FT", highlight: "Bulletproof acoustic glazing" }
        ]
      },
      {
        level: "Upper Family Residence",
        area: "4,400 SQ FT",
        rooms: [
          { name: "Presidential Suite 01", size: "1,200 SQ FT", highlight: "Dual private dressing rooms & spa" },
          { name: "Family Suites 02, 03 & 04", size: "1,600 SQ FT", highlight: "Ensuite dressing rooms and private balconies" },
          { name: "Private Screening Theatre", size: "520 SQ FT", highlight: "Dolby Atmos 16-seat luxury cinema" }
        ]
      }
    ],
    amenities: [
      "Championship Regulation Tennis Court",
      "Private 16-Seat Dolby Atmos Cinema",
      "Subterranean 8-Car Climate-Controlled Motor Court",
      "Commercial Chef's Kitchen & Wine Vault",
      "Safe Room with Independent Oxygen & Security System",
      "Private 1.5 Acre Manicured English Park",
      "Separate 6-Bedroom Staff Quarters Compound",
      "Diplomatic Perimeter High-Security Systems"
    ],
    coordinates: { lat: 28.601, lng: 77.234 },
    agent: {
      name: "Siddharth Oberoi",
      title: "Senior Vice President, Private Office",
      phone: "+91 98110 99887",
      email: "siddharth@smithstone.luxury",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
      experience: "20+ Years · Lutyens Delhi & Sovereign Estates Specialist"
    },
    featured: true,
    createdAt: "2026-01-05"
  }
];
