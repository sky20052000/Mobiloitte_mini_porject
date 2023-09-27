const mongoose = require("mongoose"); 
//const validator = require("validator");

const postSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
      },
   
    description:{
        type:String,
        required:[true,  "Write your post here"]
    },
 
    category:{
        type:String,
        required:true
    },
  
    

},{timestamps:true});


module.exports = new mongoose.model("Post", postSchema);