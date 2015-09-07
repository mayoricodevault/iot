var mongoose = require('mongoose');

var transactionSchema = mongoose.Schema({
	trnsno : {type:String,required:true,index:{unique:true}},
	email: String,
	product :String,
	tagid : String,
	zipcode : String,
	region : String,
	dt: Date
});

module.exports = mongoose.model('transaction', transactionSchema);