const express = require("express");
const userController = require("../controller/userController");
const userRouter = express.Router();
const Role = require("../middleware/auth");
const passport = require("passport");
const session = require("express-session")
require("../middleware/fbPassport");
userRouter.use(express.json());
userRouter.use(express.urlencoded({ extended: true }));
userRouter.use(session({secret:"cats", resave: true, saveUninitialized: true
}));
userRouter.use(passport.initialize());
userRouter.use(passport.session());
userRouter.use(passport.initialize());
userRouter.use(passport.session());

   // role =1 for user , role =2 for admin
userRouter.post("/register", userController.regsiterUSer);
userRouter.post("/login", userController.loginUser);
userRouter.post("/update_password",Role([1]), userController.updatePassword);
userRouter.post("/forget_password",Role([1]), userController.fotgetPassword);
userRouter.post("/reset_password",Role([1]), userController.resetPassword);
userRouter.get("/getUserProfile/:id",Role([1]), userController.getUserProfile);
userRouter.delete("/admin/user/:id",Role([2]), userController.deleteUserByAdmin);
userRouter.post("/admin/all_user",Role([2]), userController.getAllUserList);
userRouter.post("/admin/block/user",Role([2]), userController.blockUser);
userRouter.post("/admin/importCsv",Role([2]), userController.importCsvFIle);
userRouter.post("/admin/dounloadCsv",Role([2]), userController.downloadCsvFIle);
userRouter.get("/auth/facebook", passport.authenticate('facebook'));
userRouter.get("/facebook/callback",
     passport.authenticate('facebook',{
        successRedirect:"/profile",
        failureRedirect:"/error"
     })
);

// protected route 
userRouter.get("/profile",(req,res)=>{
   res.send(`Hurrah! Facebook login successfully done!`);
   
});



module.exports = userRouter;
