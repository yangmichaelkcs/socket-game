/* STATUS */
export enum GAME_STATUS {
  LOBBY = "LOBBY",
  IN_PROGRESS = "IN_PROGRESS",
  END = "END",
  REJOIN = "REJOIN",
  NON_EXIST = "NON_EXIST"
}

export enum ROUND_STATUS {
  PROPOSING_TEAM = "PROPOSING_TEAM", // Player turn proposes a team composition
  VOTING_TEAM = "VOTING_TEAM", // All players vote on proposed team
  VOTING_END = "VOTING_END", // All players view results of the team vote
  MISSION_IN_PROGRESS = "MISSION_IN_PROGRESS", // Team passes or fails mission
  MISSION_END = "MISSION_END", // Everyone views results of mission
  ASSASSIN_CHOOSE = "ASSASSIN_CHOOSE", // Assassin attemps to pick Merlin
  MERLIN_PICKED = "MERLIN_PICKED" // After Merlin has been picked whether evil won or not
}

/* Voting and Team */
export enum TEAM {
  GOOD = "GOOD",
  BAD = "EVIL"
}

export enum VOTE_INDEX {
  POS = 0,
  NEG = 1
}

/* Player Number Requirements */
export const PLAYER_DISTRIBUTION = {
  1: { good: 1, bad: 0 },
  2: { good: 1, bad: 1 },
  3: { good: 2, bad: 1 },
  4: { good: 3, bad: 1 },
  5: { good: 3, bad: 2 },
  6: { good: 4, bad: 2 },
  7: { good: 4, bad: 3 },
  8: { good: 5, bad: 3 },
  9: { good: 6, bad: 3 },
  10: { good: 6, bad: 4 }
};

export const ROUND_REQ = {
  1: 
    { 
      1: { playerNeed: 1, failNeed: 0 },
      2: { playerNeed: 2, failNeed: 1 }, 
      3: { playerNeed: 2, failNeed: 1 }, 
      4: { playerNeed: 2, failNeed: 1 }, 
      5: { playerNeed: 2, failNeed: 1 }, 
      6: { playerNeed: 2, failNeed: 1 }, 
      7: { playerNeed: 2, failNeed: 1 },
      8: { playerNeed: 3, failNeed: 1 },
      9: { playerNeed: 3, failNeed: 1 },
      10: { playerNeed: 3, failNeed: 1 }
    },
  2: 
    { 
      1: { playerNeed: 1, failNeed: 0 },
      2: { playerNeed: 2, failNeed: 1 }, 
      3: { playerNeed: 2, failNeed: 1 }, 
      4: { playerNeed: 2, failNeed: 1 }, 
      5: { playerNeed: 3, failNeed: 1 }, 
      6: { playerNeed: 3, failNeed: 1 }, 
      7: { playerNeed: 3, failNeed: 1 },
      8: { playerNeed: 4, failNeed: 1 },
      9: { playerNeed: 4, failNeed: 1 },
      10: { playerNeed: 4, failNeed: 1 }
    },
  3: 
    { 
      1: { playerNeed: 1, failNeed: 0 },
      2: { playerNeed: 2, failNeed: 1 }, 
      3: { playerNeed: 2, failNeed: 1 }, 
      4: { playerNeed: 2, failNeed: 1 }, 
      5: { playerNeed: 2, failNeed: 1 }, 
      6: { playerNeed: 4, failNeed: 1 }, 
      7: { playerNeed: 3, failNeed: 1 },
      8: { playerNeed: 4, failNeed: 1 },
      9: { playerNeed: 4, failNeed: 1 },
      10: { playerNeed: 4, failNeed: 1 }
    },
  4: 
    { 
      1: { playerNeed: 1, failNeed: 0 },
      2: { playerNeed: 2, failNeed: 1 }, 
      3: { playerNeed: 2, failNeed: 1 }, 
      4: { playerNeed: 2, failNeed: 1 }, 
      5: { playerNeed: 3, failNeed: 1 }, 
      6: { playerNeed: 3, failNeed: 1 }, 
      7: { playerNeed: 4, failNeed: 2 },
      8: { playerNeed: 5, failNeed: 2 },
      9: { playerNeed: 5, failNeed: 2 },
      10: { playerNeed: 5, failNeed: 2 }
    },
  5: 
    { 
      1: { playerNeed: 1, failNeed: 0 },
      2: { playerNeed: 2, failNeed: 1 }, 
      3: { playerNeed: 2, failNeed: 1 }, 
      4: { playerNeed: 2, failNeed: 1 }, 
      5: { playerNeed: 3, failNeed: 1 }, 
      6: { playerNeed: 4, failNeed: 1 }, 
      7: { playerNeed: 4, failNeed: 1 },
      8: { playerNeed: 5, failNeed: 1 },
      9: { playerNeed: 5, failNeed: 1 },
      10: { playerNeed: 5, failNeed: 1 }
    }
}

/* Definitions */
export interface RootState {
  game: Game;
  user: User;
}

export interface User {
  socketId: string;
}

export interface Game {
  id: string;
  players: Player[];
  status?: GAME_STATUS;
  roundStatus?: ROUND_STATUS;
  currentRound: number;
  score: number[];
  failedVotes: number;
  currentPlayerTurn: string;
  rounds: Round[];
  votes: number[];
  includes: boolean[];
}

export interface Round {
  id: number;
  value: TEAM;
  playersNeeded: number;
  failsNeeded: number;
}

export interface Player {
  socketId: string;
  nickName?: string;
  team?: TEAM;
  role?: string;
  selected?: number;
  vote?: number;
}

export enum SPECIAL_CHAR_INDEX {
  ASSMERLIN = 0,
  PERCIVAL = 1,
  MORGANA = 2,
  MORDRED = 3
}

export enum ROLES {
  NONE = "None",
  MORGANA = "Morgana",
  MORDRED = "Mordred",
  MERLIN = "Merlin",
  PERCIVAL = "Percival",
  ASSASSIN = "Assassin"
}

export enum SCORE_TYPE {
  ASSASSIN = 4
}