import * as React from "react";
import { connect } from "react-redux";
import RoleButton from "./RoleButton";
import VoteButtons from "./VoteButtons";
import AllRounds from "./AllRounds";
import RoundInfo from "./RoundInfo/RoundInfo";
import PlayerList from "./PlayerList/PlayerList";
import { getPlayerDataById, getCurrentPlayerTurn, getPlayers } from "selectors";
import { Player } from "types/types";

interface GameStateProps {
  curentPlayerTurn: Player;
  players: Player[];
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
      players: this.props.players,
      // FIXME, use props for current round
      currentRound: 1,
    };
  }

  public onPlayerClick = player => {
    const players = [...this.state.players];
    const index = players.indexOf(player);
    let numPlayers = 0;
    players.forEach(p => p.selected ? numPlayers++ : 0)
    players[index] = { ...player };
    const pNeeded = this.state.rounds[this.state.currentRound].playersNeeded;
    if (players[index].selected === 0 && numPlayers < pNeeded ) 
    {
      players[index].selected = 1;
    } 
    else {
      players[index].selected = 0;
    }
    this.setState({ players });
  };

  public render() {
    const { curentPlayerTurn } = this.props;
    return (
      <div className="Game">
        <RoundInfo currentRound={this.state.currentRound} />
        <RoleButton />
        <h2>{curentPlayerTurn.nickName}'s turn to pick a team</h2>
        <p>Pick ___ players, ___ failures need for spies</p>
        <AllRounds rounds={this.state.rounds} />
        <PlayerList
          players={this.state.players}
          onPlayerClick={this.onPlayerClick}
        />
        <VoteButtons />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  curentPlayerTurn: getPlayerDataById(state, getCurrentPlayerTurn(state)),
  players: getPlayers(state)
});

export default connect(mapStateToProps)(Game);
