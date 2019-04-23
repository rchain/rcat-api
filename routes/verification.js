const router = require('express').Router();
const User = require('../models/user');
const { isAuthenticated } = require('../middlewares/auth-middleware');
const { randomIntInc } = require('../helpers/random');
const { sendSmsMobileVerificationCode } = require('../services/sms');
const { sendEmailWithVerificationCode } = require('../services/email');
const { VerificationDataError } = require('../helpers/custom-errors');
const { Sentry } = require('../services/sentry');

router.use(isAuthenticated);

const validateEmail= (email) => {
    console.log('TODO! Impl Email Validation ...');
};

const validateMobileNumber= (mobile) => {
    console.log('TODO! Impl Mobile num Validation ...');
};

const validateUserHasEmail= (user) => {
    if(!user.email || user.email.trim().length === 0) {
        throw new VerificationDataError('User does not have email.');
    }
};

const validateUserEmailIsNotVerified= (user) => {
    if(user.isEmailVerified()) {
        throw new VerificationDataError('Already verified.');
    }
};

const validateUserHasMobile= (user) => {
    if(!user.mobile || user.mobile.trim().length === 0) {
        throw new VerificationDataError('User does not have mobile.');
    }
};

const validateUserMobileIsNotVerified= (user) => {
    if(user.isMobileVerified()) {
        throw new VerificationDataError('Already verified.');
    }
};

router.get('/', async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).populate('facebook_account kyc_account gmail_account');
        return res.send(user.getVerification());
    } catch (err) {
        console.error('ERROR GET /verification', err);
        Sentry.captureException(err);
        res.status(500).send(err);
    }
});

router.post('/email', async (req, res, next) => {

    try {
        console.log('POST /verification/email: ', req.body);
        console.log('req.user.id: ', req.user.id);
        console.log('req.body.email: ', req.body.email);
        const email = req.body.email;
        const first_name = req.body.first_name;
        const last_name = req.body.last_name;
        validateEmail(email);
        const code = randomIntInc(100000, 999999);
        await User.findByIdAndUpdate(req.user.id, {
            $set: {
                'email': email,
                'first_name': first_name,
                'last_name': last_name,
                'verification_data.code_email': code
            }
        });
        await sendEmailWithVerificationCode(email, code);
        const user = await User.findById(req.user.id);
        return res.send(user.getVerification());
    } catch (err) {
        if (err instanceof VerificationDataError) {
            return res.status(400).send(err.toString());
        }
        if(err.response && err.response.data) {
            console.error(err.response.data);
            Sentry.captureException(err);
            return res.status(500).send(err.response.data);
        }
        Sentry.captureException(err);
        res.status(500).send(err);
    }
});

router.post('/email-code', async (req, res, next) => {

    try {
        console.log('POST /verification/email-code: ', req.body);
        const user = await User.findById(req.user.id);
        validateUserHasEmail(user);
        validateUserEmailIsNotVerified(user);
        const code = req.body.code;
        const isCodeValid = !!code && user.verification_data && code === user.verification_data.code_email;
        console.log({
            isCodeValid: isCodeValid,
            code: code,
            code_db: user.verification_data.code_email
        });

        await User.findByIdAndUpdate(req.user.id, {
            $set: {
                'verification_data.code_email': code,
                'verification_data.code_email_verified': isCodeValid,
            },
            $inc: {
                'verification_data.code_email_verify_count': 1
            }
        });
        const userUpdated = await User.findById(req.user.id);
        if(!isCodeValid) {
            return res.status(400).send({message: 'Code not valid'});
        }
        return res.send(userUpdated.getVerification());
    } catch (err) {
        console.error(err);
        if (err instanceof VerificationDataError) {
            return res.status(400).send(err.toString());
        }
        if(err.response && err.response.data) {
            console.error(err.response.data);
            Sentry.captureException(err);
            return res.status(500).send(err.response.data);
        }
        Sentry.captureException(err);
        res.status(500).send(err);
    }
});

router.post('/mobile', async (req, res, next) => {

    try {
        console.log('POST /verification/mobile: ', req.body);
        const mobile = req.body.mobile;
        validateMobileNumber(mobile);
        const code = randomIntInc(100000, 999999);
        await User.findByIdAndUpdate(req.user.id, {
            $set: {
                'mobile': mobile,
                'verification_data.code_mobile': code
            }
        });
        const user = await User.findById(req.user.id);
        await sendSmsMobileVerificationCode(user.mobile, code);
        return res.send(user.getVerification());
    } catch (err) {
        if (err instanceof VerificationDataError) {
            return res.status(400).send(err.toString());
        }
        if(err.response && err.response.data) {
            console.error(err.response.data);
            Sentry.captureException(err);
            return res.status(500).send(err.response.data);
        }
        Sentry.captureException(err);
        res.status(500).send(err);
    }
});

router.post('/mobile-code', async (req, res, next) => {

    try {
        console.log('POST /verification/mobile-code: ', req.body);
        const user = await User.findById(req.user.id);
        validateUserHasMobile(user);
        validateUserMobileIsNotVerified(user);
        const code = req.body.code;
        const isCodeValid = !!code && user.verification_data && code === user.verification_data.code_mobile;
        console.log({
            code: code,
            codeInDb: user.verification_data.code_mobile,
            isCodeValid: isCodeValid
        });
        await User.findByIdAndUpdate(req.user.id, {
            $set: {
                'verification_data.code_mobile': code,
                'verification_data.code_mobile_verified': isCodeValid,
            },
            $inc: {
                'verification_data.code_mobile_verify_count': 1
            }
        });
        const userUpdated = await User.findById(req.user.id);
        return res.send(userUpdated.getVerification());
    } catch (err) {
        if (err instanceof VerificationDataError) {
            return res.status(400).send(err.toString());
        }
        if(err.response && err.response.data) {
            console.error(err.response.data);
            Sentry.captureException(err);
            return res.status(500).send(err.response.data);
        }
        Sentry.captureException(err);
        res.status(500).send(err);
    }
});

router.post('/email-resend', async (req, res, next) => {

    try {
        console.log('POST /verification/email-resend: ', req.body);
        const user = await User.findById(req.user.id);
        validateUserHasEmail(user);
        validateUserEmailIsNotVerified(user);
        await sendEmailWithVerificationCode(user.email, user.verification_data.code_email);
        return res.send(user.getVerification());
    } catch (err) {
        console.error(err);
        if (err instanceof VerificationDataError) {
            return res.status(400).send(err.toString());
        }
        if(err.response && err.response.data) {
            console.error(err.response.data);
            Sentry.captureException(err);
            return res.status(500).send(err.response.data);
        }
        Sentry.captureException(err);
        res.status(500).send(err);
    }
});

router.post('/mobile-resend', async (req, res, next) => {
    try {
        console.log('POST /verification/mobile-resend: ', req.user);
        const user = await User.findById(req.user.id);
        validateUserHasMobile(user);
        validateUserMobileIsNotVerified(user);
        await sendSmsMobileVerificationCode(user.mobile, user.verification_data.code_mobile);
        return res.send(user.getVerification());
    } catch (err) {
        if (err instanceof VerificationDataError) {
            return res.status(400).send(err.toString());
        }
        if(err.response && err.response.data) {
            console.error(err.response.data);
            Sentry.captureException(err);
            return res.status(500).send(err.response.data);
        }
        Sentry.captureException(err);
        res.status(500).send(err);
    }
});


module.exports = router;