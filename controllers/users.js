// Require resource's model(s).
var User = require("../models/user");

var login = function(req, res, next) {
  res.render('users/login', { message: req.flash('loginMessage') });
}

var signup = function(req, res, next) {
  res.render('users/signup', { message: req.flash('signupMessage') });
}

var profile = function(req, res) {
  res.render('users/profile', {user: req.user})
}

var index = function(req, res, next){

  User.find({}, function(error, users){
    res.render('users/index', {users: users, user: req.user});
  });
};

var show = function(req, res, next){
  User.findById(req.params.id, function(error, user){
    if (error) res.json({message: 'Could not find user because ' + error});
    res.render('users/show', {user: user});
  });
};

module.exports = {
  login: login,
  signup: signup,
  index: index,
  show:  show,
  profile: profile
};
