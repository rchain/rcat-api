const homeRouter = require('./home');
const verificationRouter = require('./verification');
const loginRouter = require('./login');
const logoutRouter = require('./logout');
const usersRouter = require('./users');
const meRouter = require('./me');
const statusRouter = require('./status');
const kycRouter = require('./kyc');
const songsRouter = require('./songs');
const genresRouter = require('./genres');
const webhooksRouter = require('./webhooks');
const testRouter = require('./tester');

module.exports = {
    homeRouter,
    statusRouter,
    verificationRouter,
    loginRouter,
    logoutRouter,
    usersRouter,
    meRouter,
    kycRouter,
    songsRouter,
    genresRouter,
    webhooksRouter,
    testRouter
};