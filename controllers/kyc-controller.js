const User = require('../models/user');
const KycAccount = require('../models/kyc-account');

// Save Kyc account data
exports.saveKycData = async (req, res) => {
    let kycAccount = await User.getKycAccountId(req.user);
    console.log('kycAccount', kycAccount);

    if (kycAccount) {
        return 'Kyc account already exists.'
    } else {
        let data = req.body;
        let files = req.files;

        // TODO AWS S3 upload
        console.error('TODO AWS S3 upload');

        return await KycAccount.save(data, req.user);
    }
};
