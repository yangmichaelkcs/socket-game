import React, { Component } from "react";
import { connect } from "react-redux";
import { getPlayerCount, getGameId } from "selectors";
import StartButton from "./StartButton";

class Lobby extends Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  render() {
    return (
      <div className="Lobby">
        <h2>{this.props.gameId}</h2>
        <h2> {this.props.playerCount} players have connected </h2>
        <StartButton />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  gameId: getGameId(state),
  playerCount: getPlayerCount(state)
});

export default connect(mapStateToProps)(Lobby);
