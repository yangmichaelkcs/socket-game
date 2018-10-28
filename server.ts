import * as randomWord from "random-word";
import * as socketIo from "socket.io";

const port = 8888;
const io = socketIo.listen(port);

enum GAME_STATUS {
  LOBBY = "LOBBY",
  IN_PROGRESS = "IN_PROGRESS",
  END = "END"
}

enum TEAM {
  GOOD = "GOOD",
  BAD = "BAD"
}

interface Game {
  players: Player[];
  status: GAME_STATUS;
  currentRound: number;
  score: number[];
  failedVotes: number;
  currentPlayerTurn: string;
}

interface Player {
  socketId: string;
  nickName: string;
  team: TEAM;
  role: string;
}

const gamesById: { string?: Game } = {};

const teamCountByTotalPlayers = {
  2: { good: 1, bad: 1 },
  3: { good: 2, bad: 1 },
  4: { good: 3, bad: 1 },
  5: { good: 4, bad: 1 },
  6: { good: 5, bad: 2 },
  7: { good: 6, bad: 2 },
  8: { good: 7, bad: 2 },
  9: { good: 8, bad: 3 },
  10: { good: 9, bad: 3 }
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getRandomWord() {
  return capitalizeFirstLetter(randomWord());
}

function getGameIdBySocket(socket) {
  let rooms = Object.keys(socket && socket.rooms);
  return rooms && rooms[rooms.length - 1];
}

const getGameBySocket = socket => {
  return getGameById(getGameIdBySocket(socket));
};

const getGameById = gameId => {
  return gamesById[gameId];
};

function getPlayerCount(gameId) {
  return Object.keys(gamesById[gameId].players).length;
}

function createNewGame() {
  const gameId = getRandomWord() + getRandomWord() + getRandomWord();
  const game = { players: [], status: "LOBBY" };
  gamesById[gameId] = game;
  return gameId;
}

function addPlayerToGame(gameId, socketId, socket) {
  const player = { socketId: socketId };
  socket.join(gameId);
  gamesById[gameId].players.push(player);
}

const startGame = (gameId: string) => {
  const game: Game = gamesById[gameId];
  game.status = GAME_STATUS.IN_PROGRESS;
  game.players = shuffle(game.players);
  game.currentPlayerTurn = game.players[0].socketId;
  game.failedVotes = 0;
  game.currentRound = 1;
  game.score = [];
};

const shuffle = (players: Player[]) => {
  let currentIndex = players.length,
    temporaryValue,
    randomIndex;

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
      io.to(gameId).emit("UPDATE_COUNT", getPlayerCount(gameId));
    }
  });

  // Creates a new game with the player who made the game
  socket.on("NEW_GAME", function() {
    const gameId: string = createNewGame();
    addPlayerToGame(gameId, socket.id, socket);
    io.to(gameId).emit("JOINED_GAME", gameId);
    io.to(gameId).emit("UPDATE_COUNT", getPlayerCount(gameId));

    console.log(`${socket.id} created a new game with gameId: ${gameId}`);
  });

  // Joins an existing game based on game id
  socket.on("JOIN_GAME", function(gameId) {
    const gameIds = Object.keys(gamesById);
    if (gameIds.includes(gameId)) {
      addPlayerToGame(gameId, socket.id, socket);

      io.to(gameId).emit("JOINED_GAME", gameId);
      io.to(gameId).emit("UPDATE_COUNT", getPlayerCount(gameId));

      console.log(`${socket.id} joined a game with gameId: ${gameId}`);
    } else {
      console.log(`Game Id ${gameId} does not exist.`);
      // TODO: Add some error handling here
    }
  });

  socket.on("START_GAME", function() {
    const gameId = getGameIdBySocket(socket);
    if (gameId && gamesById[gameId]) {
      assignRoles(gameId);
      startGame(gameId);
      io.to(gameId).emit("GAME_STARTING", getGameById(gameId));
    }
  });
});

console.log("listening on port", port);
