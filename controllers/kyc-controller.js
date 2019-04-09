const User = require('../models/user');
const KycAccount = require('../models/kyc-account');
const { uploadKycFilesToS3 } = require('../services/file-upload');
const { notifyKYC } = require('../services/email');
const KycState = require('../helpers/kys-state');

const getKyc = async (req, res) => {
    return await User.getKycAccountById(req.user.id);
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
    let kycAccount = await User.getKycAccountById(req.user.id);

    if (kycAccount) {
        console.log('(submitKycData) kycAccount.getDataInfo() >>>>>>>>>>>>>>>>>>>>>>>>>>', kycAccount.getDataInfo());
        throw {
            status_code: 409,
            message: 'Kyc account already exists.'
        };
    } else {
        return new Promise((resolve, reject) => {
            uploadKycFilesToS3(req.files, req.user)
                .then(async (values) => {
                    let data = req.body;
                    data.state = 'SUBMITTED';
                    let files = [];
                    values.forEach(val => {
                        files[Object.keys(val)[0]] = val[Object.keys(val)[0]];
                    });
                    return await KycAccount.save(req.user, data, files);
                })
                .then((kyc) => {
                    notifyKYC(kyc, req.files)
                        .then(async (emalResponse) => {
                            await KycAccount.findByIdAndUpdate(
                                kyc._id,
                                {
                                    $set: {
                                        state: KycState.EMAILED
                                    }
                                }
                            );
                            // resolve(await KycAccount.findById(kyc._id));
                            return await KycAccount.findById(kyc._id);
                        })
                        .then(async (kycUpdated) => {
                            console.log('TODO ... verify kyc');
                            await KycAccount.findByIdAndUpdate(
                                kyc._id,
                                {
                                    $set: {
                                        state: KycState.SUBMITTED
                                    }
                                }
                            );
                            resolve(await KycAccount.findById(kyc._id));
                        })
                        .catch((err) => {
                            console.error('notifyEmail ERROR!', err);
                            resolve(kyc);
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