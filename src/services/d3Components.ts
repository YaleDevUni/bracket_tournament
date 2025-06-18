/**
 * D3.js component creation functions
 */

import * as d3 from "d3";
import type { Match, HierarchyNode } from "../types/bracket.types";
import { truncateText } from "../utils/bracketHelpers";

export const createLinks = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  treeData: HierarchyNode,
  roundedLinks: boolean
): void => {
  g.selectAll(".link")
    .data(treeData.links())
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", (d: d3.HierarchyLink<Match>) => {
      const source = d.source as HierarchyNode;
      const target = d.target as HierarchyNode;
      const midY = (source.y + target.y) / 2;
      if (roundedLinks) {
        return createRoundedPath(source, target, midY);
      } else {
        return createHybridPath(source, target, midY);
      }
    })
    .attr("fill", "none")
    .attr("stroke", "#872DE7")
    .attr("stroke-width", 2);
};

const createRoundedPath = (
  source: HierarchyNode,
  target: HierarchyNode,
  midY: number
): string => {
  return `M${source.y},${source.x} 
            H${midY} 
            V${target.x} 
            H${target.y}`;
};

const createHybridPath = (
  source: HierarchyNode,
  target: HierarchyNode,
  midY: number
): string => {
  const finalRadius = -8;
  const isTargetBelow = target.x < source.x;

  if (isTargetBelow) {
    return `M${source.y},${source.x} 
            H${midY} 
            V${target.x - finalRadius} 
            Q${midY},${target.x} ${midY + finalRadius},${target.x} 
            H${target.y}`;
  } else {
    return `M${source.y},${source.x} 
            H${midY} 
            V${target.x + finalRadius} 
            Q${midY},${target.x} ${midY + finalRadius},${target.x} 
            H${target.y}`;
  }
};

export const createNodes = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  treeData: HierarchyNode,
  onMatchSelect: (match: Match) => void,
  nodeGap: number = 2,
  winnerBackgroundColor: string = "#1F2937",
  winnerBorderColor: string = "#374151",
  loserBackgroundColor: string = "#FFFFFF",
  loserBorderColor: string = "#9CA3AF",
  borderWidth: number = 1,
  cornerRadius: number = 4,
  nodeWidth: number = 120,
  nodeHeight: number = 25,
  backgroundColor: string = "#FFFFFF"
): void => {
  const nodes = g
    .selectAll(".node")
    .data(treeData.descendants())
    .enter()
    .append("g")
    .attr("class", "node")
    .style("cursor", "pointer")
    .attr("transform", (d: HierarchyNode) => `translate(${d.y},${d.x})`)
    .on("click", (_: MouseEvent, d: HierarchyNode) => {
      onMatchSelect(d.data);
    });

  createNodeRectangles(
    nodes,
    nodeGap,
    winnerBackgroundColor,
    winnerBorderColor,
    loserBackgroundColor,
    loserBorderColor,
    borderWidth,
    cornerRadius,
    nodeWidth,
    nodeHeight,
    backgroundColor
  );
  createNodeText(
    nodes,
    nodeGap,
    nodeHeight,
    winnerBackgroundColor,
    loserBorderColor,
    nodeWidth
  );
};

const createNodeRectangles = (
  nodes: d3.Selection<SVGGElement, HierarchyNode, SVGGElement, unknown>,
  gap: number = 2,
  winnerBackgroundColor: string = "#1F2937",
  winnerBorderColor: string = "#374151",
  loserBackgroundColor: string = "#FFFFFF",
  loserBorderColor: string = "#9CA3AF",
  borderWidth: number = 1,
  cornerRadius: number = 4,
  nodeWidth: number = 120,
  nodeHeight: number = 25,
  backgroundColor: string = "#FFFFFF"
): void => {
  const halfWidth = nodeWidth / 2;

  // Background rectangle to hide links behind the node
  nodes
    .append("rect")
    .attr("x", -halfWidth - 5)
    .attr("y", -(gap / 2 + nodeHeight) - 5)
    .attr("width", nodeWidth + 10)
    .attr("height", nodeHeight * 2 + gap + 10)
    .attr("fill", backgroundColor)
    .attr("stroke", "none");

  // Team 1 rectangle (completely separate box with all 4 corners rounded)
  nodes
    .append("path")
    .attr("d", () => {
      const top = -(gap / 2 + nodeHeight);
      const bottom = -gap / 2;
      const left = -halfWidth;
      const right = halfWidth;

      return `M${left + cornerRadius},${top} 
              L${right - cornerRadius},${top} 
              Q${right},${top} ${right},${top + cornerRadius} 
              L${right},${bottom - cornerRadius} 
              Q${right},${bottom} ${right - cornerRadius},${bottom} 
              L${left + cornerRadius},${bottom} 
              Q${left},${bottom} ${left},${bottom - cornerRadius} 
              L${left},${top + cornerRadius} 
              Q${left},${top} ${left + cornerRadius},${top} Z`;
    })
    .attr("fill", (d: HierarchyNode) => {
      const color =
        d.data.winner === d.data.team1
          ? winnerBackgroundColor
          : loserBackgroundColor;
      const d3Color = d3.color(color);
      return d3Color ? d3Color.copy({ opacity: 0.2 }).toString() : color;
    })
    .attr("stroke", (d: HierarchyNode) =>
      d.data.winner === d.data.team1 ? winnerBorderColor : loserBorderColor
    )
    .attr("stroke-width", borderWidth);

  // Team 2 rectangle (completely separate box with all 4 corners rounded)
  nodes
    .append("path")
    .attr("d", () => {
      const top = gap / 2;
      const bottom = gap / 2 + nodeHeight;
      const left = -halfWidth;
      const right = halfWidth;

      return `M${left + cornerRadius},${top} 
              L${right - cornerRadius},${top} 
              Q${right},${top} ${right},${top + cornerRadius} 
              L${right},${bottom - cornerRadius} 
              Q${right},${bottom} ${right - cornerRadius},${bottom} 
              L${left + cornerRadius},${bottom} 
              Q${left},${bottom} ${left},${bottom - cornerRadius} 
              L${left},${top + cornerRadius} 
              Q${left},${top} ${left + cornerRadius},${top} Z`;
    })
    .attr("fill", (d: HierarchyNode) => {
      const color =
        d.data.winner === d.data.team2
          ? winnerBackgroundColor
          : loserBackgroundColor;
      const d3Color = d3.color(color);
      return d3Color ? d3Color.copy({ opacity: 0.2 }).toString() : color;
    })
    .attr("stroke", (d: HierarchyNode) =>
      d.data.winner === d.data.team2 ? winnerBorderColor : loserBorderColor
    )
    .attr("stroke-width", borderWidth);
};

const createNodeText = (
  nodes: d3.Selection<SVGGElement, HierarchyNode, SVGGElement, unknown>,
  gap: number = 2,
  nodeHeight: number = 25,
  winnerBackgroundColor: string = "#1F2937",
  loserBorderColor: string = "#9CA3AF",
  nodeWidth: number = 120
): void => {
  const halfWidth = nodeWidth / 2;
  const profilePlaceholderRadius = 8;
  const scoreBoxSize = 16;

  nodes.each(function (this: SVGGElement, d: HierarchyNode) {
    const nodeGroup = d3.select(this);

    // Create a text group following the createMatchTags approach
    const textGroup = nodeGroup
      .append("g")
      .attr("class", "node-text")
      .attr("transform", () => {
        // Position at the center of the node pair (already positioned by parent transform)
        const centerX = 0; // Center horizontally with the node
        const centerY = 0; // Center vertically with the node pair
        return `translate(${centerX},${centerY})`;
      });

    const group = textGroup;

    // Calculate positions relative to center
    const team1Y = -(gap / 2 + nodeHeight / 2);
    const team2Y = gap / 2 + nodeHeight / 2;
    const nameX = -halfWidth + 12;
    const profileX = halfWidth - 35;
    const scoreBoxX = halfWidth - 21;
    const scoreTextX = halfWidth - 13;

    // Team 1 elements
    // Team 1 name (left-aligned)
    group
      .append("text")
      .attr("x", nameX)
      .attr("y", team1Y)
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "middle")
      .attr("class", "text-xs ")
      .attr("fill", d.data.winner === d.data.team1 ? "#FFFFFF" : "#FFFFFF")
      .text(truncateText(d.data.team1, 10));

    // Team 1 profile placeholder (gray circle)
    group
      .append("circle")
      .attr("cx", profileX)
      .attr("cy", team1Y)
      .attr("r", profilePlaceholderRadius)
      .attr("fill", "#9CA3AF");

    // Team 1 score (rounded square)
    group
      .append("rect")
      .attr("x", scoreBoxX)
      .attr("y", team1Y - scoreBoxSize / 2)
      .attr("width", scoreBoxSize)
      .attr("height", scoreBoxSize)
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("fill", d.data.winner === d.data.team1 ? winnerBackgroundColor : "")
      .attr("stroke", d.data.winner === d.data.team1 ? "" : loserBorderColor)
      .attr("stroke-width", 1);

    // Team 1 score text
    group
      .append("text")
      .attr("x", scoreTextX)
      .attr("y", team1Y + 1)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("class", "text-xs font-bold")
      .attr("fill", "#FFFFFF")
      .text(d.data.team1Score.toString());

    // Team 2 elements
    // Team 2 name (left-aligned)
    group
      .append("text")
      .attr("x", nameX)
      .attr("y", team2Y)
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "middle")
      .attr("class", "text-xs ")
      .attr("fill", d.data.winner === d.data.team2 ? "#FFFFFF" : "#FFFFFF")
      .text(truncateText(d.data.team2, 10));

    // Team 2 profile placeholder (gray circle)
    group
      .append("circle")
      .attr("cx", profileX)
      .attr("cy", team2Y)
      .attr("r", profilePlaceholderRadius)
      .attr("fill", "#9CA3AF");

    // Team 2 score (rounded square)
    group
      .append("rect")
      .attr("x", scoreBoxX)
      .attr("y", team2Y - scoreBoxSize / 2)
      .attr("width", scoreBoxSize)
      .attr("height", scoreBoxSize)
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("fill", d.data.winner === d.data.team2 ? winnerBackgroundColor : "")
      .attr("stroke", d.data.winner === d.data.team2 ? "" : loserBorderColor)
      .attr("stroke-width", 1);

    // Team 2 score text
    group
      .append("text")
      .attr("x", scoreTextX)
      .attr("y", team2Y + 1)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("class", "text-xs font-bold")
      .attr("fill", "#FFFFFF")
      .text(d.data.team2Score.toString());
  });
};

export const createRoundLabels = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  treeData: HierarchyNode,
  roundLabels: string[],
  rounds: number
): void => {
  const allNodes = treeData.descendants();
  const bracketTopY = Math.min(...allNodes.map((d) => d.x));

  const labelGroup = g.append("g");
  const uniqueXPositions = Array.from(
    new Set(treeData.descendants().map((d) => d.y))
  ).sort((a, b) => a - b);

  uniqueXPositions.forEach((xPos, index) => {
    labelGroup
      .append("text")
      .attr("x", xPos)
      .attr("y", bracketTopY - 40)
      .attr("text-anchor", "middle")
      .attr("class", "text-sm font-bold fill-white")
      .text(roundLabels[index] || `Round ${rounds - index}`);
  });
};

export const createMatchTags = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  treeData: HierarchyNode,
  tagCircleRadius: number = 12,
  nodeWidth: number = 120
): void => {
  const tagGroup = g.append("g").attr("class", "match-tags");

  tagGroup
    .selectAll(".match-tag")
    .data(treeData.descendants())
    .enter()
    .append("g")
    .attr("class", "match-tag")
    .attr("transform", (d: HierarchyNode) => {
      // Position at the leftmost center of the pair of nodes
      const leftmostX = d.y - (nodeWidth - 60) / 2 - 30; // Offset to the left of the node
      const centerY = d.x; // Center vertically with the node pair
      return `translate(${leftmostX},${centerY})`;
    })
    .each(function (this: SVGGElement, d: HierarchyNode) {
      const group = d3.select(this);

      // Create the circle with black background and white border
      group
        .append("circle")
        .attr("r", tagCircleRadius)
        .attr("fill", "#000000")
        .attr("stroke", "#FFFFFF")
        .attr("stroke-width", 1);

      // Add the tag text (alphabet) inside the circle
      group
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .attr("fill", "#FFFFFF")
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .text(d.data.tag || "");
    });
};
