import { FaMale } from 'react-icons/fa'
import * as React from "react";
import { connect } from "react-redux";
import { getGameId, getPlayerCount, getPlayers, getPlayerData } from "selectors";
import StartButton from "./StartButton";
import { Player } from "types/types";
import { updateNickName } from "socket";
import MenuButton from './MenuButton';

interface LobbyPropsFromState {
  gameId: string;
  playerCount: number;
  playerListItems: any;
  playerData: Player;
}

interface LobbyState {
  value: string;
}

class Lobby extends React.Component<LobbyPropsFromState, LobbyState> {
  constructor(props) {
    super(props);
    this.state = { value: "" };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  public handleChange(event) {
    this.setState({ value: event.target.value });
  }

  public handleClick() {
    if(this.state.value.trim().length >=1)
    {
      updateNickName(this.state.value.trim());
    }
  }

  public getNick() {
    if(this.props.playerData === undefined)
    {
      return "Nickname";
    }
    else
    {
      return this.props.playerData.nickName;
    }
  }

  public render() {
    const { gameId, playerCount, playerListItems } = this.props;
    return (
      <div className="Lobby">
        <h3><u>Game ID: {gameId}</u></h3>
        <h4>{playerCount} player(s) connected </h4>
        <br />
        <ul className="list-unstyled">{playerListItems}</ul>
        <br />
        <div>
          <div className="input-group mb-3">
            <input type="text" value={this.state.value} onChange={this.handleChange}
                   placeholder={this.getNick()} className="form-control" />
            <div className="input-group-append">
              <button type="button" className="NicknameButton btn btn-outline-secondary" onClick={this.handleClick}>Update Nickname</button>
            </div>
          </div>
        </div>
        <br />
        <div>
          <StartButton playerCount={playerCount} />
          <MenuButton />
        </div>
        <h5>You must have 5 - 10 players</h5>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const playerList: Player[] = getPlayers(state);
  const playerListItems = playerList.map(player => (
    <li key={player.socketId}>
      <FaMale style={{fontSize:"1rem"}}/>
      {player.nickName}
    </li>
  ));
  const playerData: Player = getPlayerData(state);

  return {
    gameId: getGameId(state),
    playerCount: getPlayerCount(state),
    playerList,
    playerListItems,
    playerData,
  };
};

export default connect(mapStateToProps)(Lobby);
