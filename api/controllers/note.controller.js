import Note from '../models/note.model.js';
import { errorHandler } from '../utils/error.js';

export const createNote = async (req, res, next) => {
    const { category, title, text } = req.body;
    const userId = req.user.userId; // Get the userId from the verified token

    if (!category || !title || !text) {
        return next(errorHandler(400, 'All fields are required'));
    }

    try {
        const existingNote = await Note.findOne({ title, user: userId });

        if (existingNote) {
            return next(errorHandler(400, 'A note with this title already exists'));
        }

        const newNote = new Note({
            category,
            title,
            text,
            user: userId, // Set the userId from the token
        });

        const savedNote = await newNote.save();
        res.status(201).json({
            statusCode: 201,
            message: 'Note created successfully',
            data: savedNote
        });
    } catch (err) {
        next(errorHandler(500, 'Server error'));
    }
};

// Get all notes from the database for a specific user
export const getNotes = async (req, res, next) => {
    const userId = req.user.userId; // Get the userId from the verified token

    try {
        const notes = await Note.find({ user: userId });
        res.status(200).json({
            statusCode: 200,
            message: 'Notes fetched successfully',
            data: { notes }
        });
    } catch (err) {
        next(errorHandler(500, 'Server error'));
    }
};

// update a note in the database by its id
export const updateNote = async (req, res, next) => {
    // Get the note id from the request parameters
    const { id } = req.params;

    // Get the title, text, and category from the request body
    const { title, text, category } = req.body;

    try {
        // Find the note by its id and update the title, text, and category
        const updatedNote = await Note.findByIdAndUpdate(
            id,
            { title, text, category },
            { new: true }
        );

        // Return an error response if the note is not found
        if (!updatedNote) {
            return next(errorHandler(404, 'Note not found'));
        }

        // Return the updated note as a response
        res.status(200).json(updatedNote);
    } catch (err) {
        next(errorHandler(500, 'Server error'));
    }
};

// Delete a note from the database by its id
export const deleteNote = async (req, res, next) => {
    const { id } = req.params;

    try {
        // Find the note by its id and delete it
        const deletedNote = await Note.findByIdAndDelete(id);

        if (!deletedNote) {
            return next(errorHandler(404, 'Note not found'));
        }

        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (err) {
        next(errorHandler(500, 'Server error'));
    }
};
