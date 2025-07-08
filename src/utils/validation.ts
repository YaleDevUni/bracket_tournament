/**
 * Validation utilities for bracket data
 */

import type { Match } from "../types/bracket.types";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export const validateMatch = (match: Match): match is Match => {
  if (typeof match !== "object" || match === null) {
    throw new ValidationError("Each match must be an object");
  }

  if (typeof match.id !== "string") {
    throw new ValidationError('Each match must have a string "id" property');
  }
  if (typeof match.team1 !== "string") {
    throw new ValidationError('Each match must have a string "team1" property');
  }
  if (typeof match.team2 !== "string") {
    throw new ValidationError('Each match must have a string "team2" property');
  }
  if (typeof match.details !== "string") {
    throw new ValidationError(
      'Each match must have a string "details" property'
    );
  }

  if (match.children !== undefined) {
    if (!Array.isArray(match.children)) {
      throw new ValidationError(
        'The "children" property must be an array if present'
      );
    }

    match.children.forEach((child: Match, index: number) => {
      try {
        validateMatch(child);
      } catch (error) {
        throw new ValidationError(
          `Invalid child at index ${index}: ${(error as Error).message}`
        );
      }
    });
  }

  return true;
};

export const validateBracketData = (data: string | Match[]): Match[] => {
  const parsedData = typeof data === "string" ? JSON.parse(data) : data;

  if (!Array.isArray(parsedData)) {
    throw new ValidationError("The JSON must be an array of matches");
  }

  if (parsedData.length === 0) {
    throw new ValidationError("The JSON must contain at least one match");
  }

  parsedData.forEach((match, index) => {
    try {
      validateMatch(match);
    } catch (error) {
      throw new ValidationError(
        `Invalid match at index ${index}: ${(error as Error).message}`
      );
    }
  });

  return parsedData as Match[];
};
