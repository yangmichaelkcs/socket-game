import { FaRegUser } from 'react-icons/fa'
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
  playerList: Player[];
}

interface LobbyState {
  value: string;
  tooltip: boolean;
}

class Lobby extends React.Component<LobbyPropsFromState, LobbyState> {
  constructor(props) {
    super(props);
    this.state = { 
      value: "",
      tooltip: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  // Changes in nickname input box reflected in value state
  public handleChange(event) {
    this.setState({ value: event.target.value });
  }

  // On clicking update nick, checks if its between 1-7 characters and unique
  public handleClick() {
    const { playerList } = this.props
    const nick = this.state.value.trim()
    const dupNick = playerList.findIndex(player => player.nickName === nick);
    if(nick.length >= 1 && nick.length < 8 && dupNick === -1)
    { 
      updateNickName(this.state.value.trim());
      this.setState({ tooltip: false });
    } else {
      this.setState({ tooltip: true });
    }
  }

  // Nickname input box display 
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

  // Tooltip
  public showNickTooltip() {
    if(this.state.tooltip) {
      return (<span className="Warning">Nickname must be unique and 1-7 letters</span>);
    } 
  }

  public render() {
    const { gameId, playerCount, playerListItems } = this.props;
    return (
      <div className="Lobby">
        <h3 style={{wordBreak:"break-all"}}><u>Game ID:<br/>{gameId}</u></h3>
        <h4>{playerCount} player(s) connected: </h4>
        <ul className="list-unstyled">{playerListItems}</ul>
        <br />
        <div>
          <div className="NickTooltip input-group mb-3">
            <input type="text" value={this.state.value} onChange={this.handleChange}
                   placeholder={this.getNick()} className="form-control" />
            <div className="input-group-append">
              <button type="button" className="NicknameButton btn btn-outline-secondary" onClick={this.handleClick}>Update Nickname</button>
            </div>
          </div>
          {this.showNickTooltip()}
        </div>
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
      <FaRegUser style={{fontSize:"1rem"}}/>
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
