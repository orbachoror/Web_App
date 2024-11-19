const express = require('express');
const router=express.Router();
const postsController = require("../controllers/posts_controller")

router.post("/",postsController.createPost);

router.get("/", postsController.getAllPosts);

router.get("/:id",postsController.getById);

router.get("/",postsController.getAllPosts);
router.put("/:id",postsController.updatePostById);

module.exports=router;