import React, { useState, useEffect } from "react";
import { Property, Lead, LeadStatus } from "../types";
import {
  Users,
  Building2,
  TrendingUp,
  Calendar,
  MessageCircle,
  Plus,
  Trash2,
  Star,
  CheckCircle,
  Clock,
  Search,
  Filter,
  RefreshCw,
  X,
  Phone,
  Mail,
  ArrowRight
} from "lucide-react";

interface AdminDashboardProps {
  properties: Property[];
  onClose: () => void;
  onRefreshProperties: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  properties,
  onClose,
  onRefreshProperties
}) => {
  const [activeTab, setActiveTab] = useState<"leads" | "properties">("leads");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState<boolean>(true);
  const [leadFilterStatus, setLeadFilterStatus] = useState<string>("ALL");
  const [leadSearch, setLeadSearch] = useState<string>("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // New Property state
  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState<boolean>(false);
  const [newPropTitle, setNewPropTitle] = useState<string>("");
  const [newPropLocation, setNewPropLocation] = useState<string>("");
  const [newPropCity, setNewPropCity] = useState<string>("Mumbai");
  const [newPropPrice, setNewPropPrice] = useState<number>(15000000);
  const [newPropFormattedPrice, setNewPropFormattedPrice] = useState<string>("₹15.0 Cr");
  const [newPropType, setNewPropType] = useState<string>("Apartment");
  const [newPropBeds, setNewPropBeds] = useState<number>(4);
  const [newPropBaths, setNewPropBaths] = useState<number>(4);
  const [newPropArea, setNewPropArea] = useState<number>(3000);
  const [newPropImage, setNewPropImage] = useState<string>(
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85"
  );
  const [newPropTagline, setNewPropTagline] = useState<string>("");

  const fetchLeads = async () => {
    setLoadingLeads(true);
    try {
      const res = await fetch("/api/leads");
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLeads(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Update lead status
  const handleUpdateLeadStatus = async (leadId: string, status: LeadStatus) => {
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const data = await res.json();
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? data.lead : l))
        );
        if (selectedLead?.id === leadId) {
          setSelectedLead(data.lead);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle property featured
  const handleToggleFeatured = async (property: Property) => {
    try {
      await fetch(`/api/properties/${property.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !property.featured })
      });
      onRefreshProperties();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete property
  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm("Are you sure you want to remove this property from public listing?")) return;
    try {
      await fetch(`/api/properties/${propertyId}`, { method: "DELETE" });
      onRefreshProperties();
    } catch (err) {
      console.error(err);
    }
  };

  // Add new property
  const handleAddPropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newPropTitle,
          tagline: newPropTagline || "Prime Architectural Residence",
          location: newPropLocation,
          city: newPropCity,
          country: newPropCity === "Dubai" ? "UAE" : "India",
          price: Number(newPropPrice),
          priceFormatted: newPropFormattedPrice,
          propertyType: newPropType,
          bedrooms: Number(newPropBeds),
          bathrooms: Number(newPropBaths),
          area: Number(newPropArea),
          areaFormatted: `${newPropArea.toLocaleString()} SQ FT`,
          heroImage: newPropImage,
          featured: true,
          description: "Exclusive new private development offered through Smith & Stone Private Office."
        })
      });

      if (res.ok) {
        setIsAddPropertyOpen(false);
        onRefreshProperties();
        setNewPropTitle("");
        setNewPropLocation("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Computed KPIs
  const totalPortfolioValue = properties.reduce((acc, curr) => acc + curr.price, 0);
  const totalLeadsCount = leads.length;
  const tourBookingsCount = leads.filter((l) => l.leadType === "TOUR_BOOKING").length;
  const newLeadsCount = leads.filter((l) => l.status === "NEW").length;

  const filteredLeads = leads.filter((lead) => {
    if (leadFilterStatus !== "ALL" && lead.status !== leadFilterStatus) return false;
    if (leadSearch.trim()) {
      const q = leadSearch.toLowerCase();
      return (
        lead.name.toLowerCase().includes(q) ||
        lead.property.toLowerCase().includes(q) ||
        lead.phone.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0b0e] overflow-y-auto text-white p-4 md:p-8 animate-fadeIn">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-neutral-800 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#c5a880]" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#c5a880] font-semibold">
                Private Office Portal
              </span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl text-white font-normal">
              Smith & Stone CRM & Portfolio Operations
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchLeads}
              className="p-2.5 rounded-xl bg-[#14161f] border border-neutral-800 text-neutral-300 hover:text-white transition-colors"
              title="Refresh leads"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-[#c5a880] text-[#0c0d11] font-semibold text-xs uppercase tracking-wider hover:bg-[#d5ba92] transition-colors"
            >
              Return to Website
            </button>
          </div>
        </div>

        {/* Executive KPI Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-6 rounded-2xl bg-[#12141a] border border-neutral-800">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs uppercase tracking-wider">Portfolio Under Mandate</span>
              <TrendingUp className="w-4 h-4 text-[#c5a880]" />
            </div>
            <p className="font-serif text-2xl md:text-3xl text-white font-normal">
              ₹{(totalPortfolioValue / 10000000).toFixed(1)} Cr
            </p>
            <span className="text-[11px] text-neutral-500">{properties.length} Sovereign Assets</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#12141a] border border-neutral-800">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs uppercase tracking-wider">Total CRM Leads</span>
              <Users className="w-4 h-4 text-[#c5a880]" />
            </div>
            <p className="font-serif text-2xl md:text-3xl text-white font-normal">
              {totalLeadsCount}
            </p>
            <span className="text-[11px] text-emerald-400">{newLeadsCount} Actionable New</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#12141a] border border-neutral-800">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs uppercase tracking-wider">Private Tour Requests</span>
              <Calendar className="w-4 h-4 text-[#c5a880]" />
            </div>
            <p className="font-serif text-2xl md:text-3xl text-white font-normal">
              {tourBookingsCount}
            </p>
            <span className="text-[11px] text-neutral-500">Scheduled In-Person</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#12141a] border border-neutral-800">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs uppercase tracking-wider">Conversion Efficiency</span>
              <CheckCircle className="w-4 h-4 text-[#c5a880]" />
            </div>
            <p className="font-serif text-2xl md:text-3xl text-white font-normal">
              84.2%
            </p>
            <span className="text-[11px] text-neutral-500">Qualified UHNW Buyers</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 border-b border-neutral-800">
          <button
            onClick={() => setActiveTab("leads")}
            className={`pb-4 text-xs uppercase tracking-widest font-semibold transition-colors relative ${
              activeTab === "leads"
                ? "text-[#c5a880]"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <span>Client Inquiry Pipeline ({leads.length})</span>
            {activeTab === "leads" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c5a880]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("properties")}
            className={`pb-4 text-xs uppercase tracking-widest font-semibold transition-colors relative ${
              activeTab === "properties"
                ? "text-[#c5a880]"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <span>Listing Catalog & Inventory ({properties.length})</span>
            {activeTab === "properties" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c5a880]" />
            )}
          </button>
        </div>

        {/* TAB 1: LEADS CRM */}
        {activeTab === "leads" && (
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#12141a] p-4 rounded-xl border border-neutral-800">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search lead by name, phone, residence..."
                  value={leadSearch}
                  onChange={(e) => setLeadSearch(e.target.value)}
                  className="w-full bg-[#181a24] text-xs text-white pl-10 pr-4 py-2.5 rounded-lg border border-neutral-700 focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none">
                {["ALL", "NEW", "CONTACTED", "QUALIFIED", "VIEWING_SCHEDULED", "CLOSED"].map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => setLeadFilterStatus(status)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                        leadFilterStatus === status
                          ? "bg-[#c5a880] text-[#0c0d11]"
                          : "bg-[#181a24] text-neutral-400 hover:text-white border border-neutral-800"
                      }`}
                    >
                      {status}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Leads Table */}
            <div className="bg-[#12141a] rounded-2xl border border-neutral-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#171922] text-neutral-400 uppercase tracking-wider font-mono border-b border-neutral-800">
                    <tr>
                      <th className="p-4">Client Name</th>
                      <th className="p-4">Contact</th>
                      <th className="p-4">Residence Interest</th>
                      <th className="p-4">Type & Schedule</th>
                      <th className="p-4">Pipeline Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/80">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-[#161822] transition-colors">
                        <td className="p-4 font-medium text-white">
                          <p>{lead.name}</p>
                          <span className="text-[10px] text-neutral-500 font-mono">
                            {new Date(lead.timestamp).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="p-4 text-neutral-300">
                          <p>{lead.phone}</p>
                          <p className="text-[10px] text-neutral-500">{lead.email}</p>
                        </td>
                        <td className="p-4 text-white font-serif">
                          <p className="font-normal">{lead.property}</p>
                          <span className="text-[10px] text-[#c5a880] font-sans">
                            {lead.source}
                          </span>
                        </td>
                        <td className="p-4 text-neutral-300">
                          <span className="px-2 py-0.5 rounded bg-neutral-800 text-[10px] text-neutral-300">
                            {lead.leadType}
                          </span>
                          {lead.preferredDate && (
                            <p className="text-[11px] text-neutral-400 mt-1">
                              {lead.preferredDate} · {lead.preferredTime}
                            </p>
                          )}
                        </td>
                        <td className="p-4">
                          <select
                            value={lead.status}
                            onChange={(e) =>
                              handleUpdateLeadStatus(lead.id, e.target.value as LeadStatus)
                            }
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border bg-[#14161f] focus:outline-none cursor-pointer ${
                              lead.status === "NEW"
                                ? "text-amber-300 border-amber-500/40"
                                : lead.status === "QUALIFIED"
                                ? "text-blue-300 border-blue-500/40"
                                : lead.status === "VIEWING_SCHEDULED"
                                ? "text-purple-300 border-purple-500/40"
                                : lead.status === "CLOSED"
                                ? "text-emerald-400 border-emerald-500/40"
                                : "text-neutral-400 border-neutral-700"
                            }`}
                          >
                            <option value="NEW">NEW</option>
                            <option value="CONTACTED">CONTACTED</option>
                            <option value="QUALIFIED">QUALIFIED</option>
                            <option value="VIEWING_SCHEDULED">VIEWING SCHEDULED</option>
                            <option value="CLOSED">CLOSED</option>
                            <option value="LOST">LOST</option>
                          </select>
                        </td>
                        <td className="p-4 text-right">
                          <a
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(
                              lead.name
                            )},%20this%20is%20Smith%20%26%20Stone%20Private%20Real%20Estate%20regarding%20${encodeURIComponent(
                              lead.property
                            )}.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30 transition-colors text-[11px]"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROPERTIES INVENTORY */}
        {activeTab === "properties" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-xs text-neutral-400">
                Manage live portfolio listings, pricing, and 3D walkthrough assignments.
              </p>
              <button
                onClick={() => setIsAddPropertyOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-[#c5a880] hover:bg-[#d5ba92] text-[#0c0d11] font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add Exclusive Residence</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className="bg-[#12141a] rounded-2xl border border-neutral-800 overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative h-48 w-full">
                    <img
                      src={property.heroImage}
                      alt={property.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <button
                        onClick={() => handleToggleFeatured(property)}
                        className={`p-1.5 rounded-full backdrop-blur-md transition-colors ${
                          property.featured
                            ? "bg-[#c5a880] text-[#0c0d11]"
                            : "bg-black/60 text-neutral-400 hover:text-white"
                        }`}
                        title="Toggle Featured"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className="font-serif text-lg text-white font-medium">
                          {property.title}
                        </h4>
                        <span className="text-[#c5a880] font-semibold">
                          {property.priceFormatted}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400">
                        {property.location}, {property.city}
                      </p>
                      <p className="text-xs text-neutral-500 mt-2 font-mono">
                        {property.bedrooms} Bed · {property.bathrooms} Bath · {property.areaFormatted}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-neutral-800 flex items-center justify-between mt-4 text-xs">
                      <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                        {property.propertyType}
                      </span>

                      <button
                        onClick={() => handleDeleteProperty(property.id)}
                        className="text-red-400 hover:text-red-300 p-1.5 rounded hover:bg-red-500/10 transition-colors"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal: Add New Property */}
        {isAddPropertyOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#12141a] border border-neutral-800 rounded-2xl max-w-xl w-full p-6 text-white relative shadow-2xl">
              <button
                onClick={() => setIsAddPropertyOpen(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-serif text-2xl text-white font-normal mb-4">
                Add Exclusive Residence to Portfolio
              </h3>

              <form onSubmit={handleAddPropertySubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 uppercase tracking-wider mb-1">
                      Residence Title
                    </label>
                    <input
                      type="text"
                      placeholder="The Obsidian Pavilion"
                      value={newPropTitle}
                      onChange={(e) => setNewPropTitle(e.target.value)}
                      className="w-full bg-[#181a24] text-white px-3 py-2 rounded-xl border border-neutral-700 focus:outline-none focus:border-[#c5a880]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 uppercase tracking-wider mb-1">
                      Tagline
                    </label>
                    <input
                      type="text"
                      placeholder="Minimalist Glass Courtyard Estate"
                      value={newPropTagline}
                      onChange={(e) => setNewPropTagline(e.target.value)}
                      className="w-full bg-[#181a24] text-white px-3 py-2 rounded-xl border border-neutral-700 focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 uppercase tracking-wider mb-1">
                      Neighborhood
                    </label>
                    <input
                      type="text"
                      placeholder="Juhu Beachfront"
                      value={newPropLocation}
                      onChange={(e) => setNewPropLocation(e.target.value)}
                      className="w-full bg-[#181a24] text-white px-3 py-2 rounded-xl border border-neutral-700 focus:outline-none focus:border-[#c5a880]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 uppercase tracking-wider mb-1">
                      City
                    </label>
                    <select
                      value={newPropCity}
                      onChange={(e) => setNewPropCity(e.target.value)}
                      className="w-full bg-[#181a24] text-white px-3 py-2 rounded-xl border border-neutral-700 focus:outline-none focus:border-[#c5a880]"
                    >
                      <option>Mumbai</option>
                      <option>Dubai</option>
                      <option>Goa</option>
                      <option>Bangalore</option>
                      <option>Pune</option>
                      <option>Delhi NCR</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 uppercase tracking-wider mb-1">
                      Offer Price Display
                    </label>
                    <input
                      type="text"
                      placeholder="₹32.5 Cr"
                      value={newPropFormattedPrice}
                      onChange={(e) => setNewPropFormattedPrice(e.target.value)}
                      className="w-full bg-[#181a24] text-white px-3 py-2 rounded-xl border border-neutral-700 focus:outline-none focus:border-[#c5a880]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 uppercase tracking-wider mb-1">
                      Typology
                    </label>
                    <select
                      value={newPropType}
                      onChange={(e) => setNewPropType(e.target.value)}
                      className="w-full bg-[#181a24] text-white px-3 py-2 rounded-xl border border-neutral-700 focus:outline-none focus:border-[#c5a880]"
                    >
                      <option>Apartment</option>
                      <option>Penthouse</option>
                      <option>Villa</option>
                      <option>Bungalow</option>
                      <option>Estate</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-neutral-400 uppercase tracking-wider mb-1">
                      Beds
                    </label>
                    <input
                      type="number"
                      value={newPropBeds}
                      onChange={(e) => setNewPropBeds(Number(e.target.value))}
                      className="w-full bg-[#181a24] text-white px-3 py-2 rounded-xl border border-neutral-700 focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 uppercase tracking-wider mb-1">
                      Baths
                    </label>
                    <input
                      type="number"
                      value={newPropBaths}
                      onChange={(e) => setNewPropBaths(Number(e.target.value))}
                      className="w-full bg-[#181a24] text-white px-3 py-2 rounded-xl border border-neutral-700 focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 uppercase tracking-wider mb-1">
                      Area (SQ FT)
                    </label>
                    <input
                      type="number"
                      value={newPropArea}
                      onChange={(e) => setNewPropArea(Number(e.target.value))}
                      className="w-full bg-[#181a24] text-white px-3 py-2 rounded-xl border border-neutral-700 focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-400 uppercase tracking-wider mb-1">
                    Hero Photograph URL
                  </label>
                  <input
                    type="url"
                    value={newPropImage}
                    onChange={(e) => setNewPropImage(e.target.value)}
                    className="w-full bg-[#181a24] text-white px-3 py-2 rounded-xl border border-neutral-700 focus:outline-none focus:border-[#c5a880]"
                    required
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddPropertyOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-neutral-700 text-neutral-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#c5a880] text-[#0c0d11] font-semibold uppercase tracking-wider hover:bg-[#d5ba92]"
                  >
                    Publish Residence
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
