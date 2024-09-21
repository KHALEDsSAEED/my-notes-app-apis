import Note from '../models/note.model.js';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

export const createNote = async (req, res, next) => {
    const { category, title, text } = req.body;
    const userId = req.user.userId; // Get the userId from the verified token

    if (!category || !title || !text) {
        return next(errorHandler(400, 'All fields are required'));
    }

    try {
        // Fetch the user's email from the database using the userId
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                statusCode: 404,
                message: 'User not found',
            });
        }

        // Use the user's email to check for existing notes
        const existingNote = await Note.findOne({ title, user: user.email });

        if (existingNote) {
            return next(errorHandler(400, 'A note with this title already exists'));
        }

        // Create the new note with the user's email
        const newNote = new Note({
            category,
            title,
            text,
            user: user.email, // Set the user's email instead of userId
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
        // Fetch the user's email from the database using the userId
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                statusCode: 404,
                message: 'User not found',
            });
        }

        // Now use the user's email to fetch the notes
        const notes = await Note.find({ user: user.email });

        res.status(200).json({
            statusCode: 200,
            message: 'Notes fetched successfully',
            data: { notes }
        });
    } catch (err) {
        next(errorHandler(500, 'Server error'));
    }
};

export const updateNote = async (req, res, next) => {
    const { id } = req.params; // Note id
    const { title, text, category } = req.body; // Fields to update
    const userId = req.user.userId; // Get the userId from the verified token

    try {
        // Fetch the user's email from the database using the userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                statusCode: 404,
                message: 'User not found',
            });
        }

        // Find the note by id and ensure it belongs to the user
        const note = await Note.findById(id);
        if (!note || note.user !== user.email) {
            return next(errorHandler(404, 'Note not found or not authorized to update'));
        }

        // Check if another note with the same title exists for the user
        const existingNote = await Note.findOne({
            title,
            user: user.email,
            _id: { $ne: id } // Exclude the current note from the search
        });

        if (existingNote) {
            return next(errorHandler(400, 'A note with this title already exists'));
        }

        // Update the note if it belongs to the user
        const updatedNote = await Note.findByIdAndUpdate(
            id,
            { title, text, category },
            { new: true } // Return the updated document
        );

        res.status(200).json({
            statusCode: 200,
            message: 'Note updated successfully',
            data: updatedNote,
        });
    } catch (err) {
        next(errorHandler(500, 'Server error'));
    }
};


export const deleteNote = async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.userId; // Get the userId from the verified token

    try {
        // Fetch the user's email from the database using the userId
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                statusCode: 404,
                message: 'User not found',
            });
        }

        // Find the note by its id and check if it belongs to the user
        const note = await Note.findById(id);

        if (!note || note.user !== user.email) {
            return next(errorHandler(404, 'Note not found or not authorized to delete'));
        }

        // Delete the note if it belongs to the user
        const deletedNote = await Note.findByIdAndDelete(id);

        res.status(200).json({
            statusCode: 200,
            message: 'Note deleted successfully',
        });
    } catch (err) {
        next(errorHandler(500, 'Server error'));
    }
};
