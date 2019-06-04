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
  getRoundStatus
} from "selectors";
import { Player, ROUND_STATUS, Round } from "types/types";
import { pickPlayer } from "socket";

interface GameStateProps {
  curentPlayerTurn: Player;
  players: Player[];
  currentRound: number;
  playerData: Player;
  roundStatus: ROUND_STATUS;
  failedVotes: number;
  rounds: Round[];
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
      roundStatus
    } = this.props;
    const playersNeeded = rounds[currentRound - 1].playersNeeded;
    const votes = this.voteShuffle();
    return (
      <div className="Game">
        <RoundInfo currentRound={currentRound} />
        <RoleButton />
        <h2>{curentPlayerTurn.nickName}'s turn to pick a team</h2>
        <p>Pick {playersNeeded} players, ___ failures need for spies</p>
        <AllRounds rounds={rounds} />
        <PlayerList />
        <RoundResult
          playersNeeded={playersNeeded}
          roundStatus={roundStatus}
          votes={votes}
        />
        <VoteButtons 
          roundStatus={roundStatus}
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
    roundStatus: getRoundStatus(state)
  };
};

export default connect(mapStateToProps)(Game);
