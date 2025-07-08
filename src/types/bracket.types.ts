/**
 * Type definitions for the bracket system
 */

export interface Match {
  id: string;
  tag: string;
  team1: string;
  team2: string;
  team1Score: number;
  team2Score: number;
  details: string;
  winner?: string;
  label?: string;
  children?: Match[];
}
export interface DoubleEliminationMatch extends Match {
  isLoserBracket: boolean;
  children?: DoubleEliminationMatch[];
}

export type BracketMode = "single" | "double";

export interface BracketSettings {
  xSpacing: number;
  ySpacing: number;
  roundedLinks: boolean;
  nodeGap: number;
  winnerBackgroundColor: string;
  winnerBorderColor: string;
  loserBackgroundColor: string;
  loserBorderColor: string;
  borderWidth: number;
  cornerRadius: number;
  nodeWidth: number;
  nodeHeight: number;
  backgroundColor: string;
  canvasBackgroundColor: string;
  bracketMode: BracketMode;
}

export interface HierarchyNode extends d3.HierarchyNode<Match> {
  x: number;
  y: number;
}

export type LabelOrder = {
  [key: string]: number;
};
