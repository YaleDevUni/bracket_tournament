/**
 * Helper functions for bracket operations
 */

import type { HierarchyNode, LabelOrder } from "../types/bracket.types";

export const getLabelOrder = (): LabelOrder => ({
  Final: 3,
  "Semi-Finals": 2,
  "Quarter-Finals": 1,
  "Round 1": 0,
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
    return (labelOrder[a] || 0) - (labelOrder[b] || 0);
  });
};

export const extractUniqueRoundLabels = (
  nodes: HierarchyNode[],
  rounds: number
): string[] => {
  const labels = Array.from(
    new Set(nodes.map((d) => d.data.label || `Round ${rounds - d.depth}`))
  );
  return sortRoundLabels(labels, getLabelOrder());
};
