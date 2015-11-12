var socket = io.connect('http://localhost:3000');

socket.on('currentUsers', function (data) {
  $('#users').html("Current users: " + data.users);
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

  e.preventDefault();

  socket.emit('addCeleb', { celeb: celebInput.val() });

  // Clear input
  celebInput.val('');

});
