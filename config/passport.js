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
        console.log('deserializing user:',user);
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

    //SIGN UP WITH FACEBOOK
    passport.use('facebook', new FacebookStrategy({
    clientID        : process.env.FACEBOOK_API_KEY,
    clientSecret    : process.env.FACEBOOK_API_SECRET,
    callbackURL     : 'http://localhost:3000/auth/facebook/callback',
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
