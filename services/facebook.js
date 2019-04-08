const FacebookTokenStrategy = require('passport-facebook-token');
const User = require('../models/user');

if(!process.env.FACEBOOK_APP_ID) {
    throw new Error('Missing FACEBOOK_APP_ID environment var');
}

if(!process.env.FACEBOOK_APP_SECRET) {
    throw new Error('Missing FACEBOOK_APP_SECRET environment var');
}

const facebookTokenStrategy = new FacebookTokenStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        fbGraphVersion: 'v3.0',
        profileFields: ['id', 'displayName', 'name', 'gender', 'emails']
    }, function(accessToken, refreshToken, profile, done) {
        const data = {
            accessToken,
            refreshToken,
            profile
        };
        return done(null, data);
    }
);

module.exports = {
    facebookTokenStrategy
};