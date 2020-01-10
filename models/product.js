var mongoose=require("mongoose");
var productSchema=mongoose.Schema({
	product_name:{type:String,required:true},
	product_price:{type:Number,required:true}
})
module.exports = mongoose.model("Product", productSchema);