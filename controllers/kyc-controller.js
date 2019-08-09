const User = require('../models/user');
const KycAccount = require('../models/kyc-account');
const { uploadKycFilesToGcs } = require('../services/file-upload');
const { notifyAdminAboutKycSubmited, notifyUserAboutKycSubmitted } = require('../services/email');
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
    console.log('BEFOREEEEE User.getKycAccountById() ...');
    let kycAccount = await User.getKycAccountById(req.user.id);

    if (kycAccount && kycAccount.isSubmitted()) {
        console.log('(submitKycData) kycAccount.getDataInfo() >>>>>>>>>>>>>>>>>>>>>>>>>>', kycAccount.getDataInfo());
        throw {
            status_code: 409,
            message: 'Kyc account already exists.'
        };
    } else {
        console.log('No kyc account ... creating new one ...');
        return new Promise(async (resolve, reject) => {
            try {
                const values = await uploadKycFilesToGcs(req.files, req.user);
                let data = req.body;
                data.state = 'SUBMITTED';
                let files = [];
                values.forEach(val => {
                    files[Object.keys(val)[0]] = val[Object.keys(val)[0]];
                });

                console.log('START =============== KycAccount.save() .....');
                const kyc = await KycAccount.save(req.user, data, files);


                try {
                    console.log('START =============== Email sent to KYC Admin');
                    await notifyAdminAboutKycSubmited(kyc, req.files);
                    console.log('END ================= Email sent to KYC Admin');
                    console.log('START *************** Email sent to user who has submited kyc');
                    console.log('req.user', req.user);
                    await notifyUserAboutKycSubmitted(kyc, req);
                    console.log('END ***************** Email sent to user who has submited kyc');
                } catch (err) {
                    console.error('notifyEmail ERROR!', err);
                    return reject(err);
                }

                console.log("======>>>>>>>>>  KycAccount.findByIdAndUpdate ......");
                const kycUpdated = await KycAccount.findByIdAndUpdate(
                    kyc._id,
                    {
                        $set: {
                            state: KycState.SUBMITTED
                        }
                    }
                );
                resolve(kycUpdated);
            } catch (err) {
                console.error('ERROR[uploadKycFilesToS3]', err);
                reject(err);
            }
        });
    }
};


module.exports = {
    submitKycData,
    skip,
    getKyc
};