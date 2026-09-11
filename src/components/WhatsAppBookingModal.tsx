import React, { useState } from "react";
import { X, MessageCircle, Calendar, Clock, Car, CheckCircle2, ArrowRight } from "lucide-react";

interface WhatsAppBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPropertyTitle?: string;
}

export const WhatsAppBookingModal: React.FC<WhatsAppBookingModalProps> = ({
  isOpen,
  onClose,
  defaultPropertyTitle = "The Oak Residence"
}) => {
  const [propertyTitle, setPropertyTitle] = useState<string>(defaultPropertyTitle);
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [preferredDate, setPreferredDate] = useState<string>("");
  const [preferredTime, setPreferredTime] = useState<string>("Twilight Viewing (5:00 PM)");
  const [chauffeurService, setChauffeurService] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    // 1. Post to backend CRM leads
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          property: propertyTitle,
          preferredDate,
          preferredTime,
          message: `${chauffeurService ? "[CHAUFFEUR REQUESTED] " : ""}${notes}`,
          source: "WhatsApp Tour Booking Modal",
          leadType: "TOUR_BOOKING"
        })
      });
    } catch (err) {
      console.error("Lead submission error:", err);
    }

    // 2. Format WhatsApp deep-link message
    const waText = encodeURIComponent(
      `Hello Smith & Stone Private Office,

I would like to schedule an exclusive viewing for:
Residence: ${propertyTitle}
Client Name: ${name}
Phone: ${phone}
Preferred Date: ${preferredDate || "Earliest available"}
Preferred Time: ${preferredTime}
${chauffeurService ? "Chauffeur Service: Yes, please coordinate private transport." : ""}
${notes ? `Additional Notes: ${notes}` : ""}

Please confirm advisor availability.`
    );

    const waUrl = `https://wa.me/919820154321?text=${waText}`;

    // Show success confirmation
    setIsSuccess(true);

    // Open WhatsApp in new tab
    setTimeout(() => {
      window.open(waUrl, "_blank");
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#12141a] border border-neutral-800 rounded-2xl max-w-lg w-full p-6 md:p-8 text-white relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <MessageCircle className="w-4 h-4" />
              </div>
              <span className="text-xs uppercase tracking-widest text-[#c5a880] font-semibold">
                Private Viewing Desk
              </span>
            </div>

            <h3 className="font-serif text-2xl text-white font-normal">
              Schedule Private Viewing
            </h3>
            <p className="text-xs text-neutral-400 mt-1 mb-6 font-light">
              Connect directly with the designated Senior Listing Partner on WhatsApp for expedited concierge scheduling.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-1">
                  Selected Residence
                </label>
                <input
                  type="text"
                  value={propertyTitle}
                  onChange={(e) => setPropertyTitle(e.target.value)}
                  className="w-full bg-[#191b24] text-white px-3.5 py-2.5 rounded-xl border border-neutral-700 focus:outline-none focus:border-[#c5a880]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 uppercase tracking-wider mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lorde Harrington"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#191b24] text-white px-3.5 py-2.5 rounded-xl border border-neutral-700 focus:outline-none focus:border-[#c5a880]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 uppercase tracking-wider mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98200 00000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#191b24] text-white px-3.5 py-2.5 rounded-xl border border-neutral-700 focus:outline-none focus:border-[#c5a880]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 uppercase tracking-wider mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full bg-[#191b24] text-white px-3.5 py-2.5 rounded-xl border border-neutral-700 focus:outline-none focus:border-[#c5a880]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 uppercase tracking-wider mb-1">
                    Preferred Time Slot
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full bg-[#191b24] text-white px-3.5 py-2.5 rounded-xl border border-neutral-700 focus:outline-none focus:border-[#c5a880]"
                  >
                    <option>Morning Viewing (10:30 AM)</option>
                    <option>Afternoon Light (2:30 PM)</option>
                    <option>Twilight Viewing (5:00 PM)</option>
                    <option>Evening Architectural Glow (7:00 PM)</option>
                  </select>
                </div>
              </div>

              {/* Chauffeur Toggle */}
              <label className="flex items-center gap-3 p-3 rounded-xl bg-[#191b24] border border-neutral-800 cursor-pointer hover:border-neutral-700 transition-colors">
                <input
                  type="checkbox"
                  checked={chauffeurService}
                  onChange={(e) => setChauffeurService(e.target.checked)}
                  className="accent-[#c5a880] w-4 h-4 rounded"
                />
                <div className="flex items-center gap-2 text-neutral-300">
                  <Car className="w-4 h-4 text-[#c5a880]" />
                  <span>Request complimentary private executive chauffeur escort</span>
                </div>
              </label>

              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-1">
                  Specific Requests / Non-Disclosure Note
                </label>
                <textarea
                  rows={2}
                  placeholder="Security requirements, private entry, or guest count..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#191b24] text-white px-3.5 py-2 rounded-xl border border-neutral-700 focus:outline-none focus:border-[#c5a880] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 mt-4"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Confirm & Connect on WhatsApp</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-8 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl text-white font-normal mb-2">
              Viewing Request Transmitted
            </h3>
            <p className="text-xs text-neutral-300 max-w-sm mx-auto mb-6">
              Your request for <span className="text-[#c5a880]">{propertyTitle}</span> has been logged in the private office CRM. WhatsApp has opened in your browser to finalize times with the listing partner.
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-[#c5a880] text-[#0c0d11] text-xs font-semibold uppercase tracking-wider"
            >
              Return to Portfolio
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
