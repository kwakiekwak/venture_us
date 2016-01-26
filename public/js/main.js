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

<<<<<<< HEAD
// pause: "hover" breaks the messaging system
//Carousel timer
// $('.carousel').carousel({
//   interval: 2000,
//   pause: “hover”,
//   wrap: true
// })
=======
<<<<<<< HEAD

=======
//Carousel timer
$('.carousel').carousel({
  interval: 2000,
  pause: “hover”,
  wrap: true
})
>>>>>>> 15c6bf0039892e70dc0dcced1520e9a9b1f4a132
>>>>>>> 35f6f1f51e33aa6f07d551e8cc79f95d71ddc4f9
