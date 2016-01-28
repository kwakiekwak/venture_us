//adding dotenv up at the top
var dotenv = require('dotenv');
dotenv.load();

var Venture = require('../models/venture');
var User = require('../models/user');

client_id = "CIFWDNLDWK55XZBRIHQ0PLN1MQUBAB135DU3HDL13EZB20L3",
client_secret = "GIVQE2TPTXMVP53AB0FESQRJVGPC4X1SS1VEFXOSLXPV12CE"

var express        = require('express');
var router         = new express.Router();
// Socket below
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var request = require('request');
var locus = require('locus')

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
      // console.log(data[1].id)
      res.render('ventures/new', {friends: data, users: users})

    })
  },
  create: function(req, res, next) {
    // console.log("I'm in create with")
    var newVenture = new Venture()
    // var keys = Object.keys(req.body)
    // var newVenture = new Venture()
    newVenture.location = req.body.location;

    // Category shows
    // console.log(req.body['categories'])

    newVenture.category.push(req.body['categories'])

    // console.log(newVenture.venturists.indexOf(req.body['venturists']))
    // console.log(venturists.length)
    // if(newVenture.venturists.indexOf(req.body['venturists']) < 1){
    //   newVenture.venturists.push(req.body['venturists'].toString())
    // } else {
      // for(var i=0; i<venturists.length; i++) {
      //   newVenture.venturists.push(venturists[i])
      // }
      req.body['venturists'].forEach(function(id) {
        newVenture.venturists.push(id)
        // newVenture.venturists.split('"')
      })
    // }

    console.log(newVenture)
    newVenture.save(function(err, data) {
      if(err) console.log(err)
        console.log("Venture Created");
    // trying to resolve problem/ wanting to create one venture create at the bottom`
      // res.send("Venture created")
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
        // console.log(res.body)
        var venues = JSON.parse(body).response.venues;
        // console.log(venues);
        var count = 0;
        venues.forEach(function(venue) {
          venue_id = venue.id;
          // JSON.stringify(venue)
          // console.log(venue)
          // console.log(venue.name)
           //above, you parse the body, and then take its response
        // (2.) callback - .then, query for image, using the venue id from above.
            //venue Id hard-coded in below for now.
          request('https://api.foursquare.com/v2/venues/4a99ace9f964a520c22f20e3/photos?&client_id='+client_id+'&client_secret='+client_secret+'&v=20160126', function(error,response,data){
              if(!error) {
                //console.log(JSON.parse(response.data));
                //res.send(JSON.parse(response.body).response.photos.items[0]);
                firstPhoto = JSON.parse(response.body).response.photos.items[0];

                //res.render('ventures/photo', {firstPhoto:firstPhoto});
                res.render('ventures/show', {location: location, query: query, venues: venues, firstPhoto: firstPhoto, count:count})
              }
              else {
                res.send({venuesSearch: 'Not implemented!'});
                return;// return some JSON
              }
              //res.render('ventures/show', {location: location, query: query, venues: venues, firstPhoto: firstPhoto, photoArray:photoArray})
            })
        })
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
