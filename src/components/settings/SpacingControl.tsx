/**
 * Spacing control component with slider
 */

import React from 'react';

interface SpacingControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

const SpacingControl: React.FC<SpacingControlProps> = ({
  label,
  value,
  min,
  max,
  onChange,
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex-1">
      <label className="text-sm font-medium text-gray-700">
        {label}: {value}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        style={{
          background: `linear-gradient(to right, #2563EB ${percentage}%, #E5E7EB ${percentage}%)`,
        }}
      />
    </div>
  );
};

export default SpacingControl;
