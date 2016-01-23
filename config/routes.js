var express = require('express'),
    router  = new express.Router();

// //Socket below
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


// Require controllers.
var welcomeController = require('../controllers/welcome');
var usersController   = require('../controllers/users');

// root path:
router.get('/', welcomeController.index);

// users resource paths:
router.get('/users',     usersController.index);
router.get('/users/:id', usersController.show);

// //event listener for connection (socket)
io.on('connection', function(socket){
  console.log('a user connected');
});

module.exports = router;
