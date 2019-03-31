const jwt = require("jsonwebtoken");

const createJwtToken = () => {
    const jwtPayload = {
        id:  123,
        email: 'pera@lozac.com'
    };
    const jwtOptions = require('../config/jwt-options');
    return jwt.sign(jwtPayload, process.env.JWT_SECRET, jwtOptions);
};

module.exports = {
    createJwtToken
};