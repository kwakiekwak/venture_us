//adding dotenv up at the top
var dotenv = require('dotenv');
dotenv.load();

client_id = process.env.CLIENT_ID,
client_secret = process.env.CLIENT_SECRET

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

//here, call .env on process when you connect to the database
//request module
var request = require("request");

// Initializing passport
app.use(passport.initialize());
require("../config/passport")(passport);
app.use(flash());

// root path for showing homepage
router.get('/', welcomeController.index);

// users resource paths:
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
 .get(usersController.show)
 .put(usersController.update)
 .delete(usersController.destroy)

// routes for venture paths:
router.get('/ventures/new', ventureController.new)

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
    successRedirect: '/users/profile',
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

//Venture routes below
//route for /ventures/new (new, post)
router.route('/ventures/new')
  //create a venture - function in controller
  .post(ventureController.create)

  //form for creating a new venture
  .get(ventureController.new)

// testing google map api
router.route('/ventures/map').get(ventureController.map)

router.route('/ventures/show').get(ventureController.all)

//routing for /venturess/show (all, show, update, delete)
router.route('/ventures/show/:id')

  .get(ventureController.show)
  // show business show page
  .get(businessController.show)

  .put(ventureController.update)
  // update a business
  .put(businessController.update)
  //delete a venture.
  .delete(ventureController.delete)

// //Foursquare searching below
router.get('/search', function(req, res, next) {
  var location = req.query.location
  var query = req.query.keyword
  // Printing out the content of the request!

    request('https://api.foursquare.com/v2/venues/search?client_id='+client_id+'&client_secret='+client_secret+'&v=20130815%20&near='+location+'%20&query='+query, function(error,response,body){
    if(!error) {
    //   // //EJS venues re-rerouting here.
      res.render('ventures/venues', {location: location, query: query, venues: JSON.parse(body).response});
      //above, you parse the body, and then take its response
      console.log(res.venues);
     }
// //raw JSON rendering below.
    // res.send(JSON.parse(response.body));
    // console.log(location); //the location
    // console.log(req.body.query); //the query (i.e. vegan)
    // console.log(response.venues); //the response (i.e. all locations)
    // console.log(JSON.parse(response.body));
    // }
    else {
      res.send({venuesSearch: 'Not implemented!'}); // return some JSON
      console.log(req.body.place.name);
      console.log(req.body.query);
      console.log(JSON.parse(response.body));
    }
  });

});



module.exports = router;
