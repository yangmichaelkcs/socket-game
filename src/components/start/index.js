import React, { Component } from "react";
import { connect } from "react-redux";
import StartButton from "./StartButton";
import JoinButton from "./JoinButton";
import Lobby from "components/lobby";
import { getCurrentPage } from "selectors";

class StartGame extends Component {
  componentWillUpdate(nextProps, nextState) {
    console.log(nextProps);
  }

  render() {
    switch (this.props.currentPage) {
      case "lobby":
        return <Lobby />;
      default:
        return (
          <div className="StartGame">
            <StartButton />
            <div>OR</div>
            <JoinButton />
          </div>
        );
    }
  }
}

const mapStateToProps = state => ({
  currentPage: getCurrentPage(state)
});

export default connect(mapStateToProps)(StartGame);
