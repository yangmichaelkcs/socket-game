import { combineReducers } from "redux";
import user from "./user.js";
import navigation from "./navigation.js";
import game from "./game.js";

export default combineReducers({
  user,
  navigation,
  game
});
