//several endpoints to be used by our API, some of which are protected (ie, '/protected').
//Such proctected enpoints require a user to be authenticated via our 
//local strategy in order to gain access to those routes.

var endpointsAPI  = function(app, passport, authenticationStrategies, database, rootDir, passwordHash) {

    var self = this;

    self.activateEndpoints = function() {
             
        app.get('/', function (req, res) {
            res.sendFile(rootDir + '/Public/index.html');
        });   

        app.post('/register', function(req, res) {
            if(!req.body.username || !req.body.password) {
                res.status(400).send("Badly formatted request.");
            } else {
                //request is properly formatted and contains all required info.
                registerUser(res, req);
            }
        });  
        
        //POST /locallogin  TO be used when user submits a form containing information to be validated.
        app.post('/locallogin', passport.authenticate('local',{ failureRedirect: '/' }), function(req, res) {
            res.status(200).send('<center><h3>Authenticated.<br>Click <a href="/protected">here</a> to view a proctected page.</h3></center>');
        });

        app.get('/protected', authenticationStrategies.ensureAuthenticated, function(req, res) {
            res.status(200).send("<center><h3>You have been authorized and are viewing a proctected page.</h3></center>");
        });   
          
        app.get('/logout', function(req, res){
            req.session.destroy(function(err){
                //wait for session to be destroyed and redirect user home.
                res.status(200).send();
            });
        });


        //consider putting these helper functions into a module.
        
        function registerUser(res, req) {
            var username = req.body.username;
            var password = req.body.password;
            database.insertOrUpdate("INSERT INTO User (Username, Password) VALUES (?, ?)", [username, passwordHash.generate(password)], function(err, userInsertID) {
                if(err) {
                    res.status(503).send("Database insert failure.");
                } else {
                    //here we pass in an object containing user information to serialize to their session.
                    //in practice, a database call with all pertinent user info would be used here instead.

                    getNewUserInfo(username, req, res, serializeNewUser);
                } 
            });  
        }

        
        function getNewUserInfo(username, req, res, callback) {
            database.fetchFirst("SELECT * FROM User WHERE User.Username = ?", [username], function (userRecord) {
                return callback(userRecord, req, res);
            });
        }

        function serializeNewUser(userRecord, req, res) {
            req.login(userRecord, function(err) {
                if(err) {
                    //unknown error, display error to console and die.
                    console.log("Fatal error in login serialization: ");
                    throw err;
                } else {
                    //success, user is serialized.
                    res.redirect('/protected');
                }
            });
        }

    };
};

//allow this entire file  to be exported to application.js 
module.exports = endpointsAPI;
