export const getCurrentPage = state =>
  state.navigation[state.navigation.length - 1];
export const getPlayerCount = state => state.game.playerCount;
export const getGameId = state => state.game.gameId;
