var mongoose = require('mongoose');
var CounterSchema = mongoose.Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 0 }
});
var counter = mongoose.model('counter', CounterSchema);
var transactionSchema = mongoose.Schema({
	trnsno :String,//{type:String,required:true,index:{unique:true}},
	email: String,
	product :String,
	tagid : String,
	zipcode : String,
	region : String,
	dt: Date
});
/*transactionSchema.pre('save', function(next) {
    var doc = this;
    counter.findByIdAndUpdate({_id: 'entityId'}, {$inc: { seq: 1} }, function(error, counter)   {
        if(error)
            return next(error);
        doc.trnsno = counter.seq;
        next();
    });
});*/

module.exports = mongoose.model('transaction', transactionSchema);