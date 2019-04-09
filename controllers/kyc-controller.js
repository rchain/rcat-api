const User = require('../models/user');
const KycAccount = require('../models/kyc-account');
const { uploadKycFilesToS3 } = require('../services/file-upload');
const { notifyKYC } = require('../services/email');

const getKyc = async (req, res) => {
    return await User.getKycAccountId(req.user);
};

const skip = async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.user.id,
        {$inc: { kyc_skip_count: 1 }}
    );
    return user;
};

// Save Kyc account data
const submitKycData = async (req, res) => {
    let kycAccount = await User.getKycAccountId(req.user);

    if (kycAccount) {
        throw {
            status_code: 409,
            message: 'Kyc account already exists.'
        };
    } else {
        return new Promise((resolve, reject) => {
            uploadKycFilesToS3(req.files, req.user)
                .then(async (values) => {
                    let data = req.body;
                    data.state = 'SUBMITED';
                    let files = [];
                    values.forEach(val => {
                        files[Object.keys(val)[0]] = val[Object.keys(val)[0]];
                    });
                    // resolve(await KycAccount.save(req.user, data, files));
                    return await KycAccount.save(req.user, data, files);
                })
                .then((kycData) => {
                    notifyKYC(kycData, req.files)
                        .then((emalResponse) => {
                            console.log('notifyEmail OK!!!!!!!!');
                            resolve(kycData);
                        })
                        .catch((err) => {
                            console.error('notifyEmail ERROR!!!!!', err);
                            resolve(kycData);
                        });
                })
                .catch((err) => {
                console.error('ERROR[uploadKycFilesToS3]', err);
                reject(err);
            });
        });
    }
};


module.exports = {
    submitKycData,
    skip,
    getKyc
};