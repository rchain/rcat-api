const boom = require('boom');
const router = require('express').Router();
const Joi = require('joi');
const validate = require('express-validation');

const gmailController = require('../controllers/gmail-controller');

const requestSchema = {
    body: {
        Eea: Joi.string().required(),
        Paa: Joi.string().required(),
        U3: Joi.string().required(),
        ofa: Joi.string().required(),
        ig: Joi.string().required(),
        wea: Joi.string().required(),
    },
    headers: {
        gusrid: Joi.string().required(),
    }
};

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
router.post('/gmail', validate(requestSchema), async (req, res, next) => {
    try {
        const data = await gmailController.login(req, res);
        res.send(data);
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
router.post('/facebook', function (req, res, next) {
    res.send(501, {
        status: 'not implemented :('
    });
});

module.exports = router;
