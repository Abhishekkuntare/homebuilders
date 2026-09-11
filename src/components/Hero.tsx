import React from "react";
import { Property } from "../types";
import { motion } from "motion/react";
import {
  ArrowDown,
  Box,
  ArrowRight,
  Shield,
  Sparkles
} from "lucide-react";

interface HeroProps {
  onExploreClick: () => void;
  onLaunchCinematic: () => void;
  onBookTour: () => void;
  featuredProperty: Property;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  onLaunchCinematic,
  onBookTour,
  featuredProperty
}) => {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-[#07080a] overflow-hidden select-none">
      {/* Background Hero Image with subtle slow zoom & lighting */}
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: 1.12, opacity: 0.8 }}
          animate={{ scale: 1.04, opacity: 1 }}
          transition={{ duration: 3.5, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=85"
          alt="Luxury Architecture"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover brightness-[0.62] contrast-[1.08]"
        />
        {/* Cinematic Vignette and Gradient Fades */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0e] via-[#07080a]/40 to-black/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
      </div>

      {/* Hero Content Container with Staggered Motion */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-28 pb-16 flex flex-col items-center">
        
        {/* Brand Tagline Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#12141c]/80 backdrop-blur-md border border-[#c5a880]/30 mb-6 text-xs text-[#ede9e3]"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#c5a880]" />
          <span className="font-serif tracking-[0.2em] uppercase font-light">
            Private Office · Global Trophy Assets
          </span>
        </motion.div>

        {/* Editorial Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-4xl sm:text-6xl lg:text-7xl text-white font-normal tracking-tight leading-[1.08] max-w-4xl text-balance drop-shadow-2xl"
        >
          Find a place worth <br className="hidden sm:inline" />
          <span className="italic font-serif text-[#c5a880]">coming home to.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-neutral-300 text-sm sm:text-base md:text-lg max-w-2xl mt-6 font-light leading-relaxed drop-shadow"
        >
          Architectural masterpieces, private coastal estates, and sky sanctuaries across Mumbai, Dubai, Goa, Bangalore, and Delhi.
        </motion.p>

        {/* Main Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full sm:w-auto"
        >
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onExploreClick}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#c5a880] hover:bg-[#d5ba92] text-[#0c0d11] font-semibold text-xs uppercase tracking-widest transition-all duration-300 shadow-2xl shadow-[#c5a880]/25 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onLaunchCinematic}
            className="w-full sm:w-auto px-7 py-4 rounded-xl bg-[#14161f]/85 hover:bg-[#1c1f2b] text-white border border-neutral-700/80 hover:border-[#c5a880]/60 font-semibold text-xs uppercase tracking-widest transition-all duration-300 backdrop-blur-md flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Box className="w-4 h-4 text-[#c5a880]" />
            <span>Interactive 3D Walkthrough</span>
          </motion.button>
        </motion.div>

        {/* Quick Featured Residence Pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 inline-flex items-center gap-4 p-2 pl-4 pr-3 rounded-full bg-[#0e1017]/85 backdrop-blur-md border border-neutral-800 text-xs text-neutral-300 shadow-xl"
        >
          <span className="text-[#c5a880] font-serif uppercase tracking-widest font-medium">
            Featured Asset
          </span>
          <span className="text-white font-medium">{featuredProperty.title}</span>
          <span className="text-neutral-400">· {featuredProperty.location}, {featuredProperty.city}</span>
          <button
            onClick={onLaunchCinematic}
            className="px-3 py-1 rounded-full bg-[#c5a880]/20 hover:bg-[#c5a880] text-[#c5a880] hover:text-[#0c0d11] font-semibold transition-colors cursor-pointer"
          >
            Experience →
          </button>
        </motion.div>
      </div>

      {/* Floating Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-neutral-400 pointer-events-none"
      >
        <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#c5a880]">
          Scroll to Experience
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <ArrowDown className="w-4 h-4 text-[#c5a880]" />
        </motion.div>
      </motion.div>

      {/* Sovereign Highlights Bar at bottom left & right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 1 }}
        className="absolute bottom-8 left-8 hidden xl:flex items-center gap-2 text-xs text-neutral-400"
      >
        <Shield className="w-4 h-4 text-[#c5a880]" />
        <span>100% Cleared Titles · Discreet Non-Disclosure Representation</span>
      </motion.div>

      <div className="absolute bottom-8 right-8 hidden xl:flex items-center gap-4 text-xs font-mono text-neutral-400">
        <span>MUMBAI</span>
        <span>·</span>
        <span>DUBAI</span>
        <span>·</span>
        <span>GOA</span>
        <span>·</span>
        <span>BANGALORE</span>
      </div>
    </div>
  );
};
