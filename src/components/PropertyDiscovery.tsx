import React, { useState, useMemo } from "react";
import { Property, PropertyType } from "../types";
import { PropertyCard } from "./PropertyCard";
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  Map as MapIcon,
  X,
  MapPin,
  Bed,
  Bath,
  ArrowRight,
  Filter,
  Check
} from "lucide-react";

interface PropertyDiscoveryProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onQuick3DTour: (property: Property) => void;
  onWhatsApp: (propertyTitle: string) => void;
}

export const PropertyDiscovery: React.FC<PropertyDiscoveryProps> = ({
  properties,
  onSelectProperty,
  onQuick3DTour,
  onWhatsApp
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedBeds, setSelectedBeds] = useState<number>(0);
  const [sortBy, setSortBy] = useState<"featured" | "price-desc" | "price-asc" | "area-desc">("featured");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [selectedMapProperty, setSelectedMapProperty] = useState<Property | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // Unique lists for quick filter chips
  const cities = useMemo(() => {
    const list = Array.from(new Set(properties.map((p) => p.city)));
    return ["ALL", ...list];
  }, [properties]);

  const propertyTypes = ["ALL", "Apartment", "Penthouse", "Villa", "Bungalow", "Estate"];

  const allAmenities = [
    "Private Heated Plunge Pool",
    "Private High-Speed Elevator",
    "Smart Home Biometric Automation",
    "Gaggenau & Sub-Zero Fitted Kitchen",
    "Sonance Architectural In-Wall Audio",
    "Championship Regulation Tennis Court"
  ];

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  // Filtered and sorted properties
  const filteredProperties = useMemo(() => {
    return properties
      .filter((item) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchLoc = item.location.toLowerCase().includes(q);
          const matchCity = item.city.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          if (!matchTitle && !matchLoc && !matchCity && !matchDesc) return false;
        }

        // City filter
        if (selectedCity !== "ALL" && item.city !== selectedCity) return false;

        // Type filter
        if (selectedType !== "ALL" && item.propertyType !== selectedType) return false;

        // Bedrooms filter
        if (selectedBeds > 0 && item.bedrooms < selectedBeds) return false;

        // Amenities filter
        if (selectedAmenities.length > 0) {
          const hasAllAmenities = selectedAmenities.every((a) =>
            item.amenities.some((itemAmenity) =>
              itemAmenity.toLowerCase().includes(a.toLowerCase().slice(0, 10))
            )
          );
          if (!hasAllAmenities) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "area-desc") return b.area - a.area;
        // Default featured
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [properties, searchQuery, selectedCity, selectedType, selectedBeds, selectedAmenities, sortBy]);

  return (
    <section id="properties" className="w-full bg-[#0a0b0e] py-20 px-4 md:px-8 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#c5a880]" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#c5a880] font-medium">
                Prime Global Collection
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-5xl text-white tracking-tight">
              Curated Architectural Residences
            </h2>
            <p className="text-neutral-400 text-sm md:text-base mt-2 max-w-xl font-light">
              Discover prime trophy residences, waterfront villas, and skyline penthouses curated by Smith & Stone.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-3">
            <div className="bg-[#14161f] p-1 rounded-xl border border-neutral-800 flex items-center gap-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                  viewMode === "grid"
                    ? "bg-[#c5a880] text-[#0c0d11] font-semibold shadow-md"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Editorial Grid</span>
              </button>

              <button
                onClick={() => setViewMode("map")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                  viewMode === "map"
                    ? "bg-[#c5a880] text-[#0c0d11] font-semibold shadow-md"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Interactive Map</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-[#12141a] rounded-2xl border border-neutral-800/90 p-4 mb-8 shadow-xl">
          <div className="flex flex-col lg:flex-row items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by residence title, neighborhood, or architectural style..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#181a24] text-white pl-11 pr-4 py-3 rounded-xl border border-neutral-800 focus:outline-none focus:border-[#c5a880] text-xs placeholder:text-neutral-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

          {/* =========================================================
    PROPERTY FILTERS
========================================================= */}

<div className="w-full">
  <div
    className="
      grid
      w-full
      grid-cols-1
      gap-2.5
      sm:grid-cols-2
      sm:gap-3
      lg:flex
      lg:items-center
      lg:gap-2.5
      xl:gap-3
    "
  >
    {/* =====================================================
        CITY DROPDOWN
    ===================================================== */}

    <div className="w-full min-w-0 lg:flex-1">
      <select
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
        className="
          block
          h-12
          w-full
          min-w-0
          appearance-none
          rounded-xl
          border
          border-neutral-800
          bg-[#181a24]
          px-4
          pr-10
          text-xs
          text-neutral-200
          outline-none
          transition-all
          duration-200
          cursor-pointer
          hover:border-neutral-700
          focus:border-[#c5a880]
          focus:ring-1
          focus:ring-[#c5a880]/20
          sm:h-[46px]
          lg:h-11
          xl:px-4
        "
      >
        <option value="ALL">All Destinations</option>

        {cities
          .filter((c) => c !== "ALL")
          .map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
      </select>
    </div>

    {/* =====================================================
        PROPERTY TYPE
    ===================================================== */}

    <div className="w-full min-w-0 lg:flex-1">
      <select
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
        className="
          block
          h-12
          w-full
          min-w-0
          appearance-none
          rounded-xl
          border
          border-neutral-800
          bg-[#181a24]
          px-4
          pr-10
          text-xs
          text-neutral-200
          outline-none
          transition-all
          duration-200
          cursor-pointer
          hover:border-neutral-700
          focus:border-[#c5a880]
          focus:ring-1
          focus:ring-[#c5a880]/20
          sm:h-[46px]
          lg:h-11
          xl:px-4
        "
      >
        <option value="ALL">All Typologies</option>

        {propertyTypes
          .filter((t) => t !== "ALL")
          .map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
      </select>
    </div>

    {/* =====================================================
        SORT DROPDOWN
    ===================================================== */}

    <div className="w-full min-w-0 sm:col-span-2 lg:col-span-1 lg:flex-1">
      <select
        value={sortBy}
        onChange={(e) =>
          setSortBy(e.target.value as any)
        }
        className="
          block
          h-12
          w-full
          min-w-0
          appearance-none
          rounded-xl
          border
          border-neutral-800
          bg-[#181a24]
          px-4
          pr-10
          text-xs
          text-neutral-200
          outline-none
          transition-all
          duration-200
          cursor-pointer
          hover:border-neutral-700
          focus:border-[#c5a880]
          focus:ring-1
          focus:ring-[#c5a880]/20
          sm:h-[46px]
          lg:h-11
          xl:px-4
        "
      >
        <option value="featured">
          Sort: Featured Collection
        </option>

        <option value="price-desc">
          Price: High to Low
        </option>

        <option value="price-asc">
          Price: Low to High
        </option>

        <option value="area-desc">
          Area: Largest First
        </option>
      </select>
    </div>

    {/* =====================================================
        ADVANCED FILTER / REFINE
    ===================================================== */}

    <div className="w-full sm:col-span-2 lg:col-span-1 lg:w-auto lg:shrink-0">
      <button
        type="button"
        onClick={() =>
          setIsFilterDrawerOpen(!isFilterDrawerOpen)
        }
        className={`
          flex
          h-12
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          px-4
          text-xs
          font-medium
          uppercase
          tracking-wider
          transition-all
          duration-200
          sm:h-[46px]
          lg:h-11
          lg:w-auto
          lg:min-w-[100px]
          ${
            selectedAmenities.length > 0 ||
            selectedBeds > 0
              ? "border-[#c5a880] bg-[#c5a880]/20 text-[#c5a880] hover:bg-[#c5a880]/25"
              : "border-neutral-800 bg-[#181a24] text-neutral-400 hover:border-neutral-700 hover:text-white"
          }
        `}
        title="Advanced Architectural Filters"
      >
        <SlidersHorizontal className="h-4 w-4 shrink-0" />

        <span>Refine</span>

        {(selectedAmenities.length > 0 ||
          selectedBeds > 0) && (
          <span
            className="
              flex
              h-5
              min-w-5
              items-center
              justify-center
              rounded-full
              bg-[#c5a880]
              px-1.5
              text-[9px]
              font-bold
              text-[#0c0d11]
            "
          >
            {selectedAmenities.length +
              (selectedBeds > 0 ? 1 : 0)}
          </span>
        )}
      </button>
    </div>
  </div>
</div>
          </div>

          {/* Quick Filter Chips (City Pills) */}
          <div className="flex items-center gap-2 overflow-x-auto mt-4 pt-3 border-t border-neutral-800/80 scrollbar-none">
            <span className="text-[11px] text-neutral-500 uppercase tracking-wider whitespace-nowrap mr-2">
              Regions:
            </span>
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide whitespace-nowrap transition-all ${
                  selectedCity === city
                    ? "bg-[#c5a880] text-[#0c0d11]"
                    : "bg-[#181a24] text-neutral-400 hover:text-white border border-neutral-800"
                }`}
              >
                {city === "ALL" ? "All Locations" : city}
              </button>
            ))}

            <div className="h-4 w-px bg-neutral-800 mx-2" />

            <span className="text-[11px] text-neutral-500 uppercase tracking-wider whitespace-nowrap mr-2">
              Bedrooms:
            </span>
            {[0, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                onClick={() => setSelectedBeds(num)}
                className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide whitespace-nowrap transition-all ${
                  selectedBeds === num
                    ? "bg-[#c5a880] text-[#0c0d11]"
                    : "bg-[#181a24] text-neutral-400 hover:text-white border border-neutral-800"
                }`}
              >
                {num === 0 ? "Any Beds" : `${num}+ Beds`}
              </button>
            ))}
          </div>

          {/* Advanced Filter Collapsible Tray */}
          {isFilterDrawerOpen && (
            <div className="mt-4 pt-4 border-t border-neutral-800 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 animate-fadeIn">
              {allAmenities.map((amenity) => {
                const checked = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    onClick={() => toggleAmenity(amenity)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-lg text-left text-xs border transition-colors ${
                      checked
                        ? "bg-[#c5a880]/15 border-[#c5a880] text-[#ede9e3]"
                        : "bg-[#181a24] border-neutral-800 text-neutral-400 hover:text-white"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center ${
                        checked ? "bg-[#c5a880] border-[#c5a880]" : "border-neutral-700"
                      }`}
                    >
                      {checked && <Check className="w-3 h-3 text-[#0c0d11]" />}
                    </div>
                    <span className="truncate">{amenity}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-neutral-400 mb-6">
          <p>
            Displaying <span className="text-white font-medium">{filteredProperties.length}</span>{" "}
            residences
          </p>
          {(searchQuery || selectedCity !== "ALL" || selectedType !== "ALL" || selectedBeds > 0 || selectedAmenities.length > 0) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCity("ALL");
                setSelectedType("ALL");
                setSelectedBeds(0);
                setSelectedAmenities([]);
              }}
              className="text-[#c5a880] hover:underline"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* View Mode A: Editorial Grid View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onSelect={onSelectProperty}
                onQuick3DTour={onQuick3DTour}
                onWhatsApp={onWhatsApp}
              />
            ))}
          </div>
        )}

        {/* View Mode B: Architectural Map View */}
        {viewMode === "map" && (
          <div className="relative w-full h-[620px] rounded-2xl overflow-hidden bg-[#0c0d12] border border-neutral-800 shadow-2xl">
            {/* Architectural Stylized Dark Vector Map Canvas */}
            <div className="absolute inset-0 bg-[#0e1017] p-8 flex items-center justify-center overflow-hidden">
              {/* Decorative Map Grid Lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1b1f2a_1px,transparent_1px),linear-gradient(to_bottom,#1b1f2a_1px,transparent_1px)] bg-[size:48px_48px] opacity-40" />

              {/* Stylized Coastline / Geography Curves */}
              <svg className="absolute inset-0 w-full h-full stroke-neutral-800/80 fill-none pointer-events-none" viewBox="0 0 1000 600">
                <path d="M 0 320 Q 250 220, 480 340 T 1000 280" strokeWidth="2" />
                <path d="M 120 0 Q 300 240, 520 200 T 880 600" strokeWidth="1.5" strokeDasharray="6 6" />
                <circle cx="500" cy="300" r="180" strokeWidth="0.8" strokeDasharray="4 4" className="stroke-[#c5a880]/20" />
                <circle cx="500" cy="300" r="320" strokeWidth="0.8" strokeDasharray="4 4" className="stroke-[#c5a880]/15" />
              </svg>

              {/* Pins for Each Filtered Property */}
              {filteredProperties.map((prop, idx) => {
                // Approximate coordinate projection on map
                const leftPercent = 15 + ((idx * 16) % 70);
                const topPercent = 20 + ((idx * 22) % 60);
                const isSelected = selectedMapProperty?.id === prop.id;

                return (
                  <div
                    key={prop.id}
                    style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                  >
                    {/* Interactive Pin Marker */}
                    <button
                      onClick={() => setSelectedMapProperty(prop)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition-all duration-300 shadow-xl flex items-center gap-1.5 ${
                        isSelected
                          ? "bg-[#c5a880] text-[#0c0d11] border-white scale-110 shadow-[#c5a880]/40"
                          : "bg-[#161822] text-white border-neutral-700 hover:border-[#c5a880] hover:scale-105"
                      }`}
                    >
                      <MapPin className="w-3 h-3 text-[#c5a880]" />
                      <span>{prop.priceFormatted}</span>
                    </button>

                    {/* Subtle pulse ring */}
                    <div className="absolute inset-0 rounded-full border border-[#c5a880]/30 animate-ping pointer-events-none -z-10" />
                  </div>
                );
              })}

              {/* Map Floating Preview Popover for Selected Property */}
              {selectedMapProperty && (
                <div className="absolute bottom-6 left-6 right-6 md:right-auto md:w-96 z-30 bg-[#12141a]/95 backdrop-blur-xl rounded-2xl border border-[#c5a880]/60 p-4 shadow-2xl animate-fadeIn">
                  <div className="flex gap-4">
                    <img
                      src={selectedMapProperty.heroImage}
                      alt={selectedMapProperty.title}
                      referrerPolicy="no-referrer"
                      className="w-24 h-24 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase text-[#c5a880] font-semibold">
                          {selectedMapProperty.city}
                        </span>
                        <button
                          onClick={() => setSelectedMapProperty(null)}
                          className="text-neutral-400 hover:text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4 className="font-serif text-base text-white truncate font-medium">
                        {selectedMapProperty.title}
                      </h4>
                      <p className="font-serif text-lg text-[#c5a880] font-semibold">
                        {selectedMapProperty.priceFormatted}
                      </p>
                      <p className="text-[11px] text-neutral-400">
                        {selectedMapProperty.bedrooms} Bed · {selectedMapProperty.areaFormatted}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-neutral-800 flex items-center justify-between">
                    <button
                      onClick={() => onSelectProperty(selectedMapProperty)}
                      className="text-xs font-semibold text-[#c5a880] hover:underline flex items-center gap-1"
                    >
                      <span>Full Architectural Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onQuick3DTour(selectedMapProperty)}
                      className="text-[11px] px-2.5 py-1 rounded bg-neutral-800 text-white hover:bg-[#c5a880] hover:text-[#0c0d11] transition-colors"
                    >
                      3D Tour
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Map Watermark Indicator */}
            <div className="absolute top-4 left-4 z-10 bg-[#121419]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-neutral-800 text-xs text-neutral-400">
              <span className="text-[#c5a880] font-medium mr-1">Smith & Stone</span> Private Geo-Portal
            </div>
          </div>
        )}

        {/* Empty state if nothing matches */}
        {filteredProperties.length === 0 && (
          <div className="text-center py-20 bg-[#121419] rounded-2xl border border-neutral-800">
            <h3 className="font-serif text-2xl text-white mb-2">No residences match your criteria</h3>
            <p className="text-neutral-400 text-sm max-w-md mx-auto mb-6">
              Our private desk handles off-market listings not published on the public portal. Inquire with an advisor for discreet matching.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCity("ALL");
                setSelectedType("ALL");
                setSelectedBeds(0);
                setSelectedAmenities([]);
              }}
              className="px-6 py-2.5 rounded-xl bg-[#c5a880] text-[#0c0d11] text-xs font-semibold uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
