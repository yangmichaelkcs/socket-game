import React, {Component} from "react";

class Player extends Component{
  getPlayerClasses() {
    let classes ="";
    classes += this.props.player.selected === 0 ? "PlayerUnclicked" : "PlayerClicked";
    return classes;
  }

  render(){
      return (
        <li className = {this.getPlayerClasses()} onClick = {() => this.props.onPlayerClick(this.props.player.socketId)}>
          <span>
            {this.props.player.nickName.substring(0,1)}
          </span>
        </li>
      );
  }
}

export default Player;