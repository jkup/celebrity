var socket = io.connect('http://localhost:3000');
var celebCount = 0;

socket.on('currentUsers', function (data) {
  $('#users').html("Total users playing: " + data.users);
});

socket.on('currentCelebs', function(data) {
  data.celebs.forEach(function(celeb) {
    $('#celebrities').append('<li>' + celeb + '</li>');
    $('#celebrity-count').html("Celebrities added: " + data.celebs.length);
  });
});

socket.on('newCelebrity', function (data) {
  $('#celebrities').append('<li>' + data.name + '</li>');
  $('#celebrity-count').html("Celebrities added: " + data.count);
});

$('#addCeleb').on('submit', function(e) {
  var celebInput = $('#celebrity');
  var currentRoom = Cookies.get('roomName');

  e.preventDefault();

  socket.emit('addCeleb', { roomName: currentRoom, celeb: celebInput.val() });

  celebCount++;

  $('#namesNeeded').text(3 - celebCount + ' ');

  // When you've added your last celeb
  if (celebCount > 2) {
    window.location = 'http://localhost:3000/game/' + currentRoom + '/2';
  }

  // Clear input
  celebInput.val('');

});
