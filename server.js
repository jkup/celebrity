var express = require('express');
var app     = express();
var server  = require('http').Server(app);

var game = { totalUsers: 0, rooms: {} };

var sockets = require('./lib/sockets.js')(server, game);

app.set('view engine', 'jade');
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.render('game_creation', {
    title: 'Celebrity'
  });
});

app.get('/game/:gameId/1', function (req, res) {
  var gameToJoin = req.params.gameId;

  // if the room exists, take the user to it
  if (gameToJoin in game.rooms) {
    res.render('adding_celebs', {
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

app.get('/game/:gameId/2', function (req, res) {
  var gameToJoin = req.params.gameId;

  // if the room exists, take the user to it
  if (gameToJoin in game.rooms) {
    res.render('game_watch_mode', {
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

server.listen(3000);
console.log('Server running at http://localhost:3000');
