var mongoose=require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var shopkeeperSchema=mongoose.Schema({
	username:{type:Number,required:true},
	name:{type:String,required:true},
	email:{type:String,required:true},
	notifications: [
    {
   		type: mongoose.Schema.Types.ObjectId,
    	ref: 'Notification'
    }
    ]
	// usernotifications: [
	// {
	// type: mongoose.Schema.Types.ObjectId,
	// ref: 'Usernotification'
	// }
	// ]
});
shopkeeperSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Shopkeeper", shopkeeperSchema);