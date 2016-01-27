var mongoose= require('mongoose')

var ventureSchema = new mongoose.Schema({
  venturists: [String], //array of user_id objects
  location: String,
  keyword: String,
  venue_ids: [],
  choice: [{
    business: {},
    vote: {} //key - user_id, value - boolean
  }], //array of objects. This will be a deck of cards
  result: {} //final result of venture

})

module.exports = mongoose.model('Venture', ventureSchema)
