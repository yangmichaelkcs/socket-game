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

interface GameState {
  oldVotes: number[];
  voteOrder: string[];
}

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
  constructor(props) {
    super(props);
    this.state = { 
      oldVotes: [0, 0],
      voteOrder: []
    };
  }
  // Shuffle makes different for every player, need to shuffle in server and pass as prop?, FIXME
  // public voteShuffle() {
  //   const { roundStatus, rounds, votes, currentRound } = this.props;
  //   const playersNeeded = rounds[currentRound - 1].playersNeeded;
  //   console.log(playersNeeded);
  //   const missionVotes: string[] = [];
  //   for (let k = 0; k < playersNeeded; k++) {
  //     missionVotes[k] = "?";
  //   }
  //   if (roundStatus === ROUND_STATUS.MISSION_END) {
  //     for (let j = 0; j < votes[VOTE_INDEX.NEG]; j++) {
  //       missionVotes[j] = "F";
  //     }
  //     for (let i = votes[VOTE_INDEX.NEG]; i < playersNeeded; i++) {
  //       missionVotes[i] = "P";
  //     }
  //     for (let m = missionVotes.length - 1; m > 0; m--) {
  //       const n = Math.floor(Math.random() * (m + 1));
  //       const temp = missionVotes[m];
  //       missionVotes[m] = missionVotes[n];
  //       missionVotes[n] = temp;
  //     }
  //   }
  //   return missionVotes;
  // }

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
          <p>Approve: {votes[VOTE_INDEX.POS]}  Reject: {votes[VOTE_INDEX.NEG]}</p>
        </div>
      );
    } else if (roundStatus === ROUND_STATUS.MISSION_IN_PROGRESS) {
      if(votes[VOTE_INDEX.POS] + votes[VOTE_INDEX.NEG] === 0) {
      return (
        <div>
          <h2>The following players are on the mission </h2>
          <p>{players.filter(player => player.selected).map(p => (<span>{p.nickName.substring(0, 7)} </span>))} </p>
        </div>
      );}
      else {
        if(votes[VOTE_INDEX.POS] === this.state.oldVotes[VOTE_INDEX.POS] && votes[VOTE_INDEX.NEG] === this.state.oldVotes[VOTE_INDEX.NEG]) {
          return (
            <div>
              <h2>Mission votes are completed</h2>
              <p>{this.state.voteOrder.map((vote) => {
                 if(vote === TEAM.GOOD) {
                  return <span>| Success |</span>
                } else {
                  return <span>| Fail |</span>
                }})}
              </p>
            </div>
          );
        }
        if(votes[VOTE_INDEX.POS] === this.state.oldVotes[VOTE_INDEX.POS]) {
          this.setState({voteOrder: [...this.state.voteOrder, TEAM.BAD]})
        }
        else {
          this.setState({voteOrder: [...this.state.voteOrder, TEAM.GOOD]})
        }
        this.setState({oldVotes: votes})
      }
    } else if (roundStatus === ROUND_STATUS.MISSION_END) {
      let winner = "";
      votes[VOTE_INDEX.NEG] >= rounds[currentRound - 1].failsNeeded ? winner = "Spies" : winner = "Resistance"
      return (
        <div>
          <h2>{winner} wins the mission</h2>
          <p>{this.state.voteOrder.map((vote) => {
                if(vote === TEAM.GOOD) {
                  return <span>| Success |</span>
                } else {
                  return <span>| Fail |</span>
                }})}
          </p>
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
    // const playersNeeded = rounds[currentRound - 1].playersNeeded;
    // const missionVotes = this.voteShuffle();
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

        <VoteButtons 
          roundStatus={roundStatus}
          players = {players}
        />
      </div>
    );
  }
}

{/* <RoundResult
playersNeeded={playersNeeded}
roundStatus={roundStatus}
votes={missionVotes}
/> */}

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
