import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendVerificationEmail, sendWelcomeEmail, sendResetPasswordEmail } from "../mail/emails.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";


export const signup = async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        if (!firstName || !lastName || !email || !password ||
            firstName === '' || lastName === '' || email === '' || password === '') {
            next(errorHandler(400, 'All fields are required !'));
        }

        if (password.length < 8) {
            return next(errorHandler(400, 'Password must be at least 8 characters'));
        }

        const userAlreadyExists = await User.findOne({ email });

        if (userAlreadyExists) {
            return next(errorHandler(400, 'Email already exists.'));
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        function generateCode(length) {
            const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const numbers = "0123456789";
            let code = "";
            for (let i = 0; i < length; i++) {
                const char = Math.random() > 0.5 ? chars : numbers;
                code += char.charAt(Math.floor(Math.random() * char.length));
            }
            return code;

        }

        const verificationToken = generateCode(6);

        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 15 * 60 * 1000,
        });

        await user.save();

        await sendVerificationEmail(user.email, verificationToken);

        res.status(200).json({
            statusCode: 200,
            message: "User created successfully",
            data: {
                firstName,
                lastName,
                email,
            },
        });
    } catch (error) {
        return next(errorHandler(400, error.message));
    }
};

export const verifyEmail = async (req, res, next) => {
    const { email, code } = req.body;
    try {
        const user = await User.findOne({
            email: email,
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return next(errorHandler(400, 'Invalid or expired verification code'));
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;

        await user.save();

        await sendWelcomeEmail(user.email, user.firstName);

        // Generate tokens and set cookies
        const accessToken = generateAccessToken(res, user._id);
        const refreshToken = generateRefreshToken(res, user._id);

        // Respond with access token and refresh token in the response
        res.status(200).json({
            statusCode: 200,
            message: "Email verified successfully",
            data: {
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    isVerified: user.isVerified,
                },
                accessToken,
                refreshToken,
            },
        });

    } catch (error) {
        return next(errorHandler(500, error.message));
    }
};

export const requestNewVerificationEmail = async (req, res, next) => {
    const { email } = req.body;

    try {
        if (!email) {
            return next(errorHandler(400, 'Email is required'));
        }

        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        if (user.isVerified) {
            return next(errorHandler(400, 'User is already verified'));
        }

        // Generate a new verification token and set the new expiration time
        function generateCode(length) {
            const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const numbers = "0123456789";
            let code = "";
            for (let i = 0; i < length; i++) {
                const char = Math.random() > 0.5 ? chars : numbers;
                code += char.charAt(Math.floor(Math.random() * char.length));
            }
            return code;
        }

        const newVerificationToken = generateCode(6);

        user.verificationToken = newVerificationToken;
        user.verificationTokenExpiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes from now

        await user.save();

        await sendVerificationEmail(user.email, newVerificationToken);

        res.status(200).json({
            statusCode: 200,
            message: "New verification email sent successfully",
        });

    } catch (error) {
        return next(errorHandler(500, error.message));
    }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Validate input
        if (!email || !password) {
            return next(errorHandler(400, 'Email and password are required'));
        }

        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return next(errorHandler(400, 'Invalid email or password'));
        }

        // Verify the password
        const isMatch = await bcryptjs.compare(password, user.password);

        if (!isMatch) {
            return next(errorHandler(400, 'Invalid email or password'));
        }

        // Check if the user is verified
        if (!user.isVerified) {
            return res.status(200).json({
                statusCode: 200,
                message: 'Login successful, but email not verified',
                data: {
                    user: {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        isVerified: user.isVerified,
                    },
                    accessToken: null,
                    refreshToken: null,
                },
            });
        }

        // Generate tokens if email is verified
        const accessToken = generateAccessToken(res, user._id);
        const refreshToken = generateRefreshToken(res, user._id);

        // Send response with tokens and user information
        res.status(200).json({
            statusCode: 200,
            message: 'Login successful, email verified',
            data: {
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    isVerified: user.isVerified,
                },
                accessToken,   // For authenticated requests
                refreshToken,  // For refreshing tokens
            },
        });
    } catch (error) {
        console.error('Login error:', error); // Logging for debugging
        return next(errorHandler(500, 'Internal server error'));
    }
};

export const requestPasswordReset = async (req, res, next) => {
    const { email } = req.body;

    try {
        if (!email) {
            return next(errorHandler(400, 'Email is required'));
        }

        const user = await User.findOne({ email });

        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        // Generate a new verification token and set the new expiration time
        function generateCode(length) {
            const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const numbers = "0123456789";
            let code = "";
            for (let i = 0; i < length; i++) {
                const char = Math.random() > 0.5 ? chars : numbers;
                code += char.charAt(Math.floor(Math.random() * char.length));
            }
            return code;
        }

        const resetToken = generateCode(6);
        const resetTokenExpiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes expiration

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        await sendResetPasswordEmail(user.email, resetToken);

        res.status(200).json({
            statusCode: 200,
            message: 'Password reset sent successfully',
        });

    } catch (error) {
        return next(errorHandler(500, error.message));
    }
};

export const resetPassword = async (req, res, next) => {
    const { email, code, newPassword } = req.body;

    try {
        if (!email || !code || !newPassword) {
            return next(errorHandler(400, 'All fields required'));
        }

        const user = await User.findOne({
            email,
            resetPasswordToken: code,
            resetPasswordExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return next(errorHandler(400, 'Invalid or expired OTP'));
        }

        const hashedPassword = await bcryptjs.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;

        await user.save();

        res.status(200).json({
            statusCode: 200,
            message: 'Password reset successfully',
        });

    } catch (error) {
        return next(errorHandler(500, error.message));
    }
};

export const resendPasswordReset = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        // Generate a new verification token and set the new expiration time
        function generateCode(length) {
            const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const numbers = "0123456789";
            let code = "";
            for (let i = 0; i < length; i++) {
                const char = Math.random() > 0.5 ? chars : numbers;
                code += char.charAt(Math.floor(Math.random() * char.length));
            }
            return code;
        }

        const resetToken = generateCode(6);
        const otpExpiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes expiration

        // Update the user's record with the new OTP
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = otpExpiresAt;

        await user.save();

        // Send the new OTP via email
        await sendResetPasswordEmail(user.email, resetToken);

        res.status(200).json({
            statusCode: 200,
            message: 'A new password reset OTP has been sent to your email.',
        });
    } catch (error) {
        return next(errorHandler(500, error.message));
    }
};

export const signout = async (req, res, next) => {
    try {
        res.clearCookie('accessToken', { httpOnly: true, secure: true, sameSite: 'Strict' });
        res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'Strict' });

        res.status(200).json({
            statusCode: 200,
            message: 'Successfully signed out',
        });
    } catch (error) {
        return next(errorHandler(500, error.message));
    }
};

export const refreshAccessToken = async (req, res, next) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        return next(errorHandler(401, 'Refresh token not provided'));
    }

    try {
        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const user = await User.findById(decoded.userId);

        if (!user) {
            return next(errorHandler(401, 'User not found'));
        }

        // Generate a new access token
        const accessToken = generateAccessToken(res, user._id);

        res.status(200).json({
            statusCode: 200,
            message: "Access token refreshed successfully",
            data: { accessToken },
        });
    } catch (error) {
        return next(errorHandler(401, 'Invalid or expired refresh token'));
    }
};
