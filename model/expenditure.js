const mongoose = require('mongoose');



const expensesSchema = mongoose.Schema({
    lastUpdate:{
        type:Date,
        // default: Date.now
    },
    description: String,
    amount:Number,
    ResPerson: String,
    category:String
});

module.exports = mongoose.model("expense",expensesSchema);