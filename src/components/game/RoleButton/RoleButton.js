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

  roleInfo() {
      if(this.state.showRole) { 
          return (
            <p style={{margin:"0"}}>
                Team:
                <br/>
                Role:
                <br/>
                Special:
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