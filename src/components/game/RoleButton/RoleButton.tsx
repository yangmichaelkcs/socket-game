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

  // Show or Hides role info
  public handleClick() {
    this.setState(prevState => ({
      showRole: !prevState.showRole
    }));
  }

  // Displys team icon based on team
  public displayTeamIcon() {
    const { playerData } = this.props;
    return playerData.team === TEAM.GOOD ? <FaChessKnight className="Knight"/> : <FaSkull className="Spy"/>;
  }

  // Displays team members depending on role
  public displayTeamMembers() {
    const { playerData, players } = this.props;
    if( playerData.team === TEAM.BAD) {
      const spies = players.filter(player => player.team === TEAM.BAD && player.socketId !== playerData.socketId)
      return spies.map(spy => spy.nickName).join(', ')
    } else {
      return "???";
    } 
  }

  // Returns the role information
  public roleInfo() {
    const { playerData } = this.props;
    if (this.state.showRole) {
      return (
        <p style={{ fontSize:"13px", float: "left", marginBottom:"0", textAlign: "left", maxWidth: "80%" }}>
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
        <div style={{float: "right"}}>
          <button type="button" className="RoleButton btn btn-outline-secondary btn-lg" onClick={this.handleClick}>
            {this.state.showRole ? "Hide" : "Show "}
          </button>
        </div>
        {this.roleInfo()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  playerData: getPlayerData(state),
  players: getPlayers(state)
});

export default connect(mapStateToProps)(RoleButton);
