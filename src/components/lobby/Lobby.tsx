import * as React from "react";
import { connect } from "react-redux";
import { getGameId, getPlayerCount, getPlayers } from "selectors";
import StartButton from "./StartButton";
import { Player } from "types/types";
import { updateNickName } from "socket";

interface LobbyPropsFromState {
  gameId: string;
  playerCount: number;
  playerListItems: any;
}

interface LobbyState {
  value: string;
}

class Lobby extends React.Component<LobbyPropsFromState, LobbyState> {
  constructor(props) {
    super(props);
    this.state = { value: "asdf" };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  public handleChange(event) {
    this.setState({ value: event.target.value });
  }

  public handleClick() {
    updateNickName(this.state.value);
  }

  public render() {
    const { gameId, playerCount, playerListItems } = this.props;
    return (
      <div className="Lobby">
        <h2>Game ID: {gameId}</h2>
        <h2> {playerCount} players have connected </h2>
        <ul>{playerListItems}</ul>
        <input
          type="text"
          value={this.state.value}
          onChange={this.handleChange}
        />
        <button onClick={this.handleClick}>Update Nickname</button>
        <StartButton />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const playerList: Player[] = getPlayers(state);
  const playerListItems = playerList.map(player => (
    <li key={player.socketId}>{player.nickName}</li>
  ));

  return {
    gameId: getGameId(state),
    playerCount: getPlayerCount(state),
    playerListItems
  };
};

export default connect(mapStateToProps)(Lobby);
