/**
 * Main application component
 */

import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SettingsPanel from "./components/settings/SettingsPanel";
import DataEditor from "./components/editor/DataEditor";
import BracketVisualization from "./components/visualization/BracketVisualization";
import MatchDetailsModal from "./components/MatchDetailsModal";
import { useBracketData } from "./hooks/useBracketData";
import { useBracketSettings } from "./hooks/useBracketSettings";
import type { Match } from "./types/bracket.types";
import "./index.css";

const App: React.FC = () => {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  
  const {
    bracketData,
    jsonInput,
    handleJsonUpdate,
    resetBracket,
    updateJsonInput,
  } = useBracketData();

  const {
    settings,
    updateXSpacing,
    updateYSpacing,
    toggleRoundedLinks,
  } = useBracketSettings();

  const handleUpdateBracket = () => {
    const result = handleJsonUpdate();
    if (!result.success && result.error) {
      alert(`Invalid JSON format: ${result.error}`);
    }
    return result;
  };

  // Sync JSON input when bracket data changes
  useEffect(() => {
    updateJsonInput(JSON.stringify(bracketData, null, 2));
  }, [bracketData, updateJsonInput]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
        <div className="flex gap-6 h-full">
          <div className="w-1/3 flex flex-col gap-6">
            <SettingsPanel
              settings={settings}
              onXSpacingChange={updateXSpacing}
              onYSpacingChange={updateYSpacing}
              onRoundedLinksToggle={toggleRoundedLinks}
            />
            
            <DataEditor
              jsonInput={jsonInput}
              onJsonChange={updateJsonInput}
              onUpdate={handleUpdateBracket}
              onReset={resetBracket}
            />
          </div>

          <BracketVisualization
            bracketData={bracketData}
            settings={settings}
            onMatchSelect={setSelectedMatch}
          />
        </div>
      </main>

      <Footer />

      <MatchDetailsModal
        match={selectedMatch}
        onClose={() => setSelectedMatch(null)}
      />
    </div>
  );
};

export default App;
