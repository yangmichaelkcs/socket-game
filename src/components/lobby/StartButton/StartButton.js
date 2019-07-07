import React, { Component } from "react";
import { connect } from "react-redux";
import { navigateTo } from "../../../actions";
import { startGame } from "socket";

class StartButton extends Component {
  disableStart() {
    // UNCOMMENT THIS
    // const { playerCount } = this.props;
    // return playerCount < 5 || playerCount > 10;

    // FIXME TEMP FOR DEV
    return false
  }

  render() {
    const { onClick } = this.props;
    return <button type="button" className="btn btn-primary" style={{margin:"1rem"}} disabled={this.disableStart()} onClick={onClick}>Start</button>;
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
