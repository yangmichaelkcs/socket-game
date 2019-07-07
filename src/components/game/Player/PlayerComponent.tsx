import { FaRegUser, FaUser, FaThumbsUp, FaThumbsDown } from 'react-icons/fa'
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
import { throws } from 'assert';

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
      const playerPicked = players.find(p => p.socketId === socketId);
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

  // Turn into some kind of icon later
  public displayVote = () => {
    const { player, roundStatus } = this.props;
    if (roundStatus === ROUND_STATUS.VOTING_END) {
      if( player.vote === 1) {
        return (
          <FaThumbsUp className="Thumbsup Thumbsize"/>
        );
      } else {
        return (
          <FaThumbsDown className="Thumbsdown Thumbsize"/>
        );
      }
    } 
  }

  public getPlayerIcon() {
    return this.props.player.selected === 0 ? <FaRegUser /> : <FaUser className="PlayerPicked"/>;
  }

  public render() {
    const { player } = this.props;
    return (
      <div className="PlayerCol col">
        <div className="PlayerCard card" onClick={this.onPlayerClick}>
          <div className="PlayerCardBody card-body">
            <p className="cardInfo card-text">{player.nickName.substring(0,7)}</p>
            <p className="Iconsize card-text">{this.getPlayerIcon()}&nbsp;{this.displayVote()}</p>
          </div>
        </div>
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
