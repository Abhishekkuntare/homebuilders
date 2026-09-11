import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Property, CinematicStage } from "../types";
import { ThreePropertyViewer } from "./ThreePropertyViewer";
import { CinematicRoomNavigator } from "./CinematicRoomNavigator";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Calendar,
  MessageCircle,
  FileText,
  Volume2,
  VolumeX,
  Compass,
  ArrowRight,
  Box,
  Film,
  Sparkles
} from "lucide-react";

interface CinematicTourProps {
  property: Property;
  onBookTour: (propertyTitle: string) => void;
  onWhatsApp: (propertyTitle: string) => void;
  onViewFloorPlan: () => void;
}

export const CinematicTour: React.FC<CinematicTourProps> = ({
  property,
  onBookTour,
  onWhatsApp,
  onViewFloorPlan
}) => {
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(0);
  const [tourMode, setTourMode] = useState<"navigator" | "3d" | "cinematic">("navigator");
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true);
  const [autoPlay, setAutoPlay] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stages: CinematicStage[] = property.cinematicStages && property.cinematicStages.length > 0
    ? property.cinematicStages
    : [
        {
          stage: "Arrive",
          title: "Private Courtyard Gate",
          subtitle: "Approaching the sovereign architectural threshold",
          image: property.heroImage,
          spec: "Private Vehicular Access · 24/7 Security"
        },
        {
          stage: "Enter",
          title: "The Great Foyer",
          subtitle: "Double-height void with natural limestone flooring",
          image: property.gallery[0]?.url || property.heroImage,
          spec: "14-ft Ceiling Clearances"
        },
        {
          stage: "Live",
          title: "The Main Salon",
          subtitle: "Expansive glass curtain opening to panoramic vistas",
          image: property.gallery[1]?.url || property.heroImage,
          spec: "Acoustic Glazing · Italian Joinery"
        },
        {
          stage: "Experience",
          title: "Sunset Balcony & Pool",
          subtitle: "Private heated plunge pool suspended over horizon",
          image: property.gallery[5]?.url || property.heroImage,
          spec: "Heated Plunge Pool · Teppanyaki Bar"
        }
      ];

  const currentStage = stages[currentStageIdx];
  const progressPercent = ((currentStageIdx + 1) / stages.length) * 100;

  // Autoplay progression timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoPlay && tourMode === "cinematic") {
      interval = setInterval(() => {
        setCurrentStageIdx((prev) => (prev + 1) % stages.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [autoPlay, tourMode, stages.length]);

  const handleNext = () => {
    if (currentStageIdx < stages.length - 1) {
      setCurrentStageIdx((prev) => prev + 1);
    } else {
      setCurrentStageIdx(0);
    }
  };

  const handlePrev = () => {
    if (currentStageIdx > 0) {
      setCurrentStageIdx((prev) => prev - 1);
    } else {
      setCurrentStageIdx(stages.length - 1);
    }
  };

  // Optional subtle luxury audio oscillator synthesis
  const toggleAudio = () => {
    setIsAudioMuted((prev) => !prev);
  };

  return (
    <section id="cinematic-tour" className="relative w-full bg-[#0c0d11] text-white py-16 px-4 md:px-8 border-t border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#c5a880] animate-pulse" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#c5a880] font-medium">
                Immersive Property Walkthrough
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-5xl tracking-tight text-neutral-100">
              Don&apos;t just browse the property. <span className="italic text-[#c5a880]">Experience it.</span>
            </h2>
            <p className="text-neutral-400 text-sm md:text-base mt-2 max-w-xl font-light">
              Step through the private thresholds of {property.title} in {property.location}, {property.city}. 
              Move from the gated motor court to the panoramic sky lounge.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-3">
            <div className="bg-[#15171e] p-1.5 rounded-xl border border-neutral-800 flex items-center gap-1 text-xs">
              <button
                onClick={() => setTourMode("navigator")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-all ${
                  tourMode === "navigator"
                    ? "bg-[#c5a880] text-[#0c0d11] shadow-lg shadow-[#c5a880]/15 font-semibold"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>R3F Room Navigator</span>
              </button>

              <button
                onClick={() => setTourMode("3d")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-all ${
                  tourMode === "3d"
                    ? "bg-[#c5a880] text-[#0c0d11] shadow-lg shadow-[#c5a880]/15 font-semibold"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>3D Virtual Estate</span>
              </button>

              <button
                onClick={() => setTourMode("cinematic")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-all ${
                  tourMode === "cinematic"
                    ? "bg-[#c5a880] text-[#0c0d11] shadow-lg shadow-[#c5a880]/15 font-semibold"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Cinematic Scroll</span>
              </button>
            </div>

            <button
              onClick={toggleAudio}
              className="p-3 bg-[#15171e] hover:bg-[#1f222b] rounded-xl border border-neutral-800 text-neutral-300 transition-colors"
              title={isAudioMuted ? "Soundscape Off" : "Soundscape Active"}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#c5a880]" />}
            </button>
          </div>
        </div>

        {/* Central Experience Stage Container */}
        <AnimatePresence mode="wait">
          {tourMode === "navigator" ? (
            <motion.div
              key="navigator"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35 }}
            >
              <CinematicRoomNavigator
                propertyName={property.title}
                onBookTour={(title, room) => onBookTour(`${title}${room ? ` · ${room}` : ""}`)}
                onWhatsApp={(title, room) => onWhatsApp(`${title}${room ? ` · ${room}` : ""}`)}
                isEmbedded={true}
              />
            </motion.div>
          ) : tourMode === "3d" ? (
            <motion.div
              key="3d"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35 }}
            >
              <ThreePropertyViewer
                propertyName={property.title}
                onBookTour={(title, room) => onBookTour(`${title}${room ? ` · ${room}` : ""}`)}
                isEmbedded={true}
              />
            </motion.div>
          ) : (
            <motion.div
              key="cinematic"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35 }}
              className="relative w-full h-[520px] md:h-[660px] rounded-2xl overflow-hidden bg-black border border-neutral-800/80 shadow-2xl group"
            >
            {/* Background Stage Imagery with smooth transition & slow cinematic zoom */}
            <div className="absolute inset-0 overflow-hidden">
              {stages.map((stage, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    idx === currentStageIdx ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                  }`}
                >
                  <img
                    src={stage.image}
                    alt={stage.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transform scale-105 transition-transform duration-[8000ms] ease-out hover:scale-100 brightness-[0.82]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/40" />
                </div>
              ))}
            </div>

            {/* Top Stage Bar & Progression HUD */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
              <div className="flex items-center gap-3 bg-[#0c0d11]/85 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-xs">
                <span className="text-[#c5a880] font-serif uppercase tracking-widest font-semibold">
                  Scene 0{currentStageIdx + 1} / 0{stages.length}
                </span>
                <span className="w-1 h-1 rounded-full bg-neutral-600" />
                <span className="text-neutral-300 font-light">{currentStage.stage}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAutoPlay(!autoPlay)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md border transition-all ${
                    autoPlay
                      ? "bg-[#c5a880] text-[#0c0d11] border-[#c5a880]"
                      : "bg-[#0c0d11]/80 text-neutral-300 border-white/10 hover:bg-neutral-800"
                  }`}
                >
                  {autoPlay ? "Auto Walkthrough · Active" : "Auto Play"}
                </button>
              </div>
            </div>

            {/* Left / Right Cinematic Navigation Arrows */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all duration-300 hover:scale-110 active:scale-95"
              aria-label="Previous scene"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all duration-300 hover:scale-110 active:scale-95"
              aria-label="Next scene"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Bottom HUD: Room Narrative & Specifications */}
            <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-xl">
                <p className="text-xs uppercase tracking-[0.2em] text-[#c5a880] font-medium mb-1">
                  {currentStage.stage} · {property.title}
                </p>
                <h3 className="font-serif text-2xl md:text-4xl text-white font-normal tracking-wide drop-shadow-md">
                  {currentStage.title}
                </h3>
                <p className="text-neutral-300 text-sm mt-1 font-light drop-shadow">
                  {currentStage.subtitle}
                </p>

                {/* Architectural Spec Pill */}
                <div className="mt-3 inline-flex items-center gap-2 bg-[#121419]/90 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-[#c5a880]/30 text-xs text-[#ede9e3]">
                  <Compass className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span>{currentStage.spec}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onBookTour(property.title)}
                  className="px-5 py-3 rounded-xl bg-[#c5a880] hover:bg-[#d5ba92] text-[#0c0d11] font-medium text-xs tracking-wider uppercase transition-all shadow-lg shadow-[#c5a880]/20 flex items-center gap-2 group/btn"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule Private Tour</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onWhatsApp(property.title)}
                  className="px-4 py-3 rounded-xl bg-[#121419]/90 hover:bg-[#1a1d24] text-white border border-neutral-700/80 font-medium text-xs tracking-wider uppercase transition-all flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp Agent</span>
                </button>

                <button
                  onClick={onViewFloorPlan}
                  className="px-4 py-3 rounded-xl bg-[#121419]/90 hover:bg-[#1a1d24] text-neutral-300 hover:text-white border border-neutral-700/80 font-medium text-xs tracking-wider uppercase transition-all flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-[#c5a880]" />
                  <span>Floor Plan</span>
                </button>
              </div>
            </div>

              {/* Continuous Progression Line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-30">
                <div
                  className="h-full bg-gradient-to-r from-[#c5a880] to-[#e4cb9e] transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stage Selector Waypoint Pills */}
        <div className="mt-6 flex items-center justify-between gap-2 overflow-x-auto pb-2 scrollbar-none">
          {stages.map((stage, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTourMode("cinematic");
                setCurrentStageIdx(idx);
              }}
              className={`flex-1 min-w-[130px] text-left p-3 rounded-xl border transition-all ${
                currentStageIdx === idx && tourMode === "cinematic"
                  ? "bg-[#181a22] border-[#c5a880] shadow-md"
                  : "bg-[#101217] border-neutral-800/80 hover:border-neutral-700 opacity-70 hover:opacity-100"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase tracking-wider text-[#c5a880]">0{idx + 1}</span>
                <span className="text-[10px] text-neutral-400 uppercase">{stage.stage}</span>
              </div>
              <p className="text-xs text-white font-medium truncate">{stage.title}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
