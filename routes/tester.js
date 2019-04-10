const router = require('express').Router();

router.get('/', function(req, res, next) {
  res.send('testing ...');
});

router.get('/headers', function(req, res, next) {
  res.send(req.headers);
});

module.exports = router;
