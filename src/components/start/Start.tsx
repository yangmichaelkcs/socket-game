import { FaCrown } from 'react-icons/fa'
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
            <div style={{marginBottom: "2rem"}}>
              <h1 className="display-2"><u>Avalon</u><FaCrown style={{fontSize:"5rem"}}/></h1>
              <p>
                Welcome to Avalon. Evil Mordred and his minions  
                <br />
                have infiltrated the kingdom of Avalon. It is up 
                <br />
                to the knights to defeat Mordred. Deduce who is  
                <br />
                friend and who is foe and win 3 rounds to claim victory.               
              </p>
            </div>
            <StartButton />
            <br />
            <h3>OR</h3>
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
