//adding dotenv up at the top
var dotenv = require('dotenv');
dotenv.load();
var client_id = process.env.CLIENT_ID;
var client_secret = process.env.CLIENT_SECRET;
var Venture = require('../models/venture');
var User = require('../models/user');
var express        = require('express');
var router         = new express.Router();
// Socket below
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var request = require('request');
var rp = require('request-promise');
var locus = require('locus');

//body-parser
var bodyParser   = require('body-parser');
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
    // console.log("I'm in create with")
    var newVenture = new Venture()
    var keys = Object.keys(req.body)
    var newVenture = new Venture()
    newVenture.location = req.body.location;
    req.body['venturists'].forEach(function (id) {
      newVenture.venturists.push(id)
    })
    newVenture.save(function(err, data) {
      if(err) console.log(err)
        // console.log(newVenture);
        res.send("Venture created")

      if(err){console.log(err)}
      console.log(newVenture);
      res.send("Venture created")
    })
  },
  addCategory: function(req, res, next) {
    Venture.findOneAndUpdate({_id: "56a81651ceb9a9c2d1b76f3a"},{ $set: {keyword: req.body.keyword }}, function(err, data){
      res.send('success');
    })
  },
  addVenues: function(req, res, next) {
    var venturePromise = Venture.findOne({_id: "56a81651ceb9a9c2d1b76f3a"}).exec()
    var venuesPromise = venturePromise.then(function(venture) {
      var location = venture.location
      var query = venture.keyword
      return rp('https://api.foursquare.com/v2/venues/search?client_id='+client_id+'&client_secret='+client_secret+'&v=20130815%20&near='+location+'%20&query='+query + '%20&limit=20')
    })
    Promise.all([venturePromise,venuesPromise]).then(function(venues){
      var array = [];
      var venueData = JSON.parse(venues[1]).response.venues;
      venueData.forEach(function(venue) {
        array.push(venue.id)
      });
      Venture.findOneAndUpdate({_id: "56a81651ceb9a9c2d1b76f3a"},{$set:{venue_ids:array}}, function(err, data){
        res.send({venture_id: "56a81651ceb9a9c2d1b76f3a"});
      })
    }, function(reason){
      console.log('failing because' +reason);
    });
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
    var venturePromise = Venture.findOne({_id: req.params.id}).exec()
    var venuePromises = [];
    var venusPromise = venturePromise.then(function(venture) {
      var venue_ids = venture.venue_ids
      venue_ids.forEach(function(venue_id) {
      venuePromises.push(rp('https://api.foursquare.com/v2/venues/'+venue_id+'?client_id='+client_id+'&client_secret='+client_secret+'&v=20160126'))
      // var photoGroup = data.response.venue.photos.groups
      //. response.photos.items[0]//the entire photo object for that index
      })
      return Promise.all(venuePromises)
    })

    venusPromise.then(function(data){
      var venueArray = [];
      data.forEach(function(venue){
        venueArray.push(JSON.parse(venue).response.venue);
      })
      console.log('Im in show');
      res.render('ventures/show', {venues: venueArray})
      // res.render('ventures/show', {venues: venueArray});
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
