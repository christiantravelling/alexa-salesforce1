var AlexaAppServer = require('alexa-app-server');

//create a new server with the appropriate attributes
var server = new AlexaAppServer({
    server_root:__dirname,     		      // Path to root
    public_html:"public_html", 		      // Static content
    app_dir:"apps",            		      // Where alexa-app modules are stored
    app_root:"/alexa/",        		      // Service root
    debug:true,
    port:process.env.PORT || 8080       // What port to use, duh
});

//start the server
server.start();

//enables CORS on express
server.express.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
