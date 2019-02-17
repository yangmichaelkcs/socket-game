import * as React from "react";
import PlayerComponent from "../Player";
import {
  getPlayerDataById,
  getCurrentPlayerTurn,
  getPlayers,
  getCurrentRound,
  getPlayerData
} from "selectors";
import { Player, ROUND_STATUS } from "types/types";
import { connect } from "react-redux";

interface PlayerListProps {
  players: Player[];
  turnToPick: Player;
}

class PlayerList extends React.Component<any, any> {
  public showProposeButton() {
    if (this.props.turnToPick) {
      return (
        <button
          style={{ marginBottom: "1rem", width: "100px", height: "50px" }}
        >
          Propose Team
        </button>
      );
    }
  }

  public render() {
    return (
      <div className="PlayerList">
        <h3 style={{ marginTop: "1rem" }}>
          Proposed Team:
          <div
            className="ColorCode"
            style={{ backgroundColor: "rgb(15, 132, 228)" }}
          />
          <span>Selected</span>
          <div className="ColorCode" style={{ backgroundColor: "#FFF" }} />
          <span>Not Selected</span>
        </h3>
        <ul
          style={{
            listStyle: "none",
            whiteSpace: "nowrap",
            padding: "0",
            alignItems: "center",
            margin: "0"
          }}
        >
          {this.props.players.map(player => (
            <li className="PlayerName" key={player.socketId}>
              <span>{player.nickName.substring(0, 7)}</span>
            </li>
          ))}
        </ul>
        <ul
          style={{
            listStyle: "none",
            whiteSpace: "nowrap",
            paddingLeft: "0",
            alignItems: "center",
            marginTop: "0",
            marginBottom: "1rem"
          }}
        >
          {this.props.players.map(player => (
            <PlayerComponent key={player.socketId} player={player} />
          ))}
        </ul>
        {this.showProposeButton()}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const curentPlayerTurn: Player = getPlayerDataById(
    state,
    getCurrentPlayerTurn(state)
  );
  const players: Player[] = getPlayers(state);
  const currentRound: number = getCurrentRound(state);
  const playerData: Player = getPlayerData(state);
  const turnToPick = playerData.socketId === curentPlayerTurn.socketId;

  return {
    players,
    turnToPick
  };
};

export default connect(mapStateToProps)(PlayerList);
