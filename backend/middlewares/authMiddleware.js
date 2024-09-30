const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token; // Extract token from cookies

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => { // Use environment variable for the secret
        if (err) {
            return res.status(500).json({ message: 'Failed to authenticate token' });
        }

        req.user = decoded; // Set user information in req.user
        next();
    });
};

module.exports = authMiddleware;
