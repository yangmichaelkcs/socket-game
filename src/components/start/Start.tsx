import * as React from "react";
import { connect } from "react-redux";
import StartButton from "./StartButton";
import JoinButton from "./JoinButton";
import Lobby from "components/lobby";
import Game from "components/game";
import { getCurrentPage } from "selectors";

class StartGame extends React.Component<any, any> {
  public render() {
    switch (this.props.currentPage) {
      case "LOBBY":
        return <Lobby />;
      case "IN_PROGRESS":
        return <Game />;
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
