import jwt from 'jsonwebtoken';

// Check if a user is logged in and has a valid token
export function auth(req, res, next) {
    try {
        let authTest = false;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            // Get token from request headers
            const split = req.headers.authorization.split("Bearer ");
            const token = split[split.length - 1];
            // Verify token
            const decoded = jwt.verify(token, process.env.TOKEN_KEY);
            if (decoded !== undefined) {
                authTest = true;
            }
        }
        if (authTest) {
            next();
        } else {
            res.status(401).json(new Error("Not connected"));
        }
    } catch (err) {
        throw err;
    }
};

// Check if an ID belongs to the user by comparing it with his token
export function isOwner(req, res, userIdToCheck) {
    try {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            // Get token from request headers
            const split = req.headers.authorization.split("Bearer ");
            const token = split[split.length - 1];
            // Decode token
            const decoded = jwt.decode(token, process.env.TOKEN_KEY);
            // Compare user ID
            return decoded.userId === userIdToCheck;
        } else {
            throw new Error("Missing token");
        }
    } catch (err) {
        throw err;
    }
}
