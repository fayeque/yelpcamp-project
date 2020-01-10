var mongoose=require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var usernotificationSchema = new mongoose.Schema({
	isAvailable:String,
	pprice:String,
	stock:Number,
	customer:{
		id:{
			type: mongoose.Schema.Types.ObjectId,
    		ref: 'User'
		},
		username:String
	},
		shopkeeper:{
			id:
		{
			type: mongoose.Schema.Types.ObjectId,
    		ref: 'Shopkeeper'
		},
			username:String
		},
	isRead: { type: Boolean, default: false }
});

module.exports = mongoose.model("Usernotification", usernotificationSchema);