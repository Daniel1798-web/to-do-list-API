import express from 'express';
import { registerUser, loginUser } from '../controllers/user.controller';
import { asyncHandler } from '../middleware/error.middleware';

const router = express.Router();

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: This endpoint allows you to register a new user by providing the necessary details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *               password:
 *                 type: string
 *                 description: The password for the new user.
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input data
 */
router.post('/register', asyncHandler(registerUser));

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in a user
 *     description: This endpoint allows an existing user to log in by providing the correct credentials.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *               password:
 *                 type: string
 *                 description: The password for the user.
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Unauthorized, invalid credentials
 *       400:
 *         description: Invalid input data
 */
router.post('/login', asyncHandler(loginUser));

export default router;