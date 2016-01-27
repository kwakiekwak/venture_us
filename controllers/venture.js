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
    // console.log("I'm in create with")
    var newVenture = new Venture()
    var keys = Object.keys(req.body)
    console.log(req.body.user_id)
    // console.log(array.toString())
    // console.log(req.body.user_id)
    // console.log(newVenture.user_id.push(user))'
    // console.log(req.body.user_id)
    for(var i=0; i<req.body.user_id.length;i++) {

      newVenture.user_id.push(req.body.user_id[i])

    }
    console.log(newVenture.user_id)

    keys.forEach(function(key) {
      newVenture[key] = req.body[key]
    })
    // console.log(newVenture)
    // newVenture[user_id].push(user_id)
    // console.log(newVenture[user_id])
    // console.log(newVenture[user_id][0])
    // newVenture[user_id] = user_id
    newVenture.save(function(err, data) {
      if(err) console.log(err)
        // console.log(newVenture);
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
      // console.log(data[1].id)
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
