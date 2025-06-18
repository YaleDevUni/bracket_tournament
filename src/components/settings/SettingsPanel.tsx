/**
 * Settings panel component for bracket customization
 */

import React from 'react';
import type { BracketSettings } from '../../types/bracket.types';
import SpacingControl from './SpacingControl';
import ToggleSwitch from './ToggleSwitch';

interface SettingsPanelProps {
  settings: BracketSettings;
  onXSpacingChange: (value: number) => void;
  onYSpacingChange: (value: number) => void;
  onRoundedLinksToggle: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onXSpacingChange,
  onYSpacingChange,
  onRoundedLinksToggle,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="border-b border-gray-200 bg-gray-800 px-4 py-3">
        <h2 className="text-lg font-semibold text-white">
          Spacing Settings
        </h2>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-4 mb-4">
          <SpacingControl
            label="X Spacing"
            value={settings.xSpacing}
            min={200}
            max={500}
            onChange={onXSpacingChange}
          />
          <SpacingControl
            label="Y Spacing"
            value={settings.ySpacing}
            min={70}
            max={200}
            onChange={onYSpacingChange}
          />
        </div>

        <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
          <label className="text-sm font-medium text-gray-700">
            Rounded Links
          </label>
          <ToggleSwitch
            enabled={settings.roundedLinks}
            onChange={onRoundedLinksToggle}
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
