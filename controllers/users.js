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
  req.session.save();
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

var update = function(req, res, next) {
  User.findOneAndUpdate({_id: Number(req.params.id)} , function(err, venture) {
      //Above, this will set the user_id equal to the user_id of the first
      //user in the venture array, i.e. you.
      res.render('ventures/show', {venture: venture})
    })
  }

var destroy = function(req, res, next) {
    User.findOne({user_id: User.users[0]}, function(err, user) {
      user.remove()
      res.send('Venture removed')
    })
  }

var addFriend = function(req, res, next) {
  // console.log(req.user.id)
  // console.log(req.params.id)
  User.findOneAndUpdate({_id: req.user.id},{$addToSet: {"friends": {user: req.params.id}}}, function(err, data) {
    // console.log("friend appended")
    res.send('friend appended');
  }
)}


module.exports = {
  login: login,
  signup: signup,
  profile: profile,
  index: index,
  show:  show,
  update: update,
  destroy: destroy,
  addFriend: addFriend
};
