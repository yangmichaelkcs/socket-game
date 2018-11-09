import React, { Component } from "react";

class PlayerList extends Component{

    render(){
      return (
        <div className = "PlayerList">
          <ul style ={{listStyle: "none", whiteSpace: "nowrap", paddingLeft: "0", alignItems: "center"}}>
            <li className = "Player" >
              <span >
                P1
              </span>
            </li>
            <li className = "Player">
              <span >
                P2
              </span>
            </li>
            <li className = "Player">
              <span >
                P3
              </span>
            </li>
            <li className = "Player">
              <span >
                P4
              </span>
            </li>
            <li className = "Player">
              <span >
                P5
              </span>
            </li>
            <li className = "Player">
              <span >
                P6
              </span>
            </li>
            <li className = "Player">
              <span >
                P7
              </span>
            </li>
            <li className = "Player">
              <span >
                P8
              </span>
            </li>
            <li className = "Player">
              <span >
                P9
              </span>
            </li>
            <li className = "Player">
              <span >
                P10
              </span>
            </li>
          </ul>
        </div>
      );
    }
}

export default PlayerList;