//adding dotenv up at the top
var dotenv = require('dotenv');
dotenv.load();
var Venture = require('../models/venture');
var User = require('../models/user');
client_id = "CIFWDNLDWK55XZBRIHQ0PLN1MQUBAB135DU3HDL13EZB20L3"
client_secret = "GIVQE2TPTXMVP53AB0FESQRJVGPC4X1SS1VEFXOSLXPV12CE"
var express        = require('express');
var router         = new express.Router();
// Socket below
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var request = require('request');
var rp = require('request-promise');
var locus = require('locus')
//body-parser
bodyParser   = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// array for venturists api
var apiVenturists = [];

//venture is fully CRUD-able
module.exports = {
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
  create: function(req, res, next) {
    var newVenture = new Venture()
    // setting venture location in the DB
    newVenture.location = req.body.location;
    // setting venture category in the DB
    newVenture.keyword= req.body['category']
    // adding venturists to venture in the DB
    req.body['venturists'].forEach(function(id) {
      newVenture.venturists.push(id)
    })
    // adding 20 venue choices to venture in the DB
    rp('https://api.foursquare.com/v2/venues/search?client_id='+client_id+'&client_secret='+client_secret+'&v=20130815%20&near='+newVenture.location+'%20&query='+newVenture.keyword + '%20&limit=20').then(function(venues){
        var array = [];
        var venueData = JSON.parse(venues).response.venues;
        venueData.forEach(function(venue) {
          array.push(venue.id)
        });
        newVenture.venue_ids = array;
        newVenture.save(function(err, data) {
          res.send({venture_id: data.id});
        })
    }, function(reason){
      res.send('failing because' + reason);
    });
  },
  show: function(req, res, next) {
    var venturePromise = Venture.findOne({_id: req.params.id}).exec()
    var venuePromises = [];
    var venuesPromise = venturePromise.then(function(venture) {
      var venue_ids = venture.venue_ids
      venue_ids.forEach(function(venue_id) {
      venuePromises.push(rp('https://api.foursquare.com/v2/venues/'+venue_id+'?client_id='+client_id+'&client_secret='+client_secret+'&v=20160126'))
      // var photoGroup = data.response.venue.photos.groups
      //. response.photos.items[0]//the entire photo object for that index
      })
      return Promise.all(venuePromises)
    })
    venuesPromise.then(function(data){
      var venueArray = [];
      data.forEach(function(venue){
        venueArray.push(JSON.parse(venue).response.venue);
      })
      res.render('ventures/show', {venues: venueArray, venture: req.params.id})
    })
  },
  findInvited: function(req, res, next) {
    Venture.findOne({venturists: req.user.id}, function(err, venture) {
      if(venture == null) {
        console.log("You Are Not Invited"); // is this correct?
      } else {
        console.log("You have a venture" + venture)
      res.redirect('/ventures/show/'+ venture.id)
      }
    })
  },

  // countVote: function(req, res, next) {

  // },

  all: function(req, res, next) {
    Venture.find({}, function(err, ventures) {
      //when you visit
      res.render('ventures/show', {ventures: ventures})
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
  },

// creating APIS
  testApi: function(req, res, next) {
    res.send("Hello World")
    // res.json(apiVenturists)
  },

  addVenturesApi: function(req, res, next) {
    if(!req.body.hasOwnProperty('venturists') ||
     !req.body.hasOwnProperty('keyword')) {
    res.statusCode = 400;
    return res.send('Error 400: Post syntax incorrect.');
  }
    var newApiVenture = new Venture  ({
        venturists: req.body.venturists,
        location: req.body.location,
        keyword: req.body.keyword
      });

      // apiVenturists.push(newApiVenture);
      // res.json(apiVenturists);
  },

  oneVentureApi: function(req, res, next) {
    Venture.findOne({_id: req.params.id}, function(err, data){
      console.log(data)
      res.json(data)
    })
  },

  showVenturesApi: function(req, res, next){
    // console.log(Venture)
    Venture.find({}, function(err, ventures){
      res.json(ventures)

    })
  },
// update not available yet
  updateVentureApi: function(req, res, next) {
    Venture.findOne({_id: req.params.id} , function(err, venture) {
        //Above, this will set the user_id equal to the user_id of the first
        //user in the venture array, i.e. you.
        if(err) return res.send(err)
        for(var prop in req.body) {
          venture[prop] = req.body[prop]
        }

        venture.save()
        res.json("Updated")
      })
  },

// kinda funky
  deleteVentureApi: function(req, res, next) {
    Venture.findOneAndRemove({_id: req.params.id}, function(err, venture) {
      if(err) console.log(err)
      res.send("Venture Deleted")
    })
    // if(req.params.id) {
    //   res.statusCode = 404;
    //   return res.send('Error 404: No quote found');
    // }
    // console.log(req.params.id)
    // console.log(x)
    // var x = apiVenturists.indexOf(req.params.id)
    // apiVenturists.splice(x, 1);
    //   res.json(apiVenturists);
  }

}
