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
            <div style={{marginBottom: "2rem", textAlign:"center"}}>
              <h1 style={{borderBottom: "1px solid #000"}}>
                Avalon
              </h1>
              <p>
                Welcome to Avalon. Evil Mordred and his minions  
                <br />
                have infiltrated the kingdom of Avalon. It is up 
                <br />
                to the knights to defeat Mordred. Deduce who is  
                <br />
                friend and who is foe and win  3 rounds to claim victory.               
              </p>
            </div>
            <StartButton />
            <br />
            <div>OR</div>
            <br />
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
