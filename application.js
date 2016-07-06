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

//this application will be built on a MySQL Relational Database.
var mysql = require('mysql');

//hashing library to hash sensitive user information.
var passwordHash = require('password-hash');

//body-parser will enable us to access information in incoming request bodies.
var bodyParser = require('body-parser');


process.stdout.write("Initializing application...");
//register our app as an express application
var app = express();


//enable our application to use the body parsing library imported above.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({limit: "5mb", extended: true, parameterLimit:5000}));

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('cookie-parser')());
app.use(require('express-session')({ secret: 'yours only', resave: false, saveUninitialized: false }));

//load the database module, and allow for connections to be made from the server side code.
var databaseModule = require('/Database/database.js');
var database = new databaseModule(mysql);
database.acquireConnection();

//load and initialize our authentication module
var authenticatationModule = require('./authentication.js');
var authenticationStrategies = new authenticatationModule(app, passport, LocalStrategy, database, passwordHash);
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
