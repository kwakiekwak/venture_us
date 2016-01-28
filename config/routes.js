//adding dotenv up at the top
var dotenv = require('dotenv');
dotenv.load();

var passport       = require('passport');
var mongoose       = require('mongoose');
var express        = require('express');
var router         = new express.Router();
var flash          = require('connect-flash')
// Require controllers.
var welcomeController = require('../controllers/welcome');
var usersController   = require('../controllers/users');
var ventureController = require('../controllers/venture')
var businessController = require('../controllers/business')
// Socket below
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//body-parser
bodyParser   = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initializing passport
app.use(passport.initialize());
require("../config/passport")(passport);
app.use(flash());

// The 3 routes in order to authenticate via OAuth with FB
// 1. A route to request(create) facebook
router.get('/auth/facebook',
  passport.authenticate('facebook', {
   scope: 'email'} ));
// 2. A route for the FB callback
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/users/profile',
    failureRedirect: '/'
  })
);
// 3. A route for the logout
router.get("/logout", function(req, res){
  // console.log(req.user);
  req.logout()
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

// SHOW HOMEPAGE
router.get('/', welcomeController.index);

// USERS PATHS
router.route('/users')
  .get(usersController.index);

router.get('/users/login', usersController.login);
router.post('/users/login', passport.authenticate('local-login', {
  successRedirect : '/users/profile', // redirect to the secure profile section
  failureRedirect : '/users/login', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
}));

router.get('/users/signup', usersController.signup);
router.post('/users/signup', passport.authenticate('local-signup', {
  successRedirect: '/users/profile',
  failureRedirect: '/users/signup',
  failureFlash: true
}));

router.get('/users/profile', isLoggedIn, usersController.profile);

router.route('/users/:id')
 .get(usersController.profile)
 .put(usersController.update)
 .delete(usersController.destroy);

router.route('/users/add_friend/:id')
  .post(usersController.addFriend)

// VENTURE PATHS
router.route('/ventures/new')
  //Render view page for creating a new venture
  .get(ventureController.new)
  //Create a venture - function in controller
  .post(ventureController.create)

router.route('/ventures/find')
  .get(ventureController.findInvited)

router.route('/ventures/add_vote')
  .put(ventureController.addVote)


//routing for /venturess/show (all, show, update, delete)
router.route('/ventures/show/:id')
  .get(ventureController.show)

module.exports = router;
