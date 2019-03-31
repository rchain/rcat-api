const router = require('express').Router();
const { isAuthenticated } = require('../middlewares/auth-middleware');

router.use(isAuthenticated);

router.get('/', function(req, res, next) {
    res.send({});
});

router.post('/', function(req, res, next) {
    res.send({});
});

module.exports = router;
