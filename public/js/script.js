var socket = io.connect('http://localhost:3000');

socket.on('currentUsers', function (data) {
  $('#users').html("Current Users: " + data.users);
});

socket.on('currentCelebs', function(data) {
  data.celebs.forEach(function(celeb) {
    $('#celebrities').append('<li>' + celeb + '</li>');
  });
});

socket.on('newCelebrity', function (data) {
  $('#celebrities').append('<li>' + data.name + '</li>');
});

$('#addCeleb').on('submit', function(e) {
  var celebInput = $('#celebrity');

  e.preventDefault();

  socket.emit('addCeleb', { celeb: celebInput.val() });

  // Clear input
  celebInput.val('');

});
