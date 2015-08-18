var mongoose = require('mongoose');
var locationSchema = mongoose.Schema({
		name:String,
		icon:String,
		note:String,
		featured:Boolean
});

module.exports = mongoose.model('locations', locationSchema);