import * as React from "react";
import { connect } from "react-redux";
import RoleButton from "./RoleButton";
import VoteButtons from "./VoteButtons";
import AllRounds from "./AllRounds";
import RoundInfo from "./RoundInfo/RoundInfo";
import PlayerList from "./PlayerList/PlayerList";
import RoundResult from "./RoundResult/RoundResult";
import { getPlayerDataById, getCurrentPlayerTurn, getPlayers, getCurrentRound, getPlayerData } from "selectors";
import { Player, ROUND_STATUS } from "types/types";
import { pickPlayer } from "socket"

interface GameStateProps {
  curentPlayerTurn: Player;
  players: Player[];
  currentRound: number;
  playerData: Player;
}

class Game extends React.Component<GameStateProps, any> {
  constructor(props) {
    super(props);
    this.state = {
      // FIXME, use props for these states below
      rounds: [
        { id: 1, value: null, playersNeeded: 3 },
        { id: 2, value: null, playersNeeded: 2 },
        { id: 3, value: null, playersNeeded: 2 },
        { id: 4, value: null, playersNeeded: 2 },
        { id: 5, value: null, playersNeeded: 2 }
      ],
      roundStatus: ROUND_STATUS.PROPOSING_TEAM,
      failedVotes: 1
    };
  }
  
  // Shuffle makes different for every player, need to shuffle in server and pass as prop?, FIXME
  public voteShuffle() {
    const { roundStatus, failedVotes } = this.state;
    const playersNeeded = this.state.rounds[this.props.currentRound-1].playersNeeded;
    const votes: string[] = [];
    for(let k = 0; k < playersNeeded; k++)
    {
      votes[k] = "?"
    }
    if(roundStatus === ROUND_STATUS.MISSION_END)
    {
      for(let j = 0; j < failedVotes; j++)
      {
        votes[j] = "F";
      }
      for(let i = failedVotes; i < playersNeeded; i++)
      {
        votes[i] = "P";
      }
      for (let m = votes.length -1; m > 0; m--) {
        const n = Math.floor(Math.random() * (m + 1));
        const temp = votes[m];
        votes[m] = votes[n];
        votes[n] = temp;
      }
    }
    return votes;
  }

  // FIXME, change state to props
  public onPlayerClick = socketId => {
    if(this.props.playerData.socketId === this.props.curentPlayerTurn.socketId && this.state.roundStatus === ROUND_STATUS.PROPOSING_TEAM)
    {
      const {players} = this.props;
      const playerPicked = players.find(player => player.socketId === socketId )
      let numPlayers = 0;
      players.forEach(p => p.selected ? numPlayers++ : 0)
      const pNeeded = this.state.rounds[this.props.currentRound-1].playersNeeded;
      if(numPlayers < pNeeded && playerPicked!.selected === 0) 
      {
        pickPlayer(socketId,1); 
      }    
      else
      {
        pickPlayer(socketId,0);
      }
    }
  };

  // Change this.state into props, FIXME
  public render() {
    const { curentPlayerTurn, players, currentRound, playerData } = this.props;
    const playersNeeded = this.state.rounds[currentRound-1].playersNeeded;
    const votes = this.voteShuffle();
    return (
      <div className="Game">
        <RoundInfo currentRound={currentRound} />
        <RoleButton />
        <h2>{curentPlayerTurn.nickName}'s turn to pick a team</h2>
        <p>Pick {playersNeeded}  players, ___ failures need for spies</p>
        <AllRounds rounds={this.state.rounds} />
        <PlayerList
          players={players}
          onPlayerClick={this.onPlayerClick}
          turnToPick={playerData.socketId === curentPlayerTurn.socketId && this.state.roundStatus === ROUND_STATUS.PROPOSING_TEAM}
        />
        <RoundResult 
          playersNeeded = {playersNeeded}
          roundStatus = {this.state.roundStatus} 
          votes = {votes}
        />
        <VoteButtons />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const curentPlayerTurn: Player = getPlayerDataById(state, getCurrentPlayerTurn(state));
  const players: Player[] = getPlayers(state);
  const currentRound: number = getCurrentRound(state);
  const playerData: Player = getPlayerData(state)

  return {
    curentPlayerTurn,
    players,
    currentRound,
    playerData
  };
};

export default connect(mapStateToProps)(Game);
