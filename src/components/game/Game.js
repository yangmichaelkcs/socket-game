import React, { Component } from "react";
import { connect } from "react-redux";
import RoleButton from "./RoleButton";
import VoteButtons from "./VoteButtons";

class Game extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <div className="Game">
          <RoleButton />
          <h2>Round Number</h2>
          <h2>Turn to pick a team</h2>
          <VoteButtons />
        </div>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(Game);
