console.log('JS loaded!');

// document.addEventListener("DOMContentLoaded", function() {

//     // get our connection to the socket.io server
//     var socket = io();


// });

var socket = io();

$('#chat').submit(function(){
  socket.emit('chat-message', $('#m').val());
  $('#m').val('');
  return false;
});

socket.on('chat-message', function(msg){
  $('#messages').append($('<li>').text(msg));
});

//Carousel timer
$('.carousel').carousel({
  interval: 2000,
  pause: “hover”,
    wrap: true
})
