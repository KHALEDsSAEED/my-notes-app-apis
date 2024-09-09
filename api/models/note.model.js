import mongoose from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Note:
 *       type: object
 *       required:
 *         - category
 *         - title
 *         - text
 *         - user
 *       properties:
 *         category:
 *           type: string
 *           description: The category of the note.
 *           example: Personal
 *         title:
 *           type: string
 *           description: The title of the note.
 *           example: Meeting Notes
 *         text:
 *           type: string
 *           description: The content of the note.
 *           example: "Discussed project milestones and deadlines."
 *         user:
 *           type: string
 *           description: The ID of the user who created the note.
 *           example: 607f191e810c19729de860ea
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the note was created.
 *           example: "2024-09-09T12:34:56Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the note was last updated.
 *           example: "2024-09-09T12:34:56Z"
 *       example:
 *         category: Personal
 *         title: Meeting Notes
 *         text: "Discussed project milestones and deadlines."
 *         user: 607f191e810c19729de860ea
 *         createdAt: "2024-09-09T12:34:56Z"
 *         updatedAt: "2024-09-09T12:34:56Z"
 */

// Define the note schema 
const noteSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    text: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
},
    { timestamps: true }
);

// Create a model from the schema and export it
const Note = mongoose.model('Note', noteSchema);

export default Note;
