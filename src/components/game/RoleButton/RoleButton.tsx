import * as React from "react";
import { connect } from "react-redux";
import { getPlayerData } from "selectors";
import { Player } from "types/types";

interface RoleButtonProps {
  playerData: Player;
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

  // FIXME, props for info
  public roleInfo() {
    const { playerData } = this.props;
    if (this.state.showRole) {
      return (
        <p style={{ fontSize:"12px", float: "left", marginBottom:"0", textAlign: "left" }}>
          Nickname: {playerData.nickName}
          <br />
          Team: {playerData.team}
          <br />
          Role: {playerData.role}
          <br />
          Special:
          <br />
          Team Members:
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
  playerData: getPlayerData(state)
});

export default connect(mapStateToProps)(RoleButton);
