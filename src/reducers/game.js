const game = (state = { gameId: undefined, playerCount: 0 }, action) => {
  switch (action.type) {
    case "UPDATE_PLAYER_COUNT":
      return { ...state, playerCount: action.count };
    case "SET_GAME_ID":
      return { ...state, gameId: action.gameId };
    default:
      return state;
  }
};

export default game;
