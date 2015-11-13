var express = require('express');
var app     = express();
var server  = require('http').Server(app);
var io      = require('socket.io')(server);

// Application variables
var currentUsers = 0;
var celebrities  = [];
var roomsNames   = [];

app.set('view engine', 'jade');
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.render('index', {
    title: 'Celebrity'
  });
});

app.get('/game/:gameId', function (req, res) {
  var game = req.params.gameId;

  // if the room exists, take the user to it
  if (roomsNames.indexOf(game) !== -1) {
    res.render('step_one', {
      roomName: game
    });
    // otherwise take them back to the home page
  } else {
    res.render('index', {
      title: 'Celebrity',
      error: 'That room doesn\'t exist.'
    });
  }
});

io.on('connection', function (socket) {
  // New user connects, up user count and distribute
  // new count to all clients
  currentUsers++;
  io.sockets.emit('currentUsers', { users: currentUsers });

  if (celebrities.length > 0) {
    socket.emit('currentCelebs', { celebs: celebrities });
  }

  // When a new celebrity is added, push new celebrity
  // to all clients
  socket.on('addCeleb', function (data) {
    var celebToAdd = data.celeb;

    celebrities.push(celebToAdd);
    io.emit('newCelebrity', { name: celebToAdd, count: celebrities.length });
  });

  socket.on('newRoom', function(data) {
    var roomName = data.roomName;
    if (roomsNames.indexOf(roomName) === -1) {
      roomsNames.push(roomName);
      socket.emit('roomCreated', { roomName: roomName });
    } else {
      socket.emit('roomFailed', { message: 'That room already exists' });
    }
  });

  socket.on('joinRoom', function(data) {
    var roomName = data.roomName;
    if (roomsNames.indexOf(roomName) !== -1) {
      socket.emit('roomCreated', { roomName: roomName });
    } else {
      socket.emit('roomFailed', { message: 'That room doesn\'t exist' });
    }
  });

  // User disconnects, lower user count and distribute
  // new count to all clients
  socket.on('disconnect', function() {
    currentUsers--;
    io.sockets.emit('currentUsers', { users: currentUsers });
  });
});

server.listen(3000);
console.log('Server running at http://localhost:3000');
