import * as randomWord from "random-word";
import * as socketIo from "socket.io";

const port = 8888;
const io = socketIo.listen(port);

// Game = {
//   players: [],
//   status: LOBBY|IN_PROGRESS|END
// }

// Player = {
//   socketId: string
//   nickName: string,
//   team: GOOD|BAD,
//   role: string
// }
const gamesById = {};
const teamsByPlayer = {
  2: { good: 1, bad: 1 },
  3: { good: 2, bad: 1 },
  4: { good: 3, bad: 1 },
  5: { good: 4, bad: 1 },
  6: { good: 5, bad: 1 },
  7: { good: 6, bad: 1 },
  8: { good: 7, bad: 1 },
  9: { good: 8, bad: 1 },
  10: { good: 9, bad: 1 }
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getRandomWord() {
  return capitalizeFirstLetter(randomWord());
}

function getGameId(socket) {
  let rooms = Object.keys(socket && socket.rooms);
  return rooms && rooms[rooms.length - 1];
}

function getPlayerCount(gameId) {
  return Object.keys(gamesById[gameId].players).length;
}

function createNewGame() {
  const gameId = getRandomWord() + getRandomWord() + getRandomWord();
  const game = { players: {}, status: "LOBBY" };
  gamesById[gameId] = game;
  return gameId;
}

function addPlayerToGame(gameId, socketId, socket) {
  const player = { socketId: socketId };
  socket.join(gameId);
  gamesById[gameId].players[socketId] = player;
}

function assignRoles(gameId) {}

io.on("connection", socket => {
  socket.on("disconnect", function() {
    console.log("user disconnected: " + socket.id);
  });

  // FIXME: This should only UPDATE_COUNT based on game state
  // If game has not started, it should decrement
  // If game has started we need to implement socket reconnection
  socket.on("disconnecting", () => {
    const gameId = getGameId(socket);
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

    console.log(`${socket.id} started a new game with gameId: ${gameId}`);
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
    const gameId = getGameId(socket);
    if (gameId && gamesById[gameId]) {
      io.to(gameId).emit("GAME_STARTING");
    }
  });
});

console.log("listening on port", port);
