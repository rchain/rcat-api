const router = require('express').Router();
const Joi = require('joi');
const validate = require('express-validation');
const gmaillController = require('../controllers/gmail-controller');
const facebookController = require('../controllers/facebook-controller');
const {
    Sentry,
    configureUserScope
} = require('../services/sentry');

const requestGmailSchema = {
    body: {
        Eea: Joi.string().required(),
        Paa: Joi.string().required(),
        U3: Joi.string().required(),
        ofa: Joi.string().required(),
        ig: Joi.string().required(),
        wea: Joi.string().required(),
    },
    headers: {
        gusrid: Joi.string().required(),
    }
};

router.post('/gmail', validate(requestGmailSchema), async (req, res, next) => {
    try {
        const data = await gmaillController.loginGmail(req, res);
        if(data.statusCode) {
            return res.status(data.statusCode).send(data);
        }
        configureUserScope(req.user);
        res.send(data);
    } catch (err) {
        console.error(err);
        Sentry.captureException(err);
        console.error('Google login ERROR', err);
        res.status(500).send(err);
    }
});

const requestFacebookSchema = {
    body: {},
    headers: {
        access_token: Joi.string().required(),
    }
};

router.post('/facebook', validate(requestFacebookSchema), async (req, res, next) => {
    try {
        if(req.body.force_error) {
            return res.status(400).send({"statusCode":400,"error":"Bad Request","message":"Token mismatch"});
        }
        const data = await facebookController.loginFacebook(req, res);
        if(data.statusCode) {
            console.log('facebookController.loginFacebook error response >>>', data);
            Sentry.captureMessage(JSON.stringify(data));
            return res.status(data.statusCode).send(data);
        }
        configureUserScope(req.user);
        res.send(data);
    } catch (err) {
        console.error(err);
        Sentry.captureException(err);
        console.error('Facebook login ERROR', err);
        res.status(500).send(err);
    }
});

module.exports = router;