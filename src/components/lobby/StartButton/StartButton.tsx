import * as React from "react";
import { connect } from "react-redux";
import { startGame } from "socket";

class StartButton extends React.Component<any, any> {

    // Checks if player count is between 5-10
    public disableStart() {
      // UNCOMMENT THIS
      // const { playerCount } = this.props;
      // return playerCount < 5 || playerCount > 10;
  
      // FIXME TEMP FOR DEV
      return false
    }
  
    public render() {
      const { onClick } = this.props;
      return <button type="button" className="btn btn-primary" style={{margin:"1rem"}} disabled={this.disableStart()} onClick={onClick}>Start</button>;
    }
}
  
const mapDispatchToProps = dispatch => ({
    onClick: () => {
      startGame();
    }
});
  
export default connect(undefined, mapDispatchToProps)(StartButton);