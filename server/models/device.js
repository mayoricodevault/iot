var mongoose = require('mongoose');
var deviceSchema = mongoose.Schema({
    devicename: {type:String,required:true,index:{unique:true}},
    devicelocation: String,
    icon : String,
    tagid :{type:String,required:true,index:{unique:true}},
    type : String,
    master: String,
    server: String,
    serverId: String,
    serverUrl: String,
    featured : Boolean,
    status : String
});

module.exports = mongoose.model('Device', deviceSchema);