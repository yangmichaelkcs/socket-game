import React, {Component} from "react";

class SingleRound extends Component{
  roundStatus() {
    if(this.props.value==null)
    {
      return null;
    }
    else if(this.props.value)
    {
      return (
        <circle cx="50%" cy="50%" r="25%" stroke="blue" strokeWidth="5" fill="blue" />
      );
    } 
    else
    {
      return (
        <circle cx="50%" cy="50%" r="25%" stroke="red" strokeWidth="5" fill="red" />  
      );
    }
  }

  render() {
    return (
        <svg width="20%" height="100%">
            <rect width="85%" height="70%" x="7.5%" y="15%" strokeWidth="2" stroke="#000000" fill="#FFFFFF"/>
            <text x="27.5%" y="20%" font-size="20" fill="Black">Round {this.props.roundNumber}</text>
            {this.roundStatus()}
        </svg>
    );
  }


}

export default SingleRound;