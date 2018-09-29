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
        <div>
          <button
            onClick={this.handleApprove}
            disabled={this.state.approve}
            style={{margin:5}}
          >
              Approve
          </button>
          <button
            onClick={this.handleReject}
            disabled={this.state.reject}
            style={{margin:5}}
          >
              Reject
          </button>
        </div> 
    );
  }
}


export default VoteButtons;