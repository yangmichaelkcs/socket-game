import React, {Component} from "react";
import SingleRound from "../SingleRound";

class AllRounds extends Component {

  // Pass more round info like round status, members required, failed votes, FIXME
  render() {
    return (
        <div className="Round" style={{height:"50%"}}>
          {this.props.rounds.map(round => (
            <SingleRound
              key={round.id}
              value={round.value}
              roundNumber={round.id}
              membersRequired={round.playersNeeded} 
            />
          ))}
          <h3 style={{margin:"0"}}>
              Vote Track {this.props.failedVotes}/5
          </h3>
        </div>
    );
  }
}

export default AllRounds;