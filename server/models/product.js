var mongoose = require('mongoose');
var productSchema = mongoose.Schema({
    productname: {type:String,required:true,index:{unique:true}},
    icon : String,
    large : String,
    medium : String,
    small: String,
    featured : Boolean,
    status : String
    
});

module.exports = mongoose.model('products', productSchema);