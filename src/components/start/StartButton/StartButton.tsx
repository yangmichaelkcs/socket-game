import * as React from "react";
import { connect } from "react-redux";
import { createNewGame } from "../../../socket";

class StartButton extends React.Component<any, any> {
    public render() {
        const { onClick } = this.props;
        return <button type="button" className="btn btn-primary" onClick={onClick}>Start Game</button>;
    }
}

const mapDispatchToProps = dispatch => ({
    onClick: () => {
      createNewGame();
    }
});
  
export default connect(undefined, mapDispatchToProps)(StartButton);