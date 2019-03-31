const router = require('express').Router();
const { isAuthenticated } = require('../middlewares/auth-middleware');

// router.use(isAuthenticated);

/**
 * @swagger
 * /test:
 *   get:
 *     summary: Test
 *     description:
 *       "Test route"
 *     responses:
 *       200:
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: String
 *       500:
 *         description: When something is wrong
 */
router.get('/', function(req, res, next) {
  res.send('testing ...');
});

router.get('/unsecure', function(req, res, next) {
  res.send({
    info: 'testing unsecure route',
    status: 'ok'
  });
});

router.get('/secure', isAuthenticated, function(req, res, next) {
  console.log('req.user >>>', req.user);
  res.send({
    info: 'testing secure route',
    status: 'ok'
  });
});

module.exports = router;
