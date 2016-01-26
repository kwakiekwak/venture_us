var mongoose= require('mongoose')

var ventureSchema = new mongoose.Schema({
  user_id: [{}], //array of user_id objects
  location: String,
  choice: [{
    business: {},
    vote: {} //key - user_id, value - boolean
  }], //array of objects. This will be a deck of cards
  result: {} //final result of venture

})

module.exports = mongoose.model('Venture', ventureSchema)
