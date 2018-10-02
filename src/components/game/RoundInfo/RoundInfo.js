import React, {Component} from "react";

class RoundInfo extends Component{
  render() {
    return (
        <div>
          <h2>
            Round Number {this.props.currentRound}:
          </h2>
          <p>
            Pick ___ players, ___ failures need for spies 
          </p>  
          <br/>
        </div>  
    );
  }
}

export default RoundInfo;