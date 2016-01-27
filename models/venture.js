var mongoose= require('mongoose')

var ventureSchema = new mongoose.Schema({
<<<<<<< HEAD
  user_id: [], //array of user_id objects
=======
  venturists: [String], //array of user_id objects
>>>>>>> 4c71cc953c246a2ec1fa97ee2400e488f78bf2d6
  location: String,
  choice: [{
    business: {},
    vote: {} //key - user_id, value - boolean
  }], //array of objects. This will be a deck of cards
  result: {} //final result of venture

})

module.exports = mongoose.model('Venture', ventureSchema)
