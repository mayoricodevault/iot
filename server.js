var express = require('express');
var app = express();
var favicon = require('express-favicon');
var http = require('http').Server(app);
var _ = require("underscore");
var io = require('socket.io')(http);
var jwtSecret = 'asesam0/3uk';
var session = require("express-session")({
    secret: jwtSecret,
    resave: true,
    saveUninitialized: true
  });
var sharedsession = require("express-socket.io-session");
app.use(favicon(__dirname + '/src/img/favicon.ico'));
//native NodeJS module for resolving paths
var path = require('path');
//get our port # from c9's enviromental variable: PORT
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cors= require('cors');
var moment = require('moment');
// Async Parallel
var async = require('async');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var requestify = require('requestify');
var stringify = require('json-stringify');
var faker  = require('faker');
//setup, configure, and connect to MongoDB
var mongoose = require('mongoose');
var configDB = require('./server/config/config.js');
var sessionsStore = require('./server/models/session');
var sessionMgm = require("./server/services/sessionManagement");
mongoose.connect(configDB.url);
var Firebase = require('firebase');
var appfire = new Firebase(configDB.firebase);
var DeviceList = require('./server/models/device');
var ServerList = require('./server/models/server');
var ProductsList = require('./server/models/product');
app.use(session);
app.use(cors());
app.use(bodyParser.json());
app.use(methodOverride());

//Set our view engine to EJS, and set the directory our views will be stored in
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'src', 'views'));
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

io.use(sharedsession(session));
io.on('connection', function(socket) {
  
  // var cookie = socket.handshake.headers.cookie;
  // var match = cookie.match(/\buser_id=([a-zA-Z0-9]{32})/);  //parse cookie header
  // var userId = match ? match[1] : null;
        
  var devicename = '';
  var CurrentDate = moment().format();
  console.log(CurrentDate);
  numberofusers = io.sockets.server.eio.clientsCount;
  console.log("Number of Users : " + numberofusers);
  console.log("A Device has Connected!" + socket.id);
  sessionMgm.add({
    sessionid : socket.handshake.sessionID,
    socketid : socket.id,
    dt : moment().format(),
    role : 'anonymous'
  });
  
  socket.on('request-devices', function(){
    socket.emit('devices', {devices: devices});
  });
  
  
  socket.on('message', function(data){
      io.emit('message', {devicename: devicename, message: "room : " + data.message });
  });
  
  socket.on('xternal', function(data){
      io.emit('message', {devicename: devicename, message: {action: data.action , value: data.value }});
  });
  
  socket.on('add-device', function(data){

    if(data != null) {
        var user = sessionMgm.getSessionBySocketId(data.socketid);
        if(user != null) {
            io.sockets.socket(user.sessionId).emit('newMessage', data.message);
        } else {
            var sysMsg = {type: "error", message: "User not found!"};
            socket.emit('systemMessage', sysMsg);
        }
    }
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
  
  socket.on('ping', function(data){
    if (data) {
        requestify.request(data.urlServer + "/ping", {
        method: 'GET',
        body: data,
        headers : {
                'Content-Type': 'application/json'
        },
        dataType: 'json'        
         }).then(function(response) {
            // Get the response body
            console.log(response);
        });
    }
  });
  
  
  socket.on('disconnect', function(){
    console.log(socket.id + ' has Disconnected!');
    devices.splice(devices.indexOf(devicename), 1);
    sessionMgm.remove(socket.id);
  });
});
//Redirect Messages
app.post("/xively", function(req, res) {
   io.sockets.emit('message', req.body );
   res.json(200, {results: "Message received"});

});


// app.use(expressJwt({secret : jwtSecret}).unless({path : ['/login', 
//   '/js/controllers/Actions.js',
//   '/libs/angular/angular.js',
//   'libs/ionic/ionic.css',
//   '/js/controllers/addProduct.js',
//   'libs/chartjs/Chart.js',
//   '/js/*',
//   '/' ,'/#/intro/*', '/#/route/*' ]}));
app.post('/pong', function(req, res) {
    if(_.isUndefined(req.params.sessionid) || _.isEmpty(req.params.sessionid)) {
        res.status(400).json({results: "Invalid Request!!!"});
    }
    var sessionid = req.params.sessionid; //req.param('sessionid');
    if(!sessionid) {
        res.status(400).json({results: "Must Have Socket Session Id"});
    }
    io.sockets.emit('pong', {sessionid : sessionid, status : data.status});
    res.status(200).json({results: "Message received and proceed to Forward"});
});

app.get("/random-user", function (req, res) {
 
    
    var user = faker.helpers.createCard();
    user.avatar = faker.image.avatar();
    res.status(200).json({user : user});
});

app.post("/add-people", function (req, res) {
  
  var people = req.body.people;
  var activePeople = appfire.child('people/'+escapeEmail(people.email));
  activePeople
    .once('value', function(snap) {
      if(!snap.val()) {
         activePeople.set(people);
       } 
  });
  res.status(200).json({results: "People Added Successfully"});
});

app.post("/add-message", function (req, res) {
  
  var message = req.body.message;
  var activeMessage = appfire.child('message/',message);
  activeMessage
    .once('value', function(snap) {
      if(!snap.val()) {
         activeMessage.set(message);
       } 
  });
  res.status(200).json({results: "Message Added Successfully"});
});



app.get('/deviceslist', function (req, res) {
   DeviceList.find({}, function(err, data){
         res.json(200, {devices : data});
  });
});
app.get('/productslist', function (req, res) {
   ProductsList.find({}, function(err, data){
         res.json(200, {devices : data});
  });
});
app.get('/serverlist', function (req, res) {
    ServerList.find({}, function(err, data){
      res.json(200, {servers : data});
    });
});
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

app.post('/remotekiosk', function (req, res) {
  var urlRemote  = "";
  requestify.request('https://kiosk-mmayorivera.c9.io/xively', {
    method: 'POST',
    body: req.body,
    headers : {
            'Content-Type': 'application/json'
    },
    dataType: 'json'        
    }).then(function(response) {
        // Get the response body
        console.log(response);
    });
  
    res.json(200, {results: "Message received and proceed to Forward"});
});

app.post("/sync", function(request, response) {
  var sync = request.body;
  if(_.isUndefined(sync) || _.isEmpty(sync) ){
    return response.json(400, {error: "Message is invalid"});
  }
  if(_.isUndefined(sync.socketid)) {
    return response.json(400, {error: "Socket id  Must be defined"});
  }
  if(_.isUndefined(sync.sessionid)) {
    return response.json(400, {error: "Session id  Must be defined"});
  }
  if(_.isUndefined(sync.action)) {
    return response.json(400, {error: "Action Must be defined"});
  }
  if(_.isUndefined(sync.tagId)) {
    return response.json(400, {error: "Tag Id Must be defined"});
  }
    if(_.isUndefined(sync.url)) {
    return response.json(400, {error: "Url Must be defined"});
  }
  
  requestify.request("https://kiosk-mmayorivera.c9.io/sync", {
    method: 'POST',
    body: sync,
    headers : {
            'Content-Type': 'application/json'
    },
    dataType: 'json'        
    }).then(function(res) {
       response.status(200).json(res.getBody());
    });

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
  console.log('SERVER RUNNING... PORT: ' + port + " : " + process.env.IP);
})

function  escapeEmail(email) {
    while (email.toString().indexOf(".") != -1)
      email = email.toString().replace(".",",");
  return email;
}
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