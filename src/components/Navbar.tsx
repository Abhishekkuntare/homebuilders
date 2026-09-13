import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSmoothScroll } from "./SmoothScroll";

import {
  Volume2,
  VolumeX,
  Menu,
  X,
  Calendar,
  Sparkles,
  Shield,
  ArrowRight,
  MessageCircle,
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
  onWhatsApp,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAmbientSoundOn, setIsAmbientSoundOn] = useState(false);

  const { scrollTo } = useSmoothScroll();

  /* =========================================================
     SCROLL
  ========================================================= */

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* =========================================================
     LOCK BODY WHEN MOBILE MENU IS OPEN
  ========================================================= */

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  /* =========================================================
     CLOSE MOBILE MENU ON RESIZE
  ========================================================= */

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);

    window.setTimeout(() => {
      scrollTo(id, {
        offset: -20,
        duration: 1.3,
      });
    }, 100);
  };

  /* =========================================================
     ACTIONS
  ========================================================= */

  const handleConcierge = () => {
    setIsMobileMenuOpen(false);
    onOpenConcierge();
  };

  const handleBookTour = () => {
    setIsMobileMenuOpen(false);
    onOpenBookTour();
  };

  const handleAdmin = () => {
    setIsMobileMenuOpen(false);
    onOpenAdmin();
  };

  const handleWhatsApp = () => {
    setIsMobileMenuOpen(false);
    onWhatsApp();
  };

  const toggleAmbience = () => {
    setIsAmbientSoundOn((prev) => !prev);
  };

  return (
    <>
      {/* =====================================================
          MAIN NAVBAR
          IMPORTANT:
          Mobile drawer is NOT inside this element.
      ===================================================== */}

      <motion.header
        initial={{
          y: -30,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.7,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={`
          fixed
          inset-x-0
          top-0
          z-[100]
          w-full
          max-w-none
          transition-all
          duration-500
          ${
            isScrolled
              ? "bg-[#0b0c10]/95 backdrop-blur-xl border-b border-neutral-800/80 shadow-2xl"
              : "bg-gradient-to-b from-black/85 via-black/35 to-transparent"
          }
        `}
      >
        {/* =================================================
            NAVBAR CONTAINER
        ================================================= */}

        <div
          className={`
            mx-auto
            w-full
            max-w-[1600px]
            px-4
            sm:px-5
            md:px-8
            lg:px-10
            xl:px-12
            2xl:px-16
            ${
              isScrolled
                ? "py-3 sm:py-3.5"
                : "py-4 sm:py-5 md:py-6"
            }
          `}
        >
          <div className="flex w-full min-w-0 items-center justify-between">
            {/* =================================================
                LOGO
            ================================================= */}

            <a
              href="#"
              onClick={() => setIsMobileMenuOpen(false)}
              className="
                flex
                min-w-0
                shrink
                items-center
                gap-2.5
                sm:gap-3
              "
            >
              {/* Monogram */}

              <div
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-[#c5a880]/60
                  bg-[#13151d]
                  font-serif
                  text-base
                  tracking-wider
                  text-[#c5a880]
                  transition-all
                  duration-300
                  hover:border-[#c5a880]
                  sm:h-9
                  sm:w-9
                  sm:text-lg
                  md:h-10
                  md:w-10
                "
              >
                H
              </div>

              {/* Brand */}

              <div className="min-w-0">
                <span
                  className="
                    block
                    truncate
                    font-serif
                    text-[13px]
                    uppercase
                    tracking-[0.12em]
                    text-neutral-100
                    sm:text-base
                    sm:tracking-[0.16em]
                    md:text-lg
                    lg:text-xl
                    lg:tracking-[0.2em]
                  "
                >
               Homebuilders
                </span>

                <span
                  className="
                    block
                    truncate
                    text-[7px]
                    font-light
                    uppercase
                    tracking-[0.2em]
                    text-[#c5a880]
                    sm:text-[8px]
                    sm:tracking-[0.25em]
                    md:text-[9px]
                    md:tracking-[0.3em]
                  "
                >
                  Private Real Estate
                </span>
              </div>
            </a>

            {/* =================================================
                DESKTOP NAVIGATION
            ================================================= */}

            <nav
              className="
                hidden
                xl:flex
                flex-1
                items-center
                justify-center
                gap-5
                px-6
                2xl:gap-8
              "
            >
              <button
                type="button"
                onClick={() =>
                  scrollToSection("properties")
                }
                className="
                  whitespace-nowrap
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.15em]
                  text-neutral-300
                  transition-colors
                  hover:text-[#c5a880]
                  2xl:text-xs
                  2xl:tracking-[0.18em]
                "
              >
                Properties
              </button>

              <button
                type="button"
                onClick={() =>
                  scrollToSection("cinematic-tour")
                }
                className="
                  flex
                  items-center
                  gap-1.5
                  whitespace-nowrap
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.15em]
                  text-neutral-300
                  transition-colors
                  hover:text-[#c5a880]
                  2xl:text-xs
                  2xl:tracking-[0.18em]
                "
              >
                <span>3D Room Tour</span>

                <span
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-[#c5a880]
                    animate-pulse
                  "
                />
              </button>

              <button
                type="button"
                onClick={() =>
                  scrollToSection("architectural-builder")
                }
                className="
                  flex
                  items-center
                  gap-1.5
                  whitespace-nowrap
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.15em]
                  text-[#c5a880]
                  transition-colors
                  hover:text-[#dfc49d]
                  2xl:text-xs
                  2xl:tracking-[0.18em]
                "
              >
                <span>What to Build</span>

                <span
                  className="
                    rounded
                    border
                    border-[#c5a880]/40
                    bg-[#c5a880]/15
                    px-1.5
                    py-0.5
                    font-mono
                    text-[8px]
                    tracking-normal
                    2xl:text-[9px]
                  "
                >
                  3D
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  scrollToSection("valuation")
                }
                className="
                  whitespace-nowrap
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.15em]
                  text-neutral-300
                  transition-colors
                  hover:text-[#c5a880]
                  2xl:text-xs
                  2xl:tracking-[0.18em]
                "
              >
                Valuation
              </button>

              <button
                type="button"
                onClick={onOpenConcierge}
                className="
                  flex
                  items-center
                  gap-1.5
                  whitespace-nowrap
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.15em]
                  text-[#c5a880]
                  transition-colors
                  hover:text-[#dfc49d]
                  2xl:text-xs
                  2xl:tracking-[0.18em]
                "
              >
                <Sparkles className="h-3.5 w-3.5" />

                <span>AI Concierge</span>
              </button>
            </nav>

            {/* =================================================
                DESKTOP ACTIONS
            ================================================= */}

            <div
              className="
                hidden
                shrink-0
                items-center
                gap-2
                lg:flex
                xl:gap-2.5
              "
            >
              {/* Ambient */}

              <button
                type="button"
                onClick={toggleAmbience}
                aria-label={
                  isAmbientSoundOn
                    ? "Mute ambient sound"
                    : "Enable ambient sound"
                }
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  text-neutral-400
                  transition-colors
                  hover:bg-neutral-800/60
                  hover:text-white
                "
              >
                {isAmbientSoundOn ? (
                  <Volume2 className="h-4 w-4 text-[#c5a880]" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </button>

              {/* CRM */}

              <button
                type="button"
                onClick={onOpenAdmin}
                className="
                  flex
                  items-center
                  gap-1.5
                  whitespace-nowrap
                  rounded-lg
                  border
                  border-neutral-700/80
                  px-3
                  py-2
                  text-[10px]
                  uppercase
                  tracking-wider
                  text-neutral-300
                  transition-all
                  hover:border-neutral-500
                  hover:text-white
                "
              >
                <Shield className="h-3.5 w-3.5 text-[#c5a880]" />

                <span>CRM</span>
              </button>

              {/* Book Tour */}

              <button
                type="button"
                onClick={onOpenBookTour}
                className="
                  group
                  flex
                  items-center
                  gap-1.5
                  whitespace-nowrap
                  rounded-xl
                  bg-[#c5a880]
                  px-4
                  py-2.5
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-widest
                  text-[#0c0d11]
                  shadow-lg
                  shadow-[#c5a880]/15
                  transition-all
                  hover:bg-[#d5ba92]
                  2xl:px-5
                  2xl:text-xs
                "
              >
                <Calendar className="h-3.5 w-3.5" />

                <span>Book Tour</span>

                <ArrowRight
                  className="
                    h-3
                    w-3
                    transition-transform
                    group-hover:translate-x-0.5
                  "
                />
              </button>
            </div>

            {/* =================================================
                MOBILE / TABLET ACTIONS
            ================================================= */}

            <div
              className="
                flex
                shrink-0
                items-center
                gap-1
                lg:hidden
              "
            >
              {/* AI */}

              <button
                type="button"
                onClick={handleConcierge}
                aria-label="AI Concierge"
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  text-[#c5a880]
                  transition-colors
                  hover:bg-[#c5a880]/10
                  sm:h-11
                  sm:w-11
                "
              >
                <Sparkles className="h-5 w-5" />
              </button>

              {/* Menu */}

              <button
                type="button"
                onClick={() =>
                  setIsMobileMenuOpen((prev) => !prev)
                }
                aria-label={
                  isMobileMenuOpen
                    ? "Close menu"
                    : "Open menu"
                }
                aria-expanded={isMobileMenuOpen}
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  text-neutral-200
                  transition-colors
                  hover:bg-neutral-800/60
                  hover:text-white
                  sm:h-11
                  sm:w-11
                "
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* =======================================================
          MOBILE MENU
          
          VERY IMPORTANT:
          This is OUTSIDE motion.header.
          
          Therefore:
          - no transformed parent
          - no broken fixed positioning
          - no 264px width issue
          - uses actual viewport width
      ======================================================= */}

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* =================================================
                BACKDROP
            ================================================= */}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() =>
                setIsMobileMenuOpen(false)
              }
              className="
                fixed
                inset-0
                z-[110]
                bg-black/60
                backdrop-blur-sm
                xl:hidden
              "
            />

            {/* =================================================
                MOBILE DRAWER
            ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
                x: "100%",
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: "100%",
              }}
              transition={{
                duration: 0.35,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="
                fixed
                right-0
                top-0
                z-[120]
                flex
                h-[100dvh]
                w-full
                max-w-[430px]
                flex-col
                overflow-hidden
                bg-[#0c0d11]
                shadow-2xl
                xl:hidden
              "
              style={{
                width: "min(100vw, 430px)",
              }}
            >
              {/* =================================================
                  DRAWER HEADER
              ================================================= */}

              <div
                className="
                  flex
                  h-[72px]
                  shrink-0
                  items-center
                  justify-between
                  border-b
                  border-neutral-800
                  px-5
                  sm:h-[80px]
                  sm:px-7
                "
              >
                <div>
                  <p
                    className="
                      font-serif
                      text-lg
                      uppercase
                      tracking-[0.15em]
                      text-neutral-100
                    "
                  >
                 Homebuilders
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-[7px]
                      uppercase
                      tracking-[0.3em]
                      text-[#c5a880]
                    "
                  >
                    Private Real Estate
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setIsMobileMenuOpen(false)
                  }
                  aria-label="Close navigation"
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-lg
                    text-neutral-300
                    transition-colors
                    hover:bg-neutral-800
                    hover:text-white
                  "
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* =================================================
                  SCROLLABLE CONTENT
              ================================================= */}

              <div
                className="
                  flex-1
                  overflow-y-auto
                  overscroll-contain
                  px-5
                  py-6
                  sm:px-7
                  sm:py-8
                "
              >
                <div className="space-y-1">
                  {/* Collection */}

                  <button
                    type="button"
                    onClick={() =>
                      scrollToSection("properties")
                    }
                    className="
                      group
                      flex
                      w-full
                      items-center
                      justify-between
                      rounded-xl
                      px-3
                      py-4
                      text-left
                      transition-all
                      hover:bg-neutral-800/50
                      sm:py-5
                    "
                  >
                    <span
                      className="
                        font-serif
                        text-2xl
                        text-neutral-200
                        group-hover:text-[#c5a880]
                        sm:text-3xl
                      "
                    >
                      Collection
                    </span>

                    <ArrowRight
                      className="
                        h-4
                        w-4
                        text-neutral-600
                        transition-transform
                        group-hover:translate-x-1
                        group-hover:text-[#c5a880]
                      "
                    />
                  </button>

                  {/* Cinematic Tour */}

                  <button
                    type="button"
                    onClick={() =>
                      scrollToSection("cinematic-tour")
                    }
                    className="
                      group
                      flex
                      w-full
                      items-center
                      justify-between
                      rounded-xl
                      px-3
                      py-4
                      text-left
                      transition-all
                      hover:bg-neutral-800/50
                      sm:py-5
                    "
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className="
                          mt-2
                          h-1.5
                          w-1.5
                          shrink-0
                          rounded-full
                          bg-[#c5a880]
                          animate-pulse
                        "
                      />

                      <span
                        className="
                          font-serif
                          text-2xl
                          leading-tight
                          text-neutral-200
                          group-hover:text-[#c5a880]
                          sm:text-3xl
                        "
                      >
                        Cinematic & 3D Walkthrough
                      </span>
                    </div>

                    <ArrowRight
                      className="
                        ml-3
                        h-4
                        w-4
                        shrink-0
                        text-neutral-600
                        transition-transform
                        group-hover:translate-x-1
                        group-hover:text-[#c5a880]
                      "
                    />
                  </button>

                  {/* What to Build */}

                  <button
                    type="button"
                    onClick={() =>
                      scrollToSection(
                        "architectural-builder"
                      )
                    }
                    className="
                      group
                      flex
                      w-full
                      items-center
                      justify-between
                      rounded-xl
                      border
                      border-[#c5a880]/20
                      bg-[#c5a880]/5
                      px-3
                      py-4
                      text-left
                      transition-all
                      hover:border-[#c5a880]/40
                      hover:bg-[#c5a880]/10
                      sm:py-5
                    "
                  >
                    <div>
                      <span
                        className="
                          block
                          font-serif
                          text-2xl
                          leading-tight
                          text-[#c5a880]
                          sm:text-3xl
                        "
                      >
                        What to Build
                      </span>

                      <span
                        className="
                          mt-2
                          inline-block
                          rounded
                          border
                          border-[#c5a880]/40
                          bg-[#c5a880]/10
                          px-2
                          py-1
                          font-mono
                          text-[8px]
                          tracking-wider
                          text-[#c5a880]
                        "
                      >
                        3D CONCEPTS
                      </span>
                    </div>

                    <ArrowRight
                      className="
                        ml-3
                        h-4
                        w-4
                        shrink-0
                        text-[#c5a880]/60
                        transition-transform
                        group-hover:translate-x-1
                        group-hover:text-[#c5a880]
                      "
                    />
                  </button>

                  {/* Valuation */}

                  <button
                    type="button"
                    onClick={() =>
                      scrollToSection("valuation")
                    }
                    className="
                      group
                      flex
                      w-full
                      items-center
                      justify-between
                      rounded-xl
                      px-3
                      py-4
                      text-left
                      transition-all
                      hover:bg-neutral-800/50
                      sm:py-5
                    "
                  >
                    <span
                      className="
                        font-serif
                        text-2xl
                        text-neutral-200
                        group-hover:text-[#c5a880]
                        sm:text-3xl
                      "
                    >
                      Appraisals & Valuation
                    </span>

                    <ArrowRight
                      className="
                        h-4
                        w-4
                        shrink-0
                        text-neutral-600
                        transition-transform
                        group-hover:translate-x-1
                        group-hover:text-[#c5a880]
                      "
                    />
                  </button>

                  {/* AI Concierge */}

                  <button
                    type="button"
                    onClick={handleConcierge}
                    className="
                      group
                      flex
                      w-full
                      items-center
                      justify-between
                      rounded-xl
                      px-3
                      py-4
                      text-left
                      transition-all
                      hover:bg-neutral-800/50
                      sm:py-5
                    "
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles className="h-5 w-5 shrink-0 text-[#c5a880]" />

                      <span
                        className="
                          font-serif
                          text-2xl
                          text-[#c5a880]
                          sm:text-3xl
                        "
                      >
                        AI Concierge
                      </span>
                    </div>

                    <ArrowRight
                      className="
                        h-4
                        w-4
                        shrink-0
                        text-[#c5a880]/60
                        transition-transform
                        group-hover:translate-x-1
                        group-hover:text-[#c5a880]
                      "
                    />
                  </button>
                </div>

                {/* Divider */}

                <div className="my-6 h-px bg-neutral-800" />

                {/* CRM */}

                <button
                  type="button"
                  onClick={handleAdmin}
                  className="
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-neutral-800
                    bg-neutral-900/50
                    px-4
                    py-4
                    text-xs
                    font-medium
                    uppercase
                    tracking-[0.18em]
                    text-neutral-400
                    transition-all
                    hover:border-[#c5a880]/40
                    hover:text-[#c5a880]
                  "
                >
                  <Shield className="h-4 w-4" />

                  <span>Advisor CRM Portal</span>
                </button>

                {/* =================================================
                    ACTIONS
                ================================================= */}

                <div className="mt-8 space-y-3">
                  {/* Book Tour */}

                  <button
                    type="button"
                    onClick={handleBookTour}
                    className="
                      group
                      flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-[#c5a880]
                      px-5
                      py-4
                      text-xs
                      font-semibold
                      uppercase
                      tracking-[0.16em]
                      text-[#0c0d11]
                      shadow-xl
                      shadow-[#c5a880]/10
                      transition-all
                      hover:bg-[#d5ba92]
                    "
                  >
                    <Calendar className="h-4 w-4" />

                    <span>Schedule Private Viewing</span>

                    <ArrowRight
                      className="
                        h-3.5
                        w-3.5
                        transition-transform
                        group-hover:translate-x-0.5
                      "
                    />
                  </button>

                  {/* WhatsApp */}

                  <button
                    type="button"
                    onClick={handleWhatsApp}
                    className="
                      flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      border-emerald-500/30
                      bg-emerald-600/10
                      px-5
                      py-4
                      text-xs
                      font-semibold
                      uppercase
                      tracking-[0.14em]
                      text-emerald-300
                      transition-all
                      hover:border-emerald-400/50
                      hover:bg-emerald-600/20
                    "
                  >
                    <MessageCircle className="h-4 w-4 text-emerald-400" />

                    <span>WhatsApp Direct Desk</span>
                  </button>
                </div>

                {/* =================================================
                    AMBIENT SOUND
                ================================================= */}

                <button
                  type="button"
                  onClick={toggleAmbience}
                  className="
                    mx-auto
                    mt-6
                    flex
                    items-center
                    gap-2
                    text-[9px]
                    uppercase
                    tracking-[0.25em]
                    text-neutral-600
                    transition-colors
                    hover:text-neutral-300
                  "
                >
                  {isAmbientSoundOn ? (
                    <>
                      <Volume2 className="h-3.5 w-3.5 text-[#c5a880]" />
                      <span>Ambient Sound On</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="h-3.5 w-3.5" />
                      <span>Ambient Sound Off</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
