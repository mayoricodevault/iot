var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
    text: String,
    start: String,
    end : String,
    expositor :String,
});

module.exports = mongoose.model('Message', messageSchema);