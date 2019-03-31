const homeRouter = require('./home');
const loginRouter = require('./login');
const usersRouter = require('./users');
const statusRouter = require('./status');
const kycRouter = require('./kyc');
const songsRouter = require('./songs');
const testRouter = require('./tester');

module.exports = {
    homeRouter,
    loginRouter,
    usersRouter,
    statusRouter,
    kycRouter,
    songsRouter,
    testRouter
};