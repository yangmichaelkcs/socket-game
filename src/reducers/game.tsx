import { Game } from "types/types";

const game = (state: Game | {} = {}, action): Game | {} => {
  switch (action.type) {
    case "SET_GAME":
      return { ...state, ...action.game };
    default:
      return state;
  }
};

export default game;
