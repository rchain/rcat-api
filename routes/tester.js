const router = require('express').Router();

router.get('/', function(req, res, next) {
  // const envJson = require('../env');
  // console.log(envJson);
  // res.send(envJson.gcs);
  res.send('???');
});

router.get('/headers', function(req, res, next) {
  res.send(req.headers);
});

module.exports = router;
