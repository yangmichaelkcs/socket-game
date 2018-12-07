import React, { Component } from "react";

class SingleResult extends Component {

  componentDidMount() {
    return this.props.onComponentDidMount && this.props.onComponentDidMount();
  }

  render(){
    return (
      <div className="singleResult">
          {this.props.value}
      </div>
    );
  }
}

export default SingleResult;