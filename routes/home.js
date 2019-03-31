const router = require('express').Router();

/**
 * @swagger
 * /:
 *   get:
 *     description: API Home page
 *     produces:
 *       - application/json
 *     parameters:
 *     responses:
 *       200:
 *         description: Home page
 */
router.get('/', function(req, res, next) {
  res.send('RSong Asset Management API');
});

module.exports = router;
