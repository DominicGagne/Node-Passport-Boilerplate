
var authenticationModule  = function(app, passport, LocalStrategy, FacebookStrategy) {

    var self = this;

    //calling this function will initialize both local and facebook auth strategies.
    self.initializeAuthentication = function() {

        	console.log("New strategy.");

        //enable passport to use our own local strategy for authenticating users.
        passport.use(new LocalStrategy(
          function(username, password, cb) {        

            //replace this async call with an actual call to the db.
            findByUsername(username, function(err, user) {

                //db has throw a general error. typically means we can't establish connection.
                if (err) { 
              	  return cb(err); 
                }

                //user does not exist.
                if (!user) { 
              	  return cb(null, false); 
                }

                //user exists, but supplied incorrect password.
                if (user.password != password) { 
              	  return cb(null, false); 
                }

                //success, authenticate user
                return cb(null, user);
            });
          }
        ));    

        //enable passport's own Facebook strategy.  This clientID and client secret are
        //exclusive to Inukbook.  You'll have to get your own for each app you create.
        //callbackURL is what facebook will call if you're successfully authenticated.
        passport.use(new FacebookStrategy({
            clientID: "your app's client ID goes here.",
            clientSecret: "your app's client secret goes here.",
            //your callback goes below. Using localhost for development.
            callbackURL: "http://localhost:3000/auth/facebook/callback"
          },
          function(accessToken, refreshToken, profile, done) {
            // placeholder for translating profile into your own custom user object.
            // for now we will just use the profile object returned by Facebook
            return done(null, profile);
          }
        ));      
        

        //cb is our callback function.  First argument is err flag, second is info. 
        //this function is just to be used as an example.  Make a real call to Inukbook db.
        function findByUsername(username, cb) {
            var dom = {username: "dominic", password: "password"};        

            if(username === dom.username) {
              return cb(null, dom);
            }
            return cb(null, null);
        }        
        
        
        // Configure Passport authenticated session persistence.
        //
        // In order to restore authentication state across HTTP requests, Passport needs
        // to serialize users into and deserialize users out of the session.  The
        // typical implementation of this is as simple as supplying the user ID when
        // serializing, and querying the user record by ID from the database when
        // deserializing.        
        

        //facebook serialize and deserialize functions
        passport.serializeUser(function(user, done) {
          // placeholder for custom user serialization
          // first argument is for errors
          done(null, user);
        });        

        passport.deserializeUser(function(user, done) {
          // placeholder for custom user deserialization.
          // first argument is for errors
          console.log("\n\n\nde - serialization in progress.\n\n\n");
          done(null, user);
        });



        // Initialize Passport and restore authentication state, if any, from the
        // session.
        app.use(passport.initialize());
        app.use(passport.session());

    };

    // Simple route middleware to ensure user is authenticated.
    // Use this route middleware on any resource that needs to be protected.  If
    // the request is authenticated (typically via a persistent login session),
    // the request will proceed.  Otherwise, the user will be redirected to the
    // denied page.
    self.ensureAuthenticated = function(req, res, next) {
      if (req.isAuthenticated()) { return next(); }
      res.redirect('/denied');
    };
};

//allow this entire file  to be exported to application.js 
module.exports = authenticationModule;

