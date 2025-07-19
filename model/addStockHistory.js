const mongoose = require('mongoose');



const addStockHistorySchema = mongoose.Schema({
    productName:String,
    productId:String,
    lastUpdate:{
        type:Date,
       
    },
    numberOfStock:Number,
    reference: String,
    
});

module.exports = mongoose.model("addStockHistory",addStockHistorySchema);