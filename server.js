var express = require('express');
var app = express();
//socket IO stuff
var http = require('http').Server(app);
var _ = require("underscore");
var io = require('socket.io')(http);
//native NodeJS module for resolving paths
var path = require('path');
//get our port # from c9's enviromental variable: PORT
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cors= require('cors');
// Async Parallel
var async = require('async');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

var jwtSecret = 'asesam0/3uk';
//setup, configure, and connect to MongoDB
var mongoose = require('mongoose');
var configDB = require('./server/config/database.js');
mongoose.connect(configDB.url);
app.use(cors());
app.use(bodyParser.json());
app.use(methodOverride());

//Set our view engine to EJS, and set the directory our views will be stored in
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'src', 'views'));

//serve static files from client folder.
//ex: libs/bootstrap/bootstrap.css in our html actually points to client/libs/bootstrap/bootstrap.css
app.use(express.static(path.resolve(__dirname, 'src')));

//io Specific Settings
// io.set('heartbeat timeout',10000);
// io.set('heartbeat interval',9000);
var devices = [];
var sessionsConnections = {};
var numberofusers = 0;
var messagesPoolCount = 0;
// Mini
var user = {
  username : "xively",
  password : "123"
};


io.on('connection', function(socket) {
  var devicename = '';
  numberofusers = io.sockets.server.eio.clientsCount;
  console.log("Number of Users : " + numberofusers);
  console.log("A Device has Connected!" + socket.id);
  
  socket.on('request-devices', function(){
    socket.emit('devices', {devices: devices});
  });
  
  socket.on('message', function(data){
      io.emit('message', {devicename: devicename, message: "room : " + data.message });
  })
  
  socket.on('xternal', function(data){
      io.emit('message', {devicename: devicename, message: {action: data.action , value: data.value }});
  })
  
  socket.on('add-device', function(data){

    if(devices.indexOf(data.devicename) == -1){
      io.emit('add-device', {
        devicename: data.devicename
      });
      devicename = data.devicename;
      devices.push(data.devicename);
      sessionsConnections[socket.id] = { id : socket.id, name : data.devicename};
      console.log(devicename + ' has subscribed!');
    } else {
      socket.emit('prompt-device', {
        message: 'Device Already Subscribed'
      })
    }
  })
  
  socket.on('disconnect', function(){
    console.log(devicename + ' has Disconnected!');
    devices.splice(devices.indexOf(devicename), 1);
    io.emit('remove-device', {devicename: devicename});
  })
});
//POST method to create a chat message
app.post("/xively", function(request, response) {


  //The request body expects a param named "message"
  var message = request.body.message;

  // console.log(request.body);
  //If the message is empty or wasn't sent it's a bad request
  if(_.isUndefined(message) || _.isEmpty(message.trim())) {
    return response.json(400, {error: "Message is invalid"});
  }
  if(_.isUndefined(request.body.action)) {
    return response.json(400, {error: "Action Must be defined"});
  }
  if(_.isUndefined(request.body.value)) {
    return response.json(400, {error: "Values must be defined"});
  }
  
  //We also expect the sender's name with the message
  var devicename = request.body.devicename;
  var to = request.body.to;
  var action = request.body.action;
  var value = request.body.value;
  messagesPoolCount += 1;
  //let them know there was a new message
  var fSession = _.find(sessionsConnections, function(sessionC){ return sessionC.name == to; });

   if (fSession) {
     console.log('Sending..');
     io.sockets.connected[fSession.id].emit('xternal', {devicename: devicename, message: message, action: action, value: value});
   } else {
      io.sockets.emit("message", {message: message, devicename: devicename,  msgs: messagesPoolCount});
       io.sockets.emit("xternal", {message: message, action: action, value: value, msgs: messagesPoolCount});
   }
  //Looks good, let the client know
  response.json(200, {results: "Message received"});

});

// app.use(expressJwt({secret : jwtSecret}).unless({path : ['/login', 
//   '/js/controllers/Actions.js',
//   '/libs/angular/angular.js',
//   'libs/ionic/ionic.css',
//   '/js/controllers/addProduct.js',
//   'libs/chartjs/Chart.js',
//   '/js/*',
//   '/' ,'/#/intro/*', '/#/route/*' ]}));
app.post("/test", function(request, response) {
      parallel({
        timeoutMS: 1000  // 1 second timeout
      },
      [
        function(done){
          // task 1 completes in 100ms
          setTimeout(function(){
              console.log('sending test 1');
              io.sockets.emit("xternal", {message: 'Test 1', action: "ib" , value: 0, msgs: messagesPoolCount});
          }, 100);
        },
        function(done){
          // task 2 completes in 2000ms, forcing a timeout error
          setTimeout(function(){
            console.log('sending test 2');
             io.sockets.emit("xternal", {message: 'Test 2', action: "ib" , value: 0, msgs: messagesPoolCount});
          }, 100);
        }
      ],
      function(err, results) {
        // err = 'async.parallel timed out out after 1000ms.'
      });
});
//set our first route
app.get('/', function(req, res) {
  res.render('index.ejs');
});

app.post('/login', authenticate, function(req, res) {
  
  var token = jwt.sign({
    username: user.username
  }, jwtSecret);
  
  res.send({
    token: token,
    user: user
  });
});

app.post('/me', function(req, res) {
    res.send(req.user);
});


var api = express.Router();
require('./server/routes/api')(api);
app.use('/api', api);



app.get('/*', function(req, res) {
  res.render('index.ejs');
});
//
// async.parallel with optional timeout (options.timeoutMS)
function parallel(options, tasks, cb) {
  //  sanity checks
  options = options || {};

  // no timeout wrapper; passthrough to async.parallel
  if(typeof options.timeoutMS != 'number') return async.parallel(tasks, cb);

  var timeout = setTimeout(function(){
    // remove timeout, so we'll know we already erred out
    timeout = null;

    // error out
    cb('async.parallel timed out out after ' + options.timeoutMS + 'ms.', null);
  }, options.timeoutMS);

  async.parallel(tasks, function(err, result){
    // after all tasks are complete

    // noop if timeout was called and annulled
    if(!timeout) return;

    // cancel timeout (if timeout was set longer, and all parallel tasks finished sooner)
    clearTimeout(timeout);

    // passthrough the data to the cb
    cb(err, result);
  });
}

//make our app listen for incoming requests on the port assigned above
http.listen(port, function() {
  console.log('SERVER RUNNING... PORT: ' + port);
})

function authenticate(req,res, next) {
  var body =  req.body;
  if(!body.username || !body.password) {
    res.status(400).end("Must Provide Username or Password");
  }
  if (body.username!==user.username || body.password !==user.password)  {
     res.status(401).end("Username or Password invalid or incorrect");
  }
  next();
}