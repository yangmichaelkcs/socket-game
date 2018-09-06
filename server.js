const io = require("socket.io")();
const randomWord = require("random-word");

const port = 8888;
io.listen(port);
var gamesById = {};

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

io.on("connection", socket => {
  // io.emit("UPDATE_COUNT", socketConnectionCount);

  socket.on("disconnect", function() {
    console.log("user disconnected: " + socket.id);
  });

  socket.on("disconnecting", () => {
    const gameId = getGameId(socket);
    let playerCount = gamesById[gameId] && gamesById[gameId].playerCount - 1;
    if (playerCount) {
      io.to(gameId).emit("UPDATE_COUNT", playerCount);
      gamesById[gameId].playerCount = playerCount;
    }
  });

  socket.on("NEW_GAME", function() {
    const newGameId = getRandomWord() + getRandomWord() + getRandomWord();
    const playerCount = 1;
    socket.join(newGameId);
    io.to(newGameId).emit("JOINED_GAME", newGameId);
    io.to(newGameId).emit("UPDATE_COUNT", playerCount);
    gamesById[newGameId] = { playerCount };
    console.log(
      `${
        socket.id
      } started a new game with gameId: ${newGameId} and ${playerCount} players`
    );
    console.log(`current game ids: ${Object.keys(gamesById)}`);
  });

  socket.on("JOIN_GAME", function(gameId) {
    const gameIds = Object.keys(gamesById);
    if (gameIds.includes(gameId)) {
      socket.join(gameId);
      let playerCount = gamesById[gameId].playerCount + 1;
      io.to(gameId).emit("JOINED_GAME", gameId);
      io.to(gameId).emit("UPDATE_COUNT", playerCount);
      gamesById[gameId].playerCount = playerCount;
      console.log(`${socket.id} joined a game with gameId: ${gameId}`);
      console.log(`current game ids: ${Object.keys(gamesById)}`);
    } else {
      console.log(`Game Id ${gameId} does not exist.`);
      // TODO: Add some error handlign here
    }
  });

  socket.on("START_GAME", function() {
    const gameId = getGameId(socket);
    if (gameId) {
      io.to(gameId).emit("GAME_STARTING");
    }
  });
});

console.log("listening on port", port);
