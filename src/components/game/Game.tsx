import * as React from "react";
import { connect } from "react-redux";
import RoleButton from "./RoleButton";
import VoteButtons from "./VoteButtons";
import AllRounds from "./AllRounds";
import RoundInfo from "./RoundInfo/RoundInfo";

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
      currentRound: 1
    };
  }

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
        <h3>Proposed Team:</h3>
        <VoteButtons />
      </div>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(Game);
