const router = require('express').Router();
const { sendSms } = require('../services/sms');

router.get('/', function(req, res, next) {
  // const envJson = require('../env');
  // console.log(envJson);
  // res.send(envJson.gcs);
  res.send('???');
});

router.get('/headers', function(req, res, next) {
  res.send(req.headers);
});

router.post('/sms', (req, res, next) => {
  console.log('req.body', req.body);
  sendSms(req.body);
  res.send(req.body);
});

module.exports = router;
