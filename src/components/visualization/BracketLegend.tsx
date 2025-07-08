/**
 * Legend component for bracket visualization
 */

import React from "react";
import type { BracketMode } from "../../types/bracket.types";

interface BracketLegendProps {
  bracketMode: BracketMode;
}

const BracketLegend: React.FC<BracketLegendProps> = ({ bracketMode }) => {
  return (
    <div className="mb-4 flex items-center gap-6">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-[#1F2937] rounded"></div>
        <span className="text-sm text-gray-700">Winner</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
        <span className="text-sm text-gray-700">Loser</span>
      </div>
      {bracketMode === "double" && (
        <>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#FF5E00] rounded"></div>
            <span className="text-sm text-gray-700">Winner Bracket</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#B91C1C] rounded"></div>
            <span className="text-sm text-gray-700">Loser Bracket</span>
          </div>
        </>
      )}
    </div>
  );
};

export default BracketLegend;
