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

  socket.on('roomCreated', function(data) {
    window.location = 'http://localhost:3000/game/' + data.roomName;
  });

  socket.on('roomFailed', function(data) {
    $('#error').text('Error: That room already exists.');
  })
})();
