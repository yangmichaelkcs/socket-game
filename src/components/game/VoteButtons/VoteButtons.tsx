import * as React from "react";
import { ROUND_STATUS, Player } from "../../../types/types";
import {
    getPlayers, 
    getRoundStatus,
    getPlayerData 
} from "../../../selectors";
import { connect } from "react-redux";
import { updateMissionVote } from "../../../socket";

interface VoteButtonsProps {
    players: Player[];
    roundStatus: ROUND_STATUS;
    onMission: boolean;
  }

class VoteButtons extends React.Component<VoteButtonsProps, any> {
  constructor(props) {
    super(props);
    this.state = { 
      success: true,
      fail: true
    };

    this.onSuccess = this.onSuccess.bind(this);
    this.onFail = this.onFail.bind(this);
  }
  
  // Clicking success hides buttons and emits server
  public onSuccess = () => {
    this.setState({success: false, fail: false});
    updateMissionVote(1);
  };

  // Clicking fail hides buttons and emits server
  public onFail = () => {
    this.setState({fail: false, success: false});
    updateMissionVote(-1);
  }
  
  // Shows vote buttons only for those players who are on the mission and at the correct round
  public showVoteButtons () {
    const { roundStatus, onMission } = this.props;
    if(roundStatus === ROUND_STATUS.MISSION_IN_PROGRESS) {
      if(onMission) {
        return (
          <div className={"VotingButtons"}>
            <br />
            <div>Succeed or Fail the Mission</div>
            {this.state.success && <button onClick={this.onSuccess} type="button" className="SideBySideButton btn btn-outline-primary">
                Success
            </button>}
            {this.state.fail && <button onClick={this.onFail} type="button" className="SideBySideButton RejectButton btn btn-outline-danger">
                Fail
            </button>}
          </div>
        );
      } else {
        return (
          <div>
            Players are on the mission
          </div>
        );
      }
    }
  }

  // Resets buttons so they are displayed
  public componentDidUpdate() {
    if(this.state.success && this.state.fail) {
      return;
    } else if (this.props.roundStatus === ROUND_STATUS.VOTING_END) {
      this.setState({success: true, fail: true});
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
    const playerData: Player = getPlayerData(state);
    const onMission = players.find(player => player.socketId === playerData.socketId).selected;
    return {
      players,
      roundStatus: getRoundStatus(state),
      onMission
    };
  };
  
  export default connect(mapStateToProps)(VoteButtons);