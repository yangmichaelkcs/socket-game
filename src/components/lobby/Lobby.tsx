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
    if(this.state.value.length >=1)
    {
      updateNickName(this.state.value);
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
        <h2>Game ID: {gameId}</h2>
        <h2> {playerCount} players have connected </h2>
        <ul>{playerListItems}</ul>
        <br />
        <div>
          <input
            type="text"
            value={this.state.value}
            onChange={this.handleChange}
            placeholder={this.getNick()}
          />
          <button onClick={this.handleClick}>Update Nickname</button>
        </div>
        <br />
        <div>
          <StartButton playerCount={playerCount} />
          <MenuButton />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const playerList: Player[] = getPlayers(state);
  const playerListItems = playerList.map(player => (
    <li key={player.socketId}>{player.nickName}</li>
  ));
  const playerData: Player = getPlayerData(state);

  return {
    gameId: getGameId(state),
    playerCount: getPlayerCount(state),
    playerListItems,
    playerData,
  };
};

export default connect(mapStateToProps)(Lobby);
