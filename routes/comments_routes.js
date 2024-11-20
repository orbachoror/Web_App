const express = require('express');
const router=express.Router();
const commentsController = require("../controllers/comments_controller")


router.post("/",commentsController.createComments); //create

router.get("/", commentsController.getComments); //read

router.get("/:id", commentsController.getCommentsById); //read

router.get("/", commentsController.getCommentsByPostId); //read

//router.delete("/:id",commentsController.deleteComments); //delete

//router.put("/:id",commentsController.updateComments); // update

module.exports=router;