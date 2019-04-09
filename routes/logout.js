const router = require('express').Router();

router.get('/', (req, res, next) => {
    res.send({
        message: 'GET /logout ok.'
    });
});

router.post('/', (req, res, next) => {
    res.send({
        message: 'POST /logout ok.'
    });
});

module.exports = router;