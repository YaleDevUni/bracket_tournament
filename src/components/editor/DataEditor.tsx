/**
 * JSON data editor component for bracket data
 */

import React from 'react';

interface DataEditorProps {
  jsonInput: string;
  onJsonChange: (value: string) => void;
  onUpdate: () => void;
  onReset: () => void;
}

const DataEditor: React.FC<DataEditorProps> = ({
  jsonInput,
  onJsonChange,
  onUpdate,
  onReset,
}) => {
  const handleUpdate = () => {
    const result = onUpdate();
    // Handle result if needed (e.g., show success/error message)
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex-1">
      <div className="border-b border-gray-200 bg-gray-800 px-4 py-3">
        <h2 className="text-lg font-semibold text-white">
          Bracket Data Editor
        </h2>
      </div>
      <div className="p-4 h-[calc(100%-3.5rem)]">
        <div className="space-y-4 h-full flex flex-col">
          <textarea
            value={jsonInput}
            onChange={(e) => onJsonChange(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter bracket JSON data..."
          />
          <div className="flex gap-4">
            <button
              onClick={handleUpdate}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Update Bracket
            </button>
            <button
              onClick={onReset}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset Bracket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataEditor;
