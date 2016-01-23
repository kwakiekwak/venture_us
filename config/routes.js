var express        = require('express');
var router         = new express.Router();
var passport       = require('passport');
var app            = express();
var mongoose       = require('mongoose');


// //Socket below
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


// Require controllers.
var welcomeController = require('../controllers/welcome');
var usersController   = require('../controllers/users');
// Initializing passport
app.use(passport.initialize());

require("../config/passport")(passport)

// root path:
router.get('/', welcomeController.index);

// users resource paths:
router.get('/users',     usersController.index);
router.get('/users/:id', usersController.show);


// //event listener for connection (socket)
io.on('connection', function(socket){
  console.log('a user connected');
});

// The 3 routes in order to authenticate via OAuth with FB
// 1. A route to request(create) facebook
router.get('/auth/facebook',
  passport.authenticate('facebook', {
   scope: 'email'} ));
// 2. A route for the FB callback
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/'
  })
);
// 3. A route for the logout
router.get("/logout", function(req, res){
  console.log(req.user);
  req.logout();
  // throws error undefined user but
  // its for testing if it reaches
  // console.log(user)
  res.redirect("/")
})


module.exports = router;
