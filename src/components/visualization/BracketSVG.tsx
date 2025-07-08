/**
 * SVG rendering component for bracket visualization
 */

import React, { useEffect } from "react";
import type { RefObject } from "react";
import type { Match, BracketSettings } from "../../types/bracket.types";
import { renderBracketTree } from "../../services/d3RenderService";
import { renderDoubleEliminationBracket } from "../../services/doubleEliminationRenderer";

interface BracketSVGProps {
  svgRef: RefObject<SVGSVGElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  bracketData: Match[];
  settings: BracketSettings;
  onMatchSelect: (match: Match) => void;
}

const BracketSVG: React.FC<BracketSVGProps> = ({
  svgRef,
  containerRef,
  bracketData,
  settings,
  onMatchSelect,
}) => {
  useEffect(() => {
    if (!svgRef.current || !containerRef.current || !bracketData.length) return;

    const cleanup =
      settings.bracketMode === "double"
        ? renderDoubleEliminationBracket(
            svgRef.current,
            containerRef.current,
            bracketData,
            settings,
            onMatchSelect
          )
        : renderBracketTree(
            svgRef.current,
            containerRef.current,
            bracketData,
            settings,
            onMatchSelect
          );

    return cleanup;
  }, [bracketData, settings, onMatchSelect]);

  return <svg ref={svgRef} className="w-full h-full" />;
};

export default BracketSVG;
