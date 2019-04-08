const router = require('express').Router();
const Joi = require('joi');
const validate = require('express-validation');

const loginController = require('../controllers/login-controller');

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

router.post('/gmail', validate(requestSchema), async (req, res, next) => {
    try {
        const data = await loginController.loginGmail(req, res);
        res.send(data);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post('/facebook', async (req, res, next) => {
    try {
        const data = await loginController.loginFacebook(req, res);
        res.send(data);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
