const express = require('express');
const router = express.Router();
const postsController = require("../controllers/posts_controller");
router.post("/", postsController.createPost);
router.get("/", postsController.getAllPosts);
router.get("/:id", postsController.getById);
router.put("/:id", postsController.updatePostById);
router.delete("/:id", postsController.deletePostById);
router.delete("/", postsController.deleteAllPosts);
module.exports = router;
//# sourceMappingURL=posts_routes.js.map