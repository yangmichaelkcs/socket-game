import * as React from "react";
import { connect } from "react-redux";
import { joinGame } from "socket";
import { GAME_STATUS } from 'types/types';

class JoinButton extends React.Component<any, any> {
    constructor(props) {
      super(props);
      this.state = { 
        value: "", 
      };
  
      this.handleChange = this.handleChange.bind(this);
      this.handleClick = this.handleClick.bind(this);
    }
    
    // When join game input box changes value gets updated
    public handleChange(event) {
      this.setState({ value: event.target.value });
    }
  
    // When join game is clicked will set tooltip(invalidGame) to display, if game exists will go to Lobby, else tooltip will display
    public handleClick() {
      joinGame(this.state.value);
    }
    
    // Tooltip
    public showNotExists() {
      if(this.props.currentPage === GAME_STATUS.NON_EXIST) {
        return (
          <span className="Warning">This Game ID does not exist</span>
        );
      } 
    }
  
    public render() {
      return (
        <div>
          <div>
            <div className="input-group mb-3">
              <input type="text" value={this.state.value} onChange={this.handleChange}
                     placeholder="Game ID" className="form-control" />
              <div className="input-group-append">
                <button type="button" className="btn btn-primary" onClick={this.handleClick}>Join Game</button>
              </div>
            </div>
          </div>
          <span>{this.showNotExists()}</span>
        </div>
      );
    }
}
  
const mapDispatchToProps = dispatch => ({});
  
export default connect(undefined,mapDispatchToProps)(JoinButton);