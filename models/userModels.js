const mongoose  = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const  userSchema = mongoose.Schema({
         name:{
            type:String,
            required:true,
            trim:true,
            maxlength:[20],
            minlength:[2]
         },
         email:{
            type:String,
            required:true,
            trim:true,
            maxlength:[50],
            minlength:[6]
         },
         password:{
            type:String,
            required:true,
            trim:true,
            maxlength:[25],
            minlength:[3]
         },
         profilePic:{
            type:String,
             default:null
         },
         role:{
            type:String,
            enum : [1,2], // 1=>user, 2=>admin
            default:1
         },
         Token:{
            type:String,
            default:null
         },
         resetPasswordToken:{
            type:String,
            default:null
         },
         resetPasswordExpires:{
            type:Date,
            default:null
        }
 
},{timestamps:true});



//hash password 
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next()
    }
    this.password = await bcrypt.hash(this.password,10)

})
   
// // generate token 
//   userSchema.methods.generateToken = async ()=>{
//       return jwt.sign({role:this.role},process.env.Jwt_Secret_Key ,{
//          expiresIn:"2d"
//       })
//   }

  // compare password s
      userSchema.methods.comparePassword = async function(EnterPassword){
            return await bcrypt.compare(EnterPassword, this.password);
      }


module.exports = mongoose.model("User",userSchema);