/**
 * Double elimination bracket rendering service
 */

import * as d3 from "d3";
import type {
  Match,
  DoubleEliminationMatch,
  BracketSettings,
  HierarchyNode,
} from "../types/bracket.types";
import {
  flipCoordinates,
  extractUniqueRoundLabels,
} from "../utils/bracketHelpers";
import {
  createLinks,
  createNodes,
  createRoundLabels,
  createMatchTags,
} from "./d3Components";

/**
 * Separates winner bracket and loser bracket nodes
 */
const separateWinnerAndLoserBrackets = (
  nodes: HierarchyNode[]
): { winnerNodes: HierarchyNode[]; loserNodes: HierarchyNode[] } => {
  const winnerNodes: HierarchyNode[] = [];
  const loserNodes: HierarchyNode[] = [];

  nodes.forEach((node) => {
    const match = node.data as DoubleEliminationMatch;
    if (match.isLoserBracket) {
      loserNodes.push(node);
    } else {
      winnerNodes.push(node);
    }
  });

  return { winnerNodes, loserNodes };
};

/**
 * Adjusts positioning for double elimination layout
 */
const adjustDoubleEliminationLayout = (
  treeData: HierarchyNode,
  ySpacing: number
): void => {
  const allNodes = treeData.descendants();
  const { winnerNodes, loserNodes } = separateWinnerAndLoserBrackets(allNodes);

  // Position winner bracket in the top half
  const winnerLeafNodes = winnerNodes.filter(
    (d) => !d.children || d.children.length === 0
  );
  if (winnerLeafNodes.length > 0) {
    winnerLeafNodes.sort((a, b) => a.x - b.x);
    const winnerHeight = (winnerLeafNodes.length - 1) * ySpacing;
    const winnerStartY = -winnerHeight / 2 - ySpacing * 2;

    winnerLeafNodes.forEach((node, index) => {
      node.x = winnerStartY + index * ySpacing;
    });

    // Adjust internal winner nodes
    adjustInternalNodes(winnerNodes);
  }

  // Position loser bracket in the bottom half
  const loserLeafNodes = loserNodes.filter(
    (d) => !d.children || d.children.length === 0
  );
  if (loserLeafNodes.length > 0) {
    loserLeafNodes.sort((a, b) => a.x - b.x);
    const loserHeight = (loserLeafNodes.length - 1) * ySpacing;
    const loserStartY = ySpacing * 2;

    loserLeafNodes.forEach((node, index) => {
      node.x = loserStartY + index * ySpacing;
    });

    // Adjust internal loser nodes
    adjustInternalNodes(loserNodes);
  }
};

/**
 * Adjusts internal node positions based on their children
 */
const adjustInternalNodes = (nodes: HierarchyNode[]): void => {
  // Sort nodes by depth (deepest first)
  const sortedNodes = [...nodes].sort((a, b) => b.depth - a.depth);

  sortedNodes.forEach((node) => {
    if (node.children && node.children.length > 0) {
      const childXs = node.children.map((child) => (child as HierarchyNode).x);
      node.x = (Math.min(...childXs) + Math.max(...childXs)) / 2;
    }
  });
};

/**
 * Renders double elimination bracket
 */
export const renderDoubleEliminationBracket = (
  svgElement: SVGSVGElement,
  containerElement: HTMLDivElement,
  bracketData: Match[],
  settings: BracketSettings,
  onMatchSelect: (match: Match) => void
): (() => void) => {
  const svg = d3.select(svgElement);
  svg.selectAll("*").remove();

  // Create hierarchy and layout
  const root = d3.hierarchy(bracketData[0], (d: Match) => d.children);
  const treeLayout = d3
    .tree<Match>()
    .nodeSize([settings.ySpacing, settings.xSpacing]);
  const treeData = treeLayout(root) as HierarchyNode;

  // Adjust positioning for double elimination
  adjustDoubleEliminationLayout(treeData, settings.ySpacing);

  // Flip coordinates for left-to-right layout
  flipCoordinates(treeData.descendants());

  // Create main group
  const g = svg.append("g");

  // Setup zoom
  const zoom = setupZoom(svg, g);

  // Render components
  createLinks(g, treeData, settings.roundedLinks);
  createDoubleEliminationNodes(g, treeData, onMatchSelect, settings);
  createMatchTags(g, treeData, 10, settings.nodeWidth);

  const rounds = treeData.height + 1;
  const roundLabels = extractUniqueRoundLabels(
    treeData.descendants(),
    rounds,
    true
  );
  createRoundLabels(g, treeData, roundLabels, rounds);

  // Add bracket section labels
  addBracketSectionLabels(g, treeData.descendants(), settings);

  // Initial zoom and position
  initializeZoomPosition(
    svg,
    zoom,
    g,
    containerElement,
    treeData.descendants()
  );

  // Cleanup function
  return () => {
    svg.selectAll("*").remove();
  };
};

/**
 * Creates nodes with different styling for winner and loser brackets
 */
const createDoubleEliminationNodes = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  treeData: HierarchyNode,
  onMatchSelect: (match: Match) => void,
  settings: BracketSettings
): void => {
  const allNodes = treeData.descendants();
  const { winnerNodes, loserNodes } = separateWinnerAndLoserBrackets(allNodes);

  // Create winner bracket nodes with standard styling
  if (winnerNodes.length > 0) {
    const winnerGroup = g.append("g").attr("class", "winner-bracket");
    createNodes(
      winnerGroup,
      { ...treeData, descendants: () => winnerNodes } as HierarchyNode,
      onMatchSelect,
      settings.nodeGap,
      settings.winnerBackgroundColor,
      settings.winnerBorderColor,
      settings.loserBackgroundColor,
      settings.loserBorderColor,
      settings.borderWidth,
      settings.cornerRadius,
      settings.nodeWidth,
      settings.nodeHeight,
      settings.backgroundColor
    );
  }

  // Create loser bracket nodes with different styling
  if (loserNodes.length > 0) {
    const loserGroup = g.append("g").attr("class", "loser-bracket");
    createNodes(
      loserGroup,
      { ...treeData, descendants: () => loserNodes } as HierarchyNode,
      onMatchSelect,
      settings.nodeGap,
      "#B91C1C", // Red background for loser bracket
      "#DC2626", // Red border for loser bracket
      settings.loserBackgroundColor,
      settings.loserBorderColor,
      settings.borderWidth,
      settings.cornerRadius,
      settings.nodeWidth,
      settings.nodeHeight,
      settings.backgroundColor
    );
  }
};

/**
 * Adds labels to distinguish winner and loser brackets
 */
const addBracketSectionLabels = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  nodes: HierarchyNode[],
  settings: BracketSettings
): void => {
  const { winnerNodes, loserNodes } = separateWinnerAndLoserBrackets(nodes);

  if (winnerNodes.length > 0) {
    const winnerMinX = Math.min(...winnerNodes.map((d) => d.x));
    const winnerLeftY = Math.min(...winnerNodes.map((d) => d.y));

    g.append("text")
      .attr("x", winnerLeftY - 20)
      .attr("y", winnerMinX - 40)
      .attr("text-anchor", "middle")
      .attr("class", "text-lg font-bold fill-white")
      .text("Winner Bracket");
  }

  if (loserNodes.length > 0) {
    const loserMinX = Math.min(...loserNodes.map((d) => d.x));
    const loserLeftY = Math.min(...loserNodes.map((d) => d.y));

    g.append("text")
      .attr("x", loserLeftY - 20)
      .attr("y", loserMinX - 40)
      .attr("text-anchor", "middle")
      .attr("class", "text-lg font-bold fill-red-400")
      .text("Loser Bracket");
  }
};

/**
 * Setup zoom functionality
 */
const setupZoom = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  g: d3.Selection<SVGGElement, unknown, null, undefined>
): d3.ZoomBehavior<SVGSVGElement, unknown> => {
  const zoom = d3
    .zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.1, 2])
    .on("zoom", (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
      g.attr("transform", event.transform.toString());
    });

  svg.call(zoom);
  return zoom;
};

/**
 * Initialize zoom position for double elimination layout
 */
const initializeZoomPosition = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  zoom: d3.ZoomBehavior<SVGSVGElement, unknown>,
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  containerElement: HTMLDivElement,
  nodes: HierarchyNode[]
): void => {
  const leftmostX = Math.min(...nodes.map((d) => d.y));
  const topY = Math.min(...nodes.map((d) => d.x));

  const currentTransform = d3.zoomTransform(svg.node()!);
  const currentScale = currentTransform.k;

  const bounds = g.node()!.getBBox();
  const width = containerElement.clientWidth;
  const height = containerElement.clientHeight;

  const scaleX = width / bounds.width;
  const scaleY = height / bounds.height;
  const scale = Math.min(scaleX, scaleY) * 0.6; // Smaller scale for double elimination

  const x = -leftmostX * scale + 100;
  const y = -topY * scale + 100;

  if (currentScale === 1) {
    svg.call(zoom.transform, d3.zoomIdentity.translate(x, y).scale(scale));
  } else {
    const newScale = currentScale;
    const newX = x * (newScale / scale);
    const newY = y * (newScale / scale);
    svg.call(
      zoom.transform,
      d3.zoomIdentity.translate(newX, newY).scale(newScale)
    );
  }
};
