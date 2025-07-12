const mongoose = require('mongoose');

const stockSchema = mongoose.Schema({
    product: String,
    catagory: String,
    curentStock: Number,
    minMaxStock: Number,
    lastUpdate:{
        type:Date,
        default:Date.now
    },
    supplier:String
});

module.exports = mongoose.model("product",stockSchema);