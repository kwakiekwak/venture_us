// io.js

var io = require('socket.io')();

io.on('connection', function (socket) {
  console.log('Client connected to socket.io!');


  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

});

module.exports = io;
