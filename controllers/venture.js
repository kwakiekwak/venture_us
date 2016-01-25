var Venture = require('../models/venture')
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
    res.render('ventures/new')
  },
  show: function(req, res, next) {
    Venture.findOne({user_id: Venture.users[0]}, function(err, venture) {
      //Above, this will set the user_id equal to the user_id of the first
      //user in the venture array, i.e. you.
      res.render('ventures/show', {venture: venture})
    })
  },
  update: function(req, res, next) {
    Venture.findOneAndUpdate({user_id: Venture.users[0]},
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
  }
}
