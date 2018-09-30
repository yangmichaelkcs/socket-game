import React, { Component } from "react";
import { connect } from "react-redux";
import RoleButton from "./RoleButton";
import VoteButtons from "./VoteButtons";
import AllRounds from "./AllRounds";
import RoundInfo from "./RoundInfo/RoundInfo";

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rounds: [
        { id: 1, value: null},
        { id: 2, value: null},
        { id: 3, value: null},
        { id: 4, value: null},
        { id: 5, value: null}
      ],
      currentRound: 1
    };
  }

  render() {
    return (
        <div style={{height:"100%"}}>
          <div className="Role">
            <RoleButton />
          </div>
          <div className="Game">
            <RoundInfo
              currentRound = {this.state.currentRound}
            />
            <h2>X's turn to pick a team</h2>
            <AllRounds
              rounds={this.state.rounds}
            />
            <h3>Proposed Team:</h3>
            <VoteButtons/>
          </div>
        </div>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(Game);
