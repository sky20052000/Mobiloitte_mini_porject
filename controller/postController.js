const Post = require("../models/postModels");

const create_post = async (req, res) => {
  try {
    let { userId, description, category } = req.body;
    if (!(userId && description && category)) {
      return res.status(400).json({
        success: false,
        message: "Mandatory fields can not be empty!",
      });
    }
    const newPost = new Post(req.body);
    await newPost.save();
    return res.status(201).json({
      success: true,
      message: "Post successfully created",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

const getAllPost = async (req, res) => {
  try {
    const getData = await Post.find({});
    if (!getData) {
      return res.status(200).json({ success: true, message: "No data found!" });
    }
    return res.status(200).json({
      success: true,
      data: getData,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

const getPostDetail = async (req, res) => {
  try {
    const getData = await Post.findById({ _id: req.params.id });
    if (!getData) {
      return res.status(200).json({ success: true, message: "No data found!" });
    }
    return res.status(200).json({
      success: true,
      data: getData,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

const deletePostDetail = async (req, res) => {
  try {
    await Post.findByIdAndDelete({ _id: req.params.id });

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

module.exports = {
  create_post,
  getAllPost,
  getPostDetail,
  deletePostDetail,
};
