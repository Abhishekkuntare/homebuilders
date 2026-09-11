import React, { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Property } from "./types";
import { INITIAL_PROPERTIES } from "./data/initialProperties";
import { SmoothScrollProvider } from "./components/SmoothScroll";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { CinematicTour } from "./components/CinematicTour";
import { ArchitecturalBuilderStudio } from "./components/ArchitecturalBuilderStudio";
import { PropertyDiscovery } from "./components/PropertyDiscovery";
import { PropertyDetailModal } from "./components/PropertyDetailModal";
import { HomeValuationSection } from "./components/HomeValuationSection";
import { WhatsAppBookingModal } from "./components/WhatsAppBookingModal";
import { AIConciergeModal } from "./components/AIConciergeModal";
import { AdminDashboard } from "./components/AdminDashboard";
import { Footer } from "./components/Footer";

export function App() {
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [tourProperty, setTourProperty] = useState<Property>(INITIAL_PROPERTIES[0]);

  // Modals state
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [bookingPropertyTitle, setBookingPropertyTitle] = useState<string>("The Oak Residence");
  const [isConciergeOpen, setIsConciergeOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // Fetch properties from backend server
  const loadProperties = async () => {
    try {
      const res = await fetch("/api/properties");
      if (res.ok) {
        const data = await res.json();
        if (data.properties && data.properties.length > 0) {
          setProperties(data.properties);
        }
      }
    } catch (err) {
      console.error("Using offline property catalog:", err);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  // Smooth scroll progress tracker for top indicator
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001
  });

  // Handlers
  const handleSelectProperty = (prop: Property) => {
    setSelectedProperty(prop);
    setIsDetailOpen(true);
  };

  const handleQuick3DTour = (prop: Property) => {
    setTourProperty(prop);
    const tourSection = document.getElementById("cinematic-tour");
    if (tourSection) {
      tourSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleBookTour = (propTitle?: string) => {
    setBookingPropertyTitle(propTitle || tourProperty.title);
    setIsBookingOpen(true);
  };

  const handleWhatsApp = (propTitle?: string) => {
    const title = propTitle || tourProperty.title;
    const msg = encodeURIComponent(
      `Hello Smith & Stone Private Office, I am interested in inquiring about ${title}. Please connect me with the exclusive listing partner.`
    );
    window.open(`https://wa.me/919820154321?text=${msg}`, "_blank");
  };

  const handleLaunchCinematicFromModal = (prop: Property) => {
    setTourProperty(prop);
    const tourSection = document.getElementById("cinematic-tour");
    if (tourSection) {
      tourSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <SmoothScrollProvider>
      <div className="min-h-screen bg-[#07080a] text-neutral-100 font-sans selection:bg-[#c5a880] selection:text-[#0c0d11] relative">
        {/* Luxury Top Scroll Progress Bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#c5a880] via-[#fde68a] to-[#c5a880] origin-left z-50 pointer-events-none shadow-[0_0_12px_rgba(197,168,128,0.8)]"
          style={{ scaleX }}
        />

        {/* Top Floating Navigation */}
        <Navbar
          onOpenConcierge={() => setIsConciergeOpen(true)}
          onOpenBookTour={() => handleBookTour()}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onWhatsApp={() => handleWhatsApp()}
        />

        {/* Main Fullscreen Hero */}
        <Hero
          onExploreClick={() => {
            const elem = document.getElementById("properties");
            elem?.scrollIntoView({ behavior: "smooth" });
          }}
          onLaunchCinematic={() => {
            const elem = document.getElementById("cinematic-tour");
            elem?.scrollIntoView({ behavior: "smooth" });
          }}
          onBookTour={() => handleBookTour()}
          featuredProperty={tourProperty}
        />

        {/* Flagship Immersive Cinematic & 3D Tour Experience */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <CinematicTour
            property={tourProperty}
            onBookTour={(title) => handleBookTour(title)}
            onWhatsApp={(title) => handleWhatsApp(title)}
            onViewFloorPlan={() => handleSelectProperty(tourProperty)}
          />
        </motion.div>

        {/* Bespoke Architectural Concepts & 3D Typology Studio (Home, Building, Apartment, 3-Layer, Villa, Royal House) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <ArchitecturalBuilderStudio
            onBookConsultation={(buildingTitle, zone) => {
              const title = zone ? `${buildingTitle} (${zone})` : buildingTitle;
              handleBookTour(`Architectural Design Consultation: ${title}`);
            }}
            onWhatsApp={(buildingTitle, zone) => {
              const title = zone ? `${buildingTitle} (${zone})` : buildingTitle;
              handleWhatsApp(`Custom Build Blueprint for ${title}`);
            }}
          />
        </motion.div>

        {/* Curated Properties Search, Filter & Interactive Map */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <PropertyDiscovery
            properties={properties}
            onSelectProperty={handleSelectProperty}
            onQuick3DTour={handleQuick3DTour}
            onWhatsApp={handleWhatsApp}
          />
        </motion.div>

        {/* Instant Home Valuation & Seller Advisory */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <HomeValuationSection />
        </motion.div>

        {/* Footer & Global Representation Desks */}
        <Footer
          onOpenBookTour={() => handleBookTour()}
          onOpenConcierge={() => setIsConciergeOpen(true)}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onWhatsApp={() => handleWhatsApp()}
        />

        {/* Comprehensive Property Detail Modal */}
        <PropertyDetailModal
          property={selectedProperty}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          onLaunchCinematicTour={handleLaunchCinematicFromModal}
          onBookTour={handleBookTour}
          onWhatsApp={handleWhatsApp}
        />

        {/* WhatsApp Private Tour Booking Modal */}
        <WhatsAppBookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          defaultPropertyTitle={bookingPropertyTitle}
        />

        {/* AI Property Concierge Advisor Modal */}
        <AIConciergeModal
          isOpen={isConciergeOpen}
          onClose={() => setIsConciergeOpen(false)}
          properties={properties}
          onSelectProperty={handleSelectProperty}
          onBookTour={handleBookTour}
        />

        {/* CRM & Property Management Dashboard Portal */}
        {isAdminOpen && (
          <AdminDashboard
            properties={properties}
            onClose={() => setIsAdminOpen(false)}
            onRefreshProperties={loadProperties}
          />
        )}

        {/* Floating AI Concierge Quick Trigger Button in Bottom Right */}
        <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-3">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsConciergeOpen(true)}
            className="group relative flex items-center gap-3 bg-[#11131a]/95 hover:bg-[#c5a880] text-white hover:text-[#0c0d11] p-3.5 pr-5 rounded-full border border-[#c5a880]/50 shadow-2xl transition-all duration-300 cursor-pointer"
            aria-label="Open AI Property Concierge"
          >
            <div className="w-8 h-8 rounded-full bg-[#c5a880] group-hover:bg-[#0c0d11] text-[#0c0d11] group-hover:text-[#c5a880] flex items-center justify-center font-serif font-bold text-sm">
              ✦
            </div>
            <div className="text-left">
              <span className="text-[10px] uppercase tracking-wider block opacity-75 font-mono">
                Ask Concierge
              </span>
              <span className="text-xs font-serif font-semibold tracking-wide block">
                Private Advisor
              </span>
            </div>
          </motion.button>
        </div>
      </div>
    </SmoothScrollProvider>
  );
}

export default App;
