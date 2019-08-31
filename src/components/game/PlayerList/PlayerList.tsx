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
} from "../../../selectors";
import { Player, ROUND_STATUS, Round, ROLES } from "../../../types/types";
import { connect } from "react-redux";
import { proposeTeam, updateTeamVote, killMerlin } from "../../../socket";

interface PlayerListState {
  playerNeededTooltip : boolean;
}

interface PlayerListProps {
  players: Player[];
  turnToPick: boolean;
  roundStatus: ROUND_STATUS;
  rounds: Round[];
  currentRound: number;
  currentPlayerTurn: Player[];
}

class PlayerList extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = { 
      playerNeededTooltip: false,
      accept: true,
      reject: true,
      merlinNeededTooltip: false
    };

    this.onAccept = this.onAccept.bind(this);
    this.onReject = this.onReject.bind(this);
  }

  public onKillMerlin = () => {
    const {  players } = this.props;
    let numPlayers = 0;
    players.forEach(p => (p.selected ? numPlayers++ : 0));
    if(numPlayers !== 1) {
      this.setState({ merlinNeededTooltip: true });
    } else {
      if(this.state.merlinNeededTooltip) {
        this.setState({ merlinNeededTooltip: false });
      }
      killMerlin();
    }
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
    const { turnToPick, roundStatus, currentPlayerTurn, amAssassin } = this.props;
    if (roundStatus === ROUND_STATUS.PROPOSING_TEAM) {
      if(turnToPick) {
        return (
          <div>
            <div>Click on the players to select</div>
            <button onClick={this.onProposeClick} type="button" className="SelectTeamButton btn btn-outline-success">
              Select Team
            </button>
          </div>
        );
      } else {
        return (
          <div>
            {currentPlayerTurn.nickName.toString()} is picking a team
          </div>
        );
      }
    } else if (roundStatus === ROUND_STATUS.VOTING_TEAM) {
      return (
        <div className={"VotingButtons"}>
          <div>Approve or Reject Team</div>
          {this.state.accept && <button type="button" className="SideBySideButton btn btn-outline-primary" onClick={this.onAccept}>
            Approve
          </button>}
          {this.state.reject && <button type="button" className="SideBySideButton RejectButton btn btn-outline-danger" onClick={this.onReject}>
            Reject
          </button>}
        </div>
      );
    } else if (roundStatus === ROUND_STATUS.ASSASSIN_CHOOSE) {
      if (amAssassin) {
        return (
          <div>
            <div>Click on a player to select</div>
            <button onClick={this.onKillMerlin} type="button" className="SelectTeamButton btn btn-outline-success">
              Kill Merlin
            </button>
          </div>
        );
      }
      else {
        return (
          <div>
            Assassin is choosing Merlin
          </div>
        );
      }
    }
  }

  // Returns tooltip if not a Merlin is not selected
  public showMerlinNeededToolTip() {
  if(this.state.merlinNeededTooltip) {
    return (
      <span className="Warning">
        Please select 1 player
      </span>
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
    return firstRow.map(player => (<PlayerComponent key={player.socketId.toString()} player={player} />));
  }
  
  // Returns second 5 players in second row
  public secondPlayerRow() {
    const firstRow = this.props.players.slice(5, 10);
    return firstRow.map(player => (<PlayerComponent key={player.socketId.toString()} player={player} />))
  }

  public render() {
    return (
      <div className="PlayerList">
        <div className="row">
          {this.firstPlayerRow()}
        </div>
        <div className="row">
          {this.secondPlayerRow()}
        </div>
        <br />
        {this.showProposeOrVoteButton()}
        {this.showPlayerNeededToolTip()}
        {this.showMerlinNeededToolTip()}
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
  const amAssassin = playerData.role === ROLES.ASSASSIN
  const roundStatus = getRoundStatus(state);

  return {
    players,
    turnToPick,
    roundStatus,
    rounds: getRounds(state),
    currentRound,
    playerData,
    amAssassin,
    currentPlayerTurn 
  };
};

export default connect(mapStateToProps)(PlayerList);
