/* tslint:disable:no-unused-expression */
import * as React from "react";
import { Provider } from "react-redux";
import { createStore, compose } from "redux";
import rootReducer from "./reducers";
import StartGame from "./components/start";
import { SocketListener } from "./socket";
import "./App.css";

const enhancers = compose(
  (window as any).devToolsExtension
    ? (window as any).devToolsExtension()
    : f => f
);
const store = createStore(rootReducer, enhancers);
new SocketListener(store);

class App extends React.Component {
  public render() {
    return (
      <Provider store={store}>
        <StartGame />
      </Provider>
    );
  }
}

export default App;
