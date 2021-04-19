import jwt from 'jsonwebtoken';

export function auth(req, res, next) {
    try {
        let authTest = false;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            const split = req.headers.authorization.split("Bearer ");
            const token = split[split.length - 1];
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

export function isOwner(req, res, userIdToCheck) {
    try {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            const split = req.headers.authorization.split("Bearer ");
            const token = split[split.length - 1];
            const decoded = jwt.decode(token, process.env.TOKEN_KEY);
            return decoded.userId === userIdToCheck;
        } else {
            throw new Error("Missing token");
        }
    } catch (err) {
        throw err;
    }
}
