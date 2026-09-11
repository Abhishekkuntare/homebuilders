import React from "react";
import { Property } from "../types";
import { motion } from "motion/react";
import { Bed, Bath, Maximize2, MapPin, ArrowUpRight, MessageCircle, Box } from "lucide-react";

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
  onQuick3DTour: (property: Property) => void;
  onWhatsApp: (propertyTitle: string) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  onQuick3DTour,
  onWhatsApp
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className="group bg-[#111319] rounded-2xl border border-neutral-800/80 overflow-hidden hover:border-[#c5a880]/50 transition-colors duration-300 hover:shadow-2xl hover:shadow-black flex flex-col justify-between"
    >
      {/* Image Container */}
      <div
        onClick={() => onSelect(property)}
        className="relative h-72 md:h-80 w-full overflow-hidden cursor-pointer"
      >
        <img
          src={property.heroImage}
          alt={property.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover brightness-[0.88] transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111319] via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            {property.featured && (
              <span className="px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#c5a880] text-[#0c0d11]">
                Featured Collection
              </span>
            )}
            <span className="px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-black/60 backdrop-blur-md text-white border border-white/10">
              {property.propertyType}
            </span>
          </div>

          <span className="px-3 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider bg-[#111319]/80 backdrop-blur-md text-emerald-400 border border-emerald-500/20">
            {property.status}
          </span>
        </div>

        {/* Hover Quick 3D Tour Overlay Pill */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuick3DTour(property);
          }}
          className="absolute bottom-4 right-4 px-3.5 py-1.5 rounded-full bg-black/75 hover:bg-[#c5a880] text-white hover:text-[#0c0d11] backdrop-blur-md border border-white/20 hover:border-[#c5a880] text-xs font-medium tracking-wide transition-all flex items-center gap-1.5 opacity-90 group-hover:opacity-100 cursor-pointer"
        >
          <Box className="w-3.5 h-3.5" />
          <span>Interactive 3D</span>
        </button>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Price & Location */}
          <div className="flex items-baseline justify-between mb-2">
            <span className="font-serif text-2xl md:text-3xl text-white font-normal group-hover:text-[#c5a880] transition-colors">
              {property.priceFormatted}
            </span>
            <span className="text-xs text-neutral-400 font-light flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#c5a880]" />
              {property.location}, {property.city}
            </span>
          </div>

          {/* Title & Tagline */}
          <h3
            onClick={() => onSelect(property)}
            className="font-serif text-xl text-white font-normal hover:text-[#c5a880] cursor-pointer transition-colors line-clamp-1 mb-1"
          >
            {property.title}
          </h3>
          <p className="text-xs text-neutral-400 font-light line-clamp-2 mb-4">
            {property.tagline}
          </p>

          {/* Architectural Specs Bar */}
          <div className="grid grid-cols-3 py-3 px-3.5 rounded-xl bg-[#171922] border border-neutral-800 text-xs text-neutral-300 mb-4">
            <div className="flex items-center gap-1.5">
              <Bed className="w-3.5 h-3.5 text-[#c5a880]" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-1.5 justify-center border-x border-neutral-700/60">
              <Bath className="w-3.5 h-3.5 text-[#c5a880]" />
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center gap-1.5 justify-end">
              <Maximize2 className="w-3.5 h-3.5 text-[#c5a880]" />
              <span className="truncate">{property.areaFormatted}</span>
            </div>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between">
          <button
            onClick={() => onSelect(property)}
            className="text-xs font-semibold uppercase tracking-widest text-[#c5a880] hover:text-white flex items-center gap-1 group/btn transition-colors cursor-pointer"
          >
            <span>Explore Residence</span>
            <ArrowUpRight className="w-4 h-4 transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </button>

          <button
            onClick={() => onWhatsApp(property.title)}
            className="p-2 rounded-lg bg-[#181a22] hover:bg-emerald-950/40 text-neutral-300 hover:text-emerald-300 border border-neutral-800 hover:border-emerald-600/40 transition-colors cursor-pointer"
            title="Inquire via WhatsApp"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
