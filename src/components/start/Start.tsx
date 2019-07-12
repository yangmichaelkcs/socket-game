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
              <h1><FaCrown style={{fontSize:"3rem"}}/><u><b>Resistance</b></u></h1>
              <p style={{textAlign:"center"}}>
                An evil government has taken over the 
                <br />
                world. It is up to the Resistance to fight  
                <br />
                back and overthrow the corrupt. The 
                <br />
                government has deployed spies to
                <br />
                inflitrate the Resistance. Deduce
                <br />
                who is friend or foe. Win 3 rounds to 
                <br />
                claim victory.               
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
