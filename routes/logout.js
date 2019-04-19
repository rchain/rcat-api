const router = require('express').Router();
const {
    Sentry,
    configureUserScope,
    configureNoUserScope,
    clearScope
} = require('../services/sentry');

router.get('/', (req, res, next) => {
    clearScope();
    res.send({
        message: 'GET /logout ok.'
    });
});

router.post('/', (req, res, next) => {
    clearScope();
    res.send({
        message: 'POST /logout ok.'
    });
});

module.exports = router;