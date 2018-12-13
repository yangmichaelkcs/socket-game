import React, { Component } from "react";
import { connect } from "react-redux";
import { navigateTo } from "../../../actions";

class MenuButton extends Component {
  render() {
    const { onClick } = this.props;
    return <button style={{margin:"1rem"}} onClick={onClick}>Main Menu</button>;
  }
}

// FIXME, make this disconnect this user from game
const mapDispatchToProps = dispatch => ({
});

export default connect(
  undefined,
  mapDispatchToProps
)(MenuButton);
