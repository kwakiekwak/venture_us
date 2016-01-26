var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var userSchema = mongoose.Schema({
  local: {
    email: String,
    password: String
  },
  // Setting up the facebook user model schema
  fb: {
    id: String,
    access_token: String,
    firstName: String,
    lastName: String,
    email: String
  },
  friends: [{
    user: {}, //type: Schema.ObjectId, ref: 'User'}
    category: String //
  }]
})

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

var User = mongoose.model('User', userSchema);

// create the model for users and expose it to our app
module.exports = User;
