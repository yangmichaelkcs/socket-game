import * as React from "react";
import { connect } from "react-redux";
import RoleButton from "./RoleButton";
import VoteButtons from "./VoteButtons";
import AllRounds from "./AllRounds";
import RoundInfo from "./RoundInfo/RoundInfo";
import PlayerList from "./PlayerList/PlayerList";

class Game extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      rounds: [
        { id: 1, value: null },
        { id: 2, value: null },
        { id: 3, value: null },
        { id: 4, value: null },
        { id: 5, value: null }
      ],
      // TEMP Variables to test, FIXME
      players: [
        { socketId: 1, nickName: "Mikey", team: "blue", role: "nothing", selected: 0 },
        { socketId: 2, nickName: "Ming", team: "blue", role: "nothing", selected: 0 },
        { socketId: 3, nickName: "Roo", team: "red", role: "nothing", selected: 0 },
        { socketId: 4, nickName: "Sab", team: "red", role: "nothing", selected: 0 },
        { socketId: 5, nickName: "Kev", team: "blue", role: "nothing", selected: 0 },
        { socketId: 6, nickName: "DVP", team: "blue", role: "nothing", selected: 0},
      ],
      currentRound: 1
    };
  }
  
  // Need to add limit on how many players can be selected, FIXME
  public onPlayerClick = player => {
    const players = [...this.state.players];
    const index = players.indexOf(player);
    players[index] = {...player };
    if(players[index].selected === 0)
    {
      players[index].selected = 1;
    }
    else
    {
      players[index].selected = 0;
    }    
    this.setState({players});
  }

  // Change Turn to pick a team and Pick Players strings to state.variable, FIXME
  public render() {
    return (
      <div className="Game">
        <RoundInfo currentRound={this.state.currentRound} />
        <RoleButton />
        <h2>X's turn to pick a team</h2>
        <p>
            Pick ___ players, ___ failures need for spies 
        </p>  
        <AllRounds rounds={this.state.rounds} />
        <PlayerList players={this.state.players} onPlayerClick = {this.onPlayerClick}/>
        <VoteButtons />
      </div>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(Game);
