var Venture = require('../models/venture')
//venture is fully CRUD-able
module.exports = {
  all: function(req, res, next) {
    Venture.find({}, function(err, ventures) {
      res.render('ventures/all', {allFlights: flights})
    })
  },
  create: function(req, res, next) {
    var newFlight = new Flight()
    var keys = Object.keys(req.body)
    keys.forEach(function(key) {
      newFlight[key] = req.body[key]
    })
    newFlight.save(function(err, data) {
      if(err) console.log(err)
        res.send("Flight created")
    })
  },
  new: function(req, res, next) {
    res.render('flights/new')
  },
  show: function(req, res, next) {
    Flight.findOne({number: Number(req.params.number)}, function(err, flight) {
      res.render('flights/show', {oneFlight: flight})
    })
  },
  update: function(req, res, next) {
    Flight.findOneAndUpdate({number: Number(req.params.number)},
      req.body, function(err, flight){
        if(err) console.log(err)
          res.send("Flight Update")
    })
  },
  delete: function(req, res, next) {
    Flight.findOne({number: Number(req.params.number)}, function(err, flight) {
      flight.remove()
      res.send('Flight removed')
    })
  }
}
