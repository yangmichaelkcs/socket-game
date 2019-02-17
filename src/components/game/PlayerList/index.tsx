import {
  getPlayerDataById,
  getCurrentPlayerTurn,
  getPlayers,
  getCurrentRound,
  getPlayerData
} from "selectors";
import PlayerList from "./PlayerList";
import { Player, ROUND_STATUS } from "types/types";
import { connect } from "react-redux";

export default PlayerList;
