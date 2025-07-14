const mongoose = require('mongoose');



const paymentSchema = mongoose.Schema({
    teamName:String,
    lastUpdate:{
        type:Date,
        default: Date.now
    },
    reference: String,
    amount:Number,
});

module.exports = mongoose.model("payment",paymentSchema);