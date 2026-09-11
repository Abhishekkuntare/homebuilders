import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import {
  Maximize2,
  Minimize2,
  RotateCcw,
  Play,
  Pause,
  Compass,
  Volume2,
  VolumeX,
  ChevronRight,
  ChevronLeft,
  Calendar,
  X,
  Sparkles,
  Eye,
  Film,
  ArrowRight,
  CheckCircle2,
  Layers,
  Sun,
  Moon,
  Sunset,
  ShieldCheck,
  Building2,
  Share2
} from "lucide-react";
import { ambientAudio } from "../utils/ambientAudio";

// Types for Room Definition
export interface NavigatorRoom {
  id: string;
  name: string;
  shortLabel: string;
  icon: string;
  category: "living" | "kitchen" | "bedroom" | "bathroom" | "pool" | "dining";
  floor: "Ground Level" | "Upper Sanctuary" | "Landscape Deck";
  hotspotPos: [number, number, number];
  cameraPos: [number, number, number];
  lookAt: [number, number, number];
  area: string;
  ceilingHeight: string;
  orientation: string;
  tagline: string;
  description: string;
  architecturalMaterials: string[];
  keySpecifications: string[];
  smartFeatures: string[];
  lightingMood: string;
}

export const NAVIGATOR_ROOMS: NavigatorRoom[] = [
  {
    id: "living",
    name: "Double-Height Grand Living Salon",
    shortLabel: "Living Salon",
    icon: "🛋️",
    category: "living",
    floor: "Ground Level",
    hotspotPos: [1.8, 1.6, 1.2],
    cameraPos: [7.5, 4.5, 7.8],
    lookAt: [1.5, 1.2, 0.5],
    area: "980 SQ FT",
    ceilingHeight: "18 FT Double-Height Void",
    orientation: "South-West Facing Sunset",
    tagline: "Panoramic floor-to-ceiling glass volume with ribbon vapor fireplace",
    description: "The architectural centerpiece of the residence features 18-foot soaring clearances, bookmatched Calacatta marble slab wall, custom Minotti curved seating, and seamless motorized pocket doors opening to the private gardens.",
    architecturalMaterials: ["Bookmatched Calacatta Gold Marble", "Honed Roman Travertine", "Brushed Champagne Brass"],
    keySpecifications: [
      "18-foot double-height motorized glass facade",
      "Integrated linear water-vapor flame hearth",
      "Sonance invisible acoustic in-wall sound system",
      "Custom recessed bronze architectural cove lighting"
    ],
    smartFeatures: ["Lutron Palladiom keypad automation", "Climate micro-zoning", "Motorized sheer & blackout drapes"],
    lightingMood: "Warm 2700K indirect cove wash with accent spots"
  },
  {
    id: "kitchen",
    name: "Chef's Atelier Kitchen & Wine Bar",
    shortLabel: "Chef's Kitchen",
    icon: "🍽️",
    category: "kitchen",
    floor: "Ground Level",
    hotspotPos: [-3.2, 1.6, -3.8],
    cameraPos: [-0.5, 3.2, -1.0],
    lookAt: [-3.5, 1.2, -4.2],
    area: "460 SQ FT",
    ceilingHeight: "11.5 FT Finished Ceilings",
    orientation: "East Garden Morning Light",
    tagline: "Monolithic Nero Marquina marble island meets Gaggenau culinary engineering",
    description: "Precision-crafted for elite gastronomy and private entertaining. Features an expansive 14-foot monolithic marble island, seamless induction cooktop, hidden butler's prep scullery, and custom smoked-oak cabinetry with integrated wine storage.",
    architecturalMaterials: ["Honed Nero Marquina Marble", "Smoked Belgian Oak", "Matte Gunmetal Hardware"],
    keySpecifications: [
      "Gaggenau 400 Series flush induction cooktop",
      "Sub-Zero dual-column refrigeration & 102-bottle wine reserve",
      "Concealed back-kitchen prep scullery with Miele dishwashers",
      "Custom brass cylindrical architectural pendants"
    ],
    smartFeatures: ["Hands-free sensor water filtration", "Downdraft silent ventilation", "Sommelier temperature control"],
    lightingMood: "Focused 3000K culinary task lighting & glowing stone underglow"
  },
  {
    id: "dining",
    name: "Formal Dining Salon & Wine Gallery",
    shortLabel: "Dining Salon",
    icon: "🍷",
    category: "dining",
    floor: "Ground Level",
    hotspotPos: [-0.5, 1.6, 2.5],
    cameraPos: [-2.8, 3.4, 6.2],
    lookAt: [-0.5, 1.2, 2.2],
    area: "520 SQ FT",
    ceilingHeight: "14 FT Acoustic Coffered Ceiling",
    orientation: "Courtyard Water Feature Vista",
    tagline: "Handcrafted 12-seater quartzite dining table with bespoke linear chandelier",
    description: "Framed by floor-to-ceiling glass on two sides, the formal dining salon overlooks illuminated reflecting water features and an architectural glass-enclosed wine showcase with capacity for 400 rare vintages.",
    architecturalMaterials: ["Cristallo Backlit Quartzite", "Smoked Eucalyptus", "Polished Bronze"],
    keySpecifications: [
      "Custom 12-seat sculpted quartzite monolithic dining table",
      "Bespoke 3-meter hand-blown glass linear chandelier",
      "Floor-to-ceiling conditioned wine display vault",
      "Acoustic slatted wood ceiling for balanced resonance"
    ],
    smartFeatures: ["One-touch entertaining lighting scene", "Acoustic spatial audio isolation", "Automated wine vault humidity"],
    lightingMood: "Dimmable intimate candlelight warmth (2200K)"
  },
  {
    id: "bedroom",
    name: "Primary Master Sanctuary Suite",
    shortLabel: "Master Suite",
    icon: "🛏️",
    category: "bedroom",
    floor: "Upper Sanctuary",
    hotspotPos: [4.2, 5.8, 0.8],
    cameraPos: [8.8, 7.6, 4.8],
    lookAt: [3.8, 5.4, 0.2],
    area: "780 SQ FT",
    ceilingHeight: "12 FT Vaulted Ceiling",
    orientation: "South-West Panoramic Elevated Horizon",
    tagline: "Elevated private suite with king platform bed & wraparound balcony",
    description: "An oasis of restful privacy occupying the upper west corner. Designed with wide-plank French white oak floors, upholstered bouclé headboard, dual walk-in glass dressing chambers, and direct terrace transitions.",
    architecturalMaterials: ["French White Oak Parquet", "Belgian Bouclé Linen", "Brushed Bronze Accents"],
    keySpecifications: [
      "Custom floating king bed with perimeter ambient underglow",
      "Dual Poliform illuminated glass walk-in dressing rooms",
      "Private corner terrace with glass balustrade",
      "Motorized dual-layer acoustic and blackout drape system"
    ],
    smartFeatures: ["Circadian biorhythm lighting automation", "Silent zoned whisper HVAC", "Touch-to-wake bedside controls"],
    lightingMood: "Calming 2400K nocturnal warmth with goose-neck reading beams"
  },
  {
    id: "bathroom",
    name: "En-Suite Spa Bath & Wellness Suite",
    shortLabel: "Spa Bathroom",
    icon: "🛁",
    category: "bathroom",
    floor: "Upper Sanctuary",
    hotspotPos: [7.2, 5.8, -3.8],
    cameraPos: [4.2, 7.2, -1.8],
    lookAt: [7.8, 5.6, -4.2],
    area: "320 SQ FT",
    ceilingHeight: "10.5 FT Moisture-Shielded Ceiling",
    orientation: "North Garden Privacy Vista",
    tagline: "Solid stone freestanding soaking tub & dual rain-sky shower alcove",
    description: "A private residential spa clad in honed Pietra di Cardoso stone. Features an oval soaking tub carved from a single limestone boulder, ceiling-flush rainfall shower with steam generator, and a Japanese smart toilet suite in frosted glass enclosure.",
    architecturalMaterials: ["Honed Pietra di Cardoso Stone", "Dornbracht Brushed Platinum", "Fluted Reeded Privacy Glass"],
    keySpecifications: [
      "Freestanding monolithic limestone soaking tub with floor spout",
      "Ceiling-recessed rain-sky shower with aromatherapy steam",
      "Double floating vanity with backlit anti-fog LED mirrors",
      "Enclosed Toto Neorest Japanese smart toilet with bidet & auto-lid"
    ],
    smartFeatures: ["Underfloor radiant stone heating", "Automated chromotherapy lighting", "Smart electrochromic privacy glass"],
    lightingMood: "Diffused spa daylighting with perimeter halo glow"
  },
  {
    id: "pool",
    name: "Infinity Heated Pool & Sun Pavilion",
    shortLabel: "Pool Terrace",
    icon: "🏊",
    category: "pool",
    floor: "Landscape Deck",
    hotspotPos: [-8.2, 1.4, 2.2],
    cameraPos: [-14.5, 5.2, 8.8],
    lookAt: [-6.8, 1.2, 1.8],
    area: "1,250 SQ FT",
    ceilingHeight: "Open Sky Deck",
    orientation: "Full Day Sun & Twilight Sunset",
    tagline: "Heated zero-edge pool with underwater sound & teak sun loungers",
    description: "Suspended alongside the landscaped zen gardens, this 20-meter infinity heated lap pool features Sukabumi green quartz tiles, an invisible horizon overflow edge, built-in underwater sound transducers, and shaded teak cabana loungers.",
    architecturalMaterials: ["Sukabumi Natural Green Quartz", "Weathered Teak Decking", "Seamless Glass Balustrades"],
    keySpecifications: [
      "Zero-edge horizon overflow with reflection water trough",
      "Integrated underwater LED chromotherapy lighting",
      "Dual custom teak sun loungers with weatherproof marine cushions",
      "Shaded cantilevered architectural sun parasol"
    ],
    smartFeatures: ["Automated eco-heat pump climate regulation", "Underwater acoustic sound speakers", "Saline sanitation system"],
    lightingMood: "Glowing aquatic turquoise luminescence with landscape uplights"
  }
];

// =========================================================================
// 3D SCENE MESH COMPONENTS (React Three Fiber)
// =========================================================================

// Realistic Architectural House Model
const ArchitecturalHouse: React.FC<{
  onSelectRoom: (room: NavigatorRoom) => void;
  activeRoomId: string;
}> = ({ onSelectRoom, activeRoomId }) => {
  const waterRef = useRef<THREE.Mesh>(null);
  const fireplaceRef = useRef<THREE.PointLight>(null);

  // Animate water and fireplace in R3F frame loop
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (waterRef.current) {
      waterRef.current.position.y = 0.42 + Math.sin(t * 2.0) * 0.012;
    }
    if (fireplaceRef.current) {
      fireplaceRef.current.intensity = 1.8 + Math.sin(t * 7) * 0.4 + Math.cos(t * 13) * 0.2;
    }
  });

  // Materials
  const materials = useMemo(() => {
    return {
      podium: new THREE.MeshStandardMaterial({ color: 0x1f2229, roughness: 0.9 }),
      travertine: new THREE.MeshStandardMaterial({ color: 0xe3dbd0, roughness: 0.35, metalness: 0.05 }),
      darkMarble: new THREE.MeshStandardMaterial({ color: 0x181a1f, roughness: 0.2, metalness: 0.15 }),
      teak: new THREE.MeshStandardMaterial({ color: 0x7c471c, roughness: 0.6 }),
      bronze: new THREE.MeshStandardMaterial({ color: 0xc5a880, roughness: 0.3, metalness: 0.8 }),
      fabric: new THREE.MeshStandardMaterial({ color: 0xdcd8d0, roughness: 0.85 }),
      glass: new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.25,
        roughness: 0.05,
        metalness: 0.1,
        transmission: 0.88,
        ior: 1.5
      }),
      water: new THREE.MeshStandardMaterial({
        color: 0x0ea5e9,
        roughness: 0.1,
        metalness: 0.6,
        transparent: true,
        opacity: 0.82
      }),
      grass: new THREE.MeshStandardMaterial({ color: 0x365314, roughness: 0.95 }),
      ceramic: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2, metalness: 0.05 })
    };
  }, []);

  return (
    <group>
      {/* 1. Base Foundation Podium */}
      <mesh position={[0, -0.3, 0]} receiveShadow material={materials.podium}>
        <boxGeometry args={[36, 0.6, 32]} />
      </mesh>

      {/* 2. Zen Garden & Lawn */}
      <mesh position={[-9, 0.08, 8]} receiveShadow material={materials.grass}>
        <boxGeometry args={[12, 0.15, 12]} />
      </mesh>

      {/* Trees in Garden */}
      {[-11, -8, -13].map((x, i) => (
        <group key={i} position={[x, 0, 7 + i * 2]}>
          <mesh position={[0, 1.2, 0]} castShadow material={materials.teak}>
            <cylinderGeometry args={[0.12, 0.18, 2.4, 8]} />
          </mesh>
          <mesh position={[0, 2.5, 0]} castShadow material={materials.grass} scale={[1.2, 0.8, 1.2]}>
            <sphereGeometry args={[0.9, 8, 8]} />
          </mesh>
        </group>
      ))}

      {/* 3. Ground Level Slab */}
      <mesh position={[1.5, 0.1, 0]} receiveShadow material={materials.travertine}>
        <boxGeometry args={[18, 0.2, 18]} />
      </mesh>

      {/* Slender Bronze Columns */}
      {[
        [-6.5, 2.7, -8],
        [-6.5, 2.7, 7],
        [9.5, 2.7, -8],
        [9.5, 2.7, 7],
        [1.5, 2.7, -8],
        [1.5, 2.7, 7]
      ].map(([cx, cy, cz], idx) => (
        <mesh key={idx} position={[cx, cy, cz]} castShadow material={materials.bronze}>
          <cylinderGeometry args={[0.1, 0.1, 5.4, 16]} />
        </mesh>
      ))}

      {/* Glass Curtain Front & Side */}
      <mesh position={[1.5, 2.7, 7]} material={materials.glass}>
        <boxGeometry args={[16, 5.2, 0.08]} />
      </mesh>
      <mesh position={[-6.5, 2.7, -0.5]} material={materials.glass}>
        <boxGeometry args={[0.08, 5.2, 15]} />
      </mesh>

      {/* ========================================================= */}
      {/* ROOM 1: LIVING SALON */}
      {/* ========================================================= */}
      <group
        onClick={(e) => {
          e.stopPropagation();
          const r = NAVIGATOR_ROOMS.find((item) => item.id === "living");
          if (r) onSelectRoom(r);
        }}
      >
        {/* L-Sofa */}
        <mesh position={[1.8, 0.38, 1.2]} castShadow material={materials.fabric}>
          <boxGeometry args={[3.8, 0.45, 1.6]} />
        </mesh>
        <mesh position={[3.9, 0.38, 1.6]} castShadow material={materials.fabric}>
          <boxGeometry args={[1.5, 0.45, 2.4]} />
        </mesh>
        <mesh position={[1.8, 0.78, 0.5]} castShadow material={materials.fabric}>
          <boxGeometry args={[3.8, 0.55, 0.35]} />
        </mesh>
        {/* Coffee table */}
        <mesh position={[2.0, 0.25, 2.6]} castShadow material={materials.bronze}>
          <boxGeometry args={[2.2, 0.3, 1.1]} />
        </mesh>
        {/* Rug */}
        <mesh position={[2.3, 0.12, 1.8]} receiveShadow material={materials.travertine}>
          <boxGeometry args={[4.8, 0.04, 3.6]} />
        </mesh>
        {/* Fireplace Feature Wall & Glowing PointLight */}
        <mesh position={[2, 1.7, -7.6]} castShadow material={materials.darkMarble}>
          <boxGeometry args={[4.5, 3.2, 0.4]} />
        </mesh>
        <pointLight ref={fireplaceRef} position={[2, 0.8, -7.3]} color={0xf97316} intensity={1.8} distance={8} />
      </group>

      {/* ========================================================= */}
      {/* ROOM 2: CHEF'S KITCHEN */}
      {/* ========================================================= */}
      <group
        onClick={(e) => {
          e.stopPropagation();
          const r = NAVIGATOR_ROOMS.find((item) => item.id === "kitchen");
          if (r) onSelectRoom(r);
        }}
      >
        {/* Kitchen Island */}
        <mesh position={[-3.2, 0.55, -4.2]} castShadow material={materials.darkMarble}>
          <boxGeometry args={[3.6, 0.9, 1.5]} />
        </mesh>
        {/* Induction Cooktop */}
        <mesh position={[-3.8, 1.01, -4.2]} castShadow material={materials.bronze}>
          <boxGeometry args={[1.3, 0.02, 0.7]} />
        </mesh>
        {/* Bar Stools */}
        {[-4.6, -3.7].map((sx, idx) => (
          <group key={idx} position={[sx, 0, -3.2]}>
            <mesh position={[0, 0.65, 0]} castShadow material={materials.fabric}>
              <cylinderGeometry args={[0.26, 0.26, 0.08, 16]} />
            </mesh>
            <mesh position={[0, 0.32, 0]} castShadow material={materials.bronze}>
              <cylinderGeometry args={[0.04, 0.04, 0.65, 8]} />
            </mesh>
          </group>
        ))}
        {/* Rear Wall Cabinetry */}
        <mesh position={[-3.2, 1.4, -7.5]} castShadow material={materials.teak}>
          <boxGeometry args={[3.8, 2.6, 0.6]} />
        </mesh>
        {/* Triple Brass Pendants */}
        {[-3.8, -3.2, -2.6].map((px, idx) => (
          <mesh key={idx} position={[px, 2.8, -4.2]} castShadow material={materials.bronze}>
            <cylinderGeometry args={[0.08, 0.08, 0.35, 12]} />
          </mesh>
        ))}
      </group>

      {/* ========================================================= */}
      {/* ROOM 3: DINING SALON */}
      {/* ========================================================= */}
      <group
        onClick={(e) => {
          e.stopPropagation();
          const r = NAVIGATOR_ROOMS.find((item) => item.id === "dining");
          if (r) onSelectRoom(r);
        }}
      >
        {/* Dining Table */}
        <mesh position={[-0.5, 0.5, 2.4]} castShadow material={materials.darkMarble}>
          <boxGeometry args={[3.2, 0.1, 1.6]} />
        </mesh>
        <mesh position={[-0.5, 0.24, 2.4]} castShadow material={materials.bronze}>
          <boxGeometry args={[1.8, 0.48, 0.8]} />
        </mesh>
        {/* Dining Chairs */}
        {[-1.4, -0.5, 0.4].map((cx, idx) => (
          <group key={idx}>
            <mesh position={[cx, 0.4, 1.4]} castShadow material={materials.fabric}>
              <boxGeometry args={[0.45, 0.45, 0.45]} />
            </mesh>
            <mesh position={[cx, 0.4, 3.4]} castShadow material={materials.fabric}>
              <boxGeometry args={[0.45, 0.45, 0.45]} />
            </mesh>
          </group>
        ))}
        {/* Linear Chandelier */}
        <mesh position={[-0.5, 2.8, 2.4]} castShadow material={materials.bronze}>
          <boxGeometry args={[2.6, 0.08, 0.4]} />
        </mesh>
      </group>

      {/* ========================================================= */}
      {/* UPPER FLOOR SLAB & BEDROOM + BATHROOM */}
      {/* ========================================================= */}
      <mesh position={[3.8, 5.2, -0.5]} receiveShadow material={materials.travertine}>
        <boxGeometry args={[14, 0.25, 14]} />
      </mesh>
      {/* Upper Floor Glass Railing */}
      <mesh position={[3.8, 5.8, 6.4]} material={materials.glass}>
        <boxGeometry args={[13.8, 1.1, 0.06]} />
      </mesh>

      {/* ROOM 4: MASTER BEDROOM */}
      <group
        onClick={(e) => {
          e.stopPropagation();
          const r = NAVIGATOR_ROOMS.find((item) => item.id === "bedroom");
          if (r) onSelectRoom(r);
        }}
      >
        <mesh position={[4.2, 5.4, 0.6]} castShadow material={materials.teak}>
          <boxGeometry args={[2.5, 0.35, 2.8]} />
        </mesh>
        <mesh position={[4.2, 5.75, 0.6]} castShadow material={materials.fabric}>
          <boxGeometry args={[2.3, 0.4, 2.6]} />
        </mesh>
        <mesh position={[4.2, 6.2, -0.7]} castShadow material={materials.fabric}>
          <boxGeometry args={[2.7, 1.2, 0.2]} />
        </mesh>
        {/* Bedside Nightstands & Lamps */}
        {[-1.6, 1.6].map((offset, idx) => (
          <group key={idx} position={[4.2 + offset, 5.45, -0.5]}>
            <mesh position={[0, 0, 0]} castShadow material={materials.teak}>
              <boxGeometry args={[0.6, 0.45, 0.5]} />
            </mesh>
            <mesh position={[0, 0.4, 0]} castShadow material={materials.bronze}>
              <sphereGeometry args={[0.14, 12, 12]} />
            </mesh>
          </group>
        ))}
        <pointLight position={[4.2, 6.8, 0.6]} color={0xfef3c7} intensity={1.2} distance={7} />
      </group>

      {/* ROOM 5: SPA BATHROOM */}
      <group
        onClick={(e) => {
          e.stopPropagation();
          const r = NAVIGATOR_ROOMS.find((item) => item.id === "bathroom");
          if (r) onSelectRoom(r);
        }}
      >
        {/* Frosted Screen */}
        <mesh position={[6.2, 6.6, -3.2]} material={materials.glass}>
          <boxGeometry args={[0.08, 2.8, 5.0]} />
        </mesh>
        {/* Soaking Tub */}
        <mesh position={[7.8, 5.55, -3.8]} castShadow material={materials.ceramic} scale={[1.4, 1.0, 0.9]}>
          <cylinderGeometry args={[0.7, 0.55, 0.65, 24]} />
        </mesh>
        {/* Vanity */}
        <mesh position={[8.2, 5.9, -1.6]} castShadow material={materials.darkMarble}>
          <boxGeometry args={[2.4, 0.35, 0.7]} />
        </mesh>
        {/* Toilet alcove */}
        <mesh position={[9.4, 5.45, -5.2]} castShadow material={materials.ceramic}>
          <boxGeometry args={[0.45, 0.45, 0.65]} />
        </mesh>
      </group>

      {/* ========================================================= */}
      {/* ROOM 6: INFINITY POOL & SUNDECK */}
      {/* ========================================================= */}
      <group
        onClick={(e) => {
          e.stopPropagation();
          const r = NAVIGATOR_ROOMS.find((item) => item.id === "pool");
          if (r) onSelectRoom(r);
        }}
      >
        {/* Pool Basin */}
        <mesh position={[-8.5, 0.1, 1.8]} receiveShadow material={materials.podium}>
          <boxGeometry args={[7.5, 0.8, 14.5]} />
        </mesh>
        {/* Pool Water with animated shimmer */}
        <mesh ref={waterRef} position={[-8.5, 0.45, 1.8]} rotation={[-Math.PI / 2, 0, 0]} material={materials.water}>
          <planeGeometry args={[7.0, 14.0]} />
        </mesh>
        <pointLight position={[-8.5, 0.6, 1.8]} color={0x38bdf8} intensity={2.0} distance={15} />

        {/* Teak Loungers */}
        {[0.8, 3.6].map((lz, idx) => (
          <group key={idx} position={[-4.2, 0.22, lz]}>
            <mesh position={[0, 0, 0]} castShadow material={materials.teak}>
              <boxGeometry args={[0.9, 0.25, 2.4]} />
            </mesh>
            <mesh position={[0, 0.16, 0]} castShadow material={materials.fabric}>
              <boxGeometry args={[0.82, 0.1, 2.3]} />
            </mesh>
          </group>
        ))}
        {/* Sun Parasol Umbrella */}
        <mesh position={[-4.2, 1.3, 4.8]} castShadow material={materials.bronze}>
          <cylinderGeometry args={[0.04, 0.04, 2.6, 8]} />
        </mesh>
        <mesh position={[-4.2, 2.6, 4.8]} castShadow material={materials.fabric}>
          <coneGeometry args={[1.6, 0.5, 16]} />
        </mesh>
      </group>

      {/* Roof Slab */}
      <mesh position={[2.8, 8.2, -0.5]} castShadow material={materials.podium}>
        <boxGeometry args={[19, 0.35, 17]} />
      </mesh>
    </group>
  );
};

// =========================================================================
// INTERACTIVE 3D HOTSPOT MARKERS (R3F + DREI HTML)
// =========================================================================
const HotspotMarker: React.FC<{
  room: NavigatorRoom;
  isActive: boolean;
  onSelect: () => void;
}> = ({ room, isActive, onSelect }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ringRef.current) {
      const s = 1 + Math.sin(clock.getElapsedTime() * 3.5) * 0.15;
      ringRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group position={room.hotspotPos}>
      {/* 3D Pulsing Ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.42, 32]} />
        <meshBasicMaterial
          color={isActive ? "#c5a880" : isHovered ? "#fef08a" : "#ffffff"}
          transparent
          opacity={isActive ? 0.9 : 0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Center glowing core */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setIsHovered(true);
        }}
        onPointerOut={() => setIsHovered(false)}
      >
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color={isActive ? "#c5a880" : isHovered ? "#fef08a" : "#ffffff"}
          emissive={isActive ? "#c5a880" : isHovered ? "#d97706" : "#444444"}
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* 2D HTML Floating Label Badge */}
      <Html position={[0, 0.45, 0]} center distanceFactor={14}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-xl border shadow-2xl transition-all duration-300 transform -translate-y-2 whitespace-nowrap cursor-pointer ${
            isActive
              ? "bg-[#c5a880] text-[#0c0d11] border-[#c5a880] font-semibold scale-110 shadow-[#c5a880]/40"
              : isHovered
              ? "bg-[#181a24] text-white border-[#c5a880] scale-105"
              : "bg-[#0c0d12]/85 text-neutral-200 border-neutral-700/80 hover:border-[#c5a880]"
          }`}
        >
          <span className="text-xs">{room.icon}</span>
          <span className="text-[11px] font-mono uppercase tracking-wider">{room.shortLabel}</span>
          <span
            className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono ${
              isActive ? "bg-black/20 text-[#0c0d11]" : "bg-neutral-800 text-neutral-400"
            }`}
          >
            {room.area}
          </span>
        </button>
      </Html>
    </group>
  );
};

// =========================================================================
// CAMERA CONTROLLER WITH GSAP TRANSITIONS
// =========================================================================
interface CameraControllerProps {
  selectedRoom: NavigatorRoom | null;
  controlsRef: React.RefObject<any>;
}

const GSAPCameraController: React.FC<CameraControllerProps> = ({ selectedRoom, controlsRef }) => {
  const { camera } = useThree();
  const activeTweenRef = useRef<gsap.core.Tween | null>(null);
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 2.5, 0));

  useEffect(() => {
    if (!selectedRoom) return;

    // Target coordinates
    const [tx, ty, tz] = selectedRoom.cameraPos;
    const [lx, ly, lz] = selectedRoom.lookAt;

    // Kill any ongoing tweens
    if (activeTweenRef.current) {
      activeTweenRef.current.kill();
    }

    // Temporary object to smoothly tween lookAt target
    const currentTarget = controlsRef.current
      ? controlsRef.current.target
      : targetLookAt.current;

    const targetObj = {
      cx: camera.position.x,
      cy: camera.position.y,
      cz: camera.position.z,
      lx: currentTarget.x,
      ly: currentTarget.y,
      lz: currentTarget.z
    };

    // Use GSAP for silky smooth camera travel
    activeTweenRef.current = gsap.to(targetObj, {
      cx: tx,
      cy: ty,
      cz: tz,
      lx: lx,
      ly: ly,
      lz: lz,
      duration: 1.85,
      ease: "power2.inOut",
      onUpdate: () => {
        camera.position.set(targetObj.cx, targetObj.cy, targetObj.cz);
        if (controlsRef.current) {
          controlsRef.current.target.set(targetObj.lx, targetObj.ly, targetObj.lz);
          controlsRef.current.update();
        } else {
          camera.lookAt(targetObj.lx, targetObj.ly, targetObj.lz);
        }
      }
    });

    return () => {
      if (activeTweenRef.current) {
        activeTweenRef.current.kill();
      }
    };
  }, [selectedRoom, camera, controlsRef]);

  return null;
};

// =========================================================================
// MAIN EXPORT COMPONENT: CinematicRoomNavigator
// =========================================================================
export interface CinematicRoomNavigatorProps {
  propertyName?: string;
  onBookTour?: (propertyTitle: string, roomName?: string) => void;
  onWhatsApp?: (propertyTitle: string, roomName?: string) => void;
  onClose?: () => void;
  isEmbedded?: boolean;
}

export const CinematicRoomNavigator: React.FC<CinematicRoomNavigatorProps> = ({
  propertyName = "The Oak Residence",
  onBookTour,
  onWhatsApp,
  onClose,
  isEmbedded = false
}) => {
  const [activeRoom, setActiveRoom] = useState<NavigatorRoom>(NAVIGATOR_ROOMS[0]);
  const [isSpecDrawerOpen, setIsSpecDrawerOpen] = useState<boolean>(true);
  const [specTab, setSpecTab] = useState<"highlights" | "materials" | "smart">("highlights");
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true);
  const [isAutoTouring, setIsAutoTouring] = useState<boolean>(false);
  const [tourIndex, setTourIndex] = useState<number>(0);
  const [lightingPreset, setLightingPreset] = useState<"day" | "sunset" | "night">("sunset");
  const [floorFilter, setFloorFilter] = useState<string>("All");

  const controlsRef = useRef<any>(null);

  // Filtered rooms
  const displayRooms = useMemo(() => {
    if (floorFilter === "All") return NAVIGATOR_ROOMS;
    return NAVIGATOR_ROOMS.filter((r) => r.floor.includes(floorFilter));
  }, [floorFilter]);

  // Handle Room Selection with audio chime
  const handleSelectRoom = useCallback((room: NavigatorRoom, openDrawer: boolean = true) => {
    setActiveRoom(room);
    if (openDrawer) setIsSpecDrawerOpen(true);
    if (!isAudioMuted) {
      ambientAudio.playRoomChime(room.category);
    }
  }, [isAudioMuted]);

  // Audio mute toggle
  const toggleAudio = () => {
    const next = !isAudioMuted;
    setIsAudioMuted(next);
    ambientAudio.setMuted(next);
  };

  // Automated Tour Loop with GSAP transitions
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAutoTouring) {
      timer = setInterval(() => {
        setTourIndex((prev) => {
          const next = (prev + 1) % NAVIGATOR_ROOMS.length;
          handleSelectRoom(NAVIGATOR_ROOMS[next], true);
          return next;
        });
      }, 5500);
    }
    return () => clearInterval(timer);
  }, [isAutoTouring, handleSelectRoom]);

  // Lighting configurations
  const lightingConfigs = useMemo(() => {
    switch (lightingPreset) {
      case "day":
        return {
          sky: "#0c131f",
          ambient: "#ffffff",
          ambientIntensity: 1.1,
          sun: "#fef3c7",
          sunIntensity: 2.2,
          sunPos: [20, 35, 20] as [number, number, number]
        };
      case "night":
        return {
          sky: "#050608",
          ambient: "#1e293b",
          ambientIntensity: 0.6,
          sun: "#38bdf8",
          sunIntensity: 0.8,
          sunPos: [10, 25, -15] as [number, number, number]
        };
      case "sunset":
      default:
        return {
          sky: "#0a0c12",
          ambient: "#fde68a",
          ambientIntensity: 0.9,
          sun: "#fb923c",
          sunIntensity: 2.0,
          sunPos: [25, 18, 15] as [number, number, number]
        };
    }
  }, [lightingPreset]);

  return (
    <div
      className={`relative w-full ${
        isEmbedded ? "h-[640px] md:h-[740px]" : "h-screen"
      } bg-[#07080b] overflow-hidden select-none border border-neutral-800/80 rounded-2xl shadow-2xl font-sans`}
    >
      {/* 3D WebGL Canvas via React Three Fiber */}
      <Canvas
        shadows
        camera={{ position: [15, 9, 17], fov: 42, near: 0.1, far: 1000 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        {/* Sky / Scene Color */}
        <color attach="background" args={[lightingConfigs.sky]} />
        <fog attach="fog" args={[lightingConfigs.sky, 10, 60]} />

        {/* Dynamic Lights */}
        <ambientLight color={lightingConfigs.ambient} intensity={lightingConfigs.ambientIntensity} />
        <directionalLight
          position={lightingConfigs.sunPos}
          color={lightingConfigs.sun}
          intensity={lightingConfigs.sunIntensity}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={0.5}
          shadow-camera-far={80}
        />

        {/* Architectural 3D House Model */}
        <ArchitecturalHouse onSelectRoom={handleSelectRoom} activeRoomId={activeRoom.id} />

        {/* Interactive 3D Hotspot Badges with HTML overlays */}
        {NAVIGATOR_ROOMS.map((room) => (
          <HotspotMarker
            key={room.id}
            room={room}
            isActive={activeRoom.id === room.id}
            onSelect={() => handleSelectRoom(room, true)}
          />
        ))}

        {/* Orbit Controls */}
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.06}
          maxPolarAngle={Math.PI / 2 - 0.02}
          minDistance={3.5}
          maxDistance={40}
        />

        {/* GSAP Smooth Camera Coordinator */}
        <GSAPCameraController selectedRoom={activeRoom} controlsRef={controlsRef} />
      </Canvas>

      {/* ========================================================================= */}
      {/* TOP HEADER HUD CONTROLS */}
      {/* ========================================================================= */}
      <div className="absolute top-4 left-4 right-4 flex flex-col md:flex-row md:items-center justify-between gap-3 pointer-events-none z-20">
        {/* Left: Branding & Current Room Quick Status */}
        <div className="pointer-events-auto flex items-center gap-2 bg-[#0c0d12]/90 backdrop-blur-xl p-2 rounded-2xl border border-neutral-800 shadow-xl">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#161822] rounded-xl text-[#c5a880] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>R3F 3D Navigator</span>
          </div>

          <div className="h-4 w-px bg-neutral-800 hidden sm:block" />

          <div className="flex items-center gap-2 px-2 text-xs">
            <span className="text-white font-serif">{propertyName}</span>
            <span className="text-neutral-500">·</span>
            <span className="text-[#c5a880] font-mono text-[11px]">{activeRoom.name}</span>
          </div>
        </div>

        {/* Right: Lighting Moods, Auto Flythrough & Ambient Audio */}
        <div className="pointer-events-auto flex items-center gap-2 bg-[#0c0d12]/90 backdrop-blur-xl p-1.5 rounded-2xl border border-neutral-800 shadow-xl self-end md:self-auto">
          {/* Lighting Mode Selector */}
          <div className="flex items-center bg-[#151722] p-0.5 rounded-xl border border-neutral-800 text-xs">
            <button
              onClick={() => setLightingPreset("day")}
              className={`p-1.5 rounded-lg transition-colors ${
                lightingPreset === "day" ? "bg-[#c5a880] text-[#0c0d11]" : "text-neutral-400 hover:text-white"
              }`}
              title="Daylight Architecture"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLightingPreset("sunset")}
              className={`p-1.5 rounded-lg transition-colors ${
                lightingPreset === "sunset" ? "bg-[#c5a880] text-[#0c0d11]" : "text-neutral-400 hover:text-white"
              }`}
              title="Golden Hour Twilight"
            >
              <Sunset className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLightingPreset("night")}
              className={`p-1.5 rounded-lg transition-colors ${
                lightingPreset === "night" ? "bg-[#c5a880] text-[#0c0d11]" : "text-neutral-400 hover:text-white"
              }`}
              title="Nocturnal Illumination"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* GSAP Auto Tour Walkthrough Button */}
          <button
            onClick={() => setIsAutoTouring(!isAutoTouring)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isAutoTouring
                ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30 animate-pulse"
                : "bg-[#181b24] text-[#c5a880] hover:bg-[#202430] border border-[#c5a880]/40"
            }`}
            title="Automated GSAP Guided Tour"
          >
            {isAutoTouring ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isAutoTouring ? "Pause Flythrough" : "Auto Tour"}</span>
          </button>

          {/* Ambient Soundscape */}
          <button
            onClick={toggleAudio}
            className={`p-2 rounded-xl transition-colors ${
              !isAudioMuted ? "bg-[#c5a880]/20 text-[#c5a880]" : "text-neutral-400 hover:text-white"
            }`}
            title={isAudioMuted ? "Enable Ambient Room Chimes" : "Mute Sound"}
          >
            {!isAudioMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Reset Bird's Eye View */}
          <button
            onClick={() => {
              const living = NAVIGATOR_ROOMS[0];
              handleSelectRoom(living, false);
            }}
            className="p-2 text-neutral-400 hover:text-white rounded-xl transition-colors"
            title="Reset Aerial Perspective"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white rounded-xl transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* INTERACTIVE PROPERTY SPECIFICATIONS DRAWER (REVEALED ON HOTSPOT CLICK) */}
      {/* ========================================================================= */}
      {isSpecDrawerOpen && activeRoom && (
        <div className="absolute top-16 right-4 bottom-24 w-full max-w-sm md:max-w-md bg-[#0c0d12]/95 backdrop-blur-2xl border border-neutral-800/90 rounded-2xl shadow-2xl p-6 text-white z-30 flex flex-col justify-between animate-fadeIn overflow-y-auto">
          <div>
            {/* Top drawer header */}
            <div className="flex items-start justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#161822] border border-neutral-700/80 flex items-center justify-center text-xl shadow-inner">
                  {activeRoom.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-widest text-[#c5a880] font-semibold">
                      {activeRoom.floor}
                    </span>
                    <span className="text-neutral-600">·</span>
                    <span className="text-[10px] text-neutral-400 font-mono">{activeRoom.orientation}</span>
                  </div>
                  <h3 className="font-serif text-xl text-white font-normal leading-tight">
                    {activeRoom.name}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setIsSpecDrawerOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors"
                title="Minimize Specifications"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Room Architecture Metrics Strip */}
            <div className="grid grid-cols-2 gap-2 my-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#141620] border border-neutral-800">
                <span className="text-neutral-400 text-[10px] uppercase tracking-wider block mb-0.5">Carpet Area</span>
                <span className="text-white font-semibold text-sm">{activeRoom.area}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#141620] border border-neutral-800">
                <span className="text-neutral-400 text-[10px] uppercase tracking-wider block mb-0.5">Clearance</span>
                <span className="text-[#c5a880] font-semibold text-xs truncate block">{activeRoom.ceilingHeight}</span>
              </div>
            </div>

            {/* Architectural Tagline Quote */}
            <p className="italic text-[#c5a880] font-serif text-xs leading-relaxed mb-3 bg-[#c5a880]/5 p-3 rounded-xl border border-[#c5a880]/20">
              &ldquo;{activeRoom.tagline}&rdquo;
            </p>

            {/* Specifications Category Tabs */}
            <div className="flex items-center gap-2 border-b border-neutral-800 mb-4 text-xs">
              {(["highlights", "materials", "smart"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSpecTab(tab)}
                  className={`pb-2 capitalize font-medium transition-colors relative ${
                    specTab === tab ? "text-[#c5a880]" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {tab === "highlights" ? "Key Specs" : tab === "materials" ? "Materials" : "Automations"}
                  {specTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c5a880]" />}
                </button>
              ))}
            </div>

            {/* Tab 1: Key Specifications */}
            {specTab === "highlights" && (
              <div className="space-y-3 text-xs leading-relaxed text-neutral-300">
                <p className="font-light leading-relaxed">{activeRoom.description}</p>
                <div className="pt-2">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-2 font-semibold font-mono">
                    Architectural Inclusions
                  </span>
                  <ul className="space-y-2">
                    {activeRoom.keySpecifications.map((spec, i) => (
                      <li key={i} className="flex items-start gap-2 text-neutral-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#c5a880] mt-0.5 flex-shrink-0" />
                        <span className="font-light">{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Tab 2: Materials */}
            {specTab === "materials" && (
              <div className="space-y-2 text-xs">
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-2 font-semibold font-mono">
                  Master Finishes & Sourcing
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {activeRoom.architecturalMaterials.map((mat, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-[#141620] border border-neutral-800/80 flex items-center justify-between">
                      <span className="text-white font-medium">{mat}</span>
                      <span className="text-[10px] text-[#c5a880] uppercase tracking-wider font-mono">Certified Grade A</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 rounded-xl bg-[#141620] border border-neutral-800/80 text-xs">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1 font-mono">
                    Lighting Atmosphere
                  </span>
                  <p className="text-[#c5a880] font-light">{activeRoom.lightingMood}</p>
                </div>
              </div>
            )}

            {/* Tab 3: Smart Automations */}
            {specTab === "smart" && (
              <div className="space-y-2 text-xs">
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-2 font-semibold font-mono">
                  Integrated Home Robotics & HVAC
                </span>
                <div className="space-y-2">
                  {activeRoom.smartFeatures.map((feat, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-[#141620] border border-neutral-800 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#c5a880] flex-shrink-0" />
                      <span className="text-neutral-200">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action CTAs */}
          <div className="pt-4 mt-4 border-t border-neutral-800 space-y-2">
            <button
              onClick={() => onBookTour?.(propertyName, activeRoom.name)}
              className="w-full py-3 rounded-xl bg-[#c5a880] hover:bg-[#d6bc96] text-[#0c0d11] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#c5a880]/20"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Private Walkthrough</span>
            </button>

            <button
              onClick={() => onWhatsApp?.(propertyName, activeRoom.name)}
              className="w-full py-2.5 rounded-xl bg-[#151722] hover:bg-[#1f2230] text-neutral-300 hover:text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors border border-neutral-800"
            >
              <span>Inquire Specifications on WhatsApp</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#c5a880]" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button when drawer is minimized */}
      {!isSpecDrawerOpen && (
        <button
          onClick={() => setIsSpecDrawerOpen(true)}
          className="absolute top-20 right-4 z-20 px-3.5 py-2 rounded-xl bg-[#0c0d12]/90 backdrop-blur-xl border border-neutral-800 text-[#c5a880] text-xs font-medium flex items-center gap-2 shadow-2xl hover:border-[#c5a880] transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Show Room Specs</span>
        </button>
      )}

      {/* ========================================================================= */}
      {/* BOTTOM ROOM NAVIGATION DOCK */}
      {/* ========================================================================= */}
      <div className="absolute bottom-5 left-4 right-4 z-20 flex flex-col items-center gap-2 pointer-events-none">
        {/* Floor Filter Badges */}
        <div className="pointer-events-auto flex items-center gap-1 bg-[#0c0d12]/85 backdrop-blur-md px-2 py-1 rounded-full border border-neutral-800 text-[10px] font-mono">
          {["All", "Ground", "Upper", "Deck"].map((f) => (
            <button
              key={f}
              onClick={() => setFloorFilter(f)}
              className={`px-2.5 py-0.5 rounded-full transition-colors ${
                floorFilter === f ? "bg-[#c5a880] text-[#0c0d11] font-semibold" : "text-neutral-400 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Room Navigation Pill Dock */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-[#0c0d12]/92 backdrop-blur-xl p-1.5 rounded-full border border-neutral-800 shadow-2xl max-w-full overflow-x-auto scrollbar-none">
          {displayRooms.map((room) => {
            const isActive = activeRoom.id === room.id;
            return (
              <button
                key={room.id}
                onClick={() => handleSelectRoom(room, true)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide whitespace-nowrap flex items-center gap-1.5 transition-all duration-300 ${
                  isActive
                    ? "bg-[#c5a880] text-[#0c0d11] font-semibold shadow-lg shadow-[#c5a880]/25 scale-105"
                    : "text-neutral-300 hover:text-white hover:bg-neutral-800/60"
                }`}
              >
                <span>{room.icon}</span>
                <span>{room.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Interaction Hint */}
        <p className="text-[10px] text-neutral-400 font-mono tracking-wider hidden sm:block">
          ✦ Click any 3D hotspot or room pill to glide smoothly using GSAP · Drag to orbit · Scroll to zoom
        </p>
      </div>
    </div>
  );
};
