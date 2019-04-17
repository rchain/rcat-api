const User = require('../models/user');

const verifySmsCode = async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.user.id,
        {
            $inc: {
                "verification.counter": 1
            }
        }
    );

    console.log('(verifySmsCode)', {
        user_verification_code_in_db: user.verification.code,
        user_provided_code: req.code,
    });
    const verificationOk = user.verification.code === req.code;
    await User.findByIdAndUpdate(
        req.user.id,
        {
            $set: {
                "verification.verified": verificationOk
            }
        }
    );

    return verificationOk ? 'User Verified OK' : 'User Verification failed';
};

module.exports = {
    verifySmsCode
};