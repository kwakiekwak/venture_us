// getting User schema model from ../models/user file
var User = require('../models/user');
var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy = require('passport-local').Strategy;

// Serializing/Deserializing modules
module.exports = function(passport){

    passport.serializeUser(function(user, done) {
      done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        // console.log('deserializing user:',user);
        done(err, user);
      });
    });

    //SIGN UP LOCALLY

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        console.log(email);
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

                // if there is no user with that email
                // create the user
                var newUser            = new User();

                // set the user's local credentials
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password);

                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });

        });

    }));

    //LOG IN LOCALLY
    passport.use('local-login', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
    }, function(req, email, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });

    }));

    // LOG IN WITH FACEBOOK
    passport.use('facebook', new FacebookStrategy({
    clientID        : '1669457793319000',
    clientSecret    : '158d937b7977303a84d06c423b6fe325',
    callbackURL     : 'https://project-venture-us.herokuapp.com/auth/facebook/callback',
    enableProof     : true,
    // describe the fields we want from FB
    profileFields   : ['name', 'emails']
    // executed when FB sends back the data to the website
    // using auth/facebook/callback
    }, function(access_token, refresh_token, profile, done) {

      // // Use this to see the information returned from Facebook
      // console.log(profile)
      process.nextTick(function() {
        User.findOne({ 'fb.id' : profile.id }, function(err, user) {
          if (err) return done(err);
      // if user already exists, the code directly executes
      // the callback and gives the user object found by mongo
      // to the callback
          if (user) {
            return done(null, user);
          } else {
            var newUser = new User();
            newUser.fb.id           = profile.id;
            newUser.fb.access_token = access_token;
            newUser.fb.firstName    = profile.name.givenName;
            newUser.fb.lastName     = profile.name.familyName;
            newUser.fb.email        = profile.emails[0].value;

            newUser.save(function(err) {
              if (err)
                throw err;
              return done(null, newUser);
            });
          }
        });
      });
    }
  ));
}
