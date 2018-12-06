import React, {Component} from "react";

class VoteButtons extends Component{
  constructor(props) {
    super(props);
    this.state = { 
        approve: false,
        reject: false
    };
      this.handleApprove = this.handleApprove.bind(this);
      this.handleReject = this.handleReject.bind(this);
  }

  handleApprove () {
    this.setState({approve: true, reject: false});
  }    

  handleReject () {
    this.setState({reject: true, approve: false});
  }    

  render() {
      return (
        <div style={{ marginBottom: "2rem", marginTop: "1rem"}}>
          <button
            onClick={this.handleApprove}
            disabled={this.state.approve}
            style={{margin:"10px", width:"200px", height:"50px"}}
          >
              Approve
          </button>
          <button
            onClick={this.handleReject}
            disabled={this.state.reject}
            style={{margin:"10px", width:"200px", height:"50px"}}
          >
              Reject
          </button>
        </div> 
    );
  }
}


export default VoteButtons;