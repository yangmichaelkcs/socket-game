import React, {Component} from "react";

class RoundInfo extends Component{
  render() {
    return (
        <div>
          <h2>
            Round {this.props.currentRound}
          </h2>
        </div>  
    );
  }
}

export default RoundInfo;