var mongoose = require('mongoose');
var deviceSchema = mongoose.Schema({
    username: String,
    email : String,
    image : String,
    lat : String,
    lng: String,
    showlocation : Boolean,
    lastlogin: String
});

module.exports = mongoose.model('users', deviceSchema);