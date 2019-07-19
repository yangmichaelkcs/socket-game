import { FaCrown } from 'react-icons/fa'
import * as React from "react";
import { connect } from "react-redux";
import StartButton from "./StartButton";
import JoinButton from "./JoinButton";
import Lobby from "components/lobby";
import Game from "components/game";
import Rejoin from "components/rejoin";
import { getCurrentPage } from "selectors";

class StartGame extends React.Component<any, any> {
  public render() {
    switch (this.props.currentPage) {
      case "LOBBY":
        return <Lobby />;
      case "IN_PROGRESS":
        return <Game />;
      case "REJOIN":
        return <Rejoin />
      default:
        return (
          <div className="StartGame">
            <div style={{marginBottom: "2rem"}}>
              <h1 className="display-3"><FaCrown style={{fontSize:"3rem"}}/><u><b>Avalon</b></u></h1>
              <p style={{textAlign:"center"}}>
                Evil Mordred and his minions have 
                <br />
                infiltrated the good kingdom of Avalon.  
                <br />
                It's up to the knights of King Arthur  
                <br />
                to defeat them and save humanity.    
                <br />
                Deduce who is friend and who is foe and  
                <br />
                win 3 rounds to claim victory.               
              </p>
            </div>
            <StartButton />
            <br />
            <h3>OR</h3>
            <br />
            <JoinButton currentPage={this.props.currentPage}/>
          </div>
        );
    }
  }
}

const mapStateToProps = state => ({
  currentPage: getCurrentPage(state)
});

export default connect(mapStateToProps)(StartGame);
