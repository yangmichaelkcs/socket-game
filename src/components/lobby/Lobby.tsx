import { FaRegUser, FaUser } from 'react-icons/fa'
import * as React from "react";
import { connect } from "react-redux";
import { getGameId, getPlayerCount, getPlayers, getPlayerData, getIncludes } from "selectors";
import StartButton from "./StartButton";
import { Player, TEAM } from "types/types";
import { updateNickName, updateIncludes } from "socket";
import MenuButton from './MenuButton';
import { SPECIAL_CHAR_INDEX, PLAYER_DISTRIBUTION } from '../../types/types';

interface LobbyPropsFromState {
  gameId: string;
  playerCount: number;
  playerData: Player;
  playerList: Player[];
  includes: boolean[];
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
      tooltip: false,
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

  // Disable Start
  public disableStart() {
    const { playerCount } = this.props
    let tooManyBad = 0;
    if(this.props.includes[SPECIAL_CHAR_INDEX.ASSMERLIN]) { tooManyBad++; }
    if(this.props.includes[SPECIAL_CHAR_INDEX.MORDRED]) { tooManyBad++; }
    if(this.props.includes[SPECIAL_CHAR_INDEX.MORGANA]) { tooManyBad++; }
    if(tooManyBad > PLAYER_DISTRIBUTION[playerCount].bad) {  
      return true;
    } 
    return false;
  }

  // Special Tooltip
  public showSpecialTooltip() {
    if(this.disableStart()) {
      return (<span className="Warning">Not enough players for evil team</span>);
    }
  }

  public displayPlayerDistr() {
    const { playerCount } = this.props
    return <span>Team distribution Good: {PLAYER_DISTRIBUTION[playerCount].good} Evil: {PLAYER_DISTRIBUTION[playerCount].bad}</span>
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

  public checkPlayerCount() {
    const { playerCount } = this.props
    if(playerCount < 5 || playerCount > 10) {
      return <h5 className="Warning">You must have 5 - 10 players</h5>
    }
  }

  public playerSelf(socketId) {
    const { playerData } = this.props
    if(playerData === undefined) {
      return <FaRegUser style={{fontSize:"1rem"}}/>
    }
    return playerData.socketId === socketId ? <FaUser className="PlayerPicked" style={{fontSize:"1rem"}}/> : <FaRegUser style={{fontSize:"1rem"}}/>
  }

  public playerList() {
    const { playerList } = this.props
    return (playerList.map(player => (
      <div className="col-6 col-lg-12" key={player.socketId}>
        {this.playerSelf(player.socketId)}
        {player.nickName}
      </div>)));
  }

  public render() {
    const { gameId, playerCount, includes } = this.props;
    return (
      <div className="Lobby">
        <h3 style={{wordBreak:"break-all"}}><u>Game ID:<br/>{gameId}</u></h3>
        <h4>{playerCount} player(s) connected: </h4>
        {this.checkPlayerCount()}
        {this.displayPlayerDistr()}
        <br />
        <div className="row" style={{width:"75%", paddingBottom:"1rem"}}>{this.playerList()}</div>
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
            <input className="form-check-input" type="checkbox" id="assassinMerlin" onChange={this.checkAssMerlin} checked={includes[SPECIAL_CHAR_INDEX.ASSMERLIN]}/>
            <label className="form-check-label" htmlFor="assassinMerlin">Assassin &amp; Merlin </label>
          </div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" id="percival" onChange={this.checkPercival} checked={includes[SPECIAL_CHAR_INDEX.PERCIVAL]}/>
            <label className="form-check-label" htmlFor="percival">Percival</label>
          </div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" id="morgana" onChange={this.checkMorgana} checked={includes[SPECIAL_CHAR_INDEX.MORGANA]}/>
            <label className="form-check-label" htmlFor="morgana">Morgana</label>
          </div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" id="Mordred" onChange={this.checkMordred} checked={includes[SPECIAL_CHAR_INDEX.MORDRED]}/>
            <label className="form-check-label" htmlFor="Mordred">Mordred</label>
          </div>
        </form>
        <div>
          <StartButton playerCount={playerCount} disableStart={this.disableStart()}/>
          <MenuButton />
        </div>
        {this.showSpecialTooltip()}
        <p style={{fontSize:".75rem"}}>
          Merlin ({TEAM.GOOD}) - Sees all evil minions except Mordred
          <br />
          Assassin ({TEAM.BAD}) - Kill Merlin, win game
          <br />
          Percival ({TEAM.GOOD}) - Sees Morgana and Merlin
          <br />
          Morgana ({TEAM.BAD}) - Appears as Merlin to Percival
          <br />
          Mordred ({TEAM.BAD}) - Not revealed to Merlin
        </p>
      </div>
    );
  }
}

const mapStateToProps = state => {

  const playerList: Player[] = getPlayers(state);
  const playerData: Player = getPlayerData(state);

  return {
    gameId: getGameId(state),
    playerCount: getPlayerCount(state),
    playerList,
    playerData,
    includes: getIncludes(state)
  };
};

export default connect(mapStateToProps)(Lobby);
