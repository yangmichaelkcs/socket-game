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
  MISSION_END = "MISSION_END" // Everyone views results of mission
}

export enum TEAM {
  GOOD = "GOOD",
  BAD = "BAD"
}

export const PLAYER_DISTRIBUTION = {
  2: { good: 1, bad: 1 },
  3: { good: 2, bad: 1 },
  4: { good: 3, bad: 1 },
  5: { good: 4, bad: 1 },
  6: { good: 5, bad: 2 },
  7: { good: 6, bad: 2 },
  8: { good: 7, bad: 2 },
  9: { good: 8, bad: 3 },
  10: { good: 9, bad: 3 }
};

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
