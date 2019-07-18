import { FaRegUser } from 'react-icons/fa'
import * as React from "react";
import { connect } from "react-redux";
import { getGameId, getPlayerCount, getPlayers, getPlayerData, getIncludes } from "selectors";
import StartButton from "./StartButton";
import { Player } from "types/types";
import { updateNickName, updateIncludes } from "socket";
import MenuButton from './MenuButton';
import { SPECIAL_CHAR_INDEX } from '../../types/types';

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
  includes: boolean[];
}

class Lobby extends React.Component<LobbyPropsFromState, LobbyState> {
  constructor(props) {
    super(props);
    this.state = { 
      value: "",
      tooltip: false,
      includes: [false, false, false, false]
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.checkAssMerlin = this.checkAssMerlin.bind(this);
    this.checkMordred = this.checkMordred.bind(this);
    this.checkMorgana = this.checkMorgana.bind(this);
    this.checkPercival = this.checkPercival.bind(this);
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
  
  // Check boxes for special chars
  public checkMordred() {
    updateIncludes(SPECIAL_CHAR_INDEX.MORDRED);
  }

  public checkMorgana() {
    updateIncludes(SPECIAL_CHAR_INDEX.MORGANA);
  }

  public checkPercival() {
    updateIncludes(SPECIAL_CHAR_INDEX.PERCIVAL);
  }

  public checkAssMerlin() {
    updateIncludes(SPECIAL_CHAR_INDEX.ASSMERLIN);
  }

  public render() {
    const { gameId, playerCount, playerListItems } = this.props;
    return (
      <div className="Lobby">
        <h3 style={{wordBreak:"break-all"}}><u>Game ID:<br/>{gameId}</u></h3>
        <h4>{playerCount} player(s) connected: </h4>
        <h5 className="Warning">You must have 5 - 10 players</h5>
        <br />
        <div className="row" style={{width:"75%", paddingBottom:"1rem"}}>{playerListItems}</div>
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
        <br />
        <form>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" id="assassinMerlin" onClick={this.checkAssMerlin} />
            <label className="form-check-label" htmlFor="assassinMerlin">Assassin &amp; Merlin </label>
          </div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" id="percival" onClick={this.checkPercival} />
            <label className="form-check-label" htmlFor="percival">Percival</label>
          </div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" id="morgana" onClick={this.checkMorgana} />
            <label className="form-check-label" htmlFor="morgana">Morgana</label>
          </div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" id="Mordred" onClick={this.checkMordred}/>
            <label className="form-check-label" htmlFor="Mordred">Mordred</label>
          </div>
        </form>
        <div>
          <StartButton playerCount={playerCount}/>
          <MenuButton />
        </div>
        <p style={{fontSize:".75rem"}}>
          Merlin - Sees all evil minions
          <br />
          Assassin - Kill Merlin, win game
          <br />
          Percival - Sees Morgana and Merlin
          <br />
          Morgana - Appears as Merlin to Percival
          <br />
          Mordred - Not revealed to Merlin
        </p>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const playerList: Player[] = getPlayers(state);
  const playerListItems = playerList.map(player => (
    <div className="col-6" key={player.socketId}>
      <FaRegUser style={{fontSize:"1rem"}}/>
      {player.nickName}
    </div>
  ));
  const playerData: Player = getPlayerData(state);

  return {
    gameId: getGameId(state),
    playerCount: getPlayerCount(state),
    playerList,
    playerListItems,
    playerData,
    includes: getIncludes(state)
  };
};

export default connect(mapStateToProps)(Lobby);
