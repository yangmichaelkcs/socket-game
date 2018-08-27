import socketIOClient from "socket.io-client";
import { updatePlayerCount, setGameId } from "actions";

const socket = socketIOClient("http://localhost:8888");
export class SocketListener {
  constructor(store) {
    socket.on("JOINED_GAME", gameId => {
      store.dispatch(setGameId(gameId));
    });

    socket.on("UPDATE_COUNT", count => {
      store.dispatch(updatePlayerCount(count));
    });
  }
}

export const startNewGame = () => {
  console.log("Client starting a new game");
  socket.emit("NEW_GAME");
};

export const joinGame = gameId => {
  console.log(`Client joining game with id ${gameId}`);
  socket.emit("JOIN_GAME", gameId);
};
