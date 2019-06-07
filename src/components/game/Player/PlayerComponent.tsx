import * as React from "react";
import { ROUND_STATUS, Player, Round } from "types/types";
import { pickPlayer } from "socket";
import {
  getPlayerDataById,
  getCurrentPlayerTurn,
  getPlayers,
  getCurrentRound,
  getPlayerData,
  getRounds,
  getRoundStatus
} from "selectors";
import { connect } from "react-redux";

interface PlayerComponentOwnProps {
  readonly key: number;
  readonly player: Player;
}

interface PlayerComponentStateProps {
  readonly currentPlayerTurn: Player;
  readonly players: Player[];
  readonly currentRound: number;
  readonly playerData: Player;
  readonly rounds: Round[];
  readonly roundStatus: ROUND_STATUS;
}

interface PlayerComponentProps
  extends PlayerComponentOwnProps,
    PlayerComponentStateProps {}

class PlayerComponent extends React.Component<PlayerComponentProps, any> {
  public onPlayerClick = () => {
    const { players, player, currentRound, rounds, currentPlayerTurn, playerData, roundStatus } = this.props;
    if(playerData.socketId === currentPlayerTurn.socketId && roundStatus === ROUND_STATUS.PROPOSING_TEAM ) {
      const socketId = player.socketId;
      const playerPicked = players.find(asdf => asdf.socketId === socketId);
      let numPlayers = 0;
      players.forEach(p => (p.selected ? numPlayers++ : 0));
      const playerNeeded = rounds[currentRound - 1].playersNeeded;
      if (numPlayers < playerNeeded && playerPicked!.selected === 0) {
        pickPlayer(socketId, 1);
      } else {
        pickPlayer(socketId, 0);
      }
    }
  };

  public getPlayerClasses() {
    let classes = "";
    classes +=
      this.props.player.selected === 0 ? "PlayerUnclicked" : "PlayerClicked";
    return classes;
  }

  public render() {
    const { player } = this.props;
    return (
      <div className={this.getPlayerClasses()} onClick={this.onPlayerClick}>
        <span>{player.nickName ? player.nickName.charAt(0) : ""}</span>
      </div>
    );
  }
}

const mapStateToProps = (state: any): PlayerComponentStateProps => {
  const currentPlayerTurn: Player = getPlayerDataById(
    state,
    getCurrentPlayerTurn(state)
  );
  const players: Player[] = getPlayers(state);
  const currentRound: number = getCurrentRound(state);
  const playerData: Player = getPlayerData(state);
  const roundStatus = getRoundStatus(state);

  return {
    playerData,
    currentPlayerTurn,
    players,
    currentRound,
    rounds: getRounds(state),
    roundStatus
  };
};

export default connect(mapStateToProps)(PlayerComponent);
