/**
 * Custom hook for managing bracket display settings
 */

import { useState } from 'react';
import type { BracketSettings } from '../types/bracket.types';

const DEFAULT_SETTINGS: BracketSettings = {
  xSpacing: 400,
  ySpacing: 100,
  roundedLinks: false,
};

export const useBracketSettings = () => {
  const [settings, setSettings] = useState<BracketSettings>(DEFAULT_SETTINGS);

  const updateXSpacing = (value: number) => {
    setSettings(prev => ({ ...prev, xSpacing: value }));
  };

  const updateYSpacing = (value: number) => {
    setSettings(prev => ({ ...prev, ySpacing: value }));
  };

  const toggleRoundedLinks = () => {
    setSettings(prev => ({ ...prev, roundedLinks: !prev.roundedLinks }));
  };

  return {
    settings,
    updateXSpacing,
    updateYSpacing,
    toggleRoundedLinks,
  };
};
