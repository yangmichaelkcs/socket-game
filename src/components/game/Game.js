import React, { Component } from "react";
import { connect } from "react-redux";
import RoleButton from "./RoleButton";

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
        </div>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(Game);
