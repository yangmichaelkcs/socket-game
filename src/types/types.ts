export enum GAME_STATUS {
  LOBBY = "LOBBY",
  IN_PROGRESS = "IN_PROGRESS",
  END = "END"
}

export enum ROUND_STATUS {
  PROPOSING_TEAM = "PROPOSING_TEAM", // Player turn proposes a team composition
  VOTING_TEAM = "VOTING_TEAM", // All players vote on proposed team
  VOTING_END = "VOTING_END", // All players view results of the team vote
  MISSION_IN_PROGRESS = "MISSION_IN_PROGRESS", // Team passes or fails mission
  MISSION_END = "MISSION_END", // Everyone views results of mission
}

export enum TEAM {
  GOOD = "GOOD",
  BAD = "BAD"
}

export const PLAYER_DISTRIBUTION = {
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
      5: { playerNeed: 2, failNeed: 1 }, 
      6: { playerNeed: 2, failNeed: 1 }, 
      7: { playerNeed: 2, failNeed: 1 },
      8: { playerNeed: 3, failNeed: 1 },
      9: { playerNeed: 3, failNeed: 1 },
      10: { playerNeed: 3, failNeed: 1 }
    },
  2: 
    { 
      5: { playerNeed: 3, failNeed: 1 }, 
      6: { playerNeed: 3, failNeed: 1 }, 
      7: { playerNeed: 3, failNeed: 1 },
      8: { playerNeed: 4, failNeed: 1 },
      9: { playerNeed: 4, failNeed: 1 },
      10: { playerNeed: 4, failNeed: 1 }
    },
  3: 
    { 
      5: { playerNeed: 2, failNeed: 1 }, 
      6: { playerNeed: 4, failNeed: 1 }, 
      7: { playerNeed: 3, failNeed: 1 },
      8: { playerNeed: 4, failNeed: 1 },
      9: { playerNeed: 4, failNeed: 1 },
      10: { playerNeed: 4, failNeed: 1 }
    },
  4: 
    { 
      5: { playerNeed: 3, failNeed: 1 }, 
      6: { playerNeed: 3, failNeed: 1 }, 
      7: { playerNeed: 4, failNeed: 2 },
      8: { playerNeed: 5, failNeed: 2 },
      9: { playerNeed: 5, failNeed: 2 },
      10: { playerNeed: 5, failNeed: 2 }
    },
  5: 
    { 
      5: { playerNeed: 3, failNeed: 1 }, 
      6: { playerNeed: 4, failNeed: 1 }, 
      7: { playerNeed: 4, failNeed: 1 },
      8: { playerNeed: 5, failNeed: 1 },
      9: { playerNeed: 5, failNeed: 1 },
      10: { playerNeed: 5, failNeed: 1 }
    }
}

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
}

export interface Round {
  id: number;
  value: TEAM;
  playersNeeded: number;
}

export interface Player {
  socketId: string;
  nickName?: string;
  team?: TEAM;
  role?: string;
  selected?: number;
}
