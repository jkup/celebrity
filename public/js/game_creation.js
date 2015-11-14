(function() {
  var socket = io.connect('http://localhost:3000');

  $('#start-game').on('click', function(e) {
    e.preventDefault();

    var $createVal = $('#create').val();

    if ($createVal.length === 0 ) {
      $('#formError').text('Error: You must enter a room name.');
    } else {
      socket.emit('newRoom', { roomName: $createVal });
    }
  });

  $('#join-game').on('click', function(e) {
    e.preventDefault();

    var $joinVal = $('#join').val();

    socket.emit('joinRoom', { roomName: $joinVal });
  });

  socket.on('currentUsers', function (data) {
    $('#users').html("Total users playing: " + data.users);
  });

  socket.on('roomCreated', function(data) {
    window.location = 'http://localhost:3000/game/' + data.roomName + '/admin';
  });

  socket.on('roomJoined', function(data) {
    Cookies.set('roomName', data.roomName);
    window.location = 'http://localhost:3000/game/' + data.roomName + '/1';
  });

  socket.on('roomFailed', function(data) {
    $('#error').text('Error: ' + data.message);
  })
})();
