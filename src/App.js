import React, { 
  Component
} from 'react';
import socketIOClient  from 'socket.io-client';
import logo from './logo.svg';
import './App.css';

const SOCKET = socketIOClient('http://localhost:8888');

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      playerCount: 0
    };
  }

  render() {
    SOCKET.on('UPDATE_COUNT', (count) => {
      this.setState({
        playerCount: this.state.playerCount + count
      })
    })

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <h2> {this.state.playerCount} players have connected </h2>
      </div>
    );
  }
}

export default App;
