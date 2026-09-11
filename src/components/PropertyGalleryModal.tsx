import React, { useState, useEffect, useCallback } from "react";
import { GalleryItem } from "../types";
import { X, ChevronLeft, ChevronRight, Maximize, Grid, Tag } from "lucide-react";

interface PropertyGalleryModalProps {
  gallery: GalleryItem[];
  initialIdx?: number;
  isOpen: boolean;
  onClose: () => void;
  propertyTitle: string;
}

export const PropertyGalleryModal: React.FC<PropertyGalleryModalProps> = ({
  gallery,
  initialIdx = 0,
  isOpen,
  onClose,
  propertyTitle
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(initialIdx);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  useEffect(() => {
    setCurrentIdx(initialIdx);
  }, [initialIdx, isOpen]);

  const categories = ["ALL", "EXTERIOR", "LIVING", "KITCHEN", "BEDROOM", "BATHROOM", "OUTDOOR"];

  const filteredGallery = selectedCategory === "ALL"
    ? gallery
    : gallery.filter((item) => item.category === selectedCategory);

  const safeIdx = Math.min(currentIdx, Math.max(0, filteredGallery.length - 1));
  const currentItem = filteredGallery[safeIdx] || gallery[0];

  const handleNext = useCallback(() => {
    if (filteredGallery.length <= 1) return;
    setCurrentIdx((prev) => (prev + 1) % filteredGallery.length);
  }, [filteredGallery.length]);

  const handlePrev = useCallback(() => {
    if (filteredGallery.length <= 1) return;
    setCurrentIdx((prev) => (prev - 1 + filteredGallery.length) % filteredGallery.length);
  }, [filteredGallery.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#07080a]/95 backdrop-blur-xl flex flex-col justify-between text-white p-4 md:p-8 animate-fadeIn">
      {/* Top Bar */}
      <div className="flex items-center justify-between z-10">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#c5a880] font-medium">
            Architectural Portfolio
          </span>
          <h3 className="font-serif text-xl md:text-2xl text-white tracking-wide">
            {propertyTitle}
          </h3>
        </div>

        {/* Category Filters */}
        <div className="hidden lg:flex items-center gap-1.5 bg-[#121419]/80 p-1 rounded-full border border-neutral-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentIdx(0);
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium tracking-wider transition-all ${
                selectedCategory === cat
                  ? "bg-[#c5a880] text-[#0c0d11] font-semibold"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white hover:border-[#c5a880] transition-colors"
          aria-label="Close fullscreen gallery"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image Stage */}
      <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
        {/* Navigation buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-2 md:left-6 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 flex items-center justify-center text-white transition-transform hover:scale-110"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-2 md:right-6 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 flex items-center justify-center text-white transition-transform hover:scale-110"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Active High-Res Photo */}
        {currentItem && (
          <div className="max-w-6xl max-h-[75vh] relative rounded-xl overflow-hidden shadow-2xl border border-neutral-800">
            <img
              src={currentItem.url}
              alt={currentItem.title}
              referrerPolicy="no-referrer"
              className="max-h-[75vh] w-auto object-contain mx-auto transition-opacity duration-300"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6">
              <div className="flex items-center gap-2 mb-1">
                <Tag className="w-3.5 h-3.5 text-[#c5a880]" />
                <span className="text-xs uppercase tracking-widest text-[#c5a880] font-medium">
                  {currentItem.category}
                </span>
                <span className="text-xs text-neutral-400">
                  · {safeIdx + 1} of {filteredGallery.length}
                </span>
              </div>
              <p className="font-serif text-xl text-white font-normal">{currentItem.title}</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Thumbnails Strip */}
      <div className="z-10 overflow-x-auto py-2 flex items-center gap-2 justify-center scrollbar-none">
        {filteredGallery.map((item, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIdx(idx)}
            className={`relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border transition-all duration-300 ${
              safeIdx === idx
                ? "border-[#c5a880] scale-105 shadow-md shadow-[#c5a880]/20"
                : "border-neutral-800 opacity-50 hover:opacity-100"
            }`}
          >
            <img
              src={item.url}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};
