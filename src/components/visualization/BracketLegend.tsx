/**
 * Legend component for bracket visualization
 */

import React from 'react';

const BracketLegend: React.FC = () => {
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
    </div>
  );
};

export default BracketLegend;
