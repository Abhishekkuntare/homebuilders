import React, { useState } from "react";
import { Property, GalleryItem } from "../types";
import { InteractiveFloorPlan } from "./InteractiveFloorPlan";
import { PropertyGalleryModal } from "./PropertyGalleryModal";
import {
  X,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Calendar,
  MessageCircle,
  Phone,
  Mail,
  ShieldCheck,
  Compass,
  DollarSign,
  Calculator,
  CheckCircle2,
  Box,
  Share2,
  Bookmark,
  ChevronRight
} from "lucide-react";

interface PropertyDetailModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onLaunchCinematicTour: (property: Property) => void;
  onBookTour: (propertyTitle: string) => void;
  onWhatsApp: (propertyTitle: string) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  isOpen,
  onClose,
  onLaunchCinematicTour,
  onBookTour,
  onWhatsApp
}) => {
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);
  const [galleryIdx, setGalleryIdx] = useState<number>(0);
  const [saved, setSaved] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  // Mortgage Calculator state
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [loanTenureYears, setLoanTenureYears] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(8.5);

  if (!isOpen || !property) return null;

  // Calculate monthly mortgage estimate
  const propertyPrice = property.price;
  const loanAmount = propertyPrice * (1 - downPaymentPercent / 100);
  const monthlyInterest = interestRate / 12 / 100;
  const totalMonths = loanTenureYears * 12;
  const estimatedMonthlyEMI = Math.round(
    (loanAmount * monthlyInterest * Math.pow(1 + monthlyInterest, totalMonths)) /
      (Math.pow(1 + monthlyInterest, totalMonths) - 1)
  );

  const openGalleryAt = (index: number) => {
    setGalleryIdx(index);
    setIsGalleryOpen(true);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/85 backdrop-blur-xl overflow-y-auto animate-fadeIn">
      {/* Container */}
      <div className="min-h-screen max-w-6xl mx-auto bg-[#0d0e12] border-x border-neutral-800 text-neutral-100 pb-24 shadow-2xl relative">
        
        {/* Sticky Top Navigation Header */}
        <div className="sticky top-0 z-30 bg-[#0d0e12]/95 backdrop-blur-md px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#c5a880] font-medium">
              Private Residence Portfolio
            </span>
            <h2 className="font-serif text-lg md:text-xl text-white font-normal truncate max-w-md">
              {property.title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSaved(!saved)}
              className={`p-2.5 rounded-full border transition-colors ${
                saved
                  ? "bg-[#c5a880]/20 border-[#c5a880] text-[#c5a880]"
                  : "bg-neutral-900 border-neutral-700 text-neutral-400 hover:text-white"
              }`}
              title="Save Residence"
            >
              <Bookmark className="w-4 h-4" />
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-400 hover:text-white transition-colors"
              title="Share Link"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white hover:border-[#c5a880] transition-colors"
              title="Close view"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {copiedShare && (
          <div className="fixed top-20 right-8 z-50 bg-[#c5a880] text-[#0c0d11] px-4 py-2 rounded-lg text-xs font-semibold shadow-xl">
            Residence link copied to clipboard!
          </div>
        )}

        {/* Hero Section */}
        <div className="relative h-[480px] md:h-[600px] w-full overflow-hidden group">
          <img
            src={property.heroImage}
            alt={property.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover brightness-[0.8] transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e12] via-transparent to-black/30" />

          {/* Hero Content Overlays */}
          <div className="absolute bottom-8 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#c5a880] text-[#0c0d11]">
                  {property.propertyType}
                </span>
                <span className="text-xs uppercase tracking-widest text-neutral-300 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  {property.status}
                </span>
              </div>
              <h1 className="font-serif text-3xl md:text-5xl text-white font-normal tracking-tight">
                {property.title}
              </h1>
              <p className="text-neutral-300 text-base md:text-lg font-light mt-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#c5a880]" />
                {property.location}, {property.city}, {property.country}
              </p>
            </div>

            {/* Launch Cinematic Tour CTA */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  onLaunchCinematicTour(property);
                }}
                className="px-6 py-3.5 rounded-xl bg-[#c5a880] hover:bg-[#d5ba92] text-[#0c0d11] font-semibold text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#c5a880]/20 flex items-center gap-2"
              >
                <Box className="w-4 h-4" />
                <span>Launch 3D & Cinematic Tour</span>
              </button>
            </div>
          </div>
        </div>

        {/* Key Architectural Specs Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-b border-neutral-800 bg-[#121419]">
          <div className="p-6 border-r border-b md:border-b-0 border-neutral-800">
            <span className="text-[11px] uppercase tracking-widest text-neutral-400">Offer Price</span>
            <p className="font-serif text-2xl text-[#c5a880] mt-1 font-normal">{property.priceFormatted}</p>
          </div>
          <div className="p-6 border-r border-b md:border-b-0 border-neutral-800">
            <span className="text-[11px] uppercase tracking-widest text-neutral-400">Configuration</span>
            <p className="font-serif text-xl text-white mt-1">
              {property.bedrooms} Bed · {property.bathrooms} Bath
            </p>
          </div>
          <div className="p-6 border-r border-neutral-800">
            <span className="text-[11px] uppercase tracking-widest text-neutral-400">Super Built Area</span>
            <p className="font-serif text-xl text-white mt-1">{property.areaFormatted}</p>
          </div>
          <div className="p-6">
            <span className="text-[11px] uppercase tracking-widest text-neutral-400">Possession</span>
            <p className="font-serif text-xl text-white mt-1">{property.possession}</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="p-6 md:p-10 space-y-12">
          {/* Narrative & Description */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-6">
              <div>
                <h3 className="font-serif text-2xl md:text-3xl text-white mb-4">
                  The Architectural Narrative
                </h3>
                <p className="text-neutral-300 text-base leading-relaxed font-light">
                  {property.description}
                </p>
              </div>

              {/* Additional Specifications Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-neutral-800">
                <div className="p-4 rounded-xl bg-[#13151b] border border-neutral-800">
                  <span className="text-[11px] text-neutral-400 uppercase tracking-wider">Furnishing</span>
                  <p className="text-sm font-medium text-white mt-1">{property.furnished}</p>
                </div>
                <div className="p-4 rounded-xl bg-[#13151b] border border-neutral-800">
                  <span className="text-[11px] text-neutral-400 uppercase tracking-wider">Parking Allocation</span>
                  <p className="text-sm font-medium text-white mt-1">{property.parking}</p>
                </div>
                <div className="p-4 rounded-xl bg-[#13151b] border border-neutral-800">
                  <span className="text-[11px] text-neutral-400 uppercase tracking-wider">Legal Status</span>
                  <p className="text-sm font-medium text-white mt-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Clear Title & RERA Registered
                  </p>
                </div>
              </div>

              {/* Curated Amenities List */}
              <div className="pt-6">
                <h4 className="font-serif text-xl text-white mb-4">Signature Amenities</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {property.amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-xl bg-[#13151b] border border-neutral-800 text-sm text-neutral-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#c5a880] flex-shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky Dedicated Agent Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 bg-[#14161f] rounded-2xl border border-neutral-800 p-6 space-y-6 shadow-xl">
                <div className="flex items-center gap-4">
                  <img
                    src={property.agent.avatar}
                    alt={property.agent.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#c5a880]"
                  />
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#c5a880] font-semibold">
                      Exclusive Listing Partner
                    </span>
                    <h4 className="font-serif text-lg text-white font-medium">
                      {property.agent.name}
                    </h4>
                    <p className="text-xs text-neutral-400">{property.agent.title}</p>
                  </div>
                </div>

                <div className="text-xs text-neutral-400 space-y-2 py-3 border-y border-neutral-800">
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#c5a880]" />
                    <span>{property.agent.phone}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#c5a880]" />
                    <span>{property.agent.email}</span>
                  </p>
                  <p className="italic text-neutral-500 pt-1">
                    {property.agent.experience}
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => onBookTour(property.title)}
                    className="w-full py-3.5 rounded-xl bg-[#c5a880] hover:bg-[#d5ba92] text-[#0c0d11] font-semibold text-xs uppercase tracking-widest transition-all shadow-lg shadow-[#c5a880]/15 flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book Private Viewing</span>
                  </button>

                  <button
                    onClick={() => onWhatsApp(property.title)}
                    className="w-full py-3.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-semibold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>WhatsApp Direct Desk</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Photo Gallery Grid */}
          <div className="pt-8 border-t border-neutral-800">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#c5a880]">Editorial Imagery</span>
                <h3 className="font-serif text-2xl md:text-3xl text-white">Residence Gallery</h3>
              </div>
              <button
                onClick={() => openGalleryAt(0)}
                className="text-xs uppercase tracking-wider text-[#c5a880] hover:underline flex items-center gap-1"
              >
                <span>View Fullscreen ({property.gallery.length} Photos)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {property.gallery.slice(0, 6).map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => openGalleryAt(idx)}
                  className="group relative h-48 md:h-64 rounded-xl overflow-hidden cursor-pointer border border-neutral-800 bg-neutral-900"
                >
                  <img
                    src={item.url}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute bottom-3 left-3 right-3 text-xs text-white">
                    <span className="text-[10px] uppercase tracking-wider text-[#c5a880]">
                      {item.category}
                    </span>
                    <p className="font-medium truncate">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Floor Plans Section */}
          <div className="pt-8 border-t border-neutral-800">
            <InteractiveFloorPlan
              floorPlans={property.floorPlans}
              propertyTitle={property.title}
            />
          </div>

          {/* Investment & Mortgage Calculator Section */}
          <div className="pt-8 border-t border-neutral-800">
            <div className="bg-[#121419] rounded-2xl border border-neutral-800 p-6 md:p-8">
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="w-4 h-4 text-[#c5a880]" />
                <span className="text-xs uppercase tracking-widest text-[#c5a880] font-medium">
                  Private Wealth Advisory
                </span>
              </div>
              <h3 className="font-serif text-2xl text-white mb-6">
                Investment & Financing Calculator
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div className="lg:col-span-2 space-y-6">
                  {/* Down Payment Slider */}
                  <div>
                    <div className="flex justify-between text-xs text-neutral-300 mb-2">
                      <span>Down Payment ({downPaymentPercent}%)</span>
                      <span className="font-mono text-[#c5a880]">
                        ₹{((propertyPrice * downPaymentPercent) / 100 / 100000).toFixed(2)} Lakhs
                      </span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={50}
                      step={5}
                      value={downPaymentPercent}
                      onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                      className="w-full accent-[#c5a880] h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Loan Tenure Slider */}
                  <div>
                    <div className="flex justify-between text-xs text-neutral-300 mb-2">
                      <span>Loan Tenure ({loanTenureYears} Years)</span>
                      <span className="font-mono text-white">{loanTenureYears * 12} Months</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={30}
                      step={5}
                      value={loanTenureYears}
                      onChange={(e) => setLoanTenureYears(Number(e.target.value))}
                      className="w-full accent-[#c5a880] h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Interest Rate Slider */}
                  <div>
                    <div className="flex justify-between text-xs text-neutral-300 mb-2">
                      <span>Interest Rate ({interestRate}%)</span>
                      <span className="font-mono text-white">Private Banking Prime Rate</span>
                    </div>
                    <input
                      type="range"
                      min={7.0}
                      max={12.0}
                      step={0.25}
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="w-full accent-[#c5a880] h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                {/* Result Card */}
                <div className="p-6 rounded-xl bg-[#171922] border border-neutral-700/80 text-center">
                  <span className="text-[11px] uppercase tracking-widest text-neutral-400">
                    Estimated Monthly Repayment
                  </span>
                  <p className="font-serif text-3xl md:text-4xl text-[#c5a880] font-normal my-2">
                    ₹{estimatedMonthlyEMI.toLocaleString()}
                  </p>
                  <p className="text-xs text-neutral-400 mb-4">
                    Based on principal borrow of ₹{((loanAmount) / 100000).toFixed(2)} Lakhs
                  </p>
                  <button
                    onClick={() => onBookTour(property.title)}
                    className="w-full py-2.5 rounded-lg bg-[#c5a880] hover:bg-[#d5ba92] text-[#0c0d11] text-xs font-semibold uppercase tracking-wider transition-colors"
                  >
                    Request Mortgage Consultation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Gallery Lightbox Modal */}
      <PropertyGalleryModal
        gallery={property.gallery}
        initialIdx={galleryIdx}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        propertyTitle={property.title}
      />
    </div>
  );
};
