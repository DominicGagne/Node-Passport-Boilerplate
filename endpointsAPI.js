//several endpoints to be used by our API, some of which are protected (ie, '/protected').
//Such proctected enpoints require a user to be authenticated via our 
//local strategy in order to gain access to those routes.

var endpointsAPI  = function(app, passport, authenticationStrategies) {

    var self = this;

    self.activateEndpoints = function() {
    
        app.get('/protected', authenticationStrategies.ensureAuthenticated, function(req, res) {
            res.status(200).send("You have been authorized and are viewing a proctected page.");
        });        
        
        app.get('/', function (req, res) {
            res.sendFile('Public/index.html');
        });        
        
        //POST /locallogin  TO be used when user submits a form containing information to be validated.
        app.post('/locallogin', passport.authenticate('local',{ failureRedirect: '/' }), function(req, res) {
            res.status(200).send("Authenticated.");
        });
          
        app.get('/logout', function(req, res){
            req.session.destroy(function(err){
                //wait for session to be destroyed and redirect user home.
                res.status(200).send();
            });
        });

    };
};

//allow this entire file  to be exported to application.js 
module.exports = endpointsAPI;
