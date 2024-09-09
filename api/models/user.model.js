import mongoose from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *       properties:
 *         firstName:
 *           type: string
 *           example: John
 *         lastName:
 *           type: string
 *           example: Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john.doe@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: password123
 *         isVerified:
 *           type: boolean
 *           example: false
 *         verificationToken:
 *           type: string
 *           example: A1B2C3
 *         verificationTokenExpiresAt:
 *           type: string
 *           format: date-time
 *           example: 2023-01-01T00:00:00Z
 *         resetPasswordToken:
 *           type: string
 *           example: R3S3TP4SS
 *         resetPasswordExpiresAt:
 *           type: string
 *           format: date-time
 *           example: 2023-01-01T00:00:00Z
 *       example:
 *         firstName: John
 *         lastName: Doe
 *         email: john.doe@example.com
 *         password: password123
 *         isVerified: false
 *         verificationToken: A1B2C3
 *         verificationTokenExpiresAt: 2023-01-01T00:00:00Z
 *         resetPasswordToken: R3S3TP4SS
 *         resetPasswordExpiresAt: 2023-01-01T00:00:00Z
 */
const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        verificationToken: String,
        verificationTokenExpiresAt: Date,
        resetPasswordToken: String,
        resetPasswordExpiresAt: Date,
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;