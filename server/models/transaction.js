var mongoose = require('mongoose');
var CounterSchema = mongoose.Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 0 }
});
var counter = mongoose.model('counter', CounterSchema);
var transactionSchema = mongoose.Schema({
	trnsno : {type:String,required:true,index:{unique:true}},
	email: String,
	product :String,
	tagid : String,
	zipcode : String,
	region : String,
	dt: Date
});
transactionSchema.pre('save', function(next) {
    var doc = this;
    console.log("next: ",next);
    counter.findByIdAndUpdate({_id: 'trnsno'}, {$inc: { seq: 1} }, function(error, counter)   {
        //console.log("error: ",error);
        //console.log("error: ",counter);
        if(error)
            return next(error);
        doc.trnsno = counter.seq;
        next();
    });
});

module.exports = mongoose.model('transaction', transactionSchema);