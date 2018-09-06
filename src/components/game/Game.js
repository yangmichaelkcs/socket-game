import React, { Component } from "react";
import { connect } from "react-redux";

class Game extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="Game">
        <h2>This the game</h2>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(Game);
