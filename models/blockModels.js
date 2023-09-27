

const mongoose = require("mongoose"); 
//const validator = require("validator");

const blockSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
      },
   
    user_name:{
        type:String,
        required:true
    },
  
    

},{timestamps:true});


module.exports = new mongoose.model("Block", blockSchema);