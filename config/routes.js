var passport       = require('passport');
var mongoose       = require('mongoose');
var express        = require('express');
var router         = new express.Router();
// Require controllers.
var welcomeController = require('../controllers/welcome');
var usersController   = require('../controllers/users');
// Socket below
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Initializing passport
app.use(passport.initialize());
require("../config/passport")(passport)

// root path for showing homepage
router.get('/', welcomeController.index);

// users resource paths:
router.get('/profile',   usersController.profile);
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
    successRedirect: '/users',
    failureRedirect: '/'
  })
);
// 3. A route for the logout
router.get("/logout", function(req, res){
  // console.log(req.user);
  req.logout();
  // console.log(req.user);
  res.redirect("/")
})


module.exports = router;
