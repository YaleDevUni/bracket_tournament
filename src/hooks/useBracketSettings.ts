/**
 * Custom hook for managing bracket display settings
 */

import { useState } from "react";
import type { BracketSettings, BracketMode } from "../types/bracket.types";

const DEFAULT_SETTINGS: BracketSettings = {
  xSpacing: 150,
  ySpacing: 70,
  roundedLinks: false,
  nodeGap: 5,
  winnerBackgroundColor: "#FF5E00",
  winnerBorderColor: "#FF5E00",
  loserBackgroundColor: "#191919",
  loserBorderColor: "#939393",
  borderWidth: 1,
  cornerRadius: 4,
  nodeWidth: 120,
  nodeHeight: 25,
  backgroundColor: "#191919",
  canvasBackgroundColor: "#191919",
  bracketMode: "single",
};

export const useBracketSettings = () => {
  const [settings, setSettings] = useState<BracketSettings>(DEFAULT_SETTINGS);

  const updateXSpacing = (value: number) => {
    setSettings((prev) => ({ ...prev, xSpacing: value }));
  };

  const updateYSpacing = (value: number) => {
    setSettings((prev) => ({ ...prev, ySpacing: value }));
  };

  const toggleRoundedLinks = () => {
    setSettings((prev) => ({ ...prev, roundedLinks: !prev.roundedLinks }));
  };

  const updateNodeGap = (value: number) => {
    setSettings((prev) => ({ ...prev, nodeGap: value }));
  };

  const updateWinnerBackgroundColor = (value: string) => {
    setSettings((prev) => ({ ...prev, winnerBackgroundColor: value }));
  };

  const updateWinnerBorderColor = (value: string) => {
    setSettings((prev) => ({ ...prev, winnerBorderColor: value }));
  };

  const updateLoserBackgroundColor = (value: string) => {
    setSettings((prev) => ({ ...prev, loserBackgroundColor: value }));
  };

  const updateLoserBorderColor = (value: string) => {
    setSettings((prev) => ({ ...prev, loserBorderColor: value }));
  };

  const updateBorderWidth = (value: number) => {
    setSettings((prev) => ({ ...prev, borderWidth: value }));
  };

  const updateCornerRadius = (value: number) => {
    setSettings((prev) => ({ ...prev, cornerRadius: value }));
  };

  const updateNodeWidth = (value: number) => {
    setSettings((prev) => ({ ...prev, nodeWidth: value }));
  };

  const updateNodeHeight = (value: number) => {
    setSettings((prev) => ({ ...prev, nodeHeight: value }));
  };

  const updateBackgroundColor = (value: string) => {
    setSettings((prev) => ({ ...prev, backgroundColor: value }));
  };

  const updateCanvasBackgroundColor = (value: string) => {
    setSettings((prev) => ({ ...prev, canvasBackgroundColor: value }));
  };

  const updateBracketMode = (value: BracketMode) => {
    setSettings((prev) => ({ ...prev, bracketMode: value }));
  };

  return {
    settings,
    updateXSpacing,
    updateYSpacing,
    toggleRoundedLinks,
    updateNodeGap,
    updateWinnerBackgroundColor,
    updateWinnerBorderColor,
    updateLoserBackgroundColor,
    updateLoserBorderColor,
    updateBorderWidth,
    updateCornerRadius,
    updateNodeWidth,
    updateNodeHeight,
    updateBackgroundColor,
    updateCanvasBackgroundColor,
    updateBracketMode,
  };
};
