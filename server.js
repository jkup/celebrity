var express = require('express');
var app     = express();
var server  = require('http').Server(app);
var io      = require('socket.io')(server);

app.set('view engine', 'jade');
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.render('index', {
    title: 'Celebrity'
  });
});

app.get('/new', function (req, res) {
  res.render('new_game', {
    title: 'New Game'
  });
});

var currentUsers = 0;
var celebrities = [];

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

  // User disconnects, lower user count and distribute
  // new count to all clients
  socket.on('disconnect', function() {
    currentUsers--;
    io.sockets.emit('currentUsers', { users: currentUsers });
  });
});

server.listen(3000);
console.log('Server running at http://localhost:3000');
