//adding dotenv up at the top
var dotenv = require('dotenv');
dotenv.load();

var Venture = require('../models/venture');
var User = require('../models/user');

client_id = process.env.CLIENT_ID,
client_secret = process.env.CLIENT_SECRET


var express        = require('express');
var router         = new express.Router();
// Socket below
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var request = require('request');

//body-parser
bodyParser   = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//venture is fully CRUD-able
module.exports = {
  all: function(req, res, next) {
    Venture.find({}, function(err, ventures) {
      //when you visit
      res.render('ventures/show', {ventures: ventures})
    })
  },
  create: function(req, res, next) {
    var newVenture = new Venture()
    var keys = Object.keys(req.body)
    keys.forEach(function(key) {
      newVenture[key] = req.body[key]
    })
    newVenture.save(function(err, data) {
      if(err) console.log(err)
        res.send("Venture created")
    })
  },
  new: function(req, res, next) {
    var friends = [];
    var users;
    req.user.friends.forEach(function (friend) {
      friends.push(friend.user)
    })
    User.find({}, function(err, data) {
    users = data;
    })
    User.find({ _id: { $in : friends}}, function (err, data) {
      res.render('ventures/new', {friends: data, users: users})
    })
  },
  show: function(req, res, next) {
    Venture.findOne({_id: Number(req.params.id)} , function(err, requ) {
      //Above, this will set the user_id equal to the user_id of the first
      //user in the venture array, i.e. you.

      var location = req.query.location
      var query = req.query.keyword
//(1.) request for search API - get venue id, name, address
    request('https://api.foursquare.com/v2/venues/search?client_id='+client_id+'&client_secret='+client_secret+'&v=20130815%20&near='+location+'%20&query='+query, function(error,response,body){
      if(!error) {
        venues = JSON.parse(body).response;
        console.log(venues);
        //above, you parse the body, and then take its response
        // (2.) callback - .then, query for image, using the venue id from above.
            //venue Id hard-coded in below for now.
            request('https://api.foursquare.com/v2/venues/43695300f964a5208c291fe3/photos?&client_id='+client_id+'&client_secret='+client_secret+'&v=20160126', function(error,response,data){
              if(!error) {
                //console.log(JSON.parse(response.data));
                //res.send(JSON.parse(response.body).response.photos.items[0]);
                photos = JSON.parse(response.body).response.photos.items;
                //res.render('ventures/photo', {firstPhoto:firstPhoto});
                res.render('ventures/show', {location: location, query: query, venues: venues, photos:photos})
              }
              else {
                res.send({venuesSearch: 'Not implemented!'});
                return;// return some JSON
              }
            })
          //})
      //use promises
      }
      else {
        res.send({venuesSearch: 'Not implemented!'}); // return some JSON
        console.log(req.body.place.name);
        console.log(req.body.query);
        console.log(JSON.parse(response.body));
      }
    });
  })
  },
  update: function(req, res, next) {
    Venture.findOneAndUpdate({_id: Number(req.params.id)},
      req.body, function(err, venture){
        if(err) console.log(err)
          res.send("Venture updated!")
    })
  },

  delete: function(req, res, next) {
    Venture.findOne({user_id: Venture.users[0]}, function(err, venture) {
      venture.remove()
      res.send('Venture removed')
    })
  },

  map: function(req, res, next) {
    res.render('ventures/map')
  }
}
