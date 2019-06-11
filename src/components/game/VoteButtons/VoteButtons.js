import React, {Component} from "react";
import { ROUND_STATUS } from "types/types";

class VoteButtons extends Component{
  constructor(props) {
    super(props);
    /*
    this.state = { 
      approve: false,
      reject: false
    };
    */
      //this.onAccept = this.onAccept.bind(this);
      //this.onReject = this.onReject.bind(this);
  }

  onApprove() {
    //this.setState({approve: true, reject: false});
  }    

  onReject() {
    //this.setState({reject: true, approve: false});
  }    

  showButtons()
  {
    const { roundStatus } = this.props;
    if(roundStatus ===  ROUND_STATUS.MISSION_IN_PROGRESS) {
      return (
        <div style={{ marginBottom: "2rem", marginTop: "1rem"}}>
          <button
            onClick={this.onApprove}
            //disabled={this.state.approve}
            style={{margin: "1rem", width:"100px", height:"50px"}}
          >
              Approve
          </button>
          <button
            onClick={this.onReject}
            //disabled={this.state.reject}
            style={{margin: "1rem", width:"100px", height:"50px"}}
          >
              Reject
          </button>
        </div> 
      );
    }
  }

  render() {
      return (
        <div>
          {this.showButtons()}
        </div>
    );
  }
}

export default VoteButtons;