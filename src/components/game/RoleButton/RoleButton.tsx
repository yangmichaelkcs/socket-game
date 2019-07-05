import { FaChessKnight, FaSkull } from 'react-icons/fa'
import * as React from "react";
import { connect } from "react-redux";
import { getPlayerData, getPlayers } from "selectors";
import { Player, TEAM } from "types/types";

interface RoleButtonProps {
  playerData: Player;
  players: Player[];
}

interface RoleButtonState {
  showRole: boolean;
}

class RoleButton extends React.Component<RoleButtonProps, RoleButtonState> {
  constructor(props) {
    super(props);
    this.state = { showRole: true };
    this.handleClick = this.handleClick.bind(this);
  }

  public handleClick() {
    this.setState(prevState => ({
      showRole: !prevState.showRole
    }));
  }

  public displayTeamIcon() {
    const { playerData } = this.props;
    return playerData.team === TEAM.GOOD ? <FaChessKnight className="Knight"/> : <FaSkull className="Spy"/>;
  }

  public displayTeamMembers() {
    const { playerData, players } = this.props;
    if( playerData.team === TEAM.BAD) {
      const spies = players.filter(player => player.team === TEAM.BAD && player.socketId !== playerData.socketId)
      return spies.map(spy => spy.nickName).join(' ,')
    } else {
      return "???";
    } 
  }

  public roleInfo() {
    const { playerData } = this.props;
    if (this.state.showRole) {
      return (
        <p style={{ fontSize:"13px", float: "left", marginBottom:"0", textAlign: "left" }}>
          Nickname: {playerData.nickName}
          <br />
          Team: {playerData.team} {this.displayTeamIcon()}
          <br />
          Role: {playerData.role}
          <br />
          Special:
          <br />
          Teammates: {this.displayTeamMembers()}
        </p>
      );
    }
  }

  public render() {
    return (
      <div className="Role">
        {this.roleInfo()}
        <div style={{float: "right"}}>
        <button type="button" className="RoleButton btn btn-outline-secondary btn-lg" onClick={this.handleClick}>
          {this.state.showRole ? "Hide" : "Show "}
        </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  playerData: getPlayerData(state),
  players: getPlayers(state)
});

export default connect(mapStateToProps)(RoleButton);
