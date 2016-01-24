var mongoose - require('mongoose')

var businessSchema = new mongoose.Schema({
  yelp: {
    //whatever yelp provides
  },
  category: String,
  review: [{
    user: {},
    body: String, //this needs to be limited to one word, we will have one word reviews
    venture: {}
  }]
})
