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
 * Detaches loser bracket nodes and creates a separate bracket structure
 */
const detachAndRenderLoserBracket = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  treeData: HierarchyNode,
  onMatchSelect: (match: Match) => void,
  settings: BracketSettings
): HierarchyNode[] => {
  const allNodes = treeData.descendants();
  const { loserNodes } = separateWinnerAndLoserBrackets(allNodes);

  if (loserNodes.length === 0) {
    return [];
  }

  // Create a separate hierarchy for loser bracket
  const loserMatches = loserNodes.map((node) => node.data);

  // Find the root of loser bracket (node with no parent in loser bracket)
  const loserRoot = loserMatches.find((match) => {
    const parentIsLoser = loserMatches.some(
      (m) => m.children && m.children.some((child) => child.id === match.id)
    );
    return !parentIsLoser;
  });

  if (!loserRoot) {
    return [];
  }

  // Create separate hierarchy for loser bracket
  const loserHierarchy = d3.hierarchy(loserRoot, (d: Match) => d.children);
  const loserTreeLayout = d3
    .tree<Match>()
    .nodeSize([settings.ySpacing, settings.xSpacing]);
  const loserTreeData = loserTreeLayout(loserHierarchy) as HierarchyNode;

  // Position loser bracket in bottom half
  const loserLeafNodes = loserTreeData
    .descendants()
    .filter((d) => !d.children || d.children.length === 0);

  if (loserLeafNodes.length > 0) {
    loserLeafNodes.sort((a, b) => a.x - b.x);
    const loserStartY = settings.ySpacing * 2;

    loserLeafNodes.forEach((node, index) => {
      node.x = loserStartY + index * settings.ySpacing;
    });

    // Adjust internal loser nodes
    adjustInternalNodes(loserTreeData.descendants());
  }

  // Flip coordinates for left-to-right layout
  flipCoordinates(loserTreeData.descendants());

  // Create loser bracket group and render
  const loserGroup = g.append("g").attr("class", "loser-bracket");

  // Render loser bracket components
  createLinks(loserGroup, loserTreeData, settings.roundedLinks);
  createNodes(
    loserGroup,
    loserTreeData,
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
  createMatchTags(loserGroup, loserTreeData, 10, settings.nodeWidth);

  // Add loser bracket label
  const loserNodes_positioned = loserTreeData.descendants();
  if (loserNodes_positioned.length > 0) {
    const loserMinX = Math.min(...loserNodes_positioned.map((d) => d.x));
    const loserLeftY = Math.min(...loserNodes_positioned.map((d) => d.y));

    loserGroup
      .append("text")
      .attr("x", loserLeftY - 20)
      .attr("y", loserMinX - 40)
      .attr("text-anchor", "middle")
      .attr("class", "text-lg font-bold fill-red-400")
      .text("Loser Bracket");
  }

  return loserTreeData.descendants();
};

/**
 * Recursively filters out loser bracket nodes from a match structure
 */
const filterLoserBracketNodes = (match: Match): Match | null => {
  const doubleElimMatch = match as DoubleEliminationMatch;

  // If this is a loser bracket match, exclude it
  if (doubleElimMatch.isLoserBracket) {
    return null;
  }

  // Create a copy of the match
  const filteredMatch: Match = {
    ...match,
    children: [],
  };

  // Recursively filter children
  if (match.children && match.children.length > 0) {
    const filteredChildren = match.children
      .map((child) => filterLoserBracketNodes(child))
      .filter((child) => child !== null) as Match[];

    filteredMatch.children = filteredChildren;
  }

  return filteredMatch;
};

/**
 * Creates a proper d3 hierarchy for winner bracket nodes (loser bracket completely removed)
 */
const createWinnerBracketHierarchy = (
  treeData: HierarchyNode,
  settings: BracketSettings
): HierarchyNode | null => {
  const rootMatch = treeData.data;

  // Filter out all loser bracket nodes from the entire structure
  const winnerOnlyRoot = filterLoserBracketNodes(rootMatch);

  if (!winnerOnlyRoot) {
    return null;
  }

  // Create proper hierarchy for winner bracket only
  const winnerHierarchy = d3.hierarchy(
    winnerOnlyRoot,
    (d: Match) => d.children
  );
  const winnerTreeLayout = d3
    .tree<Match>()
    .nodeSize([settings.ySpacing, settings.xSpacing]);
  const winnerTreeData = winnerTreeLayout(winnerHierarchy) as HierarchyNode;

  // Position winner bracket in top half
  const winnerLeafNodes = winnerTreeData
    .descendants()
    .filter((d) => !d.children || d.children.length === 0);

  if (winnerLeafNodes.length > 0) {
    winnerLeafNodes.sort((a, b) => a.x - b.x);
    const winnerHeight = (winnerLeafNodes.length - 1) * settings.ySpacing;
    const winnerStartY = -winnerHeight / 2 - settings.ySpacing * 2;

    winnerLeafNodes.forEach((node, index) => {
      node.x = winnerStartY + index * settings.ySpacing;
    });

    // Adjust internal nodes
    adjustInternalNodes(winnerTreeData.descendants());
  }

  // Flip coordinates for left-to-right layout
  flipCoordinates(winnerTreeData.descendants());

  return winnerTreeData;
};

/**
 * Renders winner bracket only (filtering out loser bracket nodes)
 */
const renderWinnerBracketOnly = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  treeData: HierarchyNode,
  onMatchSelect: (match: Match) => void,
  settings: BracketSettings
): HierarchyNode[] => {
  const winnerTreeData = createWinnerBracketHierarchy(treeData, settings);

  if (!winnerTreeData) {
    return [];
  }

  // Create winner bracket group
  const winnerGroup = g.append("g").attr("class", "winner-bracket");

  // Render winner bracket components
  createLinks(winnerGroup, winnerTreeData, settings.roundedLinks);
  createNodes(
    winnerGroup,
    winnerTreeData,
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
  createMatchTags(winnerGroup, winnerTreeData, 10, settings.nodeWidth);

  // Add winner bracket label
  const winnerNodes = winnerTreeData.descendants();
  if (winnerNodes.length > 0) {
    const winnerMinX = Math.min(...winnerNodes.map((d) => d.x));
    const winnerLeftY = Math.min(...winnerNodes.map((d) => d.y));

    winnerGroup
      .append("text")
      .attr("x", winnerLeftY - 20)
      .attr("y", winnerMinX - 40)
      .attr("text-anchor", "middle")
      .attr("class", "text-lg font-bold fill-white")
      .text("Winner Bracket");
  }

  return winnerNodes;
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

  // Render winner bracket only
  const winnerNodes = renderWinnerBracketOnly(
    g,
    treeData,
    onMatchSelect,
    settings
  );

  // Detach and render loser bracket separately
  const loserNodes = detachAndRenderLoserBracket(
    g,
    treeData,
    onMatchSelect,
    settings
  );

  // Combine all nodes for round labels and zoom
  const combinedNodes = [...winnerNodes, ...loserNodes];

  // Create round labels
  const rounds = treeData.height ;
  const roundLabels = extractUniqueRoundLabels(combinedNodes, rounds, true);
  createRoundLabels(
    g,
    { descendants: () => combinedNodes } as HierarchyNode,
    roundLabels,
    rounds
  );

  // Initial zoom and position
  initializeZoomPosition(svg, zoom, g, containerElement, combinedNodes);

  // Cleanup function
  return () => {
    svg.selectAll("*").remove();
  };
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
