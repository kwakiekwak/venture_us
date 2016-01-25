var dotenv = require('dotenv');
dotenv.load();

var express        = require('express');
var router         = new express.Router();
var passport       = require('passport');
var app            = express();
var mongoose       = require('mongoose');
var request = require('request');
var oauthSignature = require('oauth-signature');
var n = require('nonce')();
var qs = require('querystring');
var _ = require('lodash');

//body-parser
bodyParser   = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


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


// Yelp API variables and access functions below.
// via npm install --save yelp

// Request API access: http://www.yelp.com/developers/getting_started/api_access
var Yelp = require('yelp');

//This will factor in your oAuth params.
var yelp = new Yelp({
  consumer_key: 'WyY4LXaOSGB6OBlwSvkr5A',
  consumer_secret: 'OiO0isImZ4Ebm6UGGxkyUxOpRgM',
  token: 'mNVQwLysfi5eYcrtVIGXMGsGphE6IW5z',
  token_secret: 'hc8Fgp9V3Gd2SIFkLAYtuB4IoxY',
  //added these in below:
   oauth_nonce : n(),
   oauth_timestamp : n().toString().substr(0,10),
   oauth_signature_method : 'HMAC-SHA1',
   oauth_version : '1.0'
});

// See http://www.yelp.com/developers/documentation/v2/search_api

//  yelp.search({ term: term, location: location})
// .then(function (data) {
//   console.log(data);
// })
// .catch(function (err) {
//   console.error(err);
// }),

// See http://www.yelp.com/developers/documentation/v2/business
yelp.business('yelp-san-francisco')
  .then(console.log)
  .catch(console.error);

yelp.phoneSearch({ phone: '+15555555555' })
  .then(console.log)
  .catch(console.error);

// A callback based API is also available:
yelp.business('yelp-san-francisco', function(err, data) {
  if (err) return console.log(error);
  console.log(data);
});

//Tying in POST form for Yelp on index.

/* POST to search */
router.post('search', function(req, res, next) {
  // Printing out the content of the request!

  yelp.search('https://api.yelp.com/v2/search/?location='+JSON.stringify(req.body.location) + '&category_filter='+ JSON.stringify(req.body.query), function(error, response, body) {
    if(!error) {
    //   // //EJS venues re-rerouting here.
    //   res.render('venues', {place: req.body.place.name, query:req.body.query, venues: JSON.parse(body).response});
    //   //above, you parse the body, and then take its response
    //   console.log(res.venues);
    // // }

// //raw JSON rendering below.
    res.send(JSON.parse(response.body));
    console.log(req.body.categories); //the categories
    console.log(req.body.location); //the location
    console.log(response.venues); //the response (i.e. all locations)
    console.log(JSON.parse(response.body));
    }
    else {
      res.send({venuesSearch: 'Not implemented!'}); // return some JSON
      // console.log(req.body.place.name);
      // console.log(req.body.query);
      console.log(JSON.parse(response.body));
    }

});
});


// //ALTERNATE

// // alternate Yelp API strategy below. Adding apiURL + string of paramsURL.
// /* require the modules needed */
// var oauthSignature = require('oauth-signature');
// var n = require('nonce')();
// var request = require('request');
// var qs = require('querystring');
// var _ = require('lodash');

// /* Function for yelp call
//  * ------------------------
//  * set_parameters: object with params to search
//  * callback: callback(error, response, body)
//  */
// var request_yelp = function(set_parameters, callback) {

//   /* The type of request */
//   var httpMethod = 'GET';

//   /* The url we are using for the request */
//   var url = 'http://api.yelp.com/v2/search';

//   /* We can setup default parameters here */
//   var default_parameters = {
//     location: 'San+Francisco',
//     sort: '2'
//   };

//   /* We set the require parameters here */
//   var required_parameters = {
//     oauth_consumer_key : process.env.oauth_consumer_key,
//     oauth_token : process.env.oauth_token,
//     oauth_nonce : n(),
//     oauth_timestamp : n().toString().substr(0,10),
//     oauth_signature_method : 'HMAC-SHA1',
//     oauth_version : '1.0'
//   };

//   /* We combine all the parameters in order of importance */
//   var parameters = _.assign(default_parameters, set_parameters, required_parameters);

//   /* We set our secrets here */
//   var consumerSecret = process.env.consumerSecret;
//   var tokenSecret = process.env.tokenSecret;

//   /* Then we call Yelp's Oauth 1.0a server, and it returns a signature */
//   /* Note: This signature is only good for 300 seconds after the oauth_timestamp */
//   var signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret, { encodeSignature: false});

//   /* We add the signature to the list of paramters */
//   parameters.oauth_signature = signature;

//   /* Then we turn the paramters object, to a query string */
//   var paramURL = qs.stringify(parameters);

//   /* Add the query string to the url */
//   var apiURL = url+'?'+paramURL;

//   /* Then we use request to send make the API Request */
//   // request(apiURL, function(error, response, body){
//   //   return callback(error, response, body);
//   // });

//   //Post a call to database (query) and return

//   router.post('search', function(req, res, next) {
//     request(apiURL, function(error, response, body){
//       console.log(response.body);
//     // return callback(error, response, body);
//     });
//   })



module.exports = router;
