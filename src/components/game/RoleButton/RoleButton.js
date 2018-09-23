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
            <div>
                <h3>Team:</h3>
                <h3>Role:</h3>
                <h3>Special:</h3>
            </div>
      );}
  }

  render() {
    return  (
        <div>
            <button onClick={this.handleClick}>{this.state.showRole ? 'Hide' : 'Show Role'}</button>
            {this.roleInfo()}
        </div>
    );
  }

}

export default RoleButton;