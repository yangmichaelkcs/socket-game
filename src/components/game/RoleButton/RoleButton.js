import React, { Component } from "react";

class RoleButton extends Component {
  constructor(props) {
      super(props);
      this.state = { showRole: true };
      this.handleClick = this.handleClick.bind(this);

  }

  handleClick() {
      this.setState(prevState => ({
        showRole: !prevState.showRole
      }));
  }

  // FIXME, props for info
  roleInfo() {
      if(this.state.showRole) { 
          return (
            <p style={{margin:"0", float: "left", textAlign:"left"}}>
                Team:
                <br/>
                Role:
                <br/>
                Special:
                <br/>
                Team Members:
            </p>
      );
    }
  }

  render() {
    return  (
        <div className="Role">
             <button className = "RoleButton" onClick={this.handleClick}>{this.state.showRole ? 'Hide' : 'Show '}</button>
            {this.roleInfo()}
        </div>
    );
  }

}

export default RoleButton;