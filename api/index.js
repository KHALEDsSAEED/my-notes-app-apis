import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import swaggerDocs from '../swagger.js';

// Import the routes
import notesRoute from './routes/note.route.js';
import authRoute from './routes/auth.route.js';
import userRoute from './routes/user.route.js';

// Import the verifyToken function
import { verifyToken } from './utils/verifyToken.js';

// Load the environment variables
dotenv.config();

// Connect to the database using mongoose
mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
        console.log('Connected to the database');
    })
    .catch((error) => {
        console.log('Error connecting to the database ' + error);
    });


// Create an express app
const app = express();

// Add middleware to parse JSON
app.use(express.json());

const __dirname = path.resolve(); // Define the path to the root directory

// Start the server on port 3000
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

swaggerDocs(app);


// Use the notes route for /api/notes requests and verify the token for authentication
app.use('/api/notes', verifyToken, notesRoute);
app.use('/api/auth', authRoute);
app.use('/api/user',verifyToken, userRoute);


// Error handling middleware 
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        statusCode,
        message,
    });
});




