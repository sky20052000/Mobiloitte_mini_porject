

const mongoose = require("mongoose"); 

const socialSchema = new mongoose.Schema({
   facebookId: {
        type: String,
        required: true,
      },
   
    user_name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true
    },
  
    

},{timestamps:true});


module.exports = new mongoose.model("Social", socialSchema);