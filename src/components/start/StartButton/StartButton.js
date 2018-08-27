import React, { Component } from "react";
import { connect } from "react-redux";
import { navigateTo } from "../../../actions";
import { startNewGame } from "socket";

class StartButton extends Component {
  render() {
    const { onClick } = this.props;
    return <button onClick={onClick}>Start Game</button>;
  }
}

const mapDispatchToProps = dispatch => ({
  onClick: () => {
    startNewGame();
    dispatch(navigateTo("lobby"));
  }
});

export default connect(
  undefined,
  mapDispatchToProps
)(StartButton);
