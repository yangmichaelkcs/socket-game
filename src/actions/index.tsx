export const setSocketId = socketId => ({
  type: "SET_SOCKET_ID",
  socketId
});

export const navigateTo = destination => ({
  destination,
  type: "NAVIGATE_TO"
});

export const setGameData = game => ({
  game,
  type: "SET_GAME"
});
