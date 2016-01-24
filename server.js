'use strict';
require('dotenv').load();

var express      = require('express');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var bodyParser   = require('body-parser');
var debug        = require('debug')('app:http');
var cookieParser = require('cookie-parser');
var app          = express();
var mongoose     = require('./config/database');
var passport     = require('passport');
var session      = require('express-session');
var env          = require('./config/environment');
var routes       = require('./config/routes');
var flash        = require('connect-flash');


// using favicon in program
// DOES NOT WORK
// app.use(favicon(__dirname + '/public/images/favicon.ico'))

// MIDDLEWARE //
app.use(passport.initialize());
app.use(passport.session());
app.use(session({
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: true
}))
// Setting EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// Logging layer.
app.use(logger('dev'));
// Set up passport strategies
require("./config/passport")(passport)
// Configure the application (and set it's title!).
app.set('title', env.TITLE);
app.set('safe-title', env.SAFE_TITLE);
// Create local variables for use thoughout the application.
app.locals.title = app.get('title');
// Helper layer (parses the requests, and adds further data).
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('notsosecretnowareyou'));
// Useful for debugging the state of requests.
app.use(debugReq);
// Routes to static assets. Uncomment below if you have a favicon.
app.use(express.static(path.join(__dirname, 'public')));

// ROUTING LAYER: static assets, dynamic routes, or 404…
// Defines all of our "dynamic" routes.
app.use('/', routes);
app.use(flash());

// Catches all 404 routes.
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error-handling layer.
app.use(function(err, req, res, next) {
  // In development, the error handler will print stacktrace.
  err = (app.get('env') === 'development') ? err : {};
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
});

function debugReq(req, res, next) {
  debug('params:', req.params);
  debug('query:',  req.query);
  debug('body:',   req.body);
  next();
}

module.exports = app;
