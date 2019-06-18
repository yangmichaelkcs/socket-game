import * as React from "react";
import { ROUND_STATUS, Player } from "types/types";
import {
    getPlayers, 
    getRoundStatus,
} from "selectors";
import { connect } from "react-redux";
import { updateMissionVote } from "socket";

interface VoteButtonsProps {
    players: Player[];
    roundStatus: ROUND_STATUS;
  }

class VoteButtons extends React.Component<VoteButtonsProps, any> {
  constructor(props) {
    super(props);
    this.state = { 
      playerNeededTooltip: false,
      success: false,
      fail: false
    };

    this.onSuccess = this.onSuccess.bind(this);
    this.onFail = this.onFail.bind(this);
  }
 
  public onSuccess = () => {
    if(this.state.fail || this.state.success)
    {
      return;
    }
    this.setState({sucess: true, fail: false});
    updateMissionVote(1);
  };

  public onFail = () => {
    if(this.state.fail || this.state.success)
    {
      return;
    }
    this.setState({fail: true, success: false});
    updateMissionVote(-1);
  }
  
  public showVoteButtons () {
    const { roundStatus } = this.props;
    if(roundStatus === ROUND_STATUS.MISSION_IN_PROGRESS) {
      return (
        <div className={"VotingButtons"}>
          <button
            onClick={this.onSuccess}
            disabled={this.state.success}
            style={{ margin: "1rem", width: "100px", height: "50px" }}
          >
            Success
          </button>
          <button
            onClick={this.onFail}
            disabled={this.state.fail}
            style={{ margin: "1rem", width: "100px", height: "50px" }}
          >
            Fail
          </button>
        </div>
      );
    }
  }

  public componentDidUpdate() {
    if(!this.state.success && !this.state.fail) {
      return;
    } else if (this.props.roundStatus === ROUND_STATUS.VOTING_END) {
      this.setState({success: false, fail: false});
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