const jwt = require('jsonwebtoken');

// Checks if the user is authenticated and ejects him if he's not
const isAuthenticated = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    if (token && token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }

    if (token) {
        const jwtOptions = require('../config/jwt-options');
        jwt.verify(token, process.env.JWT_SECRET, jwtOptions, (err, decoded) => {
            if (err) {
                return res.json(401, {
                    success: false,
                    message: 'Token is not valid'
                });
            } else {
                req.user = decoded;
                next();
            }
        });
    } else {
        return res.json(401, {
            success: false,
            message: 'Auth token is not supplied'
        });
    }
};


module.exports = {
    isAuthenticated
};
