/**
 * Type definitions for the bracket system
 */

export interface Match {
  id: string;
  team1: string;
  team2: string;
  details: string;
  winner?: string;
  label?: string;
  children?: Match[];
}

export interface BracketSettings {
  xSpacing: number;
  ySpacing: number;
  roundedLinks: boolean;
}

export interface HierarchyNode extends d3.HierarchyNode<Match> {
  x: number;
  y: number;
}

export type LabelOrder = {
  [key: string]: number;
};
