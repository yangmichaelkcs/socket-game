import { FaRegUser, FaUser, FaThumbsUp, FaThumbsDown, FaTimes, FaCheck } from 'react-icons/fa'
import * as React from "react";
import { connect } from "react-redux";
import { getGameId } from "../../../selectors";

interface LegendStateProps {
  gameId: string
}

class Legend extends React.Component<any, any> {
  public render() {
    return (
      <div className="Legend LegendText container">
        <div className="row">
          <div className="col">Game Id: {this.props.gameId}</div>
          <div className="w-100"/>
          <div className="col"><FaRegUser/>Unselected Player</div>
          <div className="col"><FaUser className="PlayerPicked"/>Selected Player</div>
          <div className="w-100"/>
          <div className="col"><FaThumbsUp className="Thumbsup"/>Approved Team</div>
          <div className="col"><FaThumbsDown className="Thumbsdown"/>Rejected Team</div>
          <div className="w-100"/>
          <div className="col"><FaCheck className="Success"/>Mission Success</div>
          <div className="col"><FaTimes className="Fail"/>Mission Fail</div>
      </div>
    </div>
    );
  }
}

const mapStateToProps = state => {
  const gameId: string = getGameId(state);

  return {
    gameId
  };
};

export default connect(mapStateToProps)(Legend);