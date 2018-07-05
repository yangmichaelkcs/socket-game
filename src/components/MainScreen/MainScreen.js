import React, { Component } from "react";
import Button from "../Button";
import socketIOClient from "socket.io-client";

const SOCKET = socketIOClient("http://localhost:8888");

class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerCount: 0
    };
  }

  render() {
    SOCKET.on("UPDATE_COUNT", count => {
      this.setState({
        playerCount: this.state.playerCount + count
      });
    });

    return (
      <div className="MainScreen">
        <h2> {this.state.playerCount} players have connected </h2>
        <Button />
      </div>
    );
  }
}

export default MainScreen;
