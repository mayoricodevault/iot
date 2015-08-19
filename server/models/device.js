var mongoose = require('mongoose');
var deviceSchema = mongoose.Schema({
    devicename: {type:String,required:true,index:{unique:true}},
    devicelocation: String,
    icon : String,
    tagid : String,
    type : String,
    masterdevice: String,
    featured : Boolean,
    status : String
});

module.exports = mongoose.model('Device', deviceSchema);