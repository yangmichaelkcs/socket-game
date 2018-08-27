export const setUserName = userName => ({
  type: "SET_USER_NAME",
  userName
});

export const navigateTo = destination => ({
  type: "NAVIGATE_TO",
  destination
});

export const updatePlayerCount = count => ({
  type: "UPDATE_PLAYER_COUNT",
  count
});

export const setGameId = gameId => ({
  type: "SET_GAME_ID",
  gameId
});
