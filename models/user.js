var mongoose=require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var userSchema=mongoose.Schema({
	username:{type:Number,required:true},
	name:{type:String,required:true},
	email:{type:String,required:true},
	followers: [
    	{
    		type: mongoose.Schema.Types.ObjectId,
    		ref: 'Shopkeeper'
    	}
    ],
	notifications:[
			{
			type: mongoose.Schema.Types.ObjectId,
    		ref: 'Usernotification'
			}
	]
});
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);