import { FaChessKnight, FaSkull, FaRegQuestionCircle } from 'react-icons/fa'
import * as React from "react";
import { TEAM } from 'types/types';

class SingleRound extends React.Component<any, any> {
  
  // Returns correct icon depending on who won mission
  public roundStatus() {
    if(this.props.value == null)
    {
      return <FaRegQuestionCircle className="RoundIcon card-img-top"/>;
    }
    else if(this.props.value === TEAM.GOOD)
    {
      return <FaChessKnight className="Knight RoundIcon card-img-top"/>;
    } 
    else
    {
      return <FaSkull className="Spy RoundIcon card-img-top"/>;
    }
  }

  // Sets class for current round or not current round
  public isCurrentRound() {
    return this.props.currentRound === this.props.roundNumber ? "RoundCurrentRound card" : "card";
  }

  public render() {
    const { roundNumber, playersNeeded, failsNeeded } = this.props;
    return (
      <div className="RoundCol col">
        <div className={this.isCurrentRound()}>
          {this.roundStatus()}
          <div className="RoundCardBody card-body">
            <p className="cardInfo card-text" style={{marginBottom: "0"}}>Mission {roundNumber}</p>
            <p className="cardInfo card-text">Players: {playersNeeded}</p>
            <p className="cardInfo card-text">Fails: {failsNeeded}</p>
          </div>
        </div>
      </div>
    );
  }


}

export default SingleRound;