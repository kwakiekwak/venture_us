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
  console.log(msg)
});

// comment this out. the hover quotations were causing messages to break.
//Carousel timer
<<<<<<< HEAD
// $('.carousel').carousel({
//   interval: 2000,
//   pause: "hover",
//   wrap: true
// })
=======
$('.carousel').carousel({
  interval: 2000,
  pause: “hover”,
  wrap: true
})
>>>>>>> 0561adff993cc6ee0d2bbcd6c510b31ca9dac358
