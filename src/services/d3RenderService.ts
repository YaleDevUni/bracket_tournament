/**
 * D3.js rendering service for bracket visualization
 */

import * as d3 from 'd3';
import type { Match, BracketSettings, HierarchyNode } from '../types/bracket.types';
import { 
  flipCoordinates, 
  extractUniqueRoundLabels, 
} from '../utils/bracketHelpers';
import { createLinks, createNodes, createRoundLabels } from './d3Components';

export const renderBracketTree = (
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
  const treeLayout = d3.tree<Match>().nodeSize([settings.ySpacing, settings.xSpacing]);
  const treeData = treeLayout(root) as HierarchyNode;

  // Flip coordinates for left-to-right layout
  flipCoordinates(treeData.descendants());

  // Create main group
  const g = svg.append("g");

  // Setup zoom
  const zoom = setupZoom(svg, g);

  // Render components
  createLinks(g, treeData, settings.roundedLinks);
  createNodes(g, treeData, onMatchSelect);
  
  const rounds = treeData.height + 1;
  const roundLabels = extractUniqueRoundLabels(treeData.descendants(), rounds);
  createRoundLabels(g, treeData, roundLabels, rounds);

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
  const scale = Math.min(scaleX, scaleY) * 0.8;

  const x = -leftmostX * scale + 50;
  const y = -topY * scale + 50;

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
