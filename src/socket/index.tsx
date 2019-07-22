import * as io from "socket.io-client";
import { setGameData, navigateTo } from "../actions";
import { setSocketId } from "../actions";

const socket = io("https://socket-game.herokuapp.com");
export class SocketListener {
  constructor(store) {
    socket.on("JOINED_GAME", game => {
      store.dispatch(setGameData(game));
    });

    socket.on("GAME_STARTING", game => {
      store.dispatch(setGameData(game));
    });

    socket.on("UPDATE_GAME_STATE", game => {
      store.dispatch(setGameData(game));
    });

    socket.on("SET_SOCKET_ID", socketId => {
      store.dispatch(setSocketId(socketId));
    });

    socket.on("NAV_MAIN_MENU", destination => {
      store.dispatch(navigateTo(destination));
    });
  }
}

export const createNewGame = () => {
  console.log("Client creating a new game");
  socket.emit("NEW_GAME");
};

export const mainMenu = () => {
  console.log("Client leaving game to Main menu");
  socket.emit("MAIN_MENU");
};

export const joinGame = gameId => {
  console.log(`Client joining game with id ${gameId}`);
  socket.emit("JOIN_GAME", gameId);
};

export const startGame = () => {
  console.log(`Client started game`);
  socket.emit("START_GAME");
};

export const startGameIncludes = (includes : boolean[]) => {
  console.log(`Client started game`);
  socket.emit("START_GAME", includes);
};

export const updateNickName = (nickName: string) => {
  socket.emit("UPDATE_NICKNAME", nickName);
};

export const pickPlayer = (socketId: string, selected: number) => {
  socket.emit("PICK_PLAYER", socketId, selected);
};

export const proposeTeam = () => {
  socket.emit("PROPOSE_TEAM");
};

export const killMerlin = () => {
  socket.emit("KILL_MERLIN");
};

export const updateTeamVote = (vote: number, playerId: string) => {
  socket.emit("UPDATE_TEAM_VOTE", vote, playerId);
};

export const updateMissionVote = (vote: number) => {
  socket.emit("UPDATE_MISSION_VOTE", vote);
};

export const rejoinGame = (nickname: string) => {
  socket.emit("REJOIN_GAME", nickname);
};

export const updateIncludes = (index : number) => {
  socket.emit("UPDATE_INCLUDES", index);
};

