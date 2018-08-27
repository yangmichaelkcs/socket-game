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

io.on("connection", socket => {
  // io.emit("UPDATE_COUNT", socketConnectionCount);

  socket.on("disconnect", function() {
    console.log("user disconnected: " + socket.id);
  });

  socket.on("disconnecting", () => {
    let rooms = Object.keys(socket.rooms);
    const gameId = rooms[rooms.length - 1];
    let playerCount = gamesById[gameId].playerCount - 1;
    io.to(gameId).emit("UPDATE_COUNT", playerCount);
    gamesById[gameId].playerCount = playerCount;
  });

  socket.on("NEW_GAME", function() {
    const newGameId = getRandomWord() + getRandomWord() + getRandomWord();
    const playerCount = 1;
    socket.join(newGameId);
    io.to(newGameId).emit("JOINED_GAME", newGameId);
    io.to(newGameId).emit("UPDATE_COUNT", playerCount);
    gamesById[newGameId] = { playerCount };
    console.log(`${socket.id} started a new game with gameId: ${newGameId}`);
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
});

console.log("listening on port", port);
