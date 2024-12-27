import express from 'express';
const router = express.Router();
import commentsController from "../controllers/comments_controller";


router.post("/", commentsController.createComments); //create

router.get("/", commentsController.getAllComments); //read


router.get("/:id", commentsController.getCommentsById); //read


router.delete("/:id", commentsController.deleteCommentsById); //delete

router.put("/:id", commentsController.updateCommentsById); // update

export default router;