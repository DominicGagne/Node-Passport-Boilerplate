//the express framework will be used to manage HTTP requests to our server side code.
//express allows us to write a scalable API. Used by a large majority of node projects.
var express = require('express');

//passport is an authentication library that enables authentication middleware 
//for one, some, or all endpoints in the API.
var passport = require('passport');

//within passport, different 'strategies' allow us to authenticate 
//users in a variety of different manners.
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

process.stdout.write("Initializing application...");

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


console.log("initilization complete.");

//our app is now fully initialized, listen on port 3000 and await a request from the client.
app.listen(3000, function() {
  console.log("Now listening on 3000.");
});
