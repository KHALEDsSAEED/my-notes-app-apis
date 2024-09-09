import express from 'express';
import { getUser, updateUser, deleteUser } from '../controllers/user.controller.js';

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: User
 *   description: User API
 */

/**
 * @swagger
 * /user/get-user:
 *   get:
 *     summary: Retrieve user information
 *     description: Fetches the user details based on the authenticated user's ID. Returns user data if found or an error if not. This route is protected and requires a valid token in the Authorization header.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: User fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         firstName:
 *                           type: string
 *                           example: John
 *                         lastName:
 *                           type: string
 *                           example: Doe
 *                         email:
 *                           type: string
 *                           example: john.doe@example.com
 *             examples:
 *               success:
 *                 summary: Successful retrieval of user information
 *                 value:
 *                   statusCode: 200
 *                   message: User fetched successfully
 *                   data:
 *                     user:
 *                       firstName: John
 *                       lastName: Doe
 *                       email: john.doe@example.com
 *       401:
 *         description: Unauthorized - No token provided or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: No token provided
 *             examples:
 *               noToken:
 *                 summary: No token provided in the request
 *                 value:
 *                   success: false
 *                   message: No token provided
 *               invalidToken:
 *                 summary: The provided token is invalid
 *                 value:
 *                   success: false
 *                   message: Invalid token
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *             examples:
 *               serverError:
 *                 summary: An unexpected error occurred
 *                 value:
 *                   statusCode: 500
 *                   message: Internal server error
 */
// Route to get user information
router.get('/get-user', getUser);

/**
 * @swagger
 * /user/update-user:
 *   put:
 *     summary: Update user information
 *     description: Updates the user details based on the authenticated user's ID. Returns updated user data or an error if the user is not found. This route is protected and requires a valid token in the Authorization header.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         firstName:
 *                           type: string
 *                           example: John
 *                         lastName:
 *                           type: string
 *                           example: Doe
 *                         email:
 *                           type: string
 *                           example: john.doe@example.com
 *             examples:
 *               success:
 *                 summary: Successful update of user information
 *                 value:
 *                   statusCode: 200
 *                   message: User updated successfully
 *                   data:
 *                     user:
 *                       firstName: John
 *                       lastName: Doe
 *                       email: john.doe@example.com
 *       400:
 *         description: Bad request - Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Invalid input data
 *             examples:
 *               invalidData:
 *                 summary: The provided data is invalid
 *                 value:
 *                   statusCode: 400
 *                   message: Invalid input data
 *       401:
 *         description: Unauthorized - No token provided or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: No token provided
 *             examples:
 *               noToken:
 *                 summary: No token provided in the request
 *                 value:
 *                   success: false
 *                   message: No token provided
 *               invalidToken:
 *                 summary: The provided token is invalid
 *                 value:
 *                   success: false
 *                   message: Invalid token
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: User not found
 *             examples:
 *               userNotFound:
 *                 summary: The user does not exist
 *                 value:
 *                   statusCode: 404
 *                   message: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *             examples:
 *               serverError:
 *                 summary: An unexpected error occurred
 *                 value:
 *                   statusCode: 500
 *                   message: Internal server error
 */
// Route to update user information
router.put('/update-user', updateUser);

/**
 * @swagger
 * /user/delete-user:
 *   delete:
 *     summary: Delete a user
 *     description: Deletes the user based on the authenticated user's ID. Returns a success message if the user is deleted or an error if the user is not found. This route is protected and requires a valid token in the Authorization header.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 *             examples:
 *               success:
 *                 summary: Successful deletion of user
 *                 value:
 *                   statusCode: 200
 *                   message: User deleted successfully
 *       401:
 *         description: Unauthorized - No token provided or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: No token provided
 *             examples:
 *               noToken:
 *                 summary: No token provided in the request
 *                 value:
 *                   success: false
 *                   message: No token provided
 *               invalidToken:
 *                 summary: The provided token is invalid
 *                 value:
 *                   success: false
 *                   message: Invalid token
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: User not found
 *             examples:
 *               userNotFound:
 *                 summary: The user does not exist
 *                 value:
 *                   statusCode: 404
 *                   message: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *             examples:
 *               serverError:
 *                 summary: An unexpected error occurred
 *                 value:
 *                   statusCode: 500
 *                   message: Internal server error
 */

// Route to delete a user
router.delete('/delete-user', deleteUser);

export default router;
