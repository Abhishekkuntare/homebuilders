import React from "react";
import { Shield, Phone, Mail, MapPin, ArrowUp, MessageCircle } from "lucide-react";

interface FooterProps {
  onOpenBookTour: () => void;
  onOpenConcierge: () => void;
  onOpenAdmin: () => void;
  onWhatsApp: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenBookTour,
  onOpenConcierge,
  onOpenAdmin,
  onWhatsApp
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-[#07080a] text-neutral-300 border-t border-neutral-800/80 pt-20 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Top Call to Action Banner */}
        <div className="bg-[#101219] rounded-3xl border border-neutral-800 p-8 md:p-14 flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative overflow-hidden">
          <div className="max-w-xl">
            <span className="text-xs uppercase tracking-[0.25em] text-[#c5a880] font-medium">
              Private Client Advisory
            </span>
            <h3 className="font-serif text-3xl md:text-4xl text-white font-normal mt-2 mb-3">
              Seeking an off-market or discreet sovereign acquisition?
            </h3>
            <p className="text-neutral-400 text-sm font-light">
              Over 40% of our ultra-prime transactions occur privately off-market. Connect with our Managing Partners under non-disclosure protocol.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onOpenBookTour}
              className="px-7 py-4 rounded-xl bg-[#c5a880] hover:bg-[#d5ba92] text-[#0c0d11] font-semibold text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#c5a880]/20"
            >
              Consult Managing Partner
            </button>

            <button
              onClick={onWhatsApp}
              className="px-6 py-4 rounded-xl bg-[#171923] hover:bg-[#202331] text-emerald-400 border border-emerald-500/30 font-semibold text-xs uppercase tracking-widest transition-all flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Direct Desk</span>
            </button>
          </div>
        </div>

        {/* Global Office Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-neutral-800/80 text-xs">
          <div>
            <div className="flex items-center gap-2 mb-3 text-white font-serif text-base">
              <MapPin className="w-4 h-4 text-[#c5a880]" />
              <span>Mumbai Private Office</span>
            </div>
            <p className="text-neutral-400 font-light leading-relaxed">
              Level 9, Signature One, Pali Hill<br />
              Bandra West, Mumbai 400050<br />
              T: +91 22 6123 8800
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3 text-white font-serif text-base">
              <MapPin className="w-4 h-4 text-[#c5a880]" />
              <span>Dubai Headquarters</span>
            </div>
            <p className="text-neutral-400 font-light leading-relaxed">
              Gate Precinct 4, Level 5, DIFC<br />
              Dubai, United Arab Emirates<br />
              T: +971 4 812 9000
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3 text-white font-serif text-base">
              <MapPin className="w-4 h-4 text-[#c5a880]" />
              <span>London Desk</span>
            </div>
            <p className="text-neutral-400 font-light leading-relaxed">
              14 Berkeley Square, Mayfair<br />
              London W1J 6BL, United Kingdom<br />
              T: +44 20 7946 0192
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3 text-white font-serif text-base">
              <MapPin className="w-4 h-4 text-[#c5a880]" />
              <span>New York Representative</span>
            </div>
            <p className="text-neutral-400 font-light leading-relaxed">
              767 Fifth Avenue, General Motors Bldg<br />
              New York, NY 10153<br />
              T: +1 212 555 0184
            </p>
          </div>
        </div>

        {/* Brand & Legal Disclaimer Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs text-neutral-500">
          <div>
            <span className="font-serif text-lg tracking-[0.2em] text-white uppercase block mb-1">
              Homebuilders
            </span>
            <p className="max-w-xl font-light leading-relaxed">
             Homebuilders Private Real Estate operates as a registered luxury advisory under RERA India & Dubai DED regulatory frameworks. All property representations, photographs, and architectural renderings are protected by copyright.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={onOpenAdmin}
              className="text-neutral-400 hover:text-white uppercase tracking-wider text-[11px]"
            >
              Agent / CRM Portal
            </button>
            <button
              onClick={onOpenConcierge}
              className="text-[#c5a880] hover:underline uppercase tracking-wider text-[11px]"
            >
              AI Concierge
            </button>
            <button
              onClick={scrollToTop}
              className="p-3 rounded-full bg-[#14161f] border border-neutral-800 text-neutral-300 hover:text-white hover:border-[#c5a880] transition-colors"
              title="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="text-[11px] text-neutral-600 flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-neutral-800/60">
          <p>© 2026 Homebuilders Private Real Estate. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <a href="#" className="hover:text-neutral-400">Privacy Policy</a>
            <span>·</span>
            <a href="#" className="hover:text-neutral-400">Terms of Representation</a>
            <span>·</span>
            <a href="#" className="hover:text-neutral-400">RERA Certificates</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
