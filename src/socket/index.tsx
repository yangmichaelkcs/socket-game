import * as io from "socket.io-client";
import { updatePlayerCount, setGameId } from "../actions";
import { navigateTo } from "../actions";

const socket = io("http://localhost:8888");
export class SocketListener {
  constructor(store) {
    socket.on("JOINED_GAME", gameId => {
      store.dispatch(setGameId(gameId));
    });

    socket.on("UPDATE_COUNT", count => {
      store.dispatch(updatePlayerCount(count));
    });

    socket.on("GAME_STARTING", game => {
      console.log("Game starting for everyone hopefully");
      store.dispatch(navigateTo("game"));
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
