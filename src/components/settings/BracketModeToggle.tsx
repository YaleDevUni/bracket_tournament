/**
 * Bracket mode toggle component
 */

import React from "react";
import type { BracketMode } from "../../types/bracket.types";

interface BracketModeToggleProps {
  currentMode: BracketMode;
  onModeChange: (mode: BracketMode) => void;
}

const BracketModeToggle: React.FC<BracketModeToggleProps> = ({
  currentMode,
  onModeChange,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Bracket Mode
      </label>
      <div className="flex gap-3">
        <button
          onClick={() => onModeChange("single")}
          className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
            currentMode === "single"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          Single Elimination
        </button>
        <button
          onClick={() => onModeChange("double")}
          className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
            currentMode === "double"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          Double Elimination
        </button>
      </div>
    </div>
  );
};

export default BracketModeToggle;
