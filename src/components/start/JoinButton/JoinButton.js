import React, { Component } from "react";
import { connect } from "react-redux";
import { joinGame } from "socket";

class JoinButton extends Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleClick() {
    joinGame(this.state.value);
  }

  render() {
    return (
      <div>
        <input
          type="text"
          value={this.state.value}
          onChange={this.handleChange}
          placeholder="Game ID"
        />
        <button onClick={this.handleClick}>Join Game</button>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({});

export default connect(
  undefined,
  mapDispatchToProps
)(JoinButton);
