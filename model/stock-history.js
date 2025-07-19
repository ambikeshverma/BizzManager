const mongoose = require('mongoose');



const stockHistorySchema = mongoose.Schema({
    productName:String,
    productId:String,
    lastUpdate:{
        type:Date,
       
    },
    numberOfStock:Number,
    reference: String,
    
});

module.exports = mongoose.model("stockHistory",stockHistorySchema);