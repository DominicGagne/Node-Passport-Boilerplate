var authenticationModule  = function(app, passport, LocalStrategy, database, passwordHash) {
    
    process.stdout.write("Initializing Authentication Module...");

    var self = this;

    self.initializeAuthentication = function() {

        //specify how you want the Local Strategy to authenticate users.
        passport.use(new LocalStrategy(
            {
              passReqToCallback: true
            },
            function(req, username, password, done) {
                console.log("REQUEST BODY: ", req.body);
                console.log("\n\nsearching for user...\n\n");
                database.fetchFirst("SELECT * FROM User WHERE User.Username = ?", [username], function (userRecord) {
                    if(! userRecord) { 
                        //no user found in database.
                        return done(null, false); 
                    }

                    if(! validatePassword(userRecord, password)) { 
                      //user exists, but supplied an incorrect password.
                      return done(null, false); 
                    }

                    //credentials correct, serialize this authenticated user.
                    //all information in 'userRecord' can now be 
                    //accessed in req.user for all authenticated requests.
                    return done(null, userRecord);
                });
            }
        ));

        //custom user serialization
        passport.serializeUser(function(user, done) {
            console.log("\n\nSERIALIZATION in progress.\n");
            console.log("USER: " ,user); 
            done(null, user); 
        });        

        //custom user deserialization.
        //first argument is for errors, use as you see fit.
        passport.deserializeUser(function(user, done) {
            console.log("\n\n\nDE - SERIALIZATION in progress.\n");
            console.log("USER: " + JSON.stringify(user));

            done(null, user);
        });


        //Initialize Passport.
        app.use(passport.initialize());
        app.use(passport.session());

    };
    
    //middleware to ensure only authenticated users are able to access restricted API endpoints
    //or perform certain actions. You can write your own similar function that might check
    //to see that the user is an administrator. 
    self.ensureAuthenticated = function(req, res, next) {
      if (req.isAuthenticated()) {
          //user is authenticated, allow them to access the requested API endpoint.
          return next();
      }
      //unauthorized, give the client 403 FORBIDDEN
      res.status(403).send("Not authenticated.");
    };

    //validates user supplied password against hashed password in the database.
    //returns true on match, false on non-match
    function validatePassword(userRecord, password) {
        return passwordHash.verify(password, userRecord.Password);
    }

    console.log("done.");
};

//allow functions in this module to be accessible from other files in this codebase.
module.exports = authenticationModule;
