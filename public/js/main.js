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


// pause: "hover" breaks the messaging system
//Carousel timer

// comment this out. the hover quotations were causing messages to break.
//Carousel timer
// <<<<<<< HEAD
// // $('.carousel').carousel({
// //   interval: 2000,
// //   pause: "hover",
// //   wrap: true
// // })

