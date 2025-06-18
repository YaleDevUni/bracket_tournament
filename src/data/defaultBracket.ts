/**
 * Default bracket data for initialization
 */

import type { Match } from "../types/bracket.types";

export const defaultBracketData: Match[] = [
  {
    id: "match-7",
    tag: "G",
    team1: "Team A",
    team2: "Team B",
    team1Score: 1,
    team2Score: 0,
    details: "Championship Match",
    label: "Final",
    winner: "Team A",
    children: [
      {
        id: "match-5",
        tag: "D",
        team1: "Team A",
        team2: "Team C",
        team1Score: 1,
        team2Score: 0,
        details: "Semi-Final Match 1",
        label: "Semi-Finals",
        winner: "Team A",
        children: [
          {
            id: "match-1",
            tag: "E",
            team1: "Team A",
            team2: "Team B",
            team1Score: 3,
            team2Score: 0,
            details: "Quarter-Final Match 1",
            label: "Quarter-Finals",
            winner: "Team A",
          },
          {
            id: "match-2",
            tag: "F",
            team1: "Team C",
            team2: "Team D",
            team1Score: 5,
            team2Score: 2,
            details: "Quarter-Final Match 2",
            label: "Quarter-Finals",
            winner: "Team C",
          },
        ],
      },
      {
        id: "match-6",
        tag: "C",
        team1: "Team B",
        team2: "Team H",
        team1Score: 2,
        team2Score: 0,
        details: "Semi-Final Match 2",
        label: "Semi-Finals",
        winner: "Team B",
        children: [
          {
            id: "match-3",
            tag: "A",
            team1: "Team E",
            team2: "Team F",
            team1Score: 3,
            team2Score: 0,
            details: "Quarter-Final Match 3",
            label: "Quarter-Finals",
            winner: "Team E",
          },
          {
            id: "match-4",
            tag: "B",
            team1: "Team G",
            team2: "Team H",
            team1Score: 2,
            team2Score: 7,
            details: "Quarter-Final Match 4",
            label: "Quarter-Finals",
            winner: "Team H",
          },
        ],
      },
    ],
  },
];
