const express = require('express');
const router=express.Router();
const commentsController = require("../controllers/comments_controller")


router.post("/",commentsController.createComments); //create

router.get("/", commentsController.getAllComments); //read

router.get("/by-author", commentsController.getCommentsByAuthor); //read

router.get("/:id", commentsController.getCommentsById); //read

router.get("/by-post/:postId", commentsController.getCommentsByPostId); //read

router.delete("/:id",commentsController.deleteCommentsById); //delete

router.put("/:id",commentsController.updateCommentsById); // update

module.exports=router;