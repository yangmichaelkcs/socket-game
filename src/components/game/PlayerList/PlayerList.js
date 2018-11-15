import React, { Component } from "react";
import Player from "../Player";

class PlayerList extends Component{

  render(){
    return (
      <div className = "PlayerList">
        <h3 style ={{marginTop: "1rem"}}>
          Proposed Team:
        </h3>
        <ul style ={{listStyle: "none", whiteSpace: "nowrap", padding: "0", alignItems: "center", margin: "0"}}>
          {this.props.players.map(player => (
            <li className = "PlayerName" key = {player.socketId}>
              <span>
                {player.nickName}
              </span>
            </li>
          ))}
        </ul>
        <ul style ={{listStyle: "none", whiteSpace: "nowrap", paddingLeft: "0", alignItems: "center", marginTop: "0", marginBottom: "2rem"}}>
          {this.props.players.map(player => (
            <Player key = {player.socketId} player = {player} onPlayerClick = {this.props.onPlayerClick} />
          ))}
        </ul>
      </div>
    );
  }
}

export default PlayerList;