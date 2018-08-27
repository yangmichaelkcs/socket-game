import React, { Component } from "react";
import { Provider } from "react-redux";
import { createStore, compose } from "redux";
import rootReducer from "./reducers";
import StartGame from "./components/start";
import { SocketListener } from "socket";
import "./App.css";

const enhancers = compose(
  window.devToolsExtension ? window.devToolsExtension() : f => f
);
const store = createStore(rootReducer, enhancers);
new SocketListener(store);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <StartGame />
      </Provider>
    );
  }
}

export default App;
