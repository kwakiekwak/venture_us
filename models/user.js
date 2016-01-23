// var mongoose = require('mongoose'),

// var userSchema = new mongoose.Schema({
//   fb: {
//     id: String,
//     access_token: String,
//     firstName: String,
//     lastName: String,
//     email: String
//   }
// });

// var User = mongoose.model('User', userSchema);

// module.exports = User;

var mongoose    = require('mongoose')
    // debug       = require('debug')('app:models')

// Setting up the facebook user model schema
module.exports = mongoose.model('User', {
  fb: {
    id: String,
    access_token: String,
    firstName: String,
    lastName: String,
    email: String
  }
})
