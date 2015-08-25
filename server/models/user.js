var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    username : {type:String,required:true,index:{unique:true}},
    email : String,
    image : String,
    lat : String,
    lng: String,
    showlocation : Boolean,
    lastlogin: String
});

module.exports = mongoose.model('users', userSchema);