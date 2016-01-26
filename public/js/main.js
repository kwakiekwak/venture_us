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
<<<<<<< HEAD

<<<<<<< HEAD


=======
<<<<<<< HEAD

// pause: "hover" breaks the messaging system
//Carousel timer
=======
// comment this out. the hover quotations were causing messages to break.
//Carousel timer
// <<<<<<< HEAD
// // $('.carousel').carousel({
// //   interval: 2000,
// //   pause: "hover",
// //   wrap: true
// // })
// =======
>>>>>>> adding-friends
// $('.carousel').carousel({
//   interval: 2000,
//   pause: “hover”,
//   wrap: true
// })
<<<<<<< HEAD
=======
// >>>>>>> 0561adff993cc6ee0d2bbcd6c510b31ca9dac358
>>>>>>> adding-friends
>>>>>>> eba1474785e86dfa002be506a710f009a61de5b6
=======
>>>>>>> 1ed875293af5ed5de92db7b0da26b161058c86ae
