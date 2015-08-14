var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/test');

var Cat = mongoose.model('Cat',{name:String});

var kitty=new Cat({name:'Zildjian'});


kitty.save(function(err){
    if(!err)
      console.log('Success!');
});


var kitty1=new Cat({name:'GATO2'});


kitty1.save(function(err){
    if(!err)
      console.log('Success GATO1!');
});

Cat.find({
    
}, function(err, docs){
     console.log(docs);
});