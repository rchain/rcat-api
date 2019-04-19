require('dotenv').config();
const express = require('express');
const cors = require('cors');
const uuid = require('node-uuid');
const morgan = require('morgan');
const {
    configureNoUserScope
} = require('./services/sentry');

const app = express();


const corsOption = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));
app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({ extended: false, limit: '100mb' }));

///////////////////////////
// Logging
///////////////////////////
configureNoUserScope();

// const loggerFormat = '(:user-agent) :method :url :status :res[content-length] - :response-time ms';
const loggerFormat = 'dev';

const assignId = (req, res, next) => {
    req.id = uuid.v4();
    next();
};

app.use(assignId);

app.use(morgan(loggerFormat, {
    skip: function (req, res) {
        return res.statusCode < 400
    },
    stream: process.stderr
}));

app.use(morgan(loggerFormat, {
    skip: function (req, res) {
        return res.statusCode >= 400
    },
    stream: process.stdout
}));


///////////////////////////
// Routes
///////////////////////////
const {
    homeRouter,
    statusRouter,
    loginRouter,
    logoutRouter,
    usersRouter,
    meRouter,
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
app.use('/users', usersRouter);
app.use('/me', meRouter);
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
