import * as React from "react";
import { connect } from "react-redux";
import { startGameIncludes } from "../../../socket";
import { getIncludes } from '../../../selectors';

class StartButton extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  // Checks if player count is between 5-10 or not enough evil players
  public disableStart() {
    const { playerCount, disableStart } = this.props;
    return playerCount < 5 || playerCount > 10 || disableStart
  }
    
  public handleClick() {
    startGameIncludes(this.props.includes);
  }

  public render() {
    return <button type="button" className="btn btn-primary" style={{margin:"1rem"}} disabled={this.disableStart()} onClick={this.handleClick}>Start</button>;
  }
}

const mapStateToProps = state => {
  return {
    includes: getIncludes(state)
  };
};
 
export default connect(mapStateToProps)(StartButton);