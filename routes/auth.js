
const router = require('express').Router();

router.get('/me', function (req, res, next) {
    res.send({
        message: '/me NOT IMPELEMENTED!'
    });
});

module.exports = router;