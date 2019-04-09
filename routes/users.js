const router = require('express').Router();
const { isAuthenticated } = require('../middlewares/auth-middleware');
const User = require('../models/user');

router.use(isAuthenticated);

/* GET users listing. */
router.get('/', async (req, res, next) => {

  try {
    const user = await User.findById(req.user.id).populate('kyc_account', '-__v');
    console.log('user', user);
    res.send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }

});

module.exports = router;
