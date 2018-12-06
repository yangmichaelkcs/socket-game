import React, { Component } from "react";
import Player from "../Player";

class PlayerList extends Component{

  showProposeButton() {
    if(this.props.turnToPick)
    {
      return (<button style={{marginBottom:"1rem", width:"100px", height:"50px"}} >
                Propose Team
              </button>);
    }
  }

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
                {player.nickName.substring(0,7)}
              </span>
            </li>
          ))}
        </ul>
        <ul style ={{listStyle: "none", whiteSpace: "nowrap", paddingLeft: "0", alignItems: "center", marginTop: "0", marginBottom: "1rem"}}>
          {this.props.players.map(player => (
            <Player key = {player.socketId} player = {player} onPlayerClick = {this.props.onPlayerClick} />
          ))}
        </ul>
        {this.showProposeButton()}
      </div>
    );
  }
}

export default PlayerList;