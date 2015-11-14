var express = require('express');
var app     = express();
var server  = require('http').Server(app);
var io      = require('socket.io')(server);

// Application variables
var game = {
  totalUsers: 0,
  rooms: {}
}

app.set('view engine', 'jade');
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.render('game_creation', {
    title: 'Celebrity'
  });
});

app.get('/game/:gameId', function (req, res) {
  var gameToJoin = req.params.gameId;

  console.log('do i get in here');
  // if the room exists, take the user to it
  if (gameToJoin in game.rooms) {
    res.render('step_one', {
      roomName: gameToJoin
    });
    // otherwise take them back to the home page
  } else {
    res.render('game_creation', {
      title: 'Celebrity',
      error: 'That room doesn\'t exist.'
    });
  }
});

app.get('/game/:gameId/admin', function (req, res) {
  var gameToJoin = req.params.gameId;

  // if the room exists, take the user to it
  if (gameToJoin in game.rooms) {
    res.render('admin', {
      roomName: gameToJoin
    });
    // otherwise take them back to the home page
  } else {
    res.render('game_creation', {
      title: 'Celebrity',
      error: 'That roooom doesn\'t exist.'
    });
  }
});

io.on('connection', function (socket) {
  // New user connects, up user count and distribute
  // new count to all clients
  game.totalUsers++;
  io.sockets.emit('totalUsers', { users: game.totalUsers });

  // When a new celebrity is added, push new celebrity
  // to all clients
  socket.on('addCeleb', function (data) {
    var celebToAdd = data.celeb;

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

server.listen(3000);
console.log('Server running at http://localhost:3000');
