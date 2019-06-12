import * as randomWord from "random-word";
import * as socketIo from "socket.io";
import {
  Game,
  Player,
  TEAM,
  GAME_STATUS,
  ROUND_STATUS,
  PLAYER_DISTRIBUTION
} from "./src/types/types";

const port = 8888;
const io = socketIo.listen(port);

const gamesById: { string?: Game } = {};

function capitalizeFirstLetter(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function getRandomWord() {
  return capitalizeFirstLetter(randomWord());
}

const getGameIdBySocket = socket => {
  const rooms = Object.keys(socket && socket.rooms);
  return rooms && rooms[rooms.length - 1];
};

const getGameBySocket = socket => {
  return getGameById(getGameIdBySocket(socket));
};

const getGameById = gameId => {
  return gamesById[gameId];
};

function getPlayerCount(gameId) {
  return Object.keys(gamesById[gameId].players).length;
}

const createNewGame = () => {
  const id = getRandomWord() + getRandomWord() + getRandomWord();
  const game = {
    players: [],
    status: GAME_STATUS.LOBBY,
    id,
    failedVotes: 0,
    currentRound: 1,
    score: [],
    currentPlayerTurn: "",
    rounds: [
      { id: 1, value: null, playersNeeded: 3 },
      { id: 2, value: null, playersNeeded: 2 },
      { id: 3, value: null, playersNeeded: 2 },
      { id: 4, value: null, playersNeeded: 2 },
      { id: 5, value: null, playersNeeded: 2 }
    ],
    votes: [0, 0],
    roundStatus: ROUND_STATUS.PROPOSING_TEAM
  };
  gamesById[id] = game;
  return id;
};

const addPlayerToGame = (gameId, socket) => {
  const player: Player = {
    socketId: socket.id,
    nickName: `Random ${getRandomWord()}`,
    role: "DETECTIVE USELESS",
    selected: 0
  };
  socket.join(gameId);
  getGameById(gameId).players.push(player);
};

const getPlayerBySocket = socket => {
  const game = getGameBySocket(socket);
  return game.players.find(player => player.socketId === socket.id);
};

const updatePlayerName = (socket, nickName) => {
  const player: Player = getPlayerBySocket(socket);
  player.nickName = nickName;
};

const updatePlayerSelected = (socket, socketId, selected) => {
  const playerSelected = getGameBySocket(socket).players.find(
    player => player.socketId === socketId
  );
  playerSelected.selected = selected;
};

const nextRoundStatus = roundStatus => {
  let nextStatus;
  switch(roundStatus) {
    case ROUND_STATUS.PROPOSING_TEAM:
      nextStatus = ROUND_STATUS.VOTING_TEAM;
      break;
    case ROUND_STATUS.VOTING_TEAM:
      nextStatus = ROUND_STATUS.VOTING_END;
      break;
    case ROUND_STATUS.VOTING_END:
      nextStatus = ROUND_STATUS.MISSION_IN_PROGRESS;
      break;
    case ROUND_STATUS.MISSION_IN_PROGRESS:
      nextStatus = ROUND_STATUS.MISSION_END;
      break;
    case ROUND_STATUS.MISSION_END:
      nextStatus = ROUND_STATUS.PROPOSING_TEAM;
      break;
  }
  return nextStatus;
}

const updateRoundStatus = socket => {
  const game: Game = getGameBySocket(socket);
  game.roundStatus = nextRoundStatus(game.roundStatus);
};

const startGame = (gameId: string) => {
  const game: Game = gamesById[gameId];
  game.status = GAME_STATUS.IN_PROGRESS;
  game.roundStatus = ROUND_STATUS.PROPOSING_TEAM;
  game.players = shuffle(game.players);
  game.currentPlayerTurn = game.players[0].socketId;
  game.failedVotes = 0;
  game.currentRound = 1;
  game.score = [];
};

const shuffle = (players: Player[]): Player[] => {
  let currentIndex = players.length;
  let temporaryValue;
  let randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = players[currentIndex];
    players[currentIndex] = players[randomIndex];
    players[randomIndex] = temporaryValue;
  }

  return players;
};

const assignRoles = (gameId: string) => {
  const players: Player[] = gamesById[gameId].players;
  const playerKeys = Object.keys(players);
  playerKeys.forEach(playerId => {
    const player: Player = players[playerId];
    player.team = TEAM.GOOD;
  });
};

const updateNegVote = (socket, vote) => {
  const game: Game = getGameBySocket(socket);
  game.votes[1]+= vote;
}

const updatePosVote = (socket, vote) => {
  const game: Game = getGameBySocket(socket);
  game.votes[0]+= vote;
}

const resetVote = socket => {
  const game: Game = getGameBySocket(socket);
  game.votes[0] = 0;
  game.votes[1] = 0;
}

const checkVoteCount = socket => {
  const game: Game = getGameBySocket(socket);
  if(game.roundStatus == ROUND_STATUS.VOTING_TEAM) {
    if(game.votes[0] + game.votes[1] == game.players.length)
    {
      updateRoundStatus(socket);
    }
  } 
}

io.on("connection", socket => {
  socket.on("disconnect", function() {
    console.log("user disconnected: " + socket.id);
  });

  // FIXME: This should only UPDATE_COUNT based on game state
  // If game has not started, it should decrement
  // If game has started we need to implement socket reconnection
  socket.on("disconnecting", () => {
    const gameId = getGameIdBySocket(socket);
    if (gameId && gamesById[gameId]) {
      delete gamesById[gameId].players[socket.id];
    }
  });

  // Creates a new game with the player who made the game
  socket.on("NEW_GAME", () => {
    const gameId: string = createNewGame();
    addPlayerToGame(gameId, socket);
    io.to(gameId).emit("JOINED_GAME", getGameById(gameId));
    socket.emit("SET_SOCKET_ID", socket.id);

    console.log(`${socket.id} created a new game with gameId: ${gameId}`);
  });

  // Joins an existing game based on game id
  socket.on("JOIN_GAME", gameId => {
    const gameIds = Object.keys(gamesById);
    if (gameIds.includes(gameId)) {
      addPlayerToGame(gameId, socket);

      io.to(gameId).emit("JOINED_GAME", getGameById(gameId));
      socket.emit("SET_SOCKET_ID", socket.id);

      console.log(`${socket.id} joined a game with gameId: ${gameId}`);
    } else {
      console.log(`Game Id ${gameId} does not exist.`);
      // TODO: Add some error handling here
    }
  });

  socket.on("START_GAME", () => {
    const gameId = getGameIdBySocket(socket);
    if (gameId && gamesById[gameId]) {
      assignRoles(gameId);
      startGame(gameId);
      io.to(gameId).emit("GAME_STARTING", getGameById(gameId));
    }
  });

  socket.on("UPDATE_NICKNAME", (nickName: string) => {
    updatePlayerName(socket, nickName);
    const gameId = getGameIdBySocket(socket);
    io.to(gameId).emit("UPDATE_GAME_STATE", getGameById(gameId));
  });

  socket.on("PICK_PLAYER", (socketId: string, selected: number) => {
    updatePlayerSelected(socket, socketId, selected);
    const gameId = getGameIdBySocket(socket);
    io.to(gameId).emit("UPDATE_GAME_STATE", getGameById(gameId));
  });

  socket.on("PROPOSE_TEAM", () => {
    updateRoundStatus(socket);
    const gameId = getGameIdBySocket(socket);
    io.to(gameId).emit("UPDATE_GAME_STATE", getGameById(gameId));
  });

  socket.on("UPDATE_NEG_VOTE", (vote : number) => {
    updateNegVote(socket, vote);
    checkVoteCount(socket);
    const gameId = getGameIdBySocket(socket);
    io.to(gameId).emit("UPDATE_GAME_STATE", getGameById(gameId));
  });

  socket.on("UPDATE_POS_VOTE", (vote : number) => {
    updatePosVote(socket, vote);
    checkVoteCount(socket);
    const gameId = getGameIdBySocket(socket);
    io.to(gameId).emit("UPDATE_GAME_STATE", getGameById(gameId));
  });

});

console.log("listening on port", port);
