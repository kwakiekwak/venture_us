var Venture = require('../models/venture');
var User = require('../models/user');
var locus = require('locus')
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
    console.log('adding location')
    // eval(locus);
    newVenture.location = req.body.location;
    console.log('location added')
    // newVenture[user_ids] = req.body[user_ids];
    var array = req.body.venturists.split('"')
    console.log(array);
    for (var i = 1; i < array.length; i+=2) {
      newVenture.venturists.push(array[i])
      console.log(newVenture.venturists)
    }
    // var keys = Object.keys(req.body)
    // keys.forEach(function(key) {
    //   newVenture[key] = req.body[key]
    //   console.log(newVenture[key])
    //   console.log(req.body[key])
    // })
    newVenture.save(function(err, data) {
      if(err){console.log(err)}
      console.log(newVenture);
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
