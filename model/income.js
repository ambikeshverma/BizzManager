const mongoose = require('mongoose');



const incomeSchema = mongoose.Schema({
    lastUpdate:{
        type:Date,
        // default: Date.now
    },
    remark: String,
    amount:Number,
    paymentType:String
});

module.exports = mongoose.model("income",incomeSchema);