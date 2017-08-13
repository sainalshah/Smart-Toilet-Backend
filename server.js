//Copyright 2013-2014 Amazon.com, Inc. or its affiliates. All Rights Reserved.
//Licensed under the Apache License, Version 2.0 (the "License").
//You may not use this file except in compliance with the License.
//A copy of the License is located at
//
//    http://aws.amazon.com/apache2.0/
//
//or in the "license" file accompanying this file. This file is distributed
//on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
//either express or implied. See the License for the specific language
//governing permissions and limitations under the License.

//Get modules.
var express = require('express');
var routes = require('./routes');
var alertModule = require('./config/alert');
var botRouter = require('./routes/botRouter');
var appmtRouter = require('./routes/appointmentRouter');
var generalRoutes = require('./routes/index');
var settingRoutes = require('./routes/settingsRouter');
var adviceRoutes = require('./routes/adviceRouter');
var scanDataRouter = require('./routes/scanRouter');
var NotificationRouter= require('./routes/Notificationrouter');
var debug = require('debug')('rest-server:server');
var http = require('http');
var https = require('https');
var path = require('path');
var fs = require('fs');
var AWS = require('aws-sdk');
var app = express();
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session  = require('express-session');
const xhub = require('express-x-hub');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(xhub({
  algorithm: 'sha1',
  secret: ''}));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));


  app.use(cookieParser('')); // read cookies (needed for auth)

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers"+
    ", Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
  });
  app.use('/messenger/webhook',botRouter);
  app.all('*', function(req, res, next){
    console.log('req start: ',req.secure, req.hostname, req.url, app.get('port'));
    if (req.secure) {
      return next();
    };

    res.redirect('https://'+req.hostname+':'+app.get('secPort')+req.url);
  });

  var passport = require('passport');
  var flash    = require('connect-flash');

  // configuration ===============================================================
  // connect to our database

  require('./config/passport')(passport); // pass passport for configuration
  //require('./config/passportPatient')(passport);



  app.set('view engine', 'ejs'); // set up ejs for templating

  // required for passport
  app.use(session({
    secret: '',
    resave: true,
    saveUninitialized: true,
    maxAge: 20000,
    cookie: { secure: true }
  } )); // session secret
  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions
  app.use(flash()); // use connect-flash for flash messages stored in session


  // routes ======================================================================
  var users = require('./routes/users.js');
  users.routes(app, passport); // load our routes and pass in our app and fully configured passport



  app.use(express.static(path.join(__dirname, 'public')));
  //GET home page.
  app.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/public/app/index.html'));
    //__dirname : It will resolve to your project folder.
  });

  app.use('/',generalRoutes);
  app.use('/appointment',appmtRouter);
  app.use('/parameter',settingRoutes);
  app.use('/advice',adviceRoutes);
  app.use('/scandata',scanDataRouter);
  app.use('/notification',NotificationRouter);
  app.locals.theme = process.env.THEME; //Make the THEME environment variable available to the app.

  alertModule();

  var port = normalizePort(process.env.PORT || '3000');

  app.set('port', port);
  app.set('secPort',port+443);

  /**
  * Create HTTP server.
  */

  var server = http.createServer(app);

  /**
  * Listen on provided port, on all network interfaces.
  */

  server.listen(port, function() {
    console.log('Server listening on port ',port);
  });
  server.on('error', onError);
  server.on('listening', onListening);

  /**
  * Create HTTPS server.
  */ var options = {
  key: fs.readFileSync(__dirname+'/private.key'),
  cert: fs.readFileSync(__dirname+'/certificate.pem')
};

var secureServer = https.createServer(options,app);

/**
* Listen on provided port, on all network interfaces.
*/

secureServer.listen(app.get('secPort'), function() {
  console.log('Server listening on port ',app.get('secPort'));
});
secureServer.on('error', onError);
secureServer.on('listening', onListening);

/**
* Normalize a port into a number, string, or false.
*/

function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}

/**
* Event listener for HTTP server "error" event.
*/

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  var bind = typeof port === 'string'
  ? 'Pipe ' + port
  : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
    console.error(bind + ' requires elevated privileges');
    process.exit(1);
    break;

    case 'EADDRINUSE':
    console.error(bind + ' is already in use');
    process.exit(1);
    break;

    default:
    throw error;
  }
}

/**
* Event listener for HTTP server "listening" event.
*/

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
  ? 'pipe ' + addr
  : 'port ' + addr.port;
  debug('Listening on ' + bind);
};
