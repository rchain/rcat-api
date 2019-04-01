const User = require('../models/user');
const KycAccount = require('../models/kyc-account');

const { uploadKycFiles } = require('../services/file-upload');

// Save Kyc account data
exports.saveKycData = async (req, res) => {
    let kycAccount = await User.getKycAccountId(req.user);

    if (kycAccount) {
        return 'Kyc account already exists.'
    } else {
        return new Promise((resolve, reject) => {
            uploadKycFiles(req.files, req.user).then(async (values) => {
                let data = req.body;
                let files = [];
                values.forEach(val => {
                    files[Object.keys(val)[0]] = val[Object.keys(val)[0]];
                });
                resolve(await KycAccount.save(data, req.user, files));
            }).catch((err) => {
                resolve(err);
            });
        });
    }
};
