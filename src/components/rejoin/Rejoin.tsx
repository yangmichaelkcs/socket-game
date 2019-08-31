import { FaRegUser } from 'react-icons/fa'
import * as React from "react";
import { connect } from "react-redux";
import { getGameId, getPlayerCount, getPlayers, getPlayerData } from "../../selectors";
import { Player } from "../../types/types";
import { rejoinGame } from "../../socket";

interface RejoinPropsFromState {
  gameId: string;
  playerCount: number;
  playerListItems: any;
  playerData: Player;
  playerList: Player[];
}

interface RejoinState {
  value: string;
  tooltip: boolean;
}

class Rejoin extends React.Component<RejoinPropsFromState, RejoinState> {
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

  // On clicking rejoin, checks if its one of the players in the game
  public handleClick() {
    const { playerList } = this.props
    const nick = this.state.value.trim()
    const dupNick = playerList.findIndex(player => player.nickName === nick);
    if(dupNick !== -1)
    { 
      rejoinGame(this.state.value);
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
      return (<span className="Warning">Must enter a nickname from game</span>);
    } 
  }

  public render() {
    const { gameId, playerListItems } = this.props;
    return (
      <div className="Lobby">
        <h3 style={{wordBreak:"break-all"}}><u>Game ID:<br/>{gameId}</u></h3>
        <h4>Enter your exact nickname</h4>
        <ul className="list-unstyled">{playerListItems}</ul>
        <br />
        <div>
          <div className="NickTooltip input-group mb-3">
            <input type="text" value={this.state.value} onChange={this.handleChange}
                   placeholder={this.getNick()} className="form-control" />
            <div className="input-group-append">
              <button type="button" className="NicknameButton btn btn-outline-secondary" onClick={this.handleClick}>Rejoin</button>
            </div>
          </div>
          {this.showNickTooltip()}
        </div>
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

export default connect(mapStateToProps)(Rejoin);
