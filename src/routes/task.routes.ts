import express from 'express';
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById,
} from '../controllers/task.controller';

import { verifyToken } from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/error.middleware';

const router = express.Router();

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     description: This endpoint allows users to create a new task by providing the necessary details.
 *     security:
 *       - BearerAuth: []  # Indicates the need for authentication with a token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the task.
 *               description:
 *                 type: string
 *                 description: A brief description of the task.
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 description: The due date for the task.
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Invalid task data
 */
router.post('/', verifyToken, createTask); // Create task

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     description: This endpoint allows users to get a list of all tasks.
 *     security:
 *       - BearerAuth: []  # Requires authentication
 *     responses:
 *       200:
 *         description: List of tasks
 *       401:
 *         description: Unauthorized, invalid token
 */
router.get('/', verifyToken, getAllTasks); // Get all tasks

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     description: This endpoint allows users to get a specific task by providing its ID.
 *     security:
 *       - BearerAuth: []  # Requires authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the task.
 *     responses:
 *       200:
 *         description: Task found
 *       404:
 *         description: Task not found
 */
router.get('/:id', verifyToken, asyncHandler(getTaskById)); // Get task by ID

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task by ID
 *     description: This endpoint allows users to update an existing task by providing its ID and new details.
 *     security:
 *       - BearerAuth: []  # Requires authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the task to be updated.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The updated title of the task.
 *               description:
 *                 type: string
 *                 description: The updated description of the task.
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 description: The updated due date for the task.
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       400:
 *         description: Invalid data for task update
 *       404:
 *         description: Task not found
 */
router.put('/:id', verifyToken, asyncHandler(updateTaskById)); // Update task by ID

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     description: This endpoint allows users to delete a specific task by providing its ID.
 *     security:
 *       - BearerAuth: []  # Requires authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the task to be deleted.
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 */
router.delete('/:id', verifyToken, asyncHandler(deleteTaskById)); // Delete task by ID

export default router;