import express from 'express';
import authController from '../controllers/auth_controller';

const router = express.Router();
/**
* @swagger
* tags:
*   name: Auth
*   description: The Authentication API
*/
/**
* @swagger
* components:
*   securitySchemes:
*     bearerAuth:
*       type: http
*       scheme: bearer
*       bearerFormat: JWT
*/

/**
* @swagger
* components:
*   schemas:
*     User:
*       type: object
*       required:
*         - email
*         - password
*       properties:
*         email:
*           type: string
*           description: The user email
*         password:
*           type: string
*           description: The user password
*       example:
*         email: 'bob@gmail.com'
*         password: '123456'
*/
/**
* @swagger
* /auth/register:
*   post:
*     summary: registers a new user
*     tags: [Auth]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       200:
*         description: Registration success, return the new user
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*/
router.post("/register", authController.register);
/**
* @swagger
* /auth/login:
*   post:
*     summary: Authenticate a user and return access and refresh tokens.
*     tags: [Auth]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       200:
*         description: Successful login
*         content:
*           application/json:
*               schema:
*                   type: object
*                   properties:
*                       accessToken:
*                           type: string
*                           description: JWT access token
*                           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
*                       refreshToken:
*                           type: string
*                           description: JWT refresh token
*                           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
*                       _id:
*                           type: string
*                           description: User ID
*                           example: "60d0fe4f5311236168a109ca"
*       '400':
*         description: Invalid email or password
*       '500':
*         description: Internal server error
*/
router.post("/login", authController.login);

router.post("/logout", authController.logout);

router.post("/refresh", authController.refresh);

export default router;