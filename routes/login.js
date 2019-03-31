const boom = require('boom');
const router = require('express').Router();
const gmailController = require('../controllers/gmail-controller');
/**
 * @swagger
 * /login/gmail:
 *   post:
 *     summary: Gmail login
 *     description:
 *       "Login via gmail"
 *     responses:
 *       200:
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: String
 *         examples:
 *           application/json: {
 *             "token": "somestring",
 *             "id": "somestring",
 *             "gmail_account" : {
 *                 "first_name": "name",
 *                 "last_name": "name"
 *             }
 *           }
 *       400:
 *         description: Bad Request / Invalid token
 */
router.post('/gmail', async (req, res, next) => {
    try {
        const gmailResponse = await gmailController.login(req, res);
        console.log('gmailResponse >>>', gmailResponse);
        res.send(gmailResponse);
    } catch (err) {
        throw boom.boomify(err);
    }
});

/**
 * @swagger
 * /login/facebook:
 *   post:
 *     summary: Facebook login
 *     description:
 *       "Login via facebook"
 *     responses:
 *       200:
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: String
 *         examples:
 *           application/json: {
 *             "token": "somestring",
 *             "id": "somestring",
 *           }
 *       400:
 *         description: Bad Request / Invalid token
 */
router.post('/facebook', function(req, res, next) {
    res.send(501, {
        status: 'not implemented :('
    });
});

module.exports = router;
