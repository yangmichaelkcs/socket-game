import * as React from "react";
import SingleRound from "../SingleRound";

class AllRounds extends React.Component <any,any> {

  public render() {
    return (
      <div>
        <div className="row">
          {this.props.rounds.map(round => ( 
            <SingleRound key={round.id} value={round.value} roundNumber={round.id} playersNeeded={round.playersNeeded} 
                         failsNeeded={round.failsNeeded} currentRound={this.props.currentRound}/>))}
        </div>
        <p style={{margin:"0"}}>
          Team Proposals {this.props.failedVotes}/5
        </p>
      </div>
    );
  }
}

export default AllRounds;