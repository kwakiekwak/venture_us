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
router.get('/users', usersController.index);
router.get('/users/login', usersController.login);
router.get('/users/signup', usersController.signup);
router.post('users/signup', passport.authenticate('local-signup', {
  successRedirect: '/users/profile',
  failureRedirect: 'users/signup',
  failureFlash: true
}));
router.get('/users/profile', isLoggedIn, usersController.profile);
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

// route middleware to make sure a user is logged in

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}


module.exports = router;
