var Venture = require('../models/venture');
var User = require('../models/user');
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
    Venture.findOne({_id: Number(req.params.id)} , function(err, venture) {
      //Above, this will set the user_id equal to the user_id of the first
      //user in the venture array, i.e. you.

      //Nest both API calls here!
      //(1.) request for search API - get venue id, name, address
      // (2.) callback - .then, query for image, using the venue id from above.

      res.render('ventures/show', {venture: venture})
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
