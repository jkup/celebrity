var socket        = io.connect('http://localhost:3000');
var list          = document.querySelector('.celebrities');

socket.on('newCelebrity', function (data) {
  var item     = document.createElement('li');
  var itemText = document.createTextNode(data.name);

  item.appendChild(itemText);
  list.appendChild(item);

  document.getElementById('celebrityName').value = "";
});

var el = document.getElementById('celebrity');

el.addEventListener('submit', function(e) {
  e.preventDefault();

  var celebrityName = document.getElementById('celebrityName').value;

  socket.emit('addCelebrity', { name: celebrityName });
});
