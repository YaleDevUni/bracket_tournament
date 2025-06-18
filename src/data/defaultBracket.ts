/**
 * Default bracket data for initialization
 */

import type { Match } from '../types/bracket.types';

export const defaultBracketData: Match[] = [
  {
    id: "match-7",
    team1: "Team A",
    team2: "Team B",
    details: "Championship Match",
    label: "Final",
    winner: "Team A",
    children: [
      {
        id: "match-5",
        team1: "Team A",
        team2: "Team C",
        details: "Semi-Final Match 1",
        label: "Semi-Finals",
        winner: "Team A",
        children: [
          {
            id: "match-1",
            team1: "Team A",
            team2: "Team B",
            details: "Quarter-Final Match 1",
            label: "Quarter-Finals",
            winner: "Team A",
          },
          {
            id: "match-2",
            team1: "Team C",
            team2: "Team D",
            details: "Quarter-Final Match 2",
            label: "Quarter-Finals",
            winner: "Team C",
          },
        ],
      },
      {
        id: "match-6",
        team1: "Team B",
        team2: "Team H",
        details: "Semi-Final Match 2",
        label: "Semi-Finals",
        winner: "Team B",
        children: [
          {
            id: "match-3",
            team1: "Team E",
            team2: "Team F",
            details: "Quarter-Final Match 3",
            label: "Quarter-Finals",
            winner: "Team E",
          },
          {
            id: "match-4",
            team1: "Team G",
            team2: "Team H",
            details: "Quarter-Final Match 4",
            label: "Quarter-Finals",
            winner: "Team H",
          },
        ],
      },
    ],
  },
];
