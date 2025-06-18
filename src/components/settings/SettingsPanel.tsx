/**
 * Settings panel component for bracket customization
 */

import React from "react";
import type { BracketSettings } from "../../types/bracket.types";
import SpacingControl from "./SpacingControl";
import ToggleSwitch from "./ToggleSwitch";

interface SettingsPanelProps {
  settings: BracketSettings;
  onXSpacingChange: (value: number) => void;
  onYSpacingChange: (value: number) => void;
  onRoundedLinksToggle: () => void;
  onNodeGapChange: (value: number) => void;
  onWinnerBackgroundColorChange: (value: string) => void;
  onWinnerBorderColorChange: (value: string) => void;
  onLoserBackgroundColorChange: (value: string) => void;
  onLoserBorderColorChange: (value: string) => void;
  onBorderWidthChange: (value: number) => void;
  onCornerRadiusChange: (value: number) => void;
  onNodeWidthChange: (value: number) => void;
  onNodeHeightChange: (value: number) => void;
  onBackgroundColorChange: (value: string) => void;
  onCanvasBackgroundColorChange: (value: string) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onXSpacingChange,
  onYSpacingChange,
  onRoundedLinksToggle,
  onNodeGapChange,
  onWinnerBackgroundColorChange,
  onWinnerBorderColorChange,
  onLoserBackgroundColorChange,
  onLoserBorderColorChange,
  onBorderWidthChange,
  onCornerRadiusChange,
  onNodeWidthChange,
  onNodeHeightChange,
  onBackgroundColorChange,
  onCanvasBackgroundColorChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="border-b border-gray-200 bg-gray-800 px-4 py-3">
        <h2 className="text-lg font-semibold text-white">Bracket Settings</h2>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-4 mb-4">
          <SpacingControl
            label="X Spacing"
            value={settings.xSpacing}
            min={100}
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

        <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg mb-4">
          <label className="text-sm font-medium text-gray-700">
            Rounded Links
          </label>
          <ToggleSwitch
            enabled={settings.roundedLinks}
            onChange={onRoundedLinksToggle}
          />
        </div>

        <div className="border-t border-gray-200 pt-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Canvas Settings
          </h3>

          <div className="flex items-center gap-4 mb-4">
            <label className="text-sm font-medium text-gray-700 min-w-[120px]">
              Canvas Background:
            </label>
            <input
              type="color"
              value={settings.canvasBackgroundColor}
              onChange={(e) => onCanvasBackgroundColorChange(e.target.value)}
              className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
            />
            <span className="text-sm text-gray-500">
              {settings.canvasBackgroundColor}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Node Styling
          </h3>

          <div className="flex items-center gap-4 mb-4">
            <SpacingControl
              label="Node Width"
              value={settings.nodeWidth}
              min={80}
              max={300}
              onChange={onNodeWidthChange}
            />
            <SpacingControl
              label="Node Height"
              value={settings.nodeHeight}
              min={15}
              max={50}
              onChange={onNodeHeightChange}
            />
          </div>

          <div className="flex items-center gap-4 mb-4">
            <SpacingControl
              label="Node Gap"
              value={settings.nodeGap}
              min={0}
              max={10}
              onChange={onNodeGapChange}
            />
            <SpacingControl
              label="Border Width"
              value={settings.borderWidth}
              min={0}
              max={5}
              onChange={onBorderWidthChange}
            />
            <SpacingControl
              label="Corner Radius"
              value={settings.cornerRadius}
              min={0}
              max={20}
              onChange={onCornerRadiusChange}
            />
          </div>

          <div className="border-t border-gray-200 pt-4 mb-4">
            <h4 className="text-md font-semibold text-gray-700 mb-3">
              Winner Team Colors
            </h4>

            <div className="flex items-center gap-4 mb-3">
              <label className="text-sm font-medium text-gray-700 min-w-[120px]">
                Background:
              </label>
              <input
                type="color"
                value={settings.winnerBackgroundColor}
                onChange={(e) => onWinnerBackgroundColorChange(e.target.value)}
                className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <span className="text-sm text-gray-500">
                {settings.winnerBackgroundColor}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <label className="text-sm font-medium text-gray-700 min-w-[120px]">
                Border:
              </label>
              <input
                type="color"
                value={settings.winnerBorderColor}
                onChange={(e) => onWinnerBorderColorChange(e.target.value)}
                className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <span className="text-sm text-gray-500">
                {settings.winnerBorderColor}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 mb-4">
            <h4 className="text-md font-semibold text-gray-700 mb-3">
              Loser Team Colors
            </h4>

            <div className="flex items-center gap-4 mb-3">
              <label className="text-sm font-medium text-gray-700 min-w-[120px]">
                Background:
              </label>
              <input
                type="color"
                value={settings.loserBackgroundColor}
                onChange={(e) => onLoserBackgroundColorChange(e.target.value)}
                className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <span className="text-sm text-gray-500">
                {settings.loserBackgroundColor}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <label className="text-sm font-medium text-gray-700 min-w-[120px]">
                Border:
              </label>
              <input
                type="color"
                value={settings.loserBorderColor}
                onChange={(e) => onLoserBorderColorChange(e.target.value)}
                className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <span className="text-sm text-gray-500">
                {settings.loserBorderColor}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <label className="text-sm font-medium text-gray-700">
              Background Color:
            </label>
            <input
              type="color"
              value={settings.backgroundColor}
              onChange={(e) => onBackgroundColorChange(e.target.value)}
              className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
            />
            <span className="text-sm text-gray-500">
              {settings.backgroundColor}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
