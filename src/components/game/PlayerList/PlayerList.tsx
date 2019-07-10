import { FaRegUser, FaUser, FaThumbsUp, FaThumbsDown } from 'react-icons/fa'
import * as React from "react";
import PlayerComponent from "../Player";
import {
  getPlayerDataById,
  getCurrentPlayerTurn,
  getPlayers,
  getCurrentRound,
  getPlayerData,
  getRoundStatus,
  getRounds
} from "selectors";
import { Player, ROUND_STATUS, Round } from "types/types";
import { connect } from "react-redux";
import { proposeTeam, updateTeamVote } from "socket";

interface PlayerListState {
  playerNeededTooltip : boolean;
}

interface PlayerListProps {
  players: Player[];
  turnToPick: boolean;
  roundStatus: ROUND_STATUS;
  rounds: Round[];
  currentRound: number;
}

class PlayerList extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = { 
      playerNeededTooltip: false,
      accept: true,
      reject: true
    };

    this.onAccept = this.onAccept.bind(this);
    this.onReject = this.onReject.bind(this);
  }

  // Proposes team based on which players are selected. If not correct amount of players display tooltip
  public onProposeClick = () => {
    const { rounds, currentRound, players } = this.props;
    const playerNeeded = rounds[currentRound - 1].playersNeeded;
    let numPlayers = 0;
    players.forEach(p => (p.selected ? numPlayers++ : 0));
    if(numPlayers !== playerNeeded) {
      this.setState({ playerNeededTooltip: true });
    } else {
      if(this.state.playerNeededTooltip) {
        this.setState({ playerNeededTooltip: false });
      }
      proposeTeam();
    }
  };

  // Accept team and hide buttons, send who voted
  public onAccept = () => {
    this.setState({accept: false, reject: false});
    const { playerData } = this.props; 
    updateTeamVote(1, playerData.socketId);
  }

  // Reject team and hide buttons, send who voted
  public onReject = () => {
    this.setState({reject: false, accept: false});
    const { playerData } = this.props; 
    updateTeamVote(-1, playerData.socketId); 
  }

  // Show propose button if correct round and is that player's turn. Show team voting buttons when its time to vote
  public showProposeOrVoteButton() {
    const { turnToPick, roundStatus } = this.props;
    if (turnToPick && roundStatus === ROUND_STATUS.PROPOSING_TEAM) {
      return (
        <button onClick={this.onProposeClick} type="button" className="SelectTeamButton btn btn-outline-success">
          Select Team
        </button>
      );
    } else if (roundStatus === ROUND_STATUS.VOTING_TEAM) {
      return (
        <div className={"VotingButtons"}>
          {this.state.accept && <button type="button" className="SideBySideButton btn btn-outline-primary" onClick={this.onAccept}>
            Approve
          </button>}
          {this.state.reject && <button type="button" className="SideBySideButton RejectButton btn btn-outline-danger" onClick={this.onReject}>
            Reject
          </button>}
        </div>
      );
    }
  }

  // Returns tooltip if not correct number of players selected
  public showPlayerNeededToolTip() {
    if(this.state.playerNeededTooltip) {
      const { rounds, currentRound } = this.props;
      const playerNeeded = rounds[currentRound - 1].playersNeeded;
      return (
        <span className="Warning">
          Please select {playerNeeded} players
        </span>
      );
    }
  }

  // Unhide voting buttons
  public componentDidUpdate() {
    if(this.state.accept && this.state.reject) {
      return;
    } else if (this.props.roundStatus === ROUND_STATUS.VOTING_END) {
      this.setState({accept: true, reject: true});
    }
  }

  // Returns 5 players in first row 
  public firstPlayerRow() {
    const firstRow = this.props.players.slice(0, 5);
    return firstRow.map(player => (<PlayerComponent key={player.socketId} player={player} />));
  }
  
  // Returns second 5 players in second row
  public secondPlayerRow() {
    const firstRow = this.props.players.slice(5, 10);
    return firstRow.map(player => (<PlayerComponent key={player.socketId} player={player} />))
  }

  public render() {
    return (
      <div className="PlayerList">
        <h4 style={{ marginTop: "1rem", marginBottom: "0" }}>
          Team:
        </h4>
        <div className="row">
          {this.firstPlayerRow()}
        </div>
        <div className="row">
          {this.secondPlayerRow()}
        </div>
        {this.showProposeOrVoteButton()}
        {this.showPlayerNeededToolTip()}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const currentPlayerTurn: Player = getPlayerDataById(
    state,
    getCurrentPlayerTurn(state)
  );
  const players: Player[] = getPlayers(state);
  const currentRound: number = getCurrentRound(state);
  const playerData: Player = getPlayerData(state);
  const turnToPick = playerData.socketId === currentPlayerTurn.socketId;
  const roundStatus = getRoundStatus(state);

  return {
    players,
    turnToPick,
    roundStatus,
    rounds: getRounds(state),
    currentRound,
    playerData
  };
};

export default connect(mapStateToProps)(PlayerList);
