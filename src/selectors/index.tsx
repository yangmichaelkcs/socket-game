import { Player } from "types/types";

export const getCurrentPage = state => state.game.status;
export const getPlayers = (state): Player[] => state.game.players;
export const getPlayerCount = state =>
  state.game.players && state.game.players.length;
export const getGameId = state => state.game.id;
export const getPlayerData = (state): Player => {
  const socketId = state.user.socketId;
  const players = state.game.players;
  return players.find(player => player.socketId === socketId);
};
export const getPlayerDataById = (state, socketId): Player => {
  const players = state.game.players;
  return players.find(player => player.socketId === socketId);
};
export const getCurrentPlayerTurn = state => state.game.currentPlayerTurn;
