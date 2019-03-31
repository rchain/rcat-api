const router = require('express').Router();

/**
 * @swagger
 * /status:
 *   get:
 *     summary: Status check
 *     description:
 *       "Returns status of the api"
 *     responses:
 *       200:
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: String
 *         examples:
 *           application/json: {
 *             "status": "ok"
 *           }
 *       500:
 *         description: When something is wrong
 */
router.get('/', function(req, res, next) {
  res.send({
    status: 'ok'
  });
});

module.exports = router;
