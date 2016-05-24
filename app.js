var express = require('express');
var passport = require('passport');

var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

//register our app as an express application
var app = express();

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));


//load and initialize our authentication module
var authenticatationModule = require('./authentication.js');
var authenticationStrategies = new authenticatationModule(app, passport, LocalStrategy, FacebookStrategy);
authenticationStrategies.initializeAuthentication();


//load and initialize our endpoints module for the API
var endspointsAPIMoule = require('./endpointsAPI.js');
var endspointsAPI = new endspointsAPIMoule(app, passport, authenticationStrategies);
endspointsAPI.activateEndpoints();




//our app is now fully initialized, listen on port 3000 and await user action.
app.listen(3000, function() {
  console.log("Now listening on 3000.");
});
