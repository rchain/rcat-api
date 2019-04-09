const homeRouter = require('./home');
const loginRouter = require('./login');
const logoutRouter = require('./logout');
const authRouter = require('./auth');
const usersRouter = require('./users');
const statusRouter = require('./status');
const kycRouter = require('./kyc');
const songsRouter = require('./songs');
const genresRouter = require('./genres');
const webhooksRouter = require('./webhooks');
const testRouter = require('./tester');

module.exports = {
    homeRouter,
    loginRouter,
    logoutRouter,
    authRouter,
    usersRouter,
    statusRouter,
    kycRouter,
    songsRouter,
    genresRouter,
    webhooksRouter,
    testRouter
};