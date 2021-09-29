const mongoose=require("mongoose");
const cartSchema= new mongoose.Schema({
    item:{
        type: mongoose.Schema.Types.ObjectId,
		ref: "Product"
    },
    qty:{
        type: Number,
        default: 0
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    // amount:{
    //     type:Number,
    //     default: 0
    // }
},{timestamps:true});

module.exports=mongoose.model('Cart',cartSchema, "Cart");