var express = require('express');
var app     = express();
var server  = require('http').Server(app);
var io      = require('socket.io')(server);

app.set('view engine', 'jade');
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello World!'});
});

io.on('connection', function (socket) {
  socket.on('addCelebrity', function (data) {
    // Add to database
    io.emit('newCelebrity', { name: data.name });
  });
});

server.listen(3000);
console.log('Server running at http://localhost:3000');
