var Device = require('../models/device');
var Product = require('../models/product');
var Setting = require('../models/setting');
var Location = require('../models/location');
var User = require('../models/user');
var Server = require('../models/server');

module.exports = function(router, socket){
    // Device
    router.post('/devices', function(req, res){
        var device = new Device();
        device.devicename = req.body.devicename;
        device.devicelocation = req.body.devicelocation;
        device.tagid = req.body.tagid;
        device.icon = req.body.icon;
        device.featured = req.body.featured;
        device.type = req.body.type;
        
        device.save(function(err, data){
            if(err)
                return res.status(400).end("The field must be unique.");
                //throw err;
            res.json(data);
        });
    });
    
    
    router.get('/devices', function(req, res){
        Device.find({}, function(err, data){
            console.log(data);
            res.json(data);
        });
    });
    
    router.delete('/devices', function(req, res){
        Device.remove({}, function(err){
            res.json({result: err ? 'error' : 'ok'});
        });
    });
    
    router.get('/devices/:id', function(req, res){
        Device.findOne({_id: req.params.id}, function(err, data){
            res.json(data);
        })
    })
    
    router.delete('/devices/:id', function(req, res){
        Device.remove({_id: req.params.id}, function(err){
            res.json({result: err ? 'error' : 'ok'});
        })
    })
    
    router.post('/devices/:id', function(req, res){
        
        Device.findOne({_id: req.params.id}, function(err, data){
            var device = data;
            device.devicename = req.body.devicename;
            device.devicelocation = req.body.devicelocation;
            device.icon = req.body.icon;
            device.tagid = req.body.tagid;
            device.featured = req.body.featured;
            device.type = req.body.type;
            device.save(function(err, data){
                if(err)
                    throw err;
                res.json(data);
            });
            
        });
    });
    
    
    // Produts
    router.post('/products', function(req, res){
     
        var product = new Product();
        product.productname = req.body.productname;
        product.icon = req.body.icon;
        product.large = req.body.large;
        product.medium = req.body.medium;
        product.small = req.body.small;
        product.featured = req.body.featured;
        
        product.save(function(err, data){
            if(err)
                return res.status(400).end("The name field must be unique.");
            res.json(data);
        });
    });
    
    router.get('/products', function(req, res){
        Product.find({}, function(err, data){
            console.log(data);
            res.json(data);
        });
    });
    
    router.delete('/products', function(req, res){
        Product.remove({}, function(err){
            res.json({result: err ? 'error' : 'ok'});
        });
    });
    
    router.get('/products/:id', function(req, res){
        Product.findOne({_id: req.params.id}, function(err, data){
            res.json(data);
        })
    })
    
    router.delete('/products/:id', function(req, res){
        Product.remove({_id: req.params.id}, function(err){
            res.json({result: err ? 'error' : 'ok'});
        })
    })
    
    router.post('/products/:id', function(req, res){
        
        Product.findOne({_id: req.params.id}, function(err, data){
            var product = data;
            product.productname = req.body.productname;
            product.icon = req.body.icon;
            product.large = req.body.large;
            product.medium = req.body.medium;
            product.small = req.body.small;
            product.featured = req.body.featured;
            
            product.save(function(err, data){
                if(err)
                    throw err;
                res.json(data);
            });
            
        });
    });
    
    
    // Setting
    router.post('/settings', function(req, res){
        var setting = new Setting();
        setting.notification = req.body.notification;
        setting.usegooglemaps = req.body.usegooglemaps;
        setting.googlemapapikey=req.body.googlemapapikey;
        setting.email=req.body.email;
        setting.sms=req.body.sms;
        setting.urgentalerts = req.body.urgentalerts;
        setting.devicesnotifications=req.body.devicesnotifications;
        setting.devicenotrespondig=req.body.devicenotrespondig;
        setting.connectionlost=req.body.connectionlost;
        setting.save(function(err, data){
            if(err)
                throw err;
            res.json(data);
        });
    });
    
    router.get('/settings/', function(req, res){
        Setting.find({}, function(err, data){
            console.log(data);
            res.json(data);
        });
    });
    
     router.post('/settings/:id', function(req, res){
        
        Setting.findOne({_id: req.params.id}, function(err, data){
            var setting = data;
            setting.notification = req.body.notification;
            setting.usegooglemaps = req.body.usegooglemaps;
            setting.googlemapapikey=req.body.googlemapapikey;
            setting.email=req.body.email;
            setting.sms=req.body.sms;
            setting.urgentalerts = req.body.urgentalerts;
            setting.devicesnotifications=req.body.devicesnotifications;
            setting.devicenotrespondig=req.body.devicenotrespondig;
            setting.connectionlost=req.body.connectionlost;
            setting.save(function(err, data){
                if(err)
                    throw err;
                res.json(data);
            });
            
        });
    });
    
    
    // Location
    router.post('/locations', function(req, res){
        var location = new Location();
        location.name = req.body.name;
        location.icon = req.body.icon;
        location.note = req.body.note;
        location.featured=req.body.featured;
        location.save(function(err, data){
            if(err){
                return res.status(400).end("The name field must be unique.");
                //throw err;
            }
                
            res.json(data);
        });
    });
    
    router.get('/locations/', function(req, res){
        Location.find({}, function(err, data){
            console.log(data);
            res.json(data);
        });
    });
    
     router.post('/locations/:id', function(req, res){
        
        Location.findOne({_id: req.params.id}, function(err, data){
            var location = data;
            location.name = req.body.name;
            location.icon = req.body.icon;
            location.note = req.body.note;
            location.featured=req.body.featured;
            location.save(function(err, data){
                if(err)
                    throw err;
                res.json(data);
            });
            
        });
    });
    
    
    router.delete('/locations', function(req, res){
        Location.remove({}, function(err){
            res.json({result: err ? 'error' : 'ok'});
        });
    });
        
      router.delete('/locations/:id', function(req, res){
        Location.remove({_id: req.params.id}, function(err){
            res.json({result: err ? 'error' : 'ok'});
        })
    })
    
    // User
    router.post('/users', function(req, res){
        var user = new User();
        user.username = req.body.username;
        user.email = req.body.email;
        user.image = req.body.image;
        user.lat = req.body.lat;
        user.lng = req.body.lng;
        user.showlocation = req.body.showlocation;
        
        user.save(function(err, data){
            if(err)
                return res.status(400).end("The Username field must be unique.");
            res.json(data);
        });
    });
    
    router.get('/users', function(req, res){
        User.find({}, function(err, data){
            res.json(data);
        });
    });
    
    router.delete('/users', function(req, res){
        User.remove({}, function(err){
            res.json({result: err ? 'error' : 'ok'});
        });
    });
    
    router.get('/users/:id', function(req, res){
        User.findOne({_id: req.params.id}, function(err, data){
            res.json(data);
        })
    })
    
    router.delete('/users/:id', function(req, res){
        User.remove({_id: req.params.id}, function(err){
            res.json({result: err ? 'error' : 'ok'});
        })
    })
    
    router.post('/users/:id', function(req, res){
        
        User.findOne({_id: req.params.id}, function(err, data){
            var user = data;
            user.username = req.body.username;
            user.email = req.body.email;
            user.image = req.body.image;
            user.lat = req.body.lat;
            user.lng = req.body.lng;
            user.showlocation = req.body.showlocation;
            
            user.save(function(err, data){
                if(err)
                    throw err;
                res.json(data);
            });
            
        });
    });
    
    
    
     // Server
    router.post('/servers', function(req, res){
        var server = new Server();
        server.name = req.body.name;
        server.ipaddress = req.body.ipaddress;
        server.url = req.body.url;
        server.save(function(err, data){
            if(err){
                return res.status(400).end("The name field must be unique.");
                //throw err;
            }
            res.json(data);
        });
    });
    
    router.get('/servers/', function(req, res){
        Server.find({}, function(err, data){
            console.log(data);
            res.json(data);
        });
    });
    
     router.post('/servers/:id', function(req, res){
        
        Server.findOne({_id: req.params.id}, function(err, data){
            var server = data;
            server.name = req.body.name;
            server.ipaddress = req.body.ipaddress;
            server.url = req.body.url;
            server.save(function(err, data){
                if(err)
                    throw err;
                res.json(data);
            });
            
        });
    });
    
    
    router.delete('/servers', function(req, res){
        Server.remove({}, function(err){
            res.json({result: err ? 'error' : 'ok'});
        });
    });
        
      router.delete('/servers/:id', function(req, res){
        Server.remove({_id: req.params.id}, function(err){
            res.json({result: err ? 'error' : 'ok'});
        })
    });
    
}