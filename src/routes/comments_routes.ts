import express from 'express';
const router = express.Router();
import commentsController from '../controllers/comments_controller';
import { authTestMiddleware } from '../controllers/auth_controller';


router.get("/", commentsController.getAll.bind(commentsController));

router.get("/:id", commentsController.getById.bind(commentsController));

router.post("/", authTestMiddleware, commentsController.createItem.bind(commentsController));

router.put("/:id", authTestMiddleware, commentsController.updateItemById.bind(commentsController));

router.delete("/:id", authTestMiddleware, commentsController.deleteItem.bind(commentsController));

export default router;