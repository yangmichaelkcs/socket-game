import React, { Component } from "react";
import { connect } from "react-redux";
import RoleButton from "./RoleButton";
import VoteButtons from "./VoteButtons";
import AllRounds from "./AllRounds";

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
      ]
    };
  }

  render() {
    return (
        <div className="Game">
          <RoleButton />
          <h2>Round Number</h2>
          <h2>Turn to pick a team</h2>
          <AllRounds
            rounds={this.state.rounds}
          />
          <h3>Proposed Team</h3>
          <VoteButtons/>
        </div>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(Game);
