const jwt = require("jsonwebtoken");

const createJwtToken = () => {
    const jwtPayload = {
        id:  '5cbee42c825f012dd7ac60d7',
        email: 'test@test.com',
        name: 'Jest tester',
        auth_provider: 'pera@lozac.com'
    };
    const jwtOptions = require('../config/jwt-options');
    return jwt.sign(jwtPayload, process.env.JWT_SECRET, jwtOptions);
};

module.exports = {
    createJwtToken
};