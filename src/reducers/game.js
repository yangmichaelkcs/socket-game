const game = (state = { playerCount: 0 }, action) => {
  switch (action.type) {
    case "UPDATE_PLAYER_COUNT":
      return { playerCount: action.count };
    default:
      return state;
  }
};

export default game;
