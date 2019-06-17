import * as React from "react";
import { ROUND_STATUS, Player } from "types/types";
import {
    getPlayers, 
    getRoundStatus,
} from "selectors";
import { connect } from "react-redux";

interface VoteButtonsProps {
    players: Player[];
    roundStatus: ROUND_STATUS;
  }

  class VoteButtons extends React.Component<VoteButtonsProps, any> {
 
  public onSuccess = () => {
    // if(this.state.reject || this.state.accept)
    // {
    //   return;
    // }
    //  this.setState({accept: true, reject: false});
    //  updateVote(1);
  };

  public onFail = () => {
    // if(this.state.reject || this.state.accept)
    // {
    //   return;
    // }
    // this.setState({reject: true, accept: false});
    // updateVote(-1);
  }
  
  public showVoteButtons () {
    const { roundStatus } = this.props;
    if(roundStatus === ROUND_STATUS.MISSION_IN_PROGRESS) {
      return (
        <div className={"VotingButtons"}>
          <button
            onClick={this.onSuccess}
            //   disabled={this.state.accept}
            style={{ margin: "1rem", width: "100px", height: "50px" }}
          >
            Success
          </button>
          <button
            onClick={this.onFail}
            //   disabled={this.state.reject}
            style={{ margin: "1rem", width: "100px", height: "50px" }}
          >
            Fail
          </button>
        </div>
      );
    }
  }

  public render() {
    return (
      <div>
        {this.showVoteButtons()}
      </div>
    );
  }
    
}

  const mapStateToProps = state => {
    const players: Player[] = getPlayers(state);
  
    return {
      players,
      roundStatus: getRoundStatus(state),
    };
  };
  
  export default connect(mapStateToProps)(VoteButtons);