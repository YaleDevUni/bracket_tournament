/**
 * Main bracket visualization component
 */

import React, { useRef } from 'react';
import type { Match, BracketSettings } from '../../types/bracket.types';
import BracketSVG from './BracketSVG';
import BracketLegend from './BracketLegend';

interface BracketVisualizationProps {
  bracketData: Match[];
  settings: BracketSettings;
  onMatchSelect: (match: Match) => void;
}

const BracketVisualization: React.FC<BracketVisualizationProps> = ({
  bracketData,
  settings,
  onMatchSelect,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-2/3 h-[calc(100vh-8rem)]">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full">
        <div className="border-b border-gray-200 bg-gray-800 px-4 py-3">
          <h2 className="text-lg font-semibold text-white">
            Bracket Visualization
          </h2>
        </div>
        <div className="p-4 h-[calc(100%-3.5rem)]">
          <BracketLegend />
          <div
            ref={containerRef}
            className="h-[calc(100%-2rem)] bg-white rounded-lg border border-gray-200 overflow-hidden"
          >
            <BracketSVG
              svgRef={svgRef}
              containerRef={containerRef}
              bracketData={bracketData}
              settings={settings}
              onMatchSelect={onMatchSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BracketVisualization;
