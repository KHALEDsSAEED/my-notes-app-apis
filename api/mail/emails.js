import {
    VERIFICATION_EMAIL_TEMPLATE,
    WELCOME_EMAIL_TEMPLATE,
    RESET_PASSWORD_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
import createTransporter from "./nodemailer.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{ email }];

    try {
        const transporter = await createTransporter();
        const mailOptions = {
            from: `"Khaled Saeed" <khaled18saeed@gmail.com>`, // Sender address
            to: recipient[0].email, // List of recipients
            subject: "Verify your email", // Subject line
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken), // HTML body
        };

        const response = await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error(`Error sending verification email: ${error}`);
    }
};

export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{ email }];

    try {
        const transporter = await createTransporter();
        const mailOptions = {
            from: `"Khaled Saeed" <khaled18saeed@gmail.com>`, // Sender address
            to: recipient[0].email, // List of recipients
            subject: "Welcome to our App", // Subject line
            html: WELCOME_EMAIL_TEMPLATE, // HTML body
            text: `Welcome to our App, ${name}`, // Plain text body
        };

        const response = await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error(`Error sending welcome email: ${error}`);
    }
};

export const sendResetPasswordEmail = async (email, otpCode) => {
    const recipient = [{ email }];

    try {
        const transporter = await createTransporter();
        const mailOptions = {
            from: `"Khaled Saeed" <khaled18saeed@gmail.com>`, // Sender address
            to: recipient[0].email, // List of recipients
            subject: "Reset your password", // Subject line
            html: RESET_PASSWORD_EMAIL_TEMPLATE.replace("{otpCode}", otpCode), // HTML body with OTP code
        };

        const response = await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error(`Error sending reset password email: ${error}`);
    }
};
