const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Checks if the user is authenticated and ejects him if he's not
const isAuthenticated = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    if (token && token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }

    if (token) {
        const jwtOptions = require('../config/jwt-options');
        jwt.verify(token, process.env.JWT_SECRET, jwtOptions, async (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: 'Token is not valid',
                    err: err
                });
            } else {
                console.log('(middleware) decoded >>>>>>', decoded);
                req.user = decoded;
                const user = await User.findById(req.user.id);
                console.log('(middleware) user >>>>>>', user);
                if(!user) {
                    return res.status(401).json({
                        success: false,
                        message: 'Authorization invalid'
                    });
                }
                next();
            }
        });
    } else {
        return res.status(401).json({
            success: false,
            message: 'Auth token is not supplied'
        });
    }
};


module.exports = {
    isAuthenticated
};
