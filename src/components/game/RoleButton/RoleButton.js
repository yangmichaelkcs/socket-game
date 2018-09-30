import React, { Component } from "react";


class RoleButton extends Component {
  constructor(props) {
      super(props);
      this.state = { showRole: false };
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
            <p>
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
        <div style={{height:"50%", marginLeft:"10%"}}>
            <button onClick={this.handleClick}>{this.state.showRole ? 'Hide' : 'Show Role'}</button>
            {this.roleInfo()}
        </div>
    );
  }

}

export default RoleButton;