import React, { useState } from "react";
import { FloorPlan, RoomItem } from "../types";
import { Layers, Maximize2, Compass, CheckCircle2, Info } from "lucide-react";

interface InteractiveFloorPlanProps {
  floorPlans: FloorPlan[];
  propertyTitle: string;
}

export const InteractiveFloorPlan: React.FC<InteractiveFloorPlanProps> = ({
  floorPlans,
  propertyTitle
}) => {
  const [activeFloorIdx, setActiveFloorIdx] = useState<number>(0);
  const [selectedRoom, setSelectedRoom] = useState<RoomItem | null>(
    floorPlans[0]?.rooms[0] || null
  );

  const currentFloor = floorPlans[activeFloorIdx] || floorPlans[0];

  const handleFloorChange = (idx: number) => {
    setActiveFloorIdx(idx);
    setSelectedRoom(floorPlans[idx]?.rooms[0] || null);
  };

  return (
    <div className="w-full bg-[#111318] rounded-2xl border border-neutral-800 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-neutral-800 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-4 h-4 text-[#c5a880]" />
            <span className="text-xs uppercase tracking-widest text-[#c5a880] font-medium">
              Architectural Layout & Spatial Allocation
            </span>
          </div>
          <h3 className="font-serif text-2xl md:text-3xl text-neutral-100">
            Interactive Floor Plans · {propertyTitle}
          </h3>
        </div>

        {/* Floor Switcher Tabs */}
        <div className="flex items-center gap-2 bg-[#171922] p-1.5 rounded-xl border border-neutral-800">
          {floorPlans.map((fp, idx) => (
            <button
              key={idx}
              onClick={() => handleFloorChange(idx)}
              className={`px-4 py-2 rounded-lg text-xs font-medium tracking-wide transition-all ${
                activeFloorIdx === idx
                  ? "bg-[#c5a880] text-[#0c0d11] shadow-md font-semibold"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {fp.level} ({fp.area})
            </button>
          ))}
        </div>
      </div>

      {/* Main Floor Plan Spatial Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-start">
        {/* Visual Blueprint SVG Canvas (7 cols) */}
        <div className="lg:col-span-7 bg-[#0b0c0f] rounded-xl border border-neutral-800/80 p-6 relative overflow-hidden">
          {/* Blueprint Grid Watermark */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f222e_1px,transparent_1px),linear-gradient(to_bottom,#1f222e_1px,transparent_1px)] bg-[size:28px_28px] opacity-25" />

          {/* Blueprint HUD Overlay */}
          <div className="relative z-10 flex items-center justify-between mb-4 text-xs text-neutral-400">
            <span className="font-mono text-[#c5a880] tracking-wider">
              {currentFloor?.level.toUpperCase()} · SCALE 1:100
            </span>
            <div className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#c5a880]" />
              <span>NORTH FACING ORIENTATION</span>
            </div>
          </div>

          {/* Interactive Room Grid / Blueprint Schematic */}
          <div className="relative z-10 grid grid-cols-2 gap-3 min-h-[320px]">
            {currentFloor?.rooms.map((room, idx) => {
              const isSelected = selectedRoom?.name === room.name;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedRoom(room)}
                  className={`p-4 rounded-xl text-left border transition-all duration-300 relative group ${
                    isSelected
                      ? "bg-[#c5a880]/15 border-[#c5a880] shadow-lg shadow-[#c5a880]/10"
                      : "bg-[#14161f]/80 border-neutral-800 hover:border-neutral-600 hover:bg-[#181b26]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-[#c5a880]">ZONE 0{idx + 1}</span>
                    <span className="text-xs font-mono text-neutral-300 group-hover:text-white">
                      {room.size}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium text-white mb-1">{room.name}</h4>
                  <p className="text-[11px] text-neutral-400 line-clamp-2">{room.highlight}</p>

                  {isSelected && (
                    <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-[#c5a880] animate-ping" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Blueprint Footer notes */}
          <div className="relative z-10 mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500">
            <span>Verified Architectural CAD Drawings · Smith & Stone Archives</span>
            <span className="text-neutral-400">Total Level Area: {currentFloor?.area}</span>
          </div>
        </div>

        {/* Room Specification Detail Card (5 cols) */}
        <div className="lg:col-span-5 bg-[#171922] rounded-xl border border-neutral-800 p-6 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c5a880]/15 text-[#c5a880] text-xs font-medium mb-4">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Selected Spatial Zone</span>
            </div>

            <h4 className="font-serif text-2xl text-white mb-1">
              {selectedRoom ? selectedRoom.name : "Select a Room Zone"}
            </h4>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-2xl font-mono text-[#c5a880] font-semibold">
                {selectedRoom?.size}
              </span>
              <span className="text-xs text-neutral-400 uppercase tracking-widest">
                Usable Carpet Area
              </span>
            </div>

            <div className="space-y-3 text-sm text-neutral-300">
              <div className="p-3.5 rounded-lg bg-[#111318] border border-neutral-800">
                <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">
                  Architectural Highlights
                </p>
                <p className="text-white font-light leading-relaxed">
                  {selectedRoom?.highlight}
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#111318] border border-neutral-800">
                <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">
                  Finishes & Millwork
                </p>
                <p className="text-neutral-300 text-xs font-light">
                  Acoustic double-glazed fenestrations, concealed Daikin VRV air conditioning, recessed architectural channel lighting.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <Info className="w-3.5 h-3.5 text-[#c5a880]" />
              <span>High-resolution PDF floorplan available on request</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
