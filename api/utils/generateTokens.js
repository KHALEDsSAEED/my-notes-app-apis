import jwt from "jsonwebtoken";

// Generate access token that expires in 15 minutes, set it as a cookie
export const generateAccessToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "15m",  // Short-lived access token (15 minutes)
    });

    res.cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 minutes
    });

    return token;
};

// Generate refresh token that expires in 1 days, set it as a cookie,
// this function used to refresh the access token when it expires that way
// the user doesn't have to log in again after the access token expires
export const generateRefreshToken = (res, userId) => {
    const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '1d',  // Set expiration to 24 hours (1 day)
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    });

    return refreshToken;
};
