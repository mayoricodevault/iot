var mongoose = require('mongoose');
var deviceSchema = mongoose.Schema({
    
    productname: String,
    icon : String,
    large : String,
    medium : String,
    small: String,
    featured : Boolean,
    status : String
    
});

module.exports = mongoose.model('products', deviceSchema);