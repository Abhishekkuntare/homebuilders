import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import {
  HOMES_3D_DATA,
  Home3DModelData,
  Room3DConfig
} from "../data/property3DModels";
import { ambientAudio } from "../utils/ambientAudio";
import {
  Maximize2,
  Minimize2,
  RotateCcw,
  Play,
  Pause,
  Compass,
  Layers,
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
  Info,
  Footprints,
  SlidersHorizontal
} from "lucide-react";

interface ThreePropertyViewerProps {
  propertyName?: string;
  onBookTour?: (propertyTitle: string, roomName?: string) => void;
  onClose?: () => void;
  isEmbedded?: boolean;
}

export const ThreePropertyViewer: React.FC<ThreePropertyViewerProps> = ({
  propertyName = "The Oak Residence",
  onBookTour,
  isEmbedded = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Active home selection
  const [selectedHomeIndex, setSelectedHomeIndex] = useState<number>(0);
  const currentHome: Home3DModelData = HOMES_3D_DATA[selectedHomeIndex] || HOMES_3D_DATA[0];

  // Active room state
  const [activeRoomId, setActiveRoomId] = useState<string>("exterior");
  const [selectedRoom, setSelectedRoom] = useState<Room3DConfig>(currentHome.rooms[0]);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState<boolean>(false);

  // View & Tour modes
  const [isCinematicVideoMode, setIsCinematicVideoMode] = useState<boolean>(false);
  const [videoStageIndex, setVideoStageIndex] = useState<number>(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [videoSpeed, setVideoSpeed] = useState<number>(1);
  const [videoProgress, setVideoProgress] = useState<number>(0);

  // Settings & Toggles
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true);
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"overview" | "specs" | "materials">("overview");

  // Screen projected coordinates for 2D UI hotspots
  const [hotspotScreenPositions, setHotspotScreenPositions] = useState<{ [roomId: string]: { x: number; y: number; visible: boolean } }>({});

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(15, 9, 17));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 2.5, 0));
  const currentLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 2.5, 0));
  const sceneGroupRef = useRef<THREE.Group | null>(null);
  const interactiveMeshesRef = useRef<Map<THREE.Mesh, string>>(new Map());
  const fireplaceLightRef = useRef<THREE.PointLight | null>(null);
  const waterMeshRef = useRef<THREE.Mesh | null>(null);

  // Switch home and update active room
  const handleSelectHome = (index: number) => {
    setSelectedHomeIndex(index);
    const newHome = HOMES_3D_DATA[index];
    if (newHome) {
      const extRoom = newHome.rooms[0];
      setActiveRoomId(extRoom.id);
      setSelectedRoom(extRoom);
      targetCamPos.current.set(...extRoom.cameraPos);
      targetLookAt.current.set(...extRoom.lookAt);
      setIsRoomModalOpen(false);
      setIsCinematicVideoMode(false);
      setIsVideoPlaying(false);
    }
  };

  // Fly inside a specific room
  const goToRoom = useCallback((room: Room3DConfig, openModal: boolean = true) => {
    setActiveRoomId(room.id);
    setSelectedRoom(room);
    targetCamPos.current.set(...room.cameraPos);
    targetLookAt.current.set(...room.lookAt);
    setIsRotating(false); // Stop rotation so user can inspect room

    if (openModal) {
      setIsRoomModalOpen(true);
    }

    // Play subtle acoustic chime if audio enabled
    if (!isAudioMuted) {
      ambientAudio.playRoomChime(room.category);
    }
  }, [isAudioMuted]);

  // Audio mute toggle
  const toggleAudio = () => {
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    ambientAudio.setMuted(nextMuted);
  };

  // Build the complete 3D procedural architecture
  const buildHomeScene = useCallback((scene: THREE.Scene, home: Home3DModelData) => {
    // Clear previous models
    if (sceneGroupRef.current) {
      scene.remove(sceneGroupRef.current);
      sceneGroupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    }

    interactiveMeshesRef.current.clear();
    const group = new THREE.Group();
    sceneGroupRef.current = group;

    // Background and Fog
    scene.background = new THREE.Color(home.skyColor);
    scene.fog = new THREE.FogExp2(home.skyColor, 0.018);

    // Dynamic Materials based on home
    const travertineMat = new THREE.MeshStandardMaterial({
      color: home.environmentType === "penthouse" ? 0xededed : home.environmentType === "coastal" ? 0xe7dfd5 : 0xded6c9,
      roughness: 0.35,
      metalness: 0.05
    });

    const concreteMat = new THREE.MeshStandardMaterial({
      color: home.environmentType === "penthouse" ? 0x1f2128 : 0x24272f,
      roughness: 0.85,
      metalness: 0.15
    });

    const teakMat = new THREE.MeshStandardMaterial({
      color: home.environmentType === "coastal" ? 0x9a5a22 : 0x784212,
      roughness: 0.55,
      metalness: 0.1
    });

    const bronzeMat = new THREE.MeshStandardMaterial({
      color: home.environmentType === "penthouse" ? 0x38bdf8 : home.environmentType === "coastal" ? 0xd97706 : 0xc5a880,
      roughness: 0.25,
      metalness: 0.85
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.22,
      roughness: 0.08,
      metalness: 0.1,
      transmission: 0.9,
      ior: 1.52
    });

    const waterMat = new THREE.MeshStandardMaterial({
      color: home.environmentType === "coastal" ? 0x06b6d4 : 0x0284c7,
      roughness: 0.15,
      metalness: 0.65,
      transparent: true,
      opacity: 0.85
    });

    const grassMat = new THREE.MeshStandardMaterial({
      color: home.environmentType === "coastal" ? 0x4d7c0f : 0x2d5a27,
      roughness: 0.9,
      metalness: 0.05
    });

    const feltMat = new THREE.MeshStandardMaterial({
      color: home.environmentType === "penthouse" ? 0x1d4ed8 : 0x15803d, // Electric blue for penthouse, tournament green for villa
      roughness: 0.8,
      metalness: 0.05
    });

    const darkMarbleMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.2,
      metalness: 0.2
    });

    const fabricMat = new THREE.MeshStandardMaterial({
      color: 0xd6d3d1,
      roughness: 0.85,
      metalness: 0.05
    });

    const ceramicWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.2,
      metalness: 0.1
    });

    // Helper to register interactive mesh
    const registerMesh = (mesh: THREE.Mesh, roomId: string) => {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      interactiveMeshesRef.current.set(mesh, roomId);
      group.add(mesh);
    };

    // ==========================================
    // 1. GROUND PODIUM & FOUNDATION
    // ==========================================
    const podiumGeo = new THREE.BoxGeometry(34, 0.6, 30);
    const podium = new THREE.Mesh(podiumGeo, concreteMat);
    podium.position.y = -0.3;
    registerMesh(podium, "exterior");

    // ==========================================
    // 2. ZEN COURTYARD & GARDEN
    // ==========================================
    const gardenLawnGeo = new THREE.BoxGeometry(11, 0.15, 12);
    const gardenLawn = new THREE.Mesh(gardenLawnGeo, grassMat);
    gardenLawn.position.set(-8.5, 0.08, 7.5);
    registerMesh(gardenLawn, "garden");

    // Sculptural Zen Trees
    const createTree = (x: number, z: number, scale: number = 1) => {
      const trunkGeo = new THREE.CylinderGeometry(0.12 * scale, 0.2 * scale, 2.2 * scale, 8);
      const trunk = new THREE.Mesh(trunkGeo, teakMat);
      trunk.position.set(x, 1.1 * scale, z);
      registerMesh(trunk, "garden");

      const foliageGeo = new THREE.SphereGeometry(1.0 * scale, 8, 8);
      const foliage = new THREE.Mesh(foliageGeo, grassMat);
      foliage.position.set(x, 2.4 * scale, z);
      foliage.scale.set(1.2, 0.8, 1.2);
      registerMesh(foliage, "garden");
    };

    createTree(-11, 10, 1.1);
    createTree(-7, 11, 0.9);
    createTree(-12, 5, 0.8);

    // Stepping stones
    for (let s = 0; s < 5; s++) {
      const stepStone = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.08, 12), travertineMat);
      stepStone.position.set(-8.5 + s * 1.2, 0.16, 5.5 - s * 0.4);
      registerMesh(stepStone, "garden");
    }

    // ==========================================
    // 3. MAIN GROUND FLOOR LIVING SLAB
    // ==========================================
    const livingFloorGeo = new THREE.BoxGeometry(18, 0.2, 16);
    const livingFloor = new THREE.Mesh(livingFloorGeo, travertineMat);
    livingFloor.position.set(2, 0.1, -1);
    registerMesh(livingFloor, "living");

    // Slender Bronze Columns
    const colGeo = new THREE.CylinderGeometry(0.12, 0.12, 5.4, 16);
    const colCoords = [
      [-6, 2.7, -8],
      [-6, 2.7, 6],
      [10, 2.7, -8],
      [10, 2.7, 6],
      [2, 2.7, -8],
      [2, 2.7, 6]
    ];
    colCoords.forEach(([x, y, z]) => {
      const col = new THREE.Mesh(colGeo, bronzeMat);
      col.position.set(x, y, z);
      registerMesh(col, "exterior");
    });

    // Glass Curtain Wall Facade
    const glassFront = new THREE.Mesh(new THREE.BoxGeometry(16, 5.2, 0.08), glassMat);
    glassFront.position.set(2, 2.7, 6);
    registerMesh(glassFront, "exterior");

    const glassSide = new THREE.Mesh(new THREE.BoxGeometry(0.08, 5.2, 14), glassMat);
    glassSide.position.set(-6, 2.7, -1);
    registerMesh(glassSide, "exterior");

    // ==========================================
    // 4. LIVING ROOM (Grand Salon)
    // ==========================================
    // Luxury L-shaped sectional couch
    const sofaMain = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.45, 1.6), fabricMat);
    sofaMain.position.set(1.5, 0.35, 1.2);
    registerMesh(sofaMain, "living");

    const sofaL = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.45, 2.4), fabricMat);
    sofaL.position.set(3.8, 0.35, 1.6);
    registerMesh(sofaL, "living");

    const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.6, 0.35), fabricMat);
    sofaBack.position.set(1.5, 0.75, 0.5);
    registerMesh(sofaBack, "living");

    // Coffee table
    const coffeeTable = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.3, 1.1), bronzeMat);
    coffeeTable.position.set(1.8, 0.25, 2.8);
    registerMesh(coffeeTable, "living");

    // Area Rug
    const rug = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.04, 3.6), travertineMat);
    rug.position.set(2.2, 0.12, 2.0);
    registerMesh(rug, "living");

    // Glowing Linear Fireplace on Feature Wall
    const fireplaceWall = new THREE.Mesh(new THREE.BoxGeometry(4.5, 3.2, 0.4), darkMarbleMat);
    fireplaceWall.position.set(2, 1.7, -7.6);
    registerMesh(fireplaceWall, "living");

    const fireGlow = new THREE.PointLight(0xf97316, 1.8, 8);
    fireGlow.position.set(2, 0.8, -7.3);
    group.add(fireGlow);
    fireplaceLightRef.current = fireGlow;

    // ==========================================
    // 5. KITCHEN (Chef Atelier & Wine Bar)
    // ==========================================
    // Waterfall Marble Kitchen Island
    const islandCounter = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.9, 1.5), darkMarbleMat);
    islandCounter.position.set(-2.5, 0.55, -4.5);
    registerMesh(islandCounter, "kitchen");

    // Induction cooktop detail
    const cooktop = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.02, 0.7), bronzeMat);
    cooktop.position.set(-3.2, 1.01, -4.5);
    registerMesh(cooktop, "kitchen");

    // Pair of Bar Stools
    for (let st = 0; st < 2; st++) {
      const stoolSeat = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.08, 16), fabricMat);
      stoolSeat.position.set(-1.4, 0.65, -4.0 - st * 0.9);
      registerMesh(stoolSeat, "kitchen");

      const stoolLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.65, 8), bronzeMat);
      stoolLeg.position.set(-1.4, 0.32, -4.0 - st * 0.9);
      registerMesh(stoolLeg, "kitchen");
    }

    // Rear Kitchen Cabinet Wall
    const kitchenWall = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.6, 0.6), teakMat);
    kitchenWall.position.set(-2.5, 1.4, -7.5);
    registerMesh(kitchenWall, "kitchen");

    // Triple hanging pendant lights
    for (let p = 0; p < 3; p++) {
      const pendant = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.4, 12), bronzeMat);
      pendant.position.set(-3.3 + p * 0.8, 2.8, -4.5);
      registerMesh(pendant, "kitchen");
    }

    // ==========================================
    // 6. GAMES ROOM (Billiards & Private Lounge)
    // ==========================================
    // Regulation Billiards Table
    const poolTableFrame = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.55, 2.0), teakMat);
    poolTableFrame.position.set(5.5, 0.65, -4.5);
    registerMesh(poolTableFrame, "games");

    const poolCloth = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.05, 1.6), feltMat);
    poolCloth.position.set(5.5, 0.95, -4.5);
    registerMesh(poolCloth, "games");

    // Billiard Table overhead lamp fixture
    const poolLamp = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.15, 0.6), bronzeMat);
    poolLamp.position.set(5.5, 2.7, -4.5);
    registerMesh(poolLamp, "games");

    const poolSpot = new THREE.PointLight(0xfef08a, 1.5, 6);
    poolSpot.position.set(5.5, 2.4, -4.5);
    group.add(poolSpot);

    // Billiards Cues on wall
    const cueRack = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.8, 0.8), teakMat);
    cueRack.position.set(8.5, 1.8, -4.5);
    registerMesh(cueRack, "games");

    // Cocktail high-top table in games lounge
    const gamesCocktailTable = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.06, 16), bronzeMat);
    gamesCocktailTable.position.set(7.5, 0.95, -1.8);
    registerMesh(gamesCocktailTable, "games");

    const gamesCocktailStem = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.95, 8), bronzeMat);
    gamesCocktailStem.position.set(7.5, 0.48, -1.8);
    registerMesh(gamesCocktailStem, "games");

    // ==========================================
    // 7. UPPER LEVEL SLAB & BEDROOM + BATHROOM
    // ==========================================
    const upperFloorGeo = new THREE.BoxGeometry(14, 0.25, 14);
    const upperFloor = new THREE.Mesh(upperFloorGeo, travertineMat);
    upperFloor.position.set(4, 5.2, -1);
    registerMesh(upperFloor, "bedroom");

    // Upper level glass railing
    const upperRailing = new THREE.Mesh(new THREE.BoxGeometry(13.8, 1.1, 0.06), glassMat);
    upperRailing.position.set(4, 5.8, 5.8);
    registerMesh(upperRailing, "bedroom");

    // --- Master Bedroom ---
    // King platform bed
    const bedPlatform = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.35, 2.8), teakMat);
    bedPlatform.position.set(4.2, 5.4, 0.5);
    registerMesh(bedPlatform, "bedroom");

    const mattress = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.4, 2.6), fabricMat);
    mattress.position.set(4.2, 5.75, 0.5);
    registerMesh(mattress, "bedroom");

    const headboard = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.2, 0.2), fabricMat);
    headboard.position.set(4.2, 6.2, -0.8);
    registerMesh(headboard, "bedroom");

    // Nightstands & lamps
    [-1.5, 1.5].forEach((offset) => {
      const nightstand = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.45, 0.5), teakMat);
      nightstand.position.set(4.2 + offset, 5.45, -0.6);
      registerMesh(nightstand, "bedroom");

      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), bronzeMat);
      lamp.position.set(4.2 + offset, 5.85, -0.6);
      registerMesh(lamp, "bedroom");
    });

    const bedroomAccentLight = new THREE.PointLight(0xfef3c7, 1.2, 7);
    bedroomAccentLight.position.set(4.2, 6.8, 0.5);
    group.add(bedroomAccentLight);

    // --- Bathroom & Toilet Suite ---
    // Dividing frosted glass screen between bedroom and bath
    const bathScreen = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.8, 5.0), glassMat);
    bathScreen.position.set(6.2, 6.6, -3.5);
    registerMesh(bathScreen, "bathroom");

    // Freestanding Oval Soaking Tub
    const tubGeo = new THREE.CylinderGeometry(0.7, 0.55, 0.65, 24);
    const tub = new THREE.Mesh(tubGeo, ceramicWhiteMat);
    tub.scale.set(1.4, 1.0, 0.9);
    tub.position.set(7.8, 5.55, -4.0);
    registerMesh(tub, "bathroom");

    // Floor standing chrome gooseneck faucet
    const faucet = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.85, 8), bronzeMat);
    faucet.position.set(7.8, 5.8, -4.9);
    registerMesh(faucet, "bathroom");

    // Double floating marble vanity
    const vanity = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.35, 0.7), darkMarbleMat);
    vanity.position.set(8.2, 5.9, -1.8);
    registerMesh(vanity, "bathroom");

    // Modern wall-hung toilet alcove
    const toiletBase = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 0.65), ceramicWhiteMat);
    toiletBase.position.set(9.5, 5.45, -5.5);
    registerMesh(toiletBase, "bathroom");

    // Glass shower partition
    const showerGlass = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.6, 0.06), glassMat);
    showerGlass.position.set(9.2, 6.5, -3.5);
    registerMesh(showerGlass, "bathroom");

    // ==========================================
    // 8. INFINITY POOL & SUNDECK
    // ==========================================
    const poolBasinGeo = new THREE.BoxGeometry(7.5, 0.8, 14.5);
    const poolBasin = new THREE.Mesh(poolBasinGeo, concreteMat);
    poolBasin.position.set(-8.5, 0.1, 1.5);
    registerMesh(poolBasin, "pool");

    const poolWaterGeo = new THREE.PlaneGeometry(7.0, 14.0);
    const poolWater = new THREE.Mesh(poolWaterGeo, waterMat);
    poolWater.rotation.x = -Math.PI / 2;
    poolWater.position.set(-8.5, 0.45, 1.5);
    registerMesh(poolWater, "pool");
    waterMeshRef.current = poolWater;

    // Glowing underwater pool light
    const poolUnderwaterLight = new THREE.PointLight(0x38bdf8, 2.0, 15);
    poolUnderwaterLight.position.set(-8.5, 0.6, 1.5);
    group.add(poolUnderwaterLight);

    // Teak Sun Loungers by the pool
    for (let l = 0; l < 2; l++) {
      const lounger = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.25, 2.4), teakMat);
      lounger.position.set(-4.2, 0.22, 1.0 + l * 2.8);
      registerMesh(lounger, "pool");

      const loungerCushion = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.1, 2.3), fabricMat);
      loungerCushion.position.set(-4.2, 0.38, 1.0 + l * 2.8);
      registerMesh(loungerCushion, "pool");
    }

    // Sun Umbrella / Parasol
    const umbrellaPole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.6, 8), bronzeMat);
    umbrellaPole.position.set(-4.2, 1.3, 4.0);
    registerMesh(umbrellaPole, "pool");

    const umbrellaCanopy = new THREE.Mesh(new THREE.ConeGeometry(1.6, 0.5, 16), fabricMat);
    umbrellaCanopy.position.set(-4.2, 2.6, 4.0);
    registerMesh(umbrellaCanopy, "pool");

    // ==========================================
    // 9. CANTILEVERED ROOF SLAB
    // ==========================================
    const roofGeo = new THREE.BoxGeometry(19, 0.35, 17);
    const roof = new THREE.Mesh(roofGeo, concreteMat);
    roof.position.set(3, 8.2, -0.5);
    registerMesh(roof, "exterior");

    scene.add(group);
  }, []);

  // Main Three.js Initialization
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    camera.position.set(15, 9, 17);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Global Lighting
    const ambientLight = new THREE.AmbientLight(currentHome.ambientColor, 0.95);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(currentHome.sunColor, 2.0);
    sunLight.position.set(24, 38, 22);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 80;
    scene.add(sunLight);

    // Build the initial home geometry
    buildHomeScene(scene, currentHome);

    // Interaction Variables (Drag Orbit, Wheel Zoom, Raycaster)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let spherical = new THREE.Spherical().setFromVector3(camera.position);
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Mouse events
    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      spherical.theta -= deltaX * 0.0055;
      spherical.phi = Math.max(0.15, Math.min(Math.PI / 2 - 0.03, spherical.phi - deltaY * 0.0055));

      targetCamPos.current.setFromSpherical(spherical).add(targetLookAt.current);
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = (e: MouseEvent) => {
      isDragging = false;
    };

    // Click in 3D to identify room
    const onClick = (e: MouseEvent) => {
      if (!container || isDragging) return;
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const interactiveList: THREE.Object3D[] = Array.from(interactiveMeshesRef.current.keys());
      const intersects = raycaster.intersectObjects(interactiveList, false);

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object as THREE.Mesh;
        const matchedRoomId = interactiveMeshesRef.current.get(hitMesh);
        if (matchedRoomId) {
          const roomObj = currentHome.rooms.find((r) => r.id === matchedRoomId);
          if (roomObj) {
            goToRoom(roomObj, true);
          }
        }
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY * 0.012;
      spherical.radius = Math.max(3.5, Math.min(36, spherical.radius + zoomFactor));
      targetCamPos.current.setFromSpherical(spherical).add(targetLookAt.current);
    };

    // Mobile touch
    let touchStart = { x: 0, y: 0 };
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - touchStart.x;
      const deltaY = e.touches[0].clientY - touchStart.y;
      spherical.theta -= deltaX * 0.007;
      spherical.phi = Math.max(0.15, Math.min(Math.PI / 2 - 0.03, spherical.phi - deltaY * 0.007));
      targetCamPos.current.setFromSpherical(spherical).add(targetLookAt.current);
      touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    dom.addEventListener("click", onClick);
    dom.addEventListener("wheel", onWheel, { passive: false });
    dom.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);

    // Animation Loop with smooth LERP
    let animId: number;
    const clock = new THREE.Clock();
    const tempVec = new THREE.Vector3();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Gentle auto rotation when enabled & not dragged
      if (isRotating && !isDragging && !isCinematicVideoMode) {
        spherical.theta += delta * 0.07;
        targetCamPos.current.setFromSpherical(spherical).add(targetLookAt.current);
      }

      // Smooth camera position & lookAt lerping
      camera.position.lerp(targetCamPos.current, 0.055);
      currentLookAt.current.lerp(targetLookAt.current, 0.055);
      camera.lookAt(currentLookAt.current);

      // Flickering cozy fireplace glow
      if (fireplaceLightRef.current) {
        fireplaceLightRef.current.intensity = 1.6 + Math.sin(time * 6.5) * 0.35 + Math.cos(time * 11) * 0.15;
      }

      // Shimmering animated pool water
      if (waterMeshRef.current) {
        waterMeshRef.current.position.y = 0.45 + Math.sin(time * 1.8) * 0.015;
      }

      // Calculate 2D Screen coordinates for 3D hotspots
      if (container) {
        const widthHalf = container.clientWidth / 2;
        const heightHalf = container.clientHeight / 2;
        const updatedPositions: { [roomId: string]: { x: number; y: number; visible: boolean } } = {};

        currentHome.rooms.forEach((room) => {
          tempVec.set(...room.hotspotPos);
          tempVec.project(camera);

          // In front of camera check
          const isVisible = tempVec.z < 1;
          const sx = tempVec.x * widthHalf + widthHalf;
          const sy = -(tempVec.y * heightHalf) + heightHalf;

          updatedPositions[room.id] = {
            x: sx,
            y: sy,
            visible: isVisible && sx >= -50 && sx <= container.clientWidth + 50 && sy >= -50 && sy <= container.clientHeight + 50
          };
        });

        setHotspotScreenPositions(updatedPositions);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize handling
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      dom.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      dom.removeEventListener("click", onClick);
      dom.removeEventListener("wheel", onWheel);
      dom.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      renderer.dispose();
    };
  }, [buildHomeScene, currentHome, goToRoom, isCinematicVideoMode, isRotating]);

  // Rebuild scene when selected home changes
  useEffect(() => {
    if (sceneRef.current) {
      buildHomeScene(sceneRef.current, currentHome);
    }
  }, [buildHomeScene, currentHome]);

  // Toggle wireframe mode
  const toggleWireframe = () => {
    setIsWireframe((prev) => {
      const next = !prev;
      if (sceneGroupRef.current) {
        sceneGroupRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => (m.wireframe = next));
            } else {
              child.material.wireframe = next;
            }
          }
        });
      }
      return next;
    });
  };

  // ==========================================
  // CINEMATIC 3D VIDEO FLYTHROUGH LOGIC
  // ==========================================
  const startCinematicVideo = () => {
    setIsCinematicVideoMode(true);
    setIsVideoPlaying(true);
    setVideoStageIndex(0);
    const firstRoom = currentHome.rooms[0];
    goToRoom(firstRoom, false);
  };

  const stopCinematicVideo = () => {
    setIsCinematicVideoMode(false);
    setIsVideoPlaying(false);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCinematicVideoMode && isVideoPlaying) {
      const duration = 5000 / videoSpeed;
      timer = setInterval(() => {
        setVideoStageIndex((prev) => {
          const next = (prev + 1) % currentHome.rooms.length;
          const nextRoom = currentHome.rooms[next];
          goToRoom(nextRoom, false);
          return next;
        });
      }, duration);
    }
    return () => clearInterval(timer);
  }, [isCinematicVideoMode, isVideoPlaying, videoSpeed, currentHome.rooms, goToRoom]);

  // Update video progress percent
  useEffect(() => {
    if (isCinematicVideoMode) {
      const pct = ((videoStageIndex + 1) / currentHome.rooms.length) * 100;
      setVideoProgress(pct);
    }
  }, [videoStageIndex, isCinematicVideoMode, currentHome.rooms.length]);

  return (
    <div
      className={`relative w-full ${
        isEmbedded ? "h-[620px] md:h-[720px]" : "h-screen"
      } bg-[#0a0b0e] overflow-hidden select-none border border-neutral-800/80 rounded-2xl shadow-2xl group/viewer`}
    >
      {/* 3D WebGL Canvas */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* ========================================================================= */}
      {/* 1. TOP HEADER HUD: PROPERTY SELECTOR & CONTROLS */}
      {/* ========================================================================= */}
      <div className="absolute top-4 left-4 right-4 flex flex-col md:flex-row md:items-center justify-between gap-3 pointer-events-none z-20">
        
        {/* Left: Multi-Home Switcher */}
        <div className="pointer-events-auto flex items-center gap-2 bg-[#0f1117]/90 backdrop-blur-xl p-1.5 rounded-2xl border border-neutral-800 shadow-xl max-w-full overflow-x-auto">
          <div className="flex items-center gap-1 px-2.5 py-1 text-[#c5a880] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Estate:</span>
          </div>

          {HOMES_3D_DATA.map((home, idx) => (
            <button
              key={home.id}
              onClick={() => handleSelectHome(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                selectedHomeIndex === idx
                  ? "bg-[#c5a880] text-[#0c0d11] font-semibold shadow-md shadow-[#c5a880]/20 scale-105"
                  : "text-neutral-300 hover:text-white hover:bg-neutral-800/60"
              }`}
            >
              {home.title}
            </button>
          ))}
        </div>

        {/* Right: Camera Tools, Flythrough & Sound Controls */}
        <div className="pointer-events-auto flex items-center gap-2 bg-[#0f1117]/90 backdrop-blur-xl p-1.5 rounded-2xl border border-neutral-800 shadow-xl self-end md:self-auto">
          {/* Start/Stop 3D Cinematic Flythrough Video */}
          <button
            onClick={isCinematicVideoMode ? stopCinematicVideo : startCinematicVideo}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isCinematicVideoMode
                ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30 animate-pulse"
                : "bg-[#181b24] text-[#c5a880] hover:bg-[#202430] border border-[#c5a880]/40"
            }`}
            title="Automated 3D Cinematic Drone Tour"
          >
            <Film className="w-3.5 h-3.5" />
            <span>{isCinematicVideoMode ? "Exit Flythrough" : "3D Video Tour"}</span>
          </button>

          {/* Toggle Hotspots */}
          <button
            onClick={() => setShowHotspots(!showHotspots)}
            className={`p-2 rounded-xl transition-colors ${
              showHotspots ? "bg-[#c5a880]/20 text-[#c5a880]" : "text-neutral-400 hover:text-white"
            }`}
            title={showHotspots ? "Hide 3D Room Pins" : "Show 3D Room Pins"}
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Audio Soundscape Toggle */}
          <button
            onClick={toggleAudio}
            className={`p-2 rounded-xl transition-colors ${
              !isAudioMuted ? "bg-[#c5a880]/20 text-[#c5a880]" : "text-neutral-400 hover:text-white"
            }`}
            title={isAudioMuted ? "Enable Ambient Audio" : "Mute Soundscape"}
          >
            {!isAudioMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Auto Orbit Toggle */}
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`p-2 rounded-xl transition-colors ${
              isRotating ? "bg-[#c5a880]/20 text-[#c5a880]" : "text-neutral-400 hover:text-white"
            }`}
            title={isRotating ? "Pause Orbit" : "Resume Orbit"}
          >
            {isRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Wireframe */}
          <button
            onClick={toggleWireframe}
            className={`p-2 rounded-xl transition-colors ${
              isWireframe ? "bg-[#c5a880]/20 text-[#c5a880]" : "text-neutral-400 hover:text-white"
            }`}
            title="Architectural Wireframe"
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Reset Bird's Eye View */}
          <button
            onClick={() => {
              const extRoom = currentHome.rooms[0];
              goToRoom(extRoom, false);
            }}
            className="p-2 text-neutral-400 hover:text-white rounded-xl transition-colors"
            title="Reset to Aerial View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. REAL-TIME 3D SPATIAL HOTSPOT PINS PROJECTED ON CANVASES */}
      {/* ========================================================================= */}
      {showHotspots && !isCinematicVideoMode && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {currentHome.rooms.map((room) => {
            const pos = hotspotScreenPositions[room.id];
            if (!pos || !pos.visible) return null;

            const isCurrent = activeRoomId === room.id;

            return (
              <div
                key={room.id}
                style={{
                  transform: `translate(${pos.x}px, ${pos.y}px)`,
                  position: "absolute",
                  left: 0,
                  top: 0
                }}
                className="pointer-events-auto -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-200 hover:scale-110"
                onClick={() => goToRoom(room, true)}
              >
                {/* Pulsing ring */}
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-10 h-10 rounded-full bg-[#c5a880]/30 animate-ping" />
                  
                  {/* Pin badge */}
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md border shadow-2xl transition-all ${
                      isCurrent
                        ? "bg-[#c5a880] text-[#0c0d11] border-[#c5a880] font-semibold scale-105"
                        : "bg-[#0d0e14]/90 text-white border-neutral-700/80 hover:border-[#c5a880]"
                    }`}
                  >
                    <span className="text-sm">{room.icon}</span>
                    <span className="text-[11px] uppercase tracking-wider font-mono whitespace-nowrap">
                      {room.shortLabel}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. CINEMATIC 3D VIDEO TOUR OVERLAYS (LETTERBOX & PLAYER CONTROLS) */}
      {/* ========================================================================= */}
      {isCinematicVideoMode && (
        <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between">
          {/* Top Cinema Letterbox Bar */}
          <div className="h-14 bg-black/90 w-full flex items-center justify-between px-6 border-b border-neutral-900 pointer-events-auto">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-xs uppercase tracking-[0.25em] text-white font-mono font-medium">
                4K 60FPS 3D Spatial Walkthrough
              </span>
              <span className="text-neutral-500">|</span>
              <span className="text-xs text-[#c5a880] font-serif">{currentHome.title}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-neutral-400 font-mono">
                {videoStageIndex + 1} / {currentHome.rooms.length} · {currentHome.rooms[videoStageIndex]?.name}
              </span>
              <button
                onClick={stopCinematicVideo}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Center Screen Floating Cinematic Title */}
          <div className="px-8 py-4 max-w-xl self-start ml-4 bg-[#0a0c10]/80 backdrop-blur-md rounded-2xl border border-white/10 text-white animate-fadeIn">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#c5a880] block mb-1">
              Scene 0{videoStageIndex + 1} · {currentHome.rooms[videoStageIndex]?.floor}
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-normal text-white">
              {currentHome.rooms[videoStageIndex]?.name}
            </h2>
            <p className="text-xs text-neutral-300 mt-1 font-light leading-relaxed">
              {currentHome.rooms[videoStageIndex]?.tagline}
            </p>
            <div className="mt-2 inline-flex items-center gap-2 text-[11px] text-[#c5a880] font-mono">
              <span>{currentHome.rooms[videoStageIndex]?.area}</span>
              <span>·</span>
              <span>{currentHome.rooms[videoStageIndex]?.lightingMood}</span>
            </div>
          </div>

          {/* Bottom Cinema Player Controls Bar */}
          <div className="bg-black/90 w-full p-4 border-t border-neutral-900 pointer-events-auto space-y-2">
            {/* Scrubber progress line */}
            <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#c5a880] to-amber-300 transition-all duration-500"
                style={{ width: `${videoProgress}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                  className="p-2 bg-[#181a24] hover:bg-[#252838] text-white rounded-xl border border-neutral-700 transition-colors"
                >
                  {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => {
                    const prev = (videoStageIndex - 1 + currentHome.rooms.length) % currentHome.rooms.length;
                    setVideoStageIndex(prev);
                    goToRoom(currentHome.rooms[prev], false);
                  }}
                  className="p-2 text-neutral-400 hover:text-white transition-colors"
                  title="Previous Room"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    const next = (videoStageIndex + 1) % currentHome.rooms.length;
                    setVideoStageIndex(next);
                    goToRoom(currentHome.rooms[next], false);
                  }}
                  className="p-2 text-neutral-400 hover:text-white transition-colors"
                  title="Next Room"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1 text-xs text-neutral-400 pl-2">
                  <span className="text-white font-semibold">Speed:</span>
                  {[1, 1.5, 2].map((s) => (
                    <button
                      key={s}
                      onClick={() => setVideoSpeed(s)}
                      className={`px-2 py-0.5 rounded text-[11px] ${
                        videoSpeed === s ? "bg-[#c5a880] text-[#0c0d11] font-semibold" : "hover:text-white"
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setIsCinematicVideoMode(false);
                    setIsRoomModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#c5a880] text-[#0c0d11] font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Room Details</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. BOTTOM ROOM SELECTOR DOCK (All Sections) */}
      {/* ========================================================================= */}
      {!isCinematicVideoMode && (
        <div className="absolute bottom-6 left-4 right-4 z-20 flex flex-col items-center gap-2">
          {/* Room Pills Nav */}
          <div className="flex items-center gap-1.5 bg-[#0e1017]/90 backdrop-blur-xl p-2 rounded-full border border-neutral-800 shadow-2xl max-w-full overflow-x-auto scrollbar-none">
            {currentHome.rooms.map((room) => {
              const isActive = activeRoomId === room.id;
              return (
                <button
                  key={room.id}
                  onClick={() => goToRoom(room, true)}
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

          {/* Quick Helper Subtext */}
          <p className="text-[10px] text-neutral-400 font-mono tracking-wider hidden sm:block">
            ✦ Click any room to go inside · Drag to orbit 360° · Scroll to zoom
          </p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE ROOM DETAIL MODAL & HUMAN WALKTHROUGH DRAWER */}
      {/* ========================================================================= */}
      {isRoomModalOpen && selectedRoom && !isCinematicVideoMode && (
        <div className="absolute top-16 right-4 bottom-20 w-full max-w-md bg-[#0e1017]/96 backdrop-blur-2xl border border-neutral-800 rounded-2xl shadow-2xl p-6 text-white z-30 flex flex-col justify-between animate-fadeIn overflow-y-auto">
          {/* Top Bar */}
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedRoom.icon}</span>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#c5a880] font-semibold block">
                    {selectedRoom.floor}
                  </span>
                  <h3 className="font-serif text-xl text-white font-normal leading-tight">
                    {selectedRoom.name}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setIsRoomModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 gap-2 my-4 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-[#141722] border border-neutral-800/80">
                <span className="text-neutral-400 text-[10px] uppercase tracking-wider block">Carpet Area</span>
                <span className="text-white font-semibold text-sm">{selectedRoom.area}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#141722] border border-neutral-800/80">
                <span className="text-neutral-400 text-[10px] uppercase tracking-wider block">Atmosphere</span>
                <span className="text-[#c5a880] font-medium text-xs truncate block">{selectedRoom.lightingMood}</span>
              </div>
            </div>

            {/* Tabs for Info */}
            <div className="flex items-center gap-2 border-b border-neutral-800 mb-4 text-xs">
              {(["overview", "specs", "materials"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 capitalize font-medium transition-colors relative ${
                    activeTab === tab ? "text-[#c5a880]" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {tab}
                  {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c5a880]" />}
                </button>
              ))}
            </div>

            {/* Tab 1: Overview */}
            {activeTab === "overview" && (
              <div className="space-y-3 text-xs leading-relaxed text-neutral-300">
                <p className="italic text-[#c5a880] font-serif text-sm">
                  &ldquo;{selectedRoom.tagline}&rdquo;
                </p>
                <p className="font-light">{selectedRoom.description}</p>
                
                <div className="pt-2">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-2 font-semibold">
                    Architectural Key Features
                  </span>
                  <ul className="space-y-1.5">
                    {selectedRoom.keyFeatures.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-neutral-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#c5a880] mt-0.5 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Tab 2: Specs */}
            {activeTab === "specs" && (
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-[#141722] border border-neutral-800">
                  <span className="text-neutral-400 uppercase text-[10px] block">Spatial Volume</span>
                  <span className="text-white font-medium">Double-height void / Acoustic ceiling isolation</span>
                </div>
                <div className="p-3 rounded-xl bg-[#141722] border border-neutral-800">
                  <span className="text-neutral-400 uppercase text-[10px] block">Smart Automation</span>
                  <span className="text-white font-medium">Lutron Homeworks QSX lighting & motorized shading</span>
                </div>
                <div className="p-3 rounded-xl bg-[#141722] border border-neutral-800">
                  <span className="text-neutral-400 uppercase text-[10px] block">Audio & Acoustics</span>
                  <span className="text-white font-medium">Sonance Architectural Series invisible flush speakers</span>
                </div>
              </div>
            )}

            {/* Tab 3: Materials */}
            {activeTab === "materials" && (
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
                  Master Craftsmanship Finishes
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRoom.architecturalMaterials.map((mat, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-[#191d2a] text-[#c5a880] border border-[#c5a880]/30 text-xs font-mono"
                    >
                      {mat}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Footer */}
          <div className="pt-4 border-t border-neutral-800 mt-4 space-y-2">
            <button
              onClick={() => onBookTour?.(currentHome.title, selectedRoom.name)}
              className="w-full py-3 rounded-xl bg-[#c5a880] hover:bg-[#d5ba92] text-[#0c0d11] font-semibold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#c5a880]/20"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule Viewing for {selectedRoom.shortLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
              <button
                onClick={() => {
                  const currIdx = currentHome.rooms.findIndex((r) => r.id === selectedRoom.id);
                  const prev = (currIdx - 1 + currentHome.rooms.length) % currentHome.rooms.length;
                  goToRoom(currentHome.rooms[prev], true);
                }}
                className="hover:text-white flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous Room</span>
              </button>

              <button
                onClick={() => {
                  const currIdx = currentHome.rooms.findIndex((r) => r.id === selectedRoom.id);
                  const next = (currIdx + 1) % currentHome.rooms.length;
                  goToRoom(currentHome.rooms[next], true);
                }}
                className="hover:text-white flex items-center gap-1"
              >
                <span>Next Room</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
