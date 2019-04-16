const router = require('express').Router();
const { isAuthenticated } = require('../middlewares/auth-middleware');
const User = require('../models/user');

router.use(isAuthenticated);

router.get('/', (req, res, next) => {
  try {
    return res.send(req.user);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

router.post('/', (req, res, next) => {
  try {
    console.log('req.body >>>', req.body);
    return res.send(req.body);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

module.exports = router;
