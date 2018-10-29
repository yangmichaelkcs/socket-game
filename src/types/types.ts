export enum GAME_STATUS {
  LOBBY = "LOBBY",
  IN_PROGRESS = "IN_PROGRESS",
  END = "END"
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

export interface Game {
  players: Player[];
  status: GAME_STATUS;
  currentRound: number;
  score: number[];
  failedVotes: number;
  currentPlayerTurn: string;
}

export interface Player {
  socketId: string;
  nickName: string;
  team: TEAM;
  role: string;
}
