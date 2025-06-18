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
      const radius = 8;

      if (roundedLinks) {
        return createRoundedPath(source, target, midY, radius);
      } else {
        return createHybridPath(source, target, midY);
      }
    })
    .attr("fill", "none")
    .attr("stroke", "#4B5563")
    .attr("stroke-width", 2);
};

const createRoundedPath = (
  source: HierarchyNode,
  target: HierarchyNode,
  midY: number,
  radius: number
): string => {
  const leftMatch = source;
  const rightMatch = target;
  const dx = rightMatch.x - leftMatch.x;
  const isRightMatchBelow = dx > 0;

  if (isRightMatchBelow) {
    return `M${leftMatch.y},${leftMatch.x} 
            H${midY} 
            V${rightMatch.x - radius} 
            Q${midY + radius},${rightMatch.x} ${midY},${rightMatch.x} 
            H${rightMatch.y}`;
  } else {
    return `M${leftMatch.y},${leftMatch.x} 
            H${midY} 
            V${rightMatch.x + radius} 
            Q${midY + radius},${rightMatch.x} ${midY},${rightMatch.x} 
            H${rightMatch.y}`;
  }
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
  onMatchSelect: (match: Match) => void
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

  setupClipPath(g);
  createNodeRectangles(nodes);
  createNodeText(nodes);
};

const setupClipPath = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>
): void => {
  const defs = g.append("defs");
  defs
    .append("clipPath")
    .attr("id", "roundedRect")
    .append("rect")
    .attr("width", 120)
    .attr("height", 60)
    .attr("rx", 4)
    .attr("x", -60)
    .attr("y", -30);
};

const createNodeRectangles = (
  nodes: d3.Selection<SVGGElement, HierarchyNode, SVGGElement, unknown>
): void => {
  // Background rectangle
  nodes
    .append("rect")
    .attr("width", 120)
    .attr("height", 60)
    .attr("rx", 4)
    .attr("x", -60)
    .attr("y", -30)
    .attr("fill", "#F3F4F6")
    .attr("stroke", "#9CA3AF")
    .attr("stroke-width", 1);

  // Team 1 rectangle
  nodes
    .append("rect")
    .attr("width", 120)
    .attr("height", 30)
    .attr("x", -60)
    .attr("y", -30)
    .attr("fill", (d: HierarchyNode) =>
      d.data.winner === d.data.team1 ? "#1F2937" : "#FFFFFF"
    )
    .attr("clip-path", "url(#roundedRect)");

  // Team 2 rectangle
  nodes
    .append("rect")
    .attr("width", 120)
    .attr("height", 30)
    .attr("x", -60)
    .attr("y", 0)
    .attr("fill", (d: HierarchyNode) =>
      d.data.winner === d.data.team2 ? "#1F2937" : "#FFFFFF"
    )
    .attr("clip-path", "url(#roundedRect)");
};

const createNodeText = (
  nodes: d3.Selection<SVGGElement, HierarchyNode, SVGGElement, unknown>
): void => {
  nodes
    .append("text")
    .attr("dy", "0.32em")
    .attr("text-anchor", "middle")
    .attr("class", "text-xs font-medium")
    .each(function (this: SVGTextElement, d: HierarchyNode) {
      const text = d3.select(this);
      const team1Text = d.data.team1;
      const team2Text = d.data.team2;
      const lineHeight = 1.1;
      const dy = parseFloat(text.attr("dy"));

      text.text(null);

      text
        .append("tspan")
        .attr("x", 0)
        .attr("y", 0)
        .attr("dy", (dy - 1.5) * lineHeight + "em")
        .attr("fill", d.data.winner === d.data.team1 ? "#FFFFFF" : "#111827")
        .text(truncateText(team1Text));

      text
        .append("tspan")
        .attr("x", 0)
        .attr("y", 0)
        .attr("dy", (dy + 1.5) * lineHeight + "em")
        .attr("fill", d.data.winner === d.data.team2 ? "#FFFFFF" : "#111827")
        .text(truncateText(team2Text));
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
      .attr("class", "text-sm font-bold")
      .text(roundLabels[index] || `Round ${rounds - index}`);
  });
};
