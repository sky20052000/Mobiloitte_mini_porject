const express = require("express");
const userController = require("../controller/userController");
const userRouter = express.Router();
const Role = require("../middleware/auth");
userRouter.use(express.json());
userRouter.use(express.urlencoded({ extended: true }));

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


module.exports = userRouter;