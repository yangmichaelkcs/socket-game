import * as React from "react";
import { connect } from "react-redux";
import RoleButton from "./RoleButton";
import VoteButtons from "./VoteButtons";
import AllRounds from "./AllRounds";
import RoundInfo from "./RoundInfo/RoundInfo";
import PlayerList from "./PlayerList/PlayerList";
import { getGameId, getPlayerDataById, getCurrentPlayerTurn, getPlayers, getCurrentRound } from "selectors";
import { Player } from "types/types";
import { pickPlayer } from "socket"

interface GameStateProps {
  curentPlayerTurn: Player;
  players: Player[];
  currentRound: number;
}

class Game extends React.Component<GameStateProps, any> {
  constructor(props) {
    super(props);
    this.state = {
      // FIXME, use props for rounds
      rounds: [
        { id: 1, value: null, playersNeeded: 2 },
        { id: 2, value: null, playersNeeded: 2 },
        { id: 3, value: null, playersNeeded: 2 },
        { id: 4, value: null, playersNeeded: 2 },
        { id: 5, value: null, playersNeeded: 2 }
      ],
      players: this.props.players
    };
  }

  public onPlayerClick = socketId => {
    const {players} = this.props;
    const playerPicked = players.find(player => player.socketId === socketId )
    let numPlayers = 0;
    players.forEach(p => p.selected ? numPlayers++ : 0)
    const pNeeded = this.state.rounds[this.props.currentRound].playersNeeded;
    if(numPlayers < pNeeded && playerPicked!.selected === 0) 
    {
      pickPlayer(socketId,1); 
    }  
    else
    {
      pickPlayer(socketId,0);
    }
  };

  public render() {
    const { curentPlayerTurn, players, currentRound } = this.props;
    const playersNeeded = (this.state.rounds.find(round => round.id === currentRound)).playersNeeded;
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

  return {
    gameId: getGameId(state),
    curentPlayerTurn,
    players,
    currentRound
  };
};

export default connect(mapStateToProps)(Game);
