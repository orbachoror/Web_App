import express from 'express';
import { authTestMiddleware } from '../controllers/auth_controller';
import postsController from '../controllers/posts_controller';
const router = express.Router();

/**
* @swagger
* tags:
*   name: Posts
*   description: The Posts API
*/
/**
* @swagger
* /posts:
*   get:
*     summary: Get all posts
*     description: Retrieve all posts
*     tags: [Posts]
*     responses:
*       200:
*         description: Posts retrieved successfully
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   title:
*                     type: string
*                   content:
*                     type: string
*                   owner:
*                     type: string
*                   _id:
*                     type: string
*       500:
*         description: Internal server error
*/
router.get("/", postsController.getAll.bind(postsController));
/**
* @swagger
* /posts/{id}:
*   get:
*     summary: Get a post by ID
*     description: Retrieve a post by its ID
*     tags: [Posts]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The ID of the post to retrieve
*     responses:
*       200:
*         description: Post retrieved successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 title:
*                   type: string
*                 content:
*                   type: string
*                 owner:
*                   type: string
*                 _id:
*                   type: string
*       404:
*         description: Post not found
*       500:
*         description: Internal server error
*/
router.get("/:id", postsController.getById.bind(postsController));

/**
* @swagger
* /posts:
*   post:
*     summary: add a new post
*     tags: [Posts]
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*               type: object
*               properties:
*                       title:
*                           type: string
*                           description: the post title
*                           example: "My first post"
*                       content:
*                           type: string
*                           description: the post content
*                           example: "This is my first post ....."
*     responses:
*       200:
*         description: The post was successfully created
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                       title:
*                           type: string
*                           description: the post title
*                           example: "My first post"
*                       content:
*                           type: string
*                           description: the post content
*                           example: "This is my first post ....."
*                       owner:
*                           type: string
*                           description: the post owner
*                           example: "60f3b4b3b3b3b3b3b3b3b3b3"
*                       _id:
*                           type: string
*                           description: the post id
*                           example: "60f3b4b3b3b3b3b3b3b3b3"
*/
router.post("/", authTestMiddleware, postsController.createItem.bind(postsController));

router.put("/:id", authTestMiddleware, postsController.updateItemById.bind(postsController));
/**
* @swagger
* /posts/{id}:
*   delete:
*     summary: Delete a post
*     description: Delete a post by its ID
*     security:
*       - bearerAuth: []
*     tags: [Posts]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The ID of the post to delete
*     responses:
*       200:
*         description: Post deleted successfully
*       404:
*         description: Post not found
*       500:
*         description: Internal server error
*/
router.delete("/:id", authTestMiddleware, postsController.deleteItem.bind(postsController));


export default router;