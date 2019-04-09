require('dotenv').config();
const express = require('express');
const logger = require('morgan');
// const cookieParser = require('cookie-parser');
// const cookieSession = require('cookie-session');
var cors = require('cors');

const app = express();

// const { cookieMaxAge } = require('./config/cookie');

const corsOption = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));

app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

///////////////////////////
// Routes
///////////////////////////
const {
    homeRouter,
    statusRouter,
    loginRouter,
    logoutRouter,
    authRouter,
    usersRouter,
    kycRouter,
    songsRouter,
    genresRouter,
    webhooksRouter,
    testRouter
} = require('./routes');

app.use('/', homeRouter);
app.use('/status', statusRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/kyc', kycRouter);
app.use('/songs', songsRouter);
app.use('/genres', genresRouter);
app.use('/webhooks', webhooksRouter);
app.use('/test', testRouter);

app.use(function (err, req, res, next) {
    res.status(400).json(err);
});

//////////////////////////////////////////
// Connecting to database
//////////////////////////////////////////
require('./db/mongoose').connect();

module.exports = app;
