var mongoose = require('mongoose');
var deviceSchema = mongoose.Schema({
    
    productname: {type:String,required:true,index:{unique:true}},
    icon : String,
    large : String,
    medium : String,
    small: String,
    featured : Boolean,
    status : String
    
});

module.exports = mongoose.model('products', deviceSchema);