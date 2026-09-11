import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useSmoothScroll } from "./SmoothScroll";
import {
  Compass,
  Volume2,
  VolumeX,
  Menu,
  X,
  Calendar,
  Sparkles,
  Shield,
  ArrowRight,
  MessageCircle
} from "lucide-react";

interface NavbarProps {
  onOpenConcierge: () => void;
  onOpenBookTour: () => void;
  onOpenAdmin: () => void;
  onWhatsApp: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenConcierge,
  onOpenBookTour,
  onOpenAdmin,
  onWhatsApp
}) => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isAmbientSoundOn, setIsAmbientSoundOn] = useState<boolean>(false);
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    scrollTo(id, { offset: -25, duration: 1.3 });
  };

  // Subtle audio tone synthesizer for ambient atmosphere
  const toggleAmbience = () => {
    setIsAmbientSoundOn((prev) => !prev);
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled
          ? "bg-[#0b0c10]/92 backdrop-blur-xl border-b border-neutral-800/80 shadow-2xl py-3"
          : "bg-gradient-to-b from-black/80 via-black/30 to-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Brand Monogram & Title */}
        <a
          href="#"
          className="flex items-center gap-3 text-left group"
        >
          <div className="w-9 h-9 rounded-lg border border-[#c5a880]/60 flex items-center justify-center bg-[#13151d] text-[#c5a880] font-serif text-lg tracking-wider group-hover:border-[#c5a880] transition-colors">
            S
          </div>
          <div>
            <span className="font-serif text-lg md:text-xl font-normal tracking-[0.2em] text-neutral-100 uppercase block">
              Smith & Stone
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#c5a880] block font-light">
              Private Real Estate
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs uppercase tracking-[0.18em] font-medium text-neutral-300">
          <button
            onClick={() => scrollToSection("properties")}
            className="hover:text-[#c5a880] transition-colors"
          >
            Properties
          </button>
          <button
            onClick={() => scrollToSection("cinematic-tour")}
            className="hover:text-[#c5a880] transition-colors flex items-center gap-1.5"
          >
            <span>3D Room Tour</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880] animate-pulse" />
          </button>
          <button
            onClick={() => scrollToSection("architectural-builder")}
            className="hover:text-[#c5a880] text-[#c5a880] transition-colors flex items-center gap-1.5"
          >
            <span>What to Build</span>
            <span className="text-[9px] px-1.5 py-0.2 bg-[#c5a880]/20 rounded border border-[#c5a880]/40 font-mono">3D</span>
          </button>
          <button
            onClick={() => scrollToSection("valuation")}
            className="hover:text-[#c5a880] transition-colors"
          >
            Valuation
          </button>
          <button
            onClick={onOpenConcierge}
            className="hover:text-[#c5a880] transition-colors flex items-center gap-1 text-[#c5a880]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Concierge</span>
          </button>
        </nav>

        {/* Action Controls */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Audio Ambience Toggle */}
          <button
            onClick={toggleAmbience}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/60 transition-colors"
            title={isAmbientSoundOn ? "Mute Ambient Sound" : "Enable Ambient Sound"}
          >
            {isAmbientSoundOn ? (
              <Volume2 className="w-4 h-4 text-[#c5a880]" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Admin CRM Shortcut */}
          <button
            onClick={onOpenAdmin}
            className="px-3.5 py-2 rounded-lg border border-neutral-700/80 hover:border-neutral-500 text-neutral-300 hover:text-white text-xs tracking-wider uppercase transition-colors"
            title="Private Office CRM"
          >
            <Shield className="w-3.5 h-3.5 inline mr-1 text-[#c5a880]" />
            <span>CRM</span>
          </button>

          {/* Book Tour CTA Button */}
          <button
            onClick={onOpenBookTour}
            className="px-5 py-2.5 rounded-xl bg-[#c5a880] hover:bg-[#d5ba92] text-[#0c0d11] font-semibold text-xs tracking-widest uppercase transition-all shadow-lg shadow-[#c5a880]/15 flex items-center gap-2 group/btn"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Tour</span>
            <ArrowRight className="w-3 h-3 transform group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={onOpenConcierge}
            className="p-2 text-[#c5a880]"
            title="AI Concierge"
          >
            <Sparkles className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-neutral-200 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Fullscreen Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[68px] bg-[#0c0d11]/98 backdrop-blur-2xl z-50 p-6 flex flex-col justify-between animate-fadeIn border-t border-neutral-800">
          <div className="space-y-6 pt-6 text-center">
            <button
              onClick={() => scrollToSection("properties")}
              className="block w-full font-serif text-2xl text-neutral-200 hover:text-[#c5a880]"
            >
              Collection
            </button>
            <button
              onClick={() => scrollToSection("cinematic-tour")}
              className="block w-full font-serif text-2xl text-neutral-200 hover:text-[#c5a880]"
            >
              Cinematic & 3D Walkthrough
            </button>
            <button
              onClick={() => scrollToSection("architectural-builder")}
              className="block w-full font-serif text-2xl text-[#c5a880] hover:text-white"
            >
              What to Build (3D Concepts)
            </button>
            <button
              onClick={() => scrollToSection("valuation")}
              className="block w-full font-serif text-2xl text-neutral-200 hover:text-[#c5a880]"
            >
              Appraisals & Valuation
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenConcierge();
              }}
              className="block w-full font-serif text-2xl text-[#c5a880]"
            >
              AI Property Concierge
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="block w-full text-sm font-sans tracking-widest text-neutral-400 uppercase pt-4"
            >
              Advisor CRM Portal
            </button>
          </div>

          <div className="space-y-3 pb-8">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenBookTour();
              }}
              className="w-full py-4 rounded-xl bg-[#c5a880] text-[#0c0d11] font-semibold text-xs uppercase tracking-widest"
            >
              Schedule Private Viewing
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onWhatsApp();
              }}
              className="w-full py-4 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Direct Desk</span>
            </button>
          </div>
        </div>
      )}
    </motion.header>
  );
};
