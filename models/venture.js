var mongoose= require('mongoose')

var ventureSchema = new mongoose.Schema({
  venturists: [String], //array of user_id objects
  location: String,
  // adding category to the schema
  keyword: String,
  venue_ids: [],
  choices: [{
    venue_id: String,
    vote: [{}] //key - user_id, value - boolean [{shgkdsjgklsjdklg Boolean}]
  }],
  result: {} //final result of venture

})

module.exports = mongoose.model('Venture', ventureSchema)
