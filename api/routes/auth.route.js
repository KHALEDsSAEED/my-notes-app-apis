import express from 'express';
import {
    signup,
    verifyEmail,
    signin,
    requestNewVerificationEmail,
    refreshAccessToken,
    requestPasswordReset,
    resetPassword,
    resendPasswordReset,
    signout
} from '../controllers/auth.controller.js';
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication API
 */

const router = express.Router();

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     description: Registers a new user with the provided details. Returns a success message if the user is created successfully or an error if the email already exists.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
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
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: User created successfully
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
 *                   example: User created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     email:
 *                       type: string
 *                       example: john.doe@example.com
 *             examples:
 *               success:
 *                 summary: Successful user registration
 *                 value:
 *                   statusCode: 200
 *                   message: User created successfully
 *                   data:
 *                     firstName: John
 *                     lastName: Doe
 *                     email: john.doe@example.com
 *       400:
 *         description: Bad request - Email already exists
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
 *                   example: Email already exists
 *             examples:
 *               emailExists:
 *                 summary: Email already in use
 *                 value:
 *                   statusCode: 400
 *                   message: Email already exists
 *       500:
 *         description: Internal Server Error - General server error
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
 *                   example: "Internal server error"
 *             examples:
 *               internalError:
 *                 summary: Internal server error
 *                 value:
 *                   statusCode: 500
 *                   message: "Internal server error"
 */
router.post('/signup', signup);

/**
* @swagger
* /api/auth/verify-email:
*   post:
*     summary: Verify user email
*     description: Verifies the user's email using the provided verification code. Returns success if the email is verified or an error if the code is invalid or expired.
*     tags: [Auth]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - email
*               - code
*             properties:
*               email:
*                 type: string
*                 format: email
*                 example: john.doe@example.com
*               code:
*                 type: string
*                 example: A1B2C3
*     responses:
*       200:
*         description: Email verified successfully
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
*                   example: Email verified successfully
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
*                         isVerified:
*                           type: boolean
*                           example: true
*                     accessToken:
*                       type: string
*                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
*                     refreshToken:
*                       type: string
*                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
*             examples:
*               success:
*                 summary: Successful email verification
*                 value:
*                   statusCode: 200
*                   message: Email verified successfully
*                   data:
*                     user:
*                       firstName: John
*                       lastName: Doe
*                       email: john.doe@example.com
*                       isVerified: true
*                     accessToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
*                     refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
*       400:
*         description: Bad request - Invalid or expired verification code
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
*                   example: Invalid or expired verification code
*             examples:
*               invalidCode:
*                 summary: Invalid or expired verification code
*                 value:
*                   statusCode: 400
*                   message: Invalid or expired verification code
*       500:
*         description: Internal Server Error - General server error
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
*                   example: "Internal server error"
*             examples:
*               internalError:
*                 summary: Internal server error
*                 value:
*                   statusCode: 500
*                   message: "Internal server error"

*/
router.post("/verify-email", verifyEmail);

/**
 * @swagger
 * /api/auth/request-new-verification-email:
 *   post:
 *     summary: Request a new verification email
 *     description: Sends a new verification email to the specified user if they are not verified. Responds with an appropriate message based on the user’s verification status.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *     responses:
 *       200:
 *         description: New verification email sent successfully
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
 *                   example: "New verification email sent successfully"
 *             examples:
 *               success:
 *                 summary: Verification email sent
 *                 value:
 *                   statusCode: 200
 *                   message: "New verification email sent successfully"
 *       400:
 *         description: Bad Request - Email validation errors
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
 *                   example: "Email is required"  # This message is when email is missing
 *             examples:
 *               emailRequired:
 *                 summary: Email is required
 *                 value:
 *                   statusCode: 400
 *                   message: "Email is required"
 *               userAlreadyVerified:
 *                 summary: User is already verified
 *                 value:
 *                   statusCode: 400
 *                   message: "User is already verified"
 *       404:
 *         description: Not Found - User not found
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
 *                   example: "User not found"
 *             examples:
 *               userNotFound:
 *                 summary: User not found
 *                 value:
 *                   statusCode: 404
 *                   message: "User not found"
 *       500:
 *         description: Internal Server Error - General server error
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
 *                   example: "Internal server error"
 *             examples:
 *               internalError:
 *                 summary: Internal server error
 *                 value:
 *                   statusCode: 500
 *                   message: "Internal server error"
 */
router.post('/request-new-verification-email', requestNewVerificationEmail);

/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     summary: Sign in a user
 *     description: Sign in with email and password. Provides different responses based on email verification status.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: strongPassword123
 *     responses:
 *       200:
 *         description: Successfully logged in
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
 *                         isVerified:
 *                           type: boolean
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *             examples:
 *               verifiedUser:
 *                 summary: Verified User
 *                 value: 
 *                   statusCode: 200
 *                   message: "Login successful, email verified"
 *                   data: 
 *                     user:
 *                       firstName: "John"
 *                       lastName: "Doe"
 *                       email: "john.doe@example.com"
 *                       isVerified: true
 *                     accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                     refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               unverifiedUser:
 *                 summary: Unverified User
 *                 value: 
 *                   statusCode: 200
 *                   message: "Login successful, but email not verified"
 *                   data: 
 *                     user:
 *                       firstName: "Jane"
 *                       lastName: "Doe"
 *                       email: "jane.doe@example.com"
 *                       isVerified: false
 *                     accessToken: null
 *                     refreshToken: null
 *       400:
 *         description: Bad Request - Missing fields or invalid credentials
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
 *                   example: Bad request
 *             examples:
 *               missingFields:
 *                 summary: Missing Email or Password
 *                 value: 
 *                   statusCode: 400
 *                   message: "Email and password are required"
 *               invalidCredentials:
 *                 summary: Invalid Email or Password
 *                 value: 
 *                   statusCode: 400
 *                   message: "Invalid email or password"
 *       500:
 *         description: Internal Server Error - General server error
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
 *                   example: "Internal server error"
 *             examples:
 *               internalError:
 *                 summary: Internal server error
 *                 value:
 *                   statusCode: 500
 *                   message: "Internal server error"
 */
router.post('/signin', signin);

/**
 * @swagger
 * /api/auth/request-password-reset:
 *   post:
 *     summary: Request a password reset
 *     description: Sends a password reset email with a token to the specified user if they exist. Responds with an appropriate message based on the user’s existence and the request’s validity.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
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
 *                   example: "Password reset sent successfully"
 *             examples:
 *               success:
 *                 summary: Password reset email sent
 *                 value:
 *                   statusCode: 200
 *                   message: "Password reset sent successfully"
 *       400:
 *         description: Bad Request - Email validation errors
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
 *                   example: "Email is required"  # This message is when email is missing
 *             examples:
 *               emailRequired:
 *                 summary: Email is required
 *                 value:
 *                   statusCode: 400
 *                   message: "Email is required"
 *       404:
 *         description: Not Found - User not found
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
 *                   example: "User not found"
 *             examples:
 *               userNotFound:
 *                 summary: User not found
 *                 value:
 *                   statusCode: 404
 *                   message: "User not found"
 *       500:
 *         description: Internal Server Error - General server error
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
 *                   example: "Internal server error"
 *             examples:
 *               internalError:
 *                 summary: Internal server error
 *                 value:
 *                   statusCode: 500
 *                   message: "Internal server error"
 */
router.post('/request-password-reset', requestPasswordReset);

/**
 * @swagger
 * /api/auth/password-reset:
 *   post:
 *     summary: Reset user password
 *     description: Resets the user’s password if the provided email, reset token, and new password are valid. Responds based on the validity of the provided information and the reset process.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               code:
 *                 type: string
 *                 example: A1B2C3
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: newStrongPassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
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
 *                   example: "Password reset successfully"
 *             examples:
 *               success:
 *                 summary: Password reset successful
 *                 value:
 *                   statusCode: 200
 *                   message: "Password reset successfully"
 *       400:
 *         description: Bad Request - Validation errors or invalid token
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
 *                   example: "All fields required"  # For missing fields
 *             examples:
 *               missingFields:
 *                 summary: Missing fields
 *                 value:
 *                   statusCode: 400
 *                   message: "All fields required"
 *               invalidToken:
 *                 summary: Invalid or expired OTP
 *                 value:
 *                   statusCode: 400
 *                   message: "Invalid or expired OTP"
 *       500:
 *         description: Internal Server Error - General server error
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
 *                   example: "Internal server error"
 *             examples:
 *               internalError:
 *                 summary: Internal server error
 *                 value:
 *                   statusCode: 500
 *                   message: "Internal server error"
 */
router.post('/password-reset', resetPassword);

/**
 * @swagger
 * /api/auth/request-new-password-reset:
 *   post:
 *     summary: Request a new password reset OTP
 *     description: Requests a new password reset OTP and sends it to the user's email. Useful if the user did not receive the original reset email or if it has expired.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *     responses:
 *       200:
 *         description: A new password reset OTP has been sent successfully
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
 *                   example: "A new password reset OTP has been sent to your email."
 *             examples:
 *               success:
 *                 summary: New OTP sent successfully
 *                 value:
 *                   statusCode: 200
 *                   message: "A new password reset OTP has been sent to your email."
 *       400:
 *         description: Bad Request - Missing fields or general error
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
 *                   example: "Bad request"
 *             examples:
 *               missingEmail:
 *                 summary: Missing email field
 *                 value:
 *                   statusCode: 400
 *                   message: "Email is required"
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
 *                   example: "User not found"
 *             examples:
 *               userNotFound:
 *                 summary: User not found
 *                 value:
 *                   statusCode: 404
 *                   message: "User not found"
 *       500:
 *         description: Internal Server Error - General server error
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
 *                   example: "Internal server error"
 *             examples:
 *               internalError:
 *                 summary: Internal server error
 *                 value:
 *                   statusCode: 500
 *                   message: "Internal server error"
 */
router.post('/request-new-password-reset', resendPasswordReset);

/**
 * @swagger
 * /api/auth/signout:
 *   post:
 *     summary: Sign out a user
 *     description: Signs out a user by clearing the authentication cookies. This route is used to log out the user and invalidate the current session.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully signed out
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
 *                   example: "Successfully signed out"
 *             examples:
 *               success:
 *                 summary: Successful sign out
 *                 value:
 *                   statusCode: 200
 *                   message: "Successfully signed out"
 *       500:
 *         description: Internal Server Error - General server error
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
 *                   example: "Internal server error"
 *             examples:
 *               internalError:
 *                 summary: Internal server error
 *                 value:
 *                   statusCode: 500
 *                   message: "Internal server error"
 */
router.post('/signout', signout);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     description: Refreshes the access token using a valid refresh token provided in cookies. This route issues a new access token if the refresh token is valid.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
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
 *                   example: "Access token refreshed successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *             examples:
 *               success:
 *                 summary: Successful token refresh
 *                 value:
 *                   statusCode: 200
 *                   message: "Access token refreshed successfully"
 *                   data:
 *                     accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Unauthorized - Invalid or expired refresh token
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
 *                   example: "Invalid or expired refresh token"
 *             examples:
 *               missingToken:
 *                 summary: Refresh token not provided
 *                 value:
 *                   statusCode: 401
 *                   message: "Refresh token not provided"
 *               invalidToken:
 *                 summary: Invalid or expired refresh token
 *                 value:
 *                   statusCode: 401
 *                   message: "Invalid or expired refresh token"
 */
router.post("/refresh-token", refreshAccessToken);

export default router;