module.exports = function Sockets(server, game) {
  var io = require('socket.io')(server, game);

  io.on('connection', function (socket) {
    // New user connects, up user count and distribute
    // new count to all clients
    game.totalUsers++;
    io.sockets.emit('totalUsers', { users: game.totalUsers });

    // When a new celebrity is added, push new celebrity
    // to all clients
    socket.on('addCeleb', function (data) {
      var celebToAdd = data.celeb;
      var roomToAddTo = data.roomName;
      var celebrities = game.rooms[roomToAddTo].celebrities;

      celebrities.push(celebToAdd);
      io.emit('newCelebrity', { name: celebToAdd, count: celebrities.length });
    });

    socket.on('newRoom', function(data) {
      var roomName = data.roomName;

      if (roomName in game.rooms) {
        socket.emit('roomFailed', { message: 'That room already exists' });
      } else {
        game.rooms[roomName] = { currentUsers: 0, celebrities: [] };
        socket.emit('roomCreated', { roomName: roomName });
      }
    });

    socket.on('joinRoom', function(data) {
      var roomName = data.roomName;

      if (roomName in game.rooms) {
        socket.emit('roomJoined', { roomName: roomName });
      } else {
        socket.emit('roomFailed', { message: 'That room doesn\'t exist' });
      }
    });

    // User disconnects, lower user count and distribute
    // new count to all clients
    socket.on('disconnect', function() {
      game.totalUsers--;
      io.sockets.emit('totalUsers', { users: game.totalUsers });
    });
  });
};
