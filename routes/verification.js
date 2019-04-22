const router = require('express').Router();
const Verification = require('../models/vertifications-vm');
const User = require('../models/user');
const { isAuthenticated } = require('../middlewares/auth-middleware');
const { randomIntInc } = require('../helpers/random');
const {
    sendSms,
    sendSmsEmailVerificationCode,
    sendSmsMobileVerificationCode
} = require('../services/sms');

router.use(isAuthenticated);


router.get('/', async (req, res, next) => {
    try {
        // console.log('req.user >>>>>', req.user);
        const user = await User.findById(req.user.id).populate('facebook_account kyc_account gmail_account');
        return res.send(Verification.newRequireEmail().toJson());
    } catch (err) {
        console.error('ERROR GET /verification', err);
        res.status(500).send(err);
    }
});

router.post('/email', async (req, res, next) => {

    try {
        console.log('POST /verification/email: ', req.body);
        const email = req.body.email;
        const code = randomIntInc(100000, 999999);
        await User.findByIdAndUpdate(req.user.id, {
            $set: {
                'email': email,
                'verification_data.code_email': code
            }
        });
        await sendSmsEmailVerificationCode(code);
        const user = await User.findById(req.user.id);
        return res.send(user.getVerification());
    } catch (err) {
        if(err.response && err.response.data) {
            console.error(err.response.data);
            return res.status(500).send(err.response.data);
        }
        res.status(500).send(err);
    }
});

router.post('/email-verification', async (req, res, next) => {

    try {
        console.log('POST /verification/email-verification: ', req.body);
        const code = req.body.code;
        await User.findByIdAndUpdate(req.user.id, {
            $set: {
                'verification_data.code_email': code,
                'verification_data.code_email_verified': !!code && code === this.verification_data.code_email,
            },
            $inc: {
                'verification_data.code_email_verify_count': 1
            }
        });
        await sendSmsMobileVerificationCode(code);
        const user = await User.findById(req.user.id);
        return res.send(user.getVerification());
    } catch (err) {
        if(err.response && err.response.data) {
            console.error(err.response.data);
            return res.status(500).send(err.response.data);
        }
        res.status(500).send(err);
    }
});

router.post('/mobile', async (req, res, next) => {

    try {
        console.log('POST /verification/mobile: ', req.body);
        const mobile = req.body.mobile;
        const code = randomIntInc(100000, 999999);
        const user = await User.findByIdAndUpdate(req.user.id, {
            $set: {
                'mobile': mobile,
                'verification_data.code_mobile': code
            }
        });
        console.log('TODO! Send user verification mobile! code:::', code);
        return res.send(user.getVerification());
    } catch (err) {
        if(err.response && err.response.data) {
            console.error(err.response.data);
            return res.status(500).send(err.response.data);
        }
        res.status(500).send(err);
    }
});

router.post('/mobile-verification', async (req, res, next) => {

    try {
        console.log('POST /verification/mobile-verification: ', req.body);
        const code = req.body.code;
        const user = await User.findByIdAndUpdate(req.user.id, {
            $set: {
                'verification_data.code_mobile': code,
                'verification_data.code_mobile_verified': !!code && code === this.verification_data.code_mobile,
            },
            $inc: {
                'verification_data.code_mobile_verify_count': 1
            }
        });
        return res.send(user.getVerification());
    } catch (err) {
        console.error(err);
        if(err.response && err.response.data) {
            console.error(err.response.data);
            return res.status(500).send(err.response.data);
        }
        res.status(500).send(err);
    }
});

router.post('/email-resend', async (req, res, next) => {

    try {
        console.log('POST /verification/email-resend: ', req.body);
        const user = await User.findById(req.user.id);
        await sendSmsEmailVerificationCode(user.email, user.verification_data,code_mobile);
        return res.send(user.getVerification());
    } catch (err) {
        console.error(err);
        if(err.response && err.response.data) {
            console.error(err.response.data);
            return res.status(500).send(err.response.data);
        }
        res.status(500).send(err);
    }
});

router.post('/mobile-resend', async (req, res, next) => {
    try {
        console.log('POST /verification/mobile-resend: ', req.body);
        const user = await User.findById(req.user.id);
        await sendSmsMobileVerificationCode(user.mobile, user.verification_data,code_mobile);
        return res.send(user.getVerification());
    } catch (err) {
        console.error(err);
        if(err.response && err.response.data) {
            console.error(err.response.data);
            return res.status(500).send(err.response.data);
        }
        res.status(500).send(err);
    }
});


module.exports = router;