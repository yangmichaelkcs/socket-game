import * as React from "react";
import { connect } from "react-redux";
import { getPlayerData } from "selectors";
import { Player, ROUND_STATUS } from "types/types";
import SingleResult from '../SingleResult';


class RoundResult extends React.Component<any, any> {
    constructor(props) {
      super(props);
      this.state = { 
        displayFifth: false,
        displayFourth: false,
        displaySecond: false,
        displayThird: false,
      };
      this.displaySecond = this.displaySecond.bind(this)
      this.displayThird = this.displayThird.bind(this)
      this.displayFourth = this.displayFourth.bind(this)
      this.displayFifth = this.displayFifth.bind(this)
    }


  public displaySecond() {
    if(this.props.roundStatus === ROUND_STATUS.MISSION_END)
    {
      setTimeout(() => {
        this.setState({ displaySecond: true })
        }, 1500) 
    }
    else
    {
      this.setState({ displaySecond: true });         
    }
  }

  public displayThird() {
    if(this.props.roundStatus === ROUND_STATUS.MISSION_END)
    {
      setTimeout(() => {
        this.setState({ displayThird: true })
        }, 1500) 
    }
    else
    {
      this.setState({ displayThird: true });
    }
  }

  public displayFourth() {
    if(this.props.roundStatus === ROUND_STATUS.MISSION_END)
    {
      setTimeout(() => {
        this.setState({ displayFourth: true })
        }, 1500) 
    }
    else
    {
      this.setState({ displayFourth: true });
    }
  }

  public displayFifth() {
    if(this.props.roundStatus === ROUND_STATUS.MISSION_END)
    {
      setTimeout(() => {
        this.setState({ displayFifth: true })
        }, 1500)
    } 
    else
    {
     this.setState({ displayFifth: true });
    }
  }
  
  public renderResult(num) { 
    return num <= this.props.playersNeeded;     
  }

  public render(){
    return (
      <div className="RoundResult">
        <h2>
          Round Results:
        </h2>
          <div className="RoundResultItems">
            <SingleResult 
              id={1} 
              value={this.props.votes[0]} 
              onComponentDidMount={this.displaySecond} 
            />
            {this.renderResult(2) && this.state.displaySecond && 
              <SingleResult 
                id={2} 
                value={this.props.votes[1]} 
                onComponentDidMount={this.displayThird} 
              />
            }
            {this.renderResult(3) && this.state.displayThird && 
              <SingleResult 
                id={3} 
                value={this.props.votes[2]} 
                onComponentDidMount={this.displayFourth} 
              />
            }
            {this.renderResult(4) && this.state.displayFourth && 
              <SingleResult 
                id={4} 
                value={this.props.votes[3]} 
                onComponentDidMount={this.displayFifth} 
              />
            }
            {this.renderResult(5) && this.state.displayFifth && 
              <SingleResult 
                id={5} 
                value={this.props.votes[4]} 
              />
            }
          </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
    playerData: getPlayerData(state)
  });

export default connect(mapStateToProps)(RoundResult);
