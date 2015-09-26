var express = require('express');
var app = express();
var favicon = require('express-favicon');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var jwtSecret = 'asesam0/3uk';
var session = require("express-session")({
    secret: jwtSecret,
    resave: true,
    saveUninitialized: true
  });
var sharedsession = require("express-socket.io-session");
var _ = require("underscore");
app.use(favicon(__dirname + '/src/img/favicon.ico'));
//native NodeJS module for resolving paths
var path = require('path');
//get our port # from c9's enviromental variable: PORT
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cors= require('cors');
var moment = require('moment');
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
var fcsv = require('fast-csv');
var multipart = require('connect-multiparty');
var schedule = require('node-schedule');
app.use(session);
app.use(cors());
app.use(bodyParser.json());
app.use(methodOverride());
app.use(multipart({
    uploadDir: 'upload'
}));
//Set our view engine to EJS, and set the directory our views will be stored in
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'src', 'views'));
app.use(express.static(path.resolve(__dirname, 'src')));
app.use(express.static(path.join(__dirname,'upload')));
//io Specific Settings
// io.set('heartbeat timeout',10000);
// io.set('heartbeat interval',9000);
var cronPerson = schedule.scheduleJob('*/1 * * * *', function(){
    var postBody ={};
    var CurrentDate = moment().format();
    requestify.request(configDB.vizix_person, {
        method: 'GET',
        body: postBody,
        headers : {'api_key':'root','Content-Type': 'application/json'},
        dataType: 'json'        
         }).then(function(response) {
            // Get the response body
            var data = JSON.parse(response.body);
            // var totalPersons = data.total;
            var personsList = data.results;
            _.each(personsList, function(person){
                var otherFields = person.fields;
                if (!_.isUndefined(person.id) || !_.isEmpty(person.id)) {
                  var people = new Object();
                  people.modifiedTime = person.modifiedTime;
                  people.activated = person.activated;
                  people.name = person.name;
                  people.id = person.serial;
                  people.email = person.serial;
                  people.thingid = person.id;
                  _.each(otherFields, function(field) {
                    if (field.name == "region") {
                      if(_.isEmpty(field.value)) {
                        people.region = "undefined";
                      } else{
                        people.region = field.value;
                      }
                    }
                    if (field.name == "state") {
                      if(_.isEmpty(field.value)) {
                        people.state = "undefined";
                      } else{
                        people.state = field.value;
                      }
                    }
                    if (field.name == "drink") {
                      people.favcoffee = field.value;
                    }
                    if (field.name == "guestCity") {
                      if(_.isEmpty(field.value)) {
                        people.city = "undefined";
                      } else{
                        people.city = field.value;
                      }                      
                    }
                    if (field.name == "lastName") {
                       if(_.isEmpty(field.value)) {
                          people.lname = " ";
                        } else{
                          people.lname = field.value;
                        }                                  
                    }
                    if (field.name == "firstName") {
                      people.fname = field.value;
                    }
                    if (field.name == "greeting") {
                      people.greeting = field.value;
                    }
                   if (field.name == "greeting") {
                      people.greeting = field.value;
                    }
                    if (field.name == "message") {
                      people.msg1 = removeSpecials(field.value);
                      people.msg2 = people.msg1;
                    }
                    people.crcombined = people.city + " "+ people.state;
                  });
                  people.dt_created = CurrentDate;
                  if (_.isEmpty(people.favcoffee) ){
                    people.favcoffee = "select";
                  }
                  var activePeople = appfire.child('people/'+ person.serial);
                  activePeople
                    .once('value', function(snap) {
                      if(!snap.val()) {
                        activePeople.set(people);
                      } else {
                        var oldInfo = snap.val();
                        if (oldInfo.modifiedTime != people.modifiedTime) {
                            activePeople.set(people);
                        }
                      }
                      
                      io.emit('message',{devicename: 'vizix', message: people });
                  }); 
                }
            });
    });
});
var devices = [];
var sessionsConnections = {};
var numberofusers = 0;
var messagesPoolCount = 0;
// Mini
var currentUsers = [
  {username:"admin", password:"asesamo", role:"admin"},
  {username:"xively", password:"asesamo", role:"user"}
];


io.use(sharedsession(session));
io.on('connection', function(socket) {
  
  // var cookie = socket.handshake.headers.cookie;
  // var match = cookie.match(/\buser_id=([a-zA-Z0-9]{32})/);  //parse cookie header
  // var userId = match ? match[1] : null;
        
  var devicename = '';
  var CurrentDate = moment().format();
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
      io.emit('message', {devicename: devicename, message: data.message });
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
            // console.log(response);
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
   res.status(200);
});

app.get("/random-user", function (req, res) {
    var user = faker.helpers.createCard();
    user.avatar = faker.image.avatar();
    res.status(200).json({user : user});
});
app.post("/remotedashboard", function (req, res) {
    var sessInfo = req.body;
     if(_.isUndefined(sessInfo) || _.isEmpty(sessInfo) ){
        return res.status(400).json({error: "Request is invalid"});
    }
    if(_.isUndefined(sessInfo.zonefrom) || _.isEmpty(sessInfo.zonefrom) ){
        return res.status(400).json({error: "Request is invalid"});
    }
    if(_.isUndefined(sessInfo.zoneto) || _.isEmpty(sessInfo.zoneto) ){
        return res.status(400).json({error: "Request is invalid"});
    }
    var regionsObj = Object();
    regionsObj.west = faker.random.number({
        'min': 1,
        'max': 800
      });
    regionsObj.midwest = faker.random.number({
        'min': 1,
        'max': 800
      });
    regionsObj.neMidAtlantic = faker.random.number({
        'min': 1,
        'max': 800
      });
    regionsObj.neNewEngland = faker.random.number({
        'min': 1,
        'max': 800
      });
    regionsObj.sWestSouthCentral = faker.random.number({
        'min': 1,
        'max': 800
      });
    regionsObj.sSouthAtlanticESCentral = faker.random.number({
        'min': 1,
        'max': 800
      });
    var drinkSelObj = Object();
    drinkSelObj.esp = faker.random.number(
      {
        'min': 1,
        'max': 15
      });
    drinkSelObj.amer = faker.random.number(
      {
        'min': 1,
        'max': 15
      });
    drinkSelObj.reg = faker.random.number(
      {
        'min': 1,
        'max': 17
      });
    drinkSelObj.dcaf = faker.random.number(
      {
        'min': 1,
        'max': 15
      });
    drinkSelObj.cap = faker.random.number(
      {
        'min': 1,
        'max': 15
      });
    drinkSelObj.tea = faker.random.number(
      {
        'min': 1,
        'max': 17
      });
    var totVisitors = faker.random.number(
      {
        'min': 1,
        'max': 100
      });
    var totalPerType = drinkSelObj.esp+drinkSelObj.amer+drinkSelObj.reg+drinkSelObj.dcaf+drinkSelObj.cap+drinkSelObj.tea;
    if (totVisitors < totalPerType ) {
      totVisitors = totalPerType + faker.random.number(
      {
        'min': 1,
        'max': 100
      });
    }
    
    var stationSelObj = Object();
    stationSelObj.station1 = faker.random.number({
        'min': 1,
        'max': 100
      });
    stationSelObj.station2 = faker.random.number({
        'min': 1,
        'max': 100
      });
    stationSelObj.station3 = faker.random.number({
        'min': 1,
        'max': 100
      });
    var dashObj = Object();
    dashObj.onzas = faker.random.number({
        'min': 1,
        'max': 999
      });
    dashObj.drinksServed =  drinkSelObj;
    dashObj.regions = regionsObj;
    dashObj.zoneto = sessInfo.zoneto;
    dashObj.zonefrom = sessInfo.zonefrom;
    dashObj.stations = stationSelObj;
    dashObj.totVisitors = totVisitors;
    var remoteUrl = configDB.kiosk +'/dashboard';
    requestify.request(remoteUrl, {
    method: 'POST',
    body: dashObj,
    headers : {
            'Content-Type': 'application/json'
    },
    dataType: 'json'        
    }).then(function(response) {
      res.status(200).json({totals : dashObj});
    });
    res.status(200);
});
app.post("/remotedashboardxively", function (req, res) {
    var sessInfo = req.body;
     if(_.isUndefined(sessInfo) || _.isEmpty(sessInfo) ){
        return res.status(400).json({error: "Request is invalid"});
    }
    if(_.isUndefined(sessInfo.zonefrom) || _.isEmpty(sessInfo.zonefrom) ){
        return res.status(400).json({error: "Request is invalid"});
    }
    if(_.isUndefined(sessInfo.zoneto) || _.isEmpty(sessInfo.zoneto) ){
        return res.status(400).json({error: "Request is invalid"});
    }
    var dashObj = Object();
    dashObj = {

			"onzas": 2416,
			"drinksServed": {
				"esp": 34,
				"amer": 20,
				"reg": 44,
				"dcaf": 6,
				"cap": 24,
				"tea": 18
				},
			"regions":{
				"west": 21,
				"midwest": 5,
				"neMidAtlantic": 6,
				"neNewEngland": 60,
				"sWestSouthCentral": 6,
				"sSouthAtlanticESCentral": 2
				},
			"zoneto": "zRTLucCqjmpxNWVLAAGz",
			"zonefrom": "vizix",
			"stations":{
				"station1": 33,
				"station2": 21,
				"station3": 47
				},
			"totVisitors": 182
		}
    
    var remoteUrl = configDB.kiosk +'/dashboard';
    requestify.request(remoteUrl, {
    method: 'POST',
    body: dashObj,
    headers : {
            'Content-Type': 'application/json'
    },
    dataType: 'json'        
    }).then(function(response) {
      res.status(200).json({totals : dashObj});
    });

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
  var postsRef = appfire.child("messages");
  var newPostRef = postsRef.push();
  
  newPostRef
    .once('value', function(snap) {
      if(!snap.val()) {
         newPostRef.set(message);
       } 
  });
  res.status(200).json({results: "Message Added Successfully"});
});
app.post("/update-message", function (req, res) {
  var message = req.body.message;
  var postsRef = appfire.child("messages/"+message.id);
  postsRef
    .once('value', function(snap) {
      if(snap.val()) {
         postsRef.set(message);
       } 
  });
  res.status(200).json({results: "Message UPdated Successfully"});
});
app.get('/deviceslist', function (req, res) {
   DeviceList.find({}, function(err, data){
     if (err) {
          res.status(400).send('Error While loading');
     }
     res.status(200).json({devices : data});
  });
});
app.get('/productslist', function (req, res) {
   ProductsList.find({}, function(err, data){
      if (err) {
        res.status(400).send('Error While loading');
      }
    res.status(200).json({products : data});
  });
});
app.get('/serverlist', function (req, res) {
    ServerList.find({}, function(err, data){
    if (err) {
        res.status(400).send('Error While loading');
      }      
      res.status(200).json({servers : data});
    });
});
//set our first route
app.get('/', function(req, res) {
  res.render('index.ejs');
});

app.post('/login', authenticate, function(req, res) {
  var credentials = req.body;
  var authUser = _.where(currentUsers, {username : credentials.username});
  if (authUser.length >0) {
    var userName = authUser[0].username;
    var role = authUser[0].role;
    var token = jwt.sign({
      username: userName
    }, jwtSecret);
    res.send({
      token: token,
      username : userName,
      role : role
    });
  }
});

app.post('/upload', function (req, res, cfg) {
      var data = _.pick(req.body, 'type')
        , uploadPath = path.normalize(cfg.data + '/uploads')
        , file = req.files.file;
      res.status(200);
});

app.get('/importfile', function (req, res) {
    fcsv.fromPath("xlast.csv")
   .on("data", function(data){
      if(!_.isEmpty(data)) {
          var people = new Object();
          people.id = data[0];
          people.email = data[0];
          people.name = removeSpecials(data[1]);
          people.fname = removeSpecials(data[2]);
          people.lname = removeSpecials(data[3]);
          people.city = removeSpecials(data[4]);
          people.state = removeSpecials(data[5]);
          people.region = removeSpecials(data[6]);
          people.favcoffee = removeSpecials(data[7].toLowerCase());
          people.greeting = removeSpecials(data[8]); 
          people.msg1 = removeSpecials(data[9]);
          people.msg2 = removeSpecials(data[9]);
          people.crcombined = people.city + " "+ people.state;
          if (people.favcoffee == "cofee"){
            people.favcoffee = "Regular Coffee";
          }
          if (people.favcoffee == "expresso"){
            people.favcoffee = "Espresso";
          }
          if (people.favcoffee == "cappuchino"){
            people.favcoffee = "Capuccino";
          }
           if (people.favcoffee == "decaf"){
            people.favcoffee = "Decaf coffee";
          }
          if (people.favcoffee == "americano"){
            people.favcoffee = "Americano";
          }
          if (people.favcoffee == "tea"){
            people.favcoffee = "Tea";
          }
          var activePeople = appfire.child('people/'+ people.email);
          activePeople
            .once('value', function(snap) {
              if(!snap.val()) {
                 activePeople.set(people);
                 io.emit('message', people);
               }
          });
      }
   })
   .on("end", function(){
       res.status(200).json({results : "done"});
   });
});
app.post('/me', function(req, res) {
    res.send(req.user);
});
app.post('/remotekiosk', function (req, res) {
  console.log(req.body);
  var remoteUrl = configDB.kiosk +'/xively';
  requestify.request(remoteUrl, {
    method: 'POST',
    body: req.body,
    headers : {
            'Content-Type': 'application/json'
    },
    dataType: 'json'        
    }).then(function(response) {
        res.status(200).json(response);
    });
});
app.post('/remotewelcome', function (req, res) {
  var remoteUrl = configDB.kiosk +'/welcome';
  console.log(req.body);
  requestify.request(remoteUrl, {
    method: 'POST',
    body: req.body,
    headers : {
            'Content-Type': 'application/json'
    },
    dataType: 'json'        
    }).then(function(response) {
        res.status(200).json(response);
    });
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


//make our app listen for incoming requests on the port assigned above
http.listen(port, function() {
  console.log('SERVER RUNNING... PORT: ' + port + " : " + process.env.IP);
});

function  escapeEmail(email) {
    while (email.toString().indexOf(".") != -1)
      email = email.toString().replace(".",",");
  return email;
}

function removeSpecials(str) {
    var lower = str.toLowerCase();
    var upper = str.toUpperCase();
    var res = "";
    for(var i=0; i<lower.length; ++i) {
        if(lower[i] != upper[i] || lower[i].trim() === '')
            res += str[i];
    }
    return res;
}
function authenticate(req,res, next) {
  var body =  req.body;
  if(!body.username || !body.password) {
    res.status(400).end("Must Provide Username or Password");
  }
  var userAvail = _.where(currentUsers, {username : body.username});
  console.log(userAvail.length);
  if (userAvail.length == 0) {
    res.status(401).end("Username or Password invalid or incorrect");
  }
  if (userAvail.length > 0 ) {
    if (body.username!== userAvail[0].username || body.password !== userAvail[0].password)  {
       res.status(401).end("Username or Password invalid or incorrect");
    }
  }
  next();
}