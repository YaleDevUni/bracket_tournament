/**
 * Helper functions for bracket operations
 */

import type { HierarchyNode, LabelOrder } from "../types/bracket.types";

export const getLabelOrder = (): LabelOrder => ({
  Final: 0,
  "Quarter-Finals": 1,
  "Semi-Finals": 2,
});

export const truncateText = (text: string, maxLength: number = 10): string => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

export const flipCoordinates = (nodes: HierarchyNode[]): void => {
  const maxY = Math.max(...nodes.map((d) => d.y));
  nodes.forEach((node) => {
    node.y = maxY - node.y;
  });
};

export const sortRoundLabels = (
  labels: string[],
  labelOrder: LabelOrder
): string[] => {
  return labels.sort((a, b) => {
    return (labelOrder[b] || 0) - (labelOrder[a] || 0);
  });
};

/**
 * Generate round labels based on depth and tournament type
 */
export const generateRoundLabels = (
  totalRounds: number,
  isDoubleElimination: boolean = false
): string[] => {
  const labels: string[] = [];
  const tempLabels: string[] = [];
  const effectiveRounds = isDoubleElimination ? totalRounds + 1 : totalRounds;

  for (let depth = 0; depth < effectiveRounds; depth++) {
    const roundFromEnd = effectiveRounds - depth;

    if (roundFromEnd === 1) {
      labels.push("Final");
    } else if (roundFromEnd === 2) {
      labels.push("Semi-Finals");
    } else if (roundFromEnd === 3) {
      labels.push("Quarter-Finals");
    } else {
      // For rounds before quarter-finals, use Round X
      const roundNumber = roundFromEnd - 3;
      tempLabels.push(`Round ${roundNumber}`);
    }
  }

  labels.unshift(...tempLabels.reverse());

  return labels;
};

/**
 * Extract unique round labels from bracket nodes with new depth-based labeling
 */
export const extractUniqueRoundLabels = (
  nodes: HierarchyNode[],
  rounds: number,
  isDoubleElimination: boolean = false
): string[] => {
  if (isDoubleElimination) {
    return generateRoundLabels(rounds, false);
  }

  // For single elimination, use the regular depth-based labeling
  return generateRoundLabels(rounds, false);
};
