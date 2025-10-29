import jwt from "jsonwebtoken";

export const generateToken = (userId, role = null, res = null) => {
    try {
        const payload = { userId };
        if (role) payload.role = role;

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        if (res) {
            const cookieOptions = {
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                httpOnly: true,
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production',
                path: '/',
            };

            // For production with custom domain
            if (process.env.NODE_ENV === 'production' && process.env.DOMAIN) {
                cookieOptions.domain = process.env.DOMAIN;
            }

            res.cookie('jwt', token, cookieOptions);
        }

        return token;
    } catch (error) {
        console.error("Token generation error:", error);
        throw new Error("Failed to generate authentication token");
    }
};

// Standardized API Response Helpers
export const sendSuccess = (res, statusCode, message, data = null) => {
    const response = {
        success: true,
        message
    };
    
    if (data !== null) {
        response.data = data;
    }
    
    return res.status(statusCode).json(response);
};

export const sendError = (res, statusCode, message, error = null) => {
    const response = {
        success: false,
        message
    };
    
    if (error && process.env.NODE_ENV === 'development') {
        response.error = error;
    }
    
    return res.status(statusCode).json(response);
};

export const sendValidationError = (res, message, errors) => {
    return res.status(400).json({
        success: false,
        message,
        errors
    });
};