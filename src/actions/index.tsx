export const setUserName = userName => ({
  type: "SET_USER_NAME",
  userName
});

export const navigateTo = destination => ({
  destination,
  type: "NAVIGATE_TO"
});

export const updatePlayerCount = count => ({
  count,
  type: "UPDATE_PLAYER_COUNT"
});

export const setGameId = gameId => ({
  gameId,
  type: "SET_GAME_ID"
});
