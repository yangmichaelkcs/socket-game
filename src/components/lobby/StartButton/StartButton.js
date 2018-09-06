import React, { Component } from "react";
import { connect } from "react-redux";
import { navigateTo } from "../../../actions";
import { startGame } from "socket";

class StartButton extends Component {
  render() {
    const { onClick } = this.props;
    return <button onClick={onClick}>Start</button>;
  }
}

const mapDispatchToProps = dispatch => ({
  onClick: () => {
    startGame();
  }
});

export default connect(
  undefined,
  mapDispatchToProps
)(StartButton);
