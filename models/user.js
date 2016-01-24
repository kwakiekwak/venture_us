var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

module.exports = mongoose.model('User', {
// Setting up the facebook user model schema
  local: {
    email: String,
    password: String
  },
  fb: {
    id: String,
    access_token: String,
    firstName: String,
    lastName: String,
    email: String
  }
})
