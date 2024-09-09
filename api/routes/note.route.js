import express from 'express';
import { getNotes, updateNote, deleteNote, createNote } from '../controllers/note.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/notes/get-notes:
 *   get:
 *     summary: Retrieve all notes for the authenticated user
 *     description: Fetches all notes associated with the authenticated user. Requires a valid token in the header.
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Notes successfully retrieved
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
 *                   example: "Notes fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     notes:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "605c72ef2f8fb814b3bce7f3"
 *                           category:
 *                             type: string
 *                             example: "Personal"
 *                           title:
 *                             type: string
 *                             example: "Meeting Notes"
 *                           text:
 *                             type: string
 *                             example: "Notes from the project meeting"
 *                           user:
 *                             type: string
 *                             example: "605c72ef2f8fb814b3bce7f1"
 *             examples:
 *               success:
 *                 summary: Successful retrieval of notes
 *                 value:
 *                   statusCode: 200
 *                   message: "Notes fetched successfully"
 *                   data:
 *                     notes: [
 *                       {
 *                         _id: "605c72ef2f8fb814b3bce7f3",
 *                         category: "Personal",
 *                         title: "Meeting Notes",
 *                         text: "Notes from the project meeting",
 *                         user: "605c72ef2f8fb814b3bce7f1"
 *                       }
 *                     ]
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "No token provided or invalid token"
 *             examples:
 *               missingToken:
 *                 summary: Token not provided
 *                 value:
 *                   statusCode: 401
 *                   message: "No token provided"
 *               invalidToken:
 *                 summary: Invalid token
 *                 value:
 *                   statusCode: 401
 *                   message: "Invalid token"
 */
router.get('/get-notes', getNotes);

/**
 * @swagger
 * /api/notes/create-note:
 *   post:
 *     summary: Create a new note for the authenticated user
 *     description: Creates a new note for the authenticated user. Requires a valid token in the header and the note details in the request body.
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category
 *               - title
 *               - text
 *             properties:
 *               category:
 *                 type: string
 *                 example: "Personal"
 *               title:
 *                 type: string
 *                 example: "Meeting Notes"
 *               text:
 *                 type: string
 *                 example: "Notes from the project meeting"
 *     responses:
 *       201:
 *         description: Note created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: "Note created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "605c72ef2f8fb814b3bce7f3"
 *                     category:
 *                       type: string
 *                       example: "Personal"
 *                     title:
 *                       type: string
 *                       example: "Meeting Notes"
 *                     text:
 *                       type: string
 *                       example: "Notes from the project meeting"
 *                     user:
 *                       type: string
 *                       example: "605c72ef2f8fb814b3bce7f1"
 *             examples:
 *               success:
 *                 summary: Successful note creation
 *                 value:
 *                   statusCode: 201
 *                   message: "Note created successfully"
 *                   data:
 *                     _id: "605c72ef2f8fb814b3bce7f3"
 *                     category: "Personal"
 *                     title: "Meeting Notes"
 *                     text: "Notes from the project meeting"
 *                     user: "605c72ef2f8fb814b3bce7f1"
 *       400:
 *         description: Bad request - Missing required fields or note with the same title already exists
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
 *                   example: "All fields are required"  # Ensure this is a single example, or separate examples for clarity.
 *             examples:
 *               missingFields:
 *                 summary: Missing required fields
 *                 value:
 *                   statusCode: 400
 *                   message: "All fields are required"
 *               duplicateTitle:
 *                 summary: Note with the same title already exists
 *                 value:
 *                   statusCode: 400
 *                   message: "A note with this title already exists"
 */
router.post('/create-note', createNote);

/**
 * @swagger
 * /api/notes/update-note/{id}:
 *   put:
 *     summary: Update an existing note by its ID
 *     description: Updates the details of an existing note. Requires a valid token in the header and the note ID in the request parameters.
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the note to be updated
 *         schema:
 *           type: string
 *           example: "605c72ef2f8fb814b3bce7f3"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Meeting Notes"
 *               text:
 *                 type: string
 *                 example: "Updated notes from the project meeting"
 *               category:
 *                 type: string
 *                 example: "Work"
 *     responses:
 *       200:
 *         description: Note updated successfully
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
 *                   example: "Note updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "605c72ef2f8fb814b3bce7f3"
 *                     category:
 *                       type: string
 *                       example: "Work"
 *                     title:
 *                       type: string
 *                       example: "Updated Meeting Notes"
 *                     text:
 *                       type: string
 *                       example: "Updated notes from the project meeting"
 *                     user:
 *                       type: string
 *                       example: "605c72ef2f8fb814b3bce7f1"
 *             examples:
 *               success:
 *                 summary: Successful note update
 *                 value:
 *                   statusCode: 200
 *                   message: "Note updated successfully"
 *                   data:
 *                     _id: "605c72ef2f8fb814b3bce7f3"
 *                     category: "Work"
 *                     title: "Updated Meeting Notes"
 *                     text: "Updated notes from the project meeting"
 *                     user: "605c72ef2f8fb814b3bce7f1"
 *       400:
 *         description: Bad request - Invalid data provided
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
 *                   example: "Invalid data provided"
 *             examples:
 *               invalidData:
 *                 summary: Invalid data provided
 *                 value:
 *                   statusCode: 400
 *                   message: "Invalid data provided"
 *       404:
 *         description: Note not found or not authorized to update
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
 *                   example: "Note not found or not authorized to update"
 *             examples:
 *               notFound:
 *                 summary: Note not found
 *                 value:
 *                   statusCode: 404
 *                   message: "Note not found or not authorized to update"
 */
router.put('/update-note/:id', updateNote);

/**
 * @swagger
 * /api/notes/delete-note/{id}:
 *   delete:
 *     summary: Delete an existing note by its ID
 *     description: Deletes a note by its ID. Requires a valid token in the header and the note ID in the request parameters.
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the note to be deleted
 *         schema:
 *           type: string
 *           example: "605c72ef2f8fb814b3bce7f3"
 *     responses:
 *       200:
 *         description: Note deleted successfully
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
 *                   example: "Note deleted successfully"
 *             examples:
 *               success:
 *                 summary: Successful note deletion
 *                 value:
 *                   statusCode: 200
 *                   message: "Note deleted successfully"
 *       404:
 *         description: Note not found or not authorized to delete
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
 *                   example: "Note not found or not authorized to delete"
 *             examples:
 *               notFound:
 *                 summary: Note not found
 *                 value:
 *                   statusCode: 404
 *                   message: "Note not found or not authorized to delete"
 */
router.delete('/delete-note/:id', deleteNote);

export default router;
