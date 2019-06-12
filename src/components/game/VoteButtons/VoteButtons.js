import React, {Component} from "react";
import { ROUND_STATUS } from "types/types";

class VoteButtons extends Component{
  constructor(props) {
    super(props);
    /*
    this.state = { 
      success: false,
      fail: false
    };
    */
      //this.onSuccess = this.onSuccess.bind(this);
      //this.onFail = this.onFail.bind(this);
  }

  onSuccess() {
    //this.setState({success: true, fail: false});
  }    

  onFail() {
    //this.setState({fail: true, success: false});
  }    

  showButtons()
  {
    const { roundStatus } = this.props;
    if(roundStatus ===  ROUND_STATUS.MISSION_IN_PROGRESS) {
      return (
        <div style={{ marginBottom: "2rem", marginTop: "1rem"}}>
          <button
            onClick={this.onSuccess}
            //disabled={this.state.success}
            style={{margin: "1rem", width:"100px", height:"50px"}}
          >
              Success
          </button>
          <button
            onClick={this.onFail}
            //disabled={this.state.fail}
            style={{margin: "1rem", width:"100px", height:"50px"}}
          >
              Fail
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