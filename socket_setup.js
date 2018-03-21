/**
 * Set up Socket connection
 */

function socketSetup(socket, server) {
  io = socket(server);
  var socketConnectionCount = 0;
  io.on('connection', function(socket){
    console.log('a user connected:' + socket.id);
    io.emit('server message', 'socket ' + socket.id + ' connected');
    socketConnectionCount++;
    console.log(socketConnectionCount);
    io.emit('update count', socketConnectionCount);

    socket.on('disconnect', function(){
      console.log('user disconnected: ' + socket.id);
      io.emit('server message', 'socket ' + socket.id + ' disconnected');
      socketConnectionCount--;
      console.log(socketConnectionCount);
    });

    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
  });
}

module.exports = socketSetup;