const express = require("express");
const postController = require("../controller/postController");
const postRouter = express.Router();
const Role = require("../middleware/auth");
postRouter.use(express.json());
postRouter.use(express.urlencoded({ extended: true }));


postRouter.post("/create_post",Role([1]), postController.create_post);
postRouter.get("/all_post",Role([1]), postController.getAllPost);
postRouter.get("/get_post_detail/:id",Role([1]), postController.getPostDetail);
postRouter.delete("/delete_post/:id",Role([1]), postController.deletePostDetail);



module.exports = postRouter;