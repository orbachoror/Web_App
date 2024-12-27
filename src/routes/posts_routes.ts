import express from 'express';
const router = express.Router();
import postsController from "../controllers/posts_controller";

router.post("/", postsController.createPost);

router.get("/", postsController.getAllPosts);

router.get("/:id", postsController.getById);

router.put("/:id", postsController.updatePostById);

router.delete("/:id", postsController.deletePostById);

router.delete("/", postsController.deleteAllPosts);

export default router;