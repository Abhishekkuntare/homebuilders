import React, { useState } from "react";
import { ValuationResult } from "../types";
import {
  TrendingUp,
  Building2,
  MapPin,
  Maximize,
  Phone,
  Mail,
  User,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Sparkles
} from "lucide-react";

export const HomeValuationSection: React.FC = () => {
  const [propertyType, setPropertyType] = useState<string>("Apartment");
  const [city, setCity] = useState<string>("Mumbai");
  const [area, setArea] = useState<number>(3200);
  const [bedrooms, setBedrooms] = useState<number>(4);
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [valuationResult, setValuationResult] = useState<ValuationResult | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !area) return;

    setLoading(true);
    try {
      const response = await fetch("/api/valuation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city,
          propertyType,
          area: Number(area),
          bedrooms: Number(bedrooms),
          name,
          phone,
          email
        })
      });

      if (response.ok) {
        const data = await response.json();
        setValuationResult(data.valuation);
        setSubmitted(true);
      } else {
        // Fallback calculation
        const baseRate = city === "Dubai" ? 12000 : city === "Mumbai" ? 45000 : 25000;
        const total = area * baseRate;
        const minVal = Math.round(total * 0.95);
        const maxVal = Math.round(total * 1.15);
        setValuationResult({
          minEstimate: minVal,
          maxEstimate: maxVal,
          estimateFormatted: `₹${(minVal / 10000000).toFixed(2)} Cr - ₹${(maxVal / 10000000).toFixed(2)} Cr`,
          pricePerSqFtAverage: baseRate,
          currency: "INR"
        });
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
      // Client fallback
      const baseRate = 38000;
      const total = area * baseRate;
      setValuationResult({
        minEstimate: Math.round(total * 0.95),
        maxEstimate: Math.round(total * 1.15),
        estimateFormatted: `₹${(total * 0.95 / 10000000).toFixed(2)} Cr - ₹${(total * 1.15 / 10000000).toFixed(2)} Cr`,
        pricePerSqFtAverage: baseRate,
        currency: "INR"
      });
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="valuation" className="w-full bg-[#0d0f14] py-24 px-4 md:px-8 border-t border-neutral-800">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Editorial Copy */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#c5a880]" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#c5a880] font-medium">
                Private Advisory & Appraisal
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-5xl text-white tracking-tight leading-tight">
              Wonder what your private residence is worth?
            </h2>
            <p className="text-neutral-400 text-sm md:text-base font-light mt-4 leading-relaxed">
              Smith & Stone provides confidential institutional-grade appraisals for high-value properties in Mumbai, Dubai, Delhi, Goa, and Bangalore.
            </p>

            <div className="mt-8 space-y-4 text-xs text-neutral-300">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#c5a880]/15 flex items-center justify-center text-[#c5a880]">
                  ✓
                </div>
                <span>Ground intelligence based on actual registered registry values</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#c5a880]/15 flex items-center justify-center text-[#c5a880]">
                  ✓
                </div>
                <span>Discreet off-market buyer matching pool of UHNW investors</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#c5a880]/15 flex items-center justify-center text-[#c5a880]">
                  ✓
                </div>
                <span>Strict non-disclosure protocols and private listing desks</span>
              </div>
            </div>
          </div>

          {/* Right Appraisal Form / Calculation Result */}
          <div className="lg:col-span-7">
            <div className="bg-[#13161f] rounded-2xl border border-neutral-800 p-8 md:p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#c5a880]/5 rounded-full blur-3xl pointer-events-none" />

              {!submitted ? (
                <form onSubmit={handleCalculate} className="space-y-6">
                  <h3 className="font-serif text-2xl text-white font-normal">
                    Instant Estimated Valuation Request
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* City Selection */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
                        City / Micro-Market
                      </label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-[#1b1e2a] text-white px-4 py-3 rounded-xl border border-neutral-700 text-xs focus:outline-none focus:border-[#c5a880]"
                      >
                        <option value="Mumbai">Mumbai (Bandra, Worli, Juhu, Malabar Hill)</option>
                        <option value="Dubai">Dubai (Palm Jumeirah, Downtown, Marina, Emirates Hills)</option>
                        <option value="Goa">Goa (Assagao, Anjuna, Moira, Candolim)</option>
                        <option value="Bangalore">Bangalore (Indiranagar, Koramangala, Sadashivanagar)</option>
                        <option value="Pune">Pune (Koregaon Park, Kalyani Nagar)</option>
                        <option value="Delhi NCR">Delhi NCR (Golf Links, Lutyens, Prithviraj)</option>
                      </select>
                    </div>

                    {/* Property Type */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
                        Typology
                      </label>
                      <select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="w-full bg-[#1b1e2a] text-white px-4 py-3 rounded-xl border border-neutral-700 text-xs focus:outline-none focus:border-[#c5a880]"
                      >
                        <option value="Apartment">Luxury Apartment</option>
                        <option value="Penthouse">Sky Penthouse</option>
                        <option value="Villa">Waterfront / Garden Villa</option>
                        <option value="Bungalow">Independent Bungalow</option>
                        <option value="Estate">Sovereign Country Estate</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Area */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
                        Super Built Area (SQ FT)
                      </label>
                      <input
                        type="number"
                        min={500}
                        max={50000}
                        value={area}
                        onChange={(e) => setArea(Number(e.target.value))}
                        className="w-full bg-[#1b1e2a] text-white px-4 py-3 rounded-xl border border-neutral-700 text-xs focus:outline-none focus:border-[#c5a880]"
                        required
                      />
                    </div>

                    {/* Bedrooms */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
                        Bedrooms
                      </label>
                      <select
                        value={bedrooms}
                        onChange={(e) => setBedrooms(Number(e.target.value))}
                        className="w-full bg-[#1b1e2a] text-white px-4 py-3 rounded-xl border border-neutral-700 text-xs focus:outline-none focus:border-[#c5a880]"
                      >
                        <option value={2}>2 Bedrooms</option>
                        <option value={3}>3 Bedrooms</option>
                        <option value={4}>4 Bedrooms</option>
                        <option value={5}>5 Bedrooms</option>
                        <option value={6}>6+ Bedrooms</option>
                      </select>
                    </div>
                  </div>

                  {/* Owner Contact Information */}
                  <div className="pt-4 border-t border-neutral-800 space-y-4">
                    <p className="text-xs text-neutral-400 font-light">
                      Where should our Senior Partner send the verified appraisal dossier?
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <input
                          type="text"
                          placeholder="Your Full Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-[#1b1e2a] text-white px-3.5 py-3 rounded-xl border border-neutral-700 text-xs focus:outline-none focus:border-[#c5a880]"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="tel"
                          placeholder="WhatsApp / Phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-[#1b1e2a] text-white px-3.5 py-3 rounded-xl border border-neutral-700 text-xs focus:outline-none focus:border-[#c5a880]"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="email"
                          placeholder="Email Address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-[#1b1e2a] text-white px-3.5 py-3 rounded-xl border border-neutral-700 text-xs focus:outline-none focus:border-[#c5a880]"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-[#c5a880] hover:bg-[#d5ba92] text-[#0c0d11] font-semibold text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#c5a880]/15 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span>Consulting Market Registry...</span>
                    ) : (
                      <>
                        <span>Calculate Estimated Valuation</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="text-center py-6 animate-fadeIn">
                  <div className="w-14 h-14 rounded-full bg-[#c5a880]/20 text-[#c5a880] flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <span className="text-xs uppercase tracking-widest text-[#c5a880] font-semibold">
                    Appraisal Dossier Generated
                  </span>
                  <h3 className="font-serif text-3xl md:text-4xl text-white font-normal mt-1 mb-2">
                    {valuationResult?.estimateFormatted}
                  </h3>
                  <p className="text-xs text-neutral-400 mb-6">
                    Estimated market value for your {bedrooms}-bedroom {propertyType} in {city} (Approx. ₹{valuationResult?.pricePerSqFtAverage.toLocaleString()}/sq ft average).
                  </p>

                  <div className="p-4 rounded-xl bg-[#1a1d27] border border-neutral-700 text-left text-xs text-neutral-300 space-y-2 mb-6">
                    <p className="text-white font-medium">Next Steps with Smith & Stone Private Office:</p>
                    <p className="font-light">
                      A senior director will contact you discreetly on <span className="text-white font-medium">{phone}</span> to review physical finishes, views, floor premiums, and private buyer off-market demand.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setValuationResult(null);
                    }}
                    className="text-xs text-[#c5a880] hover:underline"
                  >
                    Calculate Another Residence
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
