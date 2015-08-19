var mongoose = require('mongoose');
var locationSchema = mongoose.Schema({
		name:{type:String,required:true,index:{unique:true}},
		icon:String,
		note:String,
		featured:Boolean
});

module.exports = mongoose.model('locations', locationSchema);
