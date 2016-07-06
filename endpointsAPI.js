//several endpoints to be used by our API, some of which are procted (ie, '/protected').
//Such proctected enpoints require a user to be authenticated via either facebook or our
//local strategy in order to gain access to those routes.


//required are the global app variable, passport, as well as our authentication strategies module.
var endpointsAPI  = function(app, passport, authenticationStrategies) {

    var self = this;

    self.activateEndpoints = function() {
    
        app.get('/protected', authenticationStrategies.ensureAuthenticated, function(req, res) {
          res.send("<h3>acess granted</h3>");
        });        
        

        app.get('/denied', function(req, res) {
          res.send("<h3>Access denied.</h3><br><a href='/'>Home</a>");
        });        
        
        

        app.get('/', function (req, res) {
          var html = "<ul>\
            <li><a href='/auth/facebook'>Facebook</a></li>\
            <li><a href='/locallogin'>Local</a></li>\
          </ul>";        

          // dump the user for debugging
          if (req.isAuthenticated()) {
            html += "<p>authenticated as user:</p>"
            html += "<pre>" + JSON.stringify(req.user, null, 4) + "</pre>";
          }        

          res.send(html);
        });        
        
        

        // we will call this to start the Facebook Login process
        app.get('/auth/facebook', passport.authenticate('facebook'));        

        // facebook will call this URL
        app.get('/auth/facebook/callback',
          passport.authenticate('facebook', { failureRedirect: '/' }),
          function(req, res) {
            //res.redirect('/');

            ///fuuuuuuck
            res.send("Success.");
        });        
        
        

        app.get('/locallogin',
          function(req, res){
            var loginHtml = '<form action="/locallogin" method="post">' +
            '<div>' +
            '<label>Username:</label>' +
            '<input type="text" name="username"/><br/>' +
            '</div>' +
            '<div>' +
            '<label>Password:</label>' +
            '<input type="password" name="password"/>' +
            '</div>' +
            '<div>' +
            '<input type="submit" value="Submit"/>' +
            '</div>' +
            '</form>';        

            res.send(loginHtml);
          });
          
        //POST.  TO be used when user submits a form containing information to be validated.
        app.post('/locallogin', 
          passport.authenticate('local', { failureRedirect: '/locallogin' }),
          function(req, res) {
            res.redirect('/');
          });
          
        app.get('/logout',
          function(req, res){
            req.logout();
            res.redirect('/');
          });
          
    };
};

//allow this entire file  to be exported to application.js 
module.exports = endpointsAPI;
