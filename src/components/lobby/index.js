import React, { Component } from "react";
import { connect } from "react-redux";
import { getPlayerCount } from "selectors";

class Lobby extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="Lobby">
        <h2> {this.props.playerCount} players have connected </h2>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  playerCount: getPlayerCount(state)
});

export default connect(mapStateToProps)(Lobby);
