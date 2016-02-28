console.log('JS loaded!');

var socket = io();

$('#chat').submit(function(){
  socket.emit('chat-message', $('#m').val());
  $('#m').val('');
  return false;
});

socket.on('chat-message', function(msg){
  $('#messages').append($('<li>').text(msg));
  console.log(msg)
});


// Toggle Show Nav-Menu

$('#show-nav-bar').click(function(){
  $('.nav-link').toggle();
});

