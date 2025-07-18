/**
 * Custom hook for managing bracket data
 */

import { useState, useCallback } from "react";
import type { Match, BracketMode } from "../types/bracket.types";
import { validateBracketData, ValidationError } from "../utils/validation";
import { defaultBracketData, doubleEliminationBracketData } from "../data/defaultBracket";

export const useBracketData = () => {
  const [bracketData, setBracketData] = useState<Match[]>([defaultBracketData]);
  const [jsonInput, setJsonInput] = useState<string>(
    JSON.stringify([defaultBracketData], null, 2)
  );

  const handleJsonUpdate = useCallback(() => {
    try {
      const validatedData = validateBracketData(jsonInput);
      setBracketData(validatedData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof ValidationError
            ? error.message
            : "Invalid JSON format",
      };
    }
  }, [jsonInput]);

  const resetBracket = useCallback(() => {
    setJsonInput(JSON.stringify([defaultBracketData], null, 2));
    setBracketData([defaultBracketData]);
  }, []);

  const updateJsonInput = useCallback((value: string) => {
    setJsonInput(value);
  }, []);

  const switchBracketMode = useCallback((mode: BracketMode) => {
    const newData = mode === "single" ? [defaultBracketData] : [doubleEliminationBracketData];
    setBracketData(newData);
    setJsonInput(JSON.stringify(newData, null, 2));
  }, []);

  return {
    bracketData,
    jsonInput,
    handleJsonUpdate,
    resetBracket,
    updateJsonInput,
    setBracketData,
    switchBracketMode,
  };
};
