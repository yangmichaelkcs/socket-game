import * as React from "react";

class RoundInfo extends React.Component <any, any> {
  public render() {
    return (
        <div>
          <h1 className="display-2">
            Round {this.props.currentRound}
          </h1>
        </div>  
    );
  }
}

export default RoundInfo;