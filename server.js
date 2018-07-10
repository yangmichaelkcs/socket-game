const io = require("socket.io")();
const randomWord = require("random-word");

const port = 8888;
io.listen(port);
var socketConnectionCount = 0;
var gameIds = [];

io.on("connection", client => {
  console.log("a user connected:" + client.id);

  socketConnectionCount++;
  io.emit("UPDATE_COUNT", socketConnectionCount);

  client.on("disconnect", function() {
    console.log("user disconnected: " + client.id);
    io.emit("server message", "socket " + client.id + " disconnected");
    socketConnectionCount--;
    console.log(socketConnectionCount);
  });

  client.on("NEW_GAME", function(msg) {
    const newGameId = randomWord() + randomWord() + randomWord();
    gameIds.push(newGameId);
    client.join(newGameId);
  });
});

console.log("listening on port", port);
