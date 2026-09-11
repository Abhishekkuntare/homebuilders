export type PropertyType = "Apartment" | "Penthouse" | "Villa" | "Bungalow" | "Estate";

export interface CinematicStage {
  stage: string;
  title: string;
  subtitle: string;
  image: string;
  spec: string;
}

export interface GalleryItem {
  category: "EXTERIOR" | "LIVING" | "KITCHEN" | "BEDROOM" | "BATHROOM" | "OUTDOOR";
  url: string;
  title: string;
}

export interface RoomItem {
  name: string;
  size: string;
  highlight: string;
}

export interface FloorPlan {
  level: string;
  area: string;
  rooms: RoomItem[];
}

export interface Agent {
  name: string;
  title: string;
  phone: string;
  email: string;
  avatar: string;
  experience: string;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  location: string;
  city: string;
  country: string;
  price: number;
  priceFormatted: string;
  propertyType: PropertyType;
  status: "For Sale" | "Reserved" | "Off Market";
  bedrooms: number;
  bathrooms: number;
  area: number;
  areaFormatted: string;
  possession: string;
  furnished: string;
  parking: string;
  description: string;
  heroImage: string;
  videoPoster: string;
  cinematicStages: CinematicStage[];
  gallery: GalleryItem[];
  floorPlans: FloorPlan[];
  amenities: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  agent: Agent;
  featured: boolean;
  createdAt: string;
}

export type LeadType = 
  | "PROPERTY_INQUIRY"
  | "TOUR_BOOKING"
  | "WHATSAPP_REQUEST"
  | "VALUATION_REQUEST"
  | "CONTACT_REQUEST"
  | "AI_ASSISTANT_LEAD";

export type LeadStatus = 
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "VIEWING_SCHEDULED"
  | "CLOSED"
  | "LOST";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  property: string;
  message: string;
  source: string;
  preferredDate?: string | null;
  preferredTime?: string | null;
  timestamp: string;
  leadType: LeadType;
  status: LeadStatus;
  notes?: string;
}

export interface ValuationResult {
  minEstimate: number;
  maxEstimate: number;
  estimateFormatted: string;
  pricePerSqFtAverage: number;
  currency: string;
}
