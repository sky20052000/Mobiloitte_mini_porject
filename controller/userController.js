require("dotenv").config();
const User = require("../models/userModels");
const Validator = require("validator");
const jwt = require("jsonwebtoken");
const Block = require("../models/blockModels");
const bcrypt = require("bcrypt");
const util = require("../utils/mail");
const randomstring = require("randomstring");
const multer = require("multer");
const path = require("path");
// const storage = multer.diskStorage({
//    destination:(req,file,cb)=>cb(null,'uploads'),
//    filename:(req,file,cb)=>{
//        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.
//            originalname)}`;
//            cb(null,uniqueName);
       
//    }
// })

// var upload = multer({
//    storage,
//    limit:{fileSize:100000 * 10}
// }).single('file');


const regsiterUSer = async (req, res) => {
  try {
    //console.log(req.body,"nn")
    let { name, email, password, role } = req.body;
    if (!(name && email && password)) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Manadatory fields can not be empty",
        });
    }

    // check valid email
    const validEmail = Validator.isEmail(email);
    if (!validEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter valid email" });
    }

    const findUser = await User.findOne({ email });
    if (findUser) {
      return res
        .status(400)
        .json({ success: false, message: "Please login with credentails" });
    }
    // save user
    let newUser = {
      name,
      email,
      password,
      role,
    };

    await User.create(newUser);
    return res.status(201).json({
      success: true,
      message: "User register successfully",
    });
  } catch (e) {
    console.log(e, "ee");
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Manadatory fields can not be empty",
        });
    }

    // check valid email
    const validEmail = Validator.isEmail(email);
    if (!validEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter valid email" });
    }

    // const find user
    const find_User = await User.findOne({ email });
    if (!find_User) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exists!" });
    }

    // compare password
    const isMatchPassword = await find_User.comparePassword(password);
    if (!isMatchPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Password mismatch!" });
    }

    let userData = {
      id: find_User._id,
      name: find_User.name,
      email: find_User.email,
      role: find_User.role,
    };
    // generate token
    const token = jwt.sign(
      { id: find_User._id, role: find_User.role },
      process.env.Jwt_Secret_Key,
      { expiresIn: "1h" }
    );
    return res.status(200).json({
      sucess: true,
      data: userData,
      token: token,
    });
  } catch (e) {
    console.log(e, "ee");
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const getUser = await User.findById({ _id: req.params.id });
    if (!getUser) {
      return res
        .status(400)
        .json({ success: false, message: "No user found!" });
    }
    return res.status(400).json({ success: false, data: getUser });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    let { userId, password } = req.body;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Mandatory fields can not be empty!",
      });
    }
    const userData = await User.findById({ _id: userId });
    if (!userData) {
      return res.status(400).json({
        success: false,
        message: "User does not exists!",
      });
    }
    // console.log(userData,"gg")
    const hashPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(
      { _id: userId },
      {
        $set: { password: hashPassword },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Password update successfully!",
    });
  } catch (e) {
    //  console.log(e,"ee")
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

const fotgetPassword = async (req, res) => {
  try {
    let { email } = req.body;
    // check valid email
    const validEmail = Validator.isEmail(email);
    if (!validEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter valid email" });
    }

    // const find user
    const find_User = await User.findOne({ email });
    if (!find_User) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exists!" });
    }

    const token = randomstring.generate();
    await User.updateOne({ email }, { $set: { Token: token } });
    await util.sendEmail(find_User.name, find_User.email, token);
    return res
      .status(200)
      .json({
        success: true,
        message: "Email send successfully please check your mail!",
      });
  } catch (e) {
    //  console.log(e,"ee")
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    //  console.log(req.query.token,"token")
    let { password } = req.body;
    const getToken = await User.findOne({ Token: req.query.token });
    if (!getToken) {
      return res.status(400).json({
        success: true,
        message: "Token has been expired!",
      });
    }
    //  console.log(getToken,'bb')
    const hashPasshword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(
      { _id: getToken._id },
      { $set: { password: hashPasshword, Token: "" } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Password reset successfully done!",
    });
  } catch (e) {
    console.log(e, "ee");
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

////////////////////////////////////  Admin  //////////////////////////////////////////

const deleteUserByAdmin = async (req, res) => {
  try {
    const getUser = await User.findById({ _id: req.params.id });
    if (!getUser) {
      return res
        .status(400)
        .json({ success: false, message: "No user found!" });
    }
    await getUser.deleteOne();
    return res
      .status(400)
      .json({ success: false, message: "User deleted successfully" });
  } catch (e) {
    //   console.log(e,"ee")
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

const getAllUserList = async (req, res) => {
  try {
    let { name, email, fromDate, toDate, sort } = req.body;
    let query = User.find();
    if (!query) {
      return res
        .status(400)
        .json({ success: false, message: "No user found!" });
    }

    // Apply filters based on the provided fields
    if (name) {
      query = query.where("name").regex(new RegExp(name, "i"));
    }
    if (email) {
      query = query.where("email").regex(new RegExp(email, "i"));
    }
    if (fromDate) {
      query = query.where("createdAt").gte(new Date(fromDate));
    }
    if (toDate) {
      query = query.where("createdAt").lte(new Date(toDate));
    }

    // Apply sorting based on the 'sort' field (asc or desc)
    if (sort) {
      if (sort === "asc") {
        query = query.sort({ name: 1 });
      } else if (sort === "desc") {
        query = query.sort({ name: -1 });
      }
    }
    //console.log(query,"qqqqqqqqqqqqqqq")
    const users = await query.exec();
    //console.log(users,"user")
    return res.status(200).json({ success: true, data: users });
  } catch (e) {
    console.log(e, "ee");
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

const blockUser = async (req, res) => {
  try {
    let { userId, user_name } = req.body;
    if (!(userId && user_name)) {
      return res.status(400).json({
        success: false,
        message: "Mandatory fields can not be empty!",
      });
    }
    const blockUser = new Block(req.body);
    await blockUser.save();
    return res.status(201).json({
      success: true,
      message: "User successfully block",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

//////////// import csv file

const importCsvFIle = async (req, res) => {
  try {

    const storage = multer.diskStorage({
      destination:(req,file,cb)=>cb(null,'uploads'),
      filename:(req,file,cb)=>{
          const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.
              originalname)}`;
              cb(null,uniqueName);
          
      }
   })
   
   let upload = multer({
      storage,
      limit:{fileSize:100000 * 10}
   }).single('file');
    upload(req, res, async (err) => {
      console.log("fileData", req.file);
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded" });
      }
      if (err) {
        return res
          .status(400)
          .json({
            success: false,
            message: "there is error no file uploading",
          });
      }
    });
  } catch (e) {
    console.log(e, "b");
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

const downloadCsvFIle = async (req, res) => {
  try {
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

module.exports = {
  regsiterUSer,
  loginUser,
  getUserProfile,
  deleteUserByAdmin,
  getAllUserList,
  blockUser,
  updatePassword,
  fotgetPassword,
  resetPassword,
  importCsvFIle,
  downloadCsvFIle,
};
