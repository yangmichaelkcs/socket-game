import { Player, RootState } from "types/types";

export const getCurrentPage = (state: RootState) => state.game.status;
export const getPlayers = (state: RootState): Player[] => state.game.players;
export const getPlayerCount = (state: RootState) =>
  state.game.players && state.game.players.length;
export const getGameId = (state: RootState) => state.game.id;
export const getPlayerData = (state: RootState): Player => {
  const socketId = state.user.socketId;
  const players = state.game.players;
  return players.find(player => player.socketId === socketId);
};
export const getPlayerDataById = (
  state: RootState,
  socketId: string
): Player => {
  const players = state.game.players;
  return players.find(player => player.socketId === socketId);
};
export const getCurrentPlayerTurn = (state: RootState) =>
  state.game.currentPlayerTurn;
export const getCurrentRound = (state: RootState) => state.game.currentRound;
export const getFailedVotes = (state: RootState) => state.game.failedVotes;
export const getRoundStatus = (state: RootState) => state.game.roundStatus;
export const getRounds = (state: RootState) => state.game.rounds;
export const getVotes = (state: RootState) => state.game.votes;
export const getScore = (state: RootState) => state.game.score;
export const getIncludes = (state: RootState) => state.game.includes;
