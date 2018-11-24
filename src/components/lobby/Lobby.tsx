import * as React from "react";
import { connect } from "react-redux";
import { getGameId, getPlayerCount, getPlayers } from "selectors";
import StartButton from "./StartButton";
import { Player } from "types/types";

interface LobbyStateProps {
  gameId: string;
  playerCount: number;
  playerListItems: any;
}

class Lobby extends React.Component<LobbyStateProps> {
  constructor(props) {
    super(props);
    this.state = { value: "" };

    this.handleChange = this.handleChange.bind(this);
  }

  public handleChange(event) {
    this.setState({ value: event.target.value });
  }

  public render() {
    const { gameId, playerCount, playerListItems } = this.props;
    return (
      <div className="Lobby">
        <h2>Game ID: {gameId}</h2>
        <h2> {playerCount} players have connected </h2>
        <ul>{playerListItems}</ul>
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
