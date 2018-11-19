import Player from "components/game/Player";

export const getCurrentPage = state => state.game.status;
export const getPlayerCount = state =>
  state.game.players && state.game.players.length;
export const getGameId = state => state.game.id;
export const getPlayerData = (state): Player => {
  const socketId = state.user.socketId;
  const players = state.game.players;
  return players.find(player => player.socketId === socketId);
};
