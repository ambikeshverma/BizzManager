const mongoose = require('mongoose');



const teamSchema = mongoose.Schema({
    teamName:String,
    totalInstallation:Number,
    amount:Number
});

module.exports = mongoose.model("team",teamSchema);