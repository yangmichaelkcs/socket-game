import socketIOClient from "socket.io-client";
import { updatePlayerCount } from "actions";

export default class SocketListener {
  constructor(store) {
    this.socket = socketIOClient("http://localhost:8888");

    this.socket.on("UPDATE_COUNT", count => {
      store.dispatch(updatePlayerCount(count));
    });
  }
}
