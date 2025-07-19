const mongoose = require('mongoose');



const installationSchema = mongoose.Schema({
   
   teamName:String,
   brand:String,
   address:String,
   lastUpdate:{
        type:Date,
      //   default: Date.now
    },
   reference:String
   
});

module.exports = mongoose.model("installation",installationSchema);