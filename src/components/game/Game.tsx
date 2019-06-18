import * as React from "react";
import { connect } from "react-redux";
import RoleButton from "./RoleButton";
import VoteButtons from "./VoteButtons";
import AllRounds from "./AllRounds";
import RoundInfo from "./RoundInfo/RoundInfo";
import PlayerList from "./PlayerList/PlayerList";
import RoundResult from "./RoundResult/RoundResult";
import {
  getPlayerDataById,
  getCurrentPlayerTurn,
  getPlayers,
  getCurrentRound,
  getPlayerData,
  getFailedVotes,
  getRounds,
  getRoundStatus,
  getVotes,
  getCurrentPage,
  getScore
} from "selectors";
import { Player, ROUND_STATUS, Round, GAME_STATUS, VOTE_INDEX, TEAM } from "types/types";
import { pickPlayer } from "socket";

interface GameStateProps {
  curentPlayerTurn: Player;
  players: Player[];
  currentRound: number;
  playerData: Player;
  roundStatus: ROUND_STATUS;
  failedVotes: number;
  rounds: Round[];
  votes: number[];
  status: GAME_STATUS;
  score: number[];
}

class Game extends React.Component<GameStateProps, any> {
  // Shuffle makes different for every player, need to shuffle in server and pass as prop?, FIXME
  public voteShuffle() {
    const { roundStatus, failedVotes, rounds } = this.props;
    const playersNeeded = rounds[this.props.currentRound - 1].playersNeeded;
    const votes: string[] = [];
    for (let k = 0; k < playersNeeded; k++) {
      votes[k] = "?";
    }
    if (roundStatus === ROUND_STATUS.MISSION_END) {
      for (let j = 0; j < failedVotes; j++) {
        votes[j] = "F";
      }
      for (let i = failedVotes; i < playersNeeded; i++) {
        votes[i] = "P";
      }
      for (let m = votes.length - 1; m > 0; m--) {
        const n = Math.floor(Math.random() * (m + 1));
        const temp = votes[m];
        votes[m] = votes[n];
        votes[n] = temp;
      }
    }
    return votes;
  }

  public showAnnouncment () {
    const { roundStatus, rounds, currentRound, votes, curentPlayerTurn, players, status, score } = this.props;
    if (status === GAME_STATUS.END) {
      const winningTeam = score[VOTE_INDEX.NEG] === 3 ? "Spies" : "Resistance";
      return (
        <div>
          <h2>The {winningTeam} has won</h2>
          <p>The score was Resistance: {score[VOTE_INDEX.POS]}  Spies: {score[VOTE_INDEX.NEG]}</p>
        </div>
      );
    } else if (roundStatus === ROUND_STATUS.PROPOSING_TEAM) {
      const playersNeeded = rounds[currentRound - 1].playersNeeded;
      return (
        <div>
          <h2>{curentPlayerTurn.nickName}'s turn to pick a team</h2>
          <p>Pick {playersNeeded} players, {rounds[currentRound -1].failsNeeded} failures need for spies</p>
        </div>
      );
    } else if (roundStatus === ROUND_STATUS.VOTING_TEAM) {
      players.filter(p => p.selected)
      return (
        <div>
          <h2>Vote on the following team:</h2>
          <p>{players.filter(player => player.selected).map(p => (<span>{p.nickName.substring(0, 7)} </span>))} </p>
        </div>
      );
    } else if (roundStatus === ROUND_STATUS.VOTING_END) {
      return (
        <div>
          <h2>Voting has completed</h2>
          <p>Approve: {votes[0]}  Reject: {votes[1]}</p>
        </div>
      );
    } else if (roundStatus === ROUND_STATUS.MISSION_IN_PROGRESS) {
      return (
        <div>
          <h2>The following players are on the mission </h2>
          <p>{players.filter(player => player.selected).map(p => (<span>{p.nickName.substring(0, 7)} </span>))} </p>
        </div>
      ); 
    } else if (roundStatus === ROUND_STATUS.MISSION_END) {
      return (
        <div>
          <h2>Mission Results </h2>
          <p>Success: {votes[0]}  Fail: {votes[1]}</p>
        </div>
      ); 
    }
  }

  public onPlayerClick = socketId => {
    const { roundStatus, rounds } = this.props;
    if (
      this.props.playerData.socketId === this.props.curentPlayerTurn.socketId &&
      roundStatus === ROUND_STATUS.PROPOSING_TEAM
    ) {
      const { players } = this.props;
      const playerPicked = players.find(player => player.socketId === socketId);
      let numPlayers = 0;
      players.forEach(p => (p.selected ? numPlayers++ : 0));
      const pNeeded = rounds[this.props.currentRound - 1].playersNeeded;
      if (numPlayers < pNeeded && playerPicked!.selected === 0) {
        pickPlayer(socketId, 1);
      } else {
        pickPlayer(socketId, 0);
      }
    }
  };

  public render() {
    const {
      curentPlayerTurn,
      players,
      currentRound,
      playerData,
      rounds,
      roundStatus,
      failedVotes
    } = this.props;
    const playersNeeded = rounds[currentRound - 1].playersNeeded;
    const votes = this.voteShuffle();
    return (
      <div className="Game">
        <RoundInfo currentRound={currentRound} />
        <RoleButton />
        {this.showAnnouncment()}
        <AllRounds 
            rounds={rounds} 
            failedVotes={failedVotes} 
        />
        <PlayerList />
        <RoundResult
          playersNeeded={playersNeeded}
          roundStatus={roundStatus}
          votes={votes}
        />
        <VoteButtons 
          roundStatus={roundStatus}
          players = {players}
        />
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

  return {
    curentPlayerTurn,
    players,
    currentRound,
    playerData,
    failedVotes: getFailedVotes(state),
    rounds: getRounds(state),
    roundStatus: getRoundStatus(state),
    votes: getVotes(state),
    status: getCurrentPage(state),
    score: getScore(state)
  };
};

export default connect(mapStateToProps)(Game);
