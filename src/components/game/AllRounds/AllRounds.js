import React, {Component} from "react";
import SingleRound from "../SingleRound";

class AllRounds extends Component {
  render() {
    return (
        <div>
          {this.props.rounds.map(round => (
            <SingleRound
              key={round.id}
              value={round.value}
            />
          ))}
        </div>
    );
  }
}

export default AllRounds;