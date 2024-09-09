import User from '../models/user.model.js'; 
import { errorHandler } from '../utils/error.js';

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }
        res.status(200).json({
            statusCode: 200,
            message: 'User fetched successfully',
            data: { user }
        });
    } catch (error) {
        console.log('Error in getUser:', error);
        return next(errorHandler(500, error.message));
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const { firstName, lastName, email } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { firstName, lastName, email },
            { new: true, runValidators: true }
        ).select('-password');
        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }
        res.status(200).json({
            statusCode: 200,
            message: 'User updated successfully',
            data: { user }
        });
    } catch (error) {
        console.log('Error in updateUser:', error);
        return next(errorHandler(500, error.message));
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.user.userId);
        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }
        res.status(200).json({
            statusCode: 200,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.log('Error in deleteUser:', error);
        return next(errorHandler(500, error.message));
    }
};
