var mongoose = require('mongoose');
var settingSchema = mongoose.Schema({
		notification:Boolean,
		usegooglemaps:Boolean,
		googlemapapikey:String,
		email:String,
		sms:String,
		urgentalerts:Boolean,
		devicesnotifications:Boolean,
		devicenotrespondig:Boolean,
		connectionlost:Boolean,
		dFooterFO:String,
		dBodyFO: String,
		kThanksFO: String,
		wTimeFO: String,
		wQueueTD: String
});

module.exports = mongoose.model('settings', settingSchema);