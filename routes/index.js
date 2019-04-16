const homeRouter = require('./home');
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
    loginRouter,
    logoutRouter,
    usersRouter,
    meRouter,
    statusRouter,
    kycRouter,
    songsRouter,
    genresRouter,
    webhooksRouter,
    testRouter
};