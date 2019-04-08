const router = require('express').Router();

router.get('/', validate(requestSchema), async (req, res, next) => {
    res.send({
        message: 'GET /logout ok.'
    });
});

router.post('/', validate(requestSchema), async (req, res, next) => {
    res.send({
        message: 'POST /logout ok.'
    });
});