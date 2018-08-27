import React, { Component } from "react";
import { connect } from "react-redux";
import { getPlayerCount, getGameId } from "selectors";

class Lobby extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="Lobby">
        <h2>{this.props.gameId}</h2>
        <h2> {this.props.playerCount} players have connected </h2>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  gameId: getGameId(state),
  playerCount: getPlayerCount(state)
});

export default connect(mapStateToProps)(Lobby);
