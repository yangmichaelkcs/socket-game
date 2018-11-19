import * as io from "socket.io-client";
import { setGameData } from "../actions";
import { setSocketId } from "../actions";

const socket = io("http://localhost:8888");
export class SocketListener {
  constructor(store) {
    socket.on("JOINED_GAME", game => {
      store.dispatch(setGameData(game));
    });

    socket.on("GAME_STARTING", game => {
      store.dispatch(setGameData(game));
    });

    socket.on("SET_SOCKET_ID", socketId => {
      store.dispatch(setSocketId(socketId));
    });
  }
}

export const createNewGame = () => {
  console.log("Client creating a new game");
  socket.emit("NEW_GAME");
};

export const joinGame = gameId => {
  console.log(`Client joining game with id ${gameId}`);
  socket.emit("JOIN_GAME", gameId);
};

export const startGame = () => {
  console.log(`Client started game`);
  socket.emit("START_GAME");
};
