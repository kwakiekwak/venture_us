var mongoose= require('mongoose')

var ventureSchema = new mongoose.Schema({
  _id: Number,
  users: [{}], //array of user_id objects
  choice: [{}], //array of business_id objects. This will be a deck of cards
  result: {} //final result of venture

})

module.exports = mongoose.model('Venture', ventureSchema)