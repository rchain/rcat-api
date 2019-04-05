const User = require('../models/user');
const KycAccount = require('../models/kyc-account');
const sendEmail = require('../services/mailjet');

const { uploadKycFiles } = require('../services/file-upload');

const notifyEmail = () => {
    const emailData = {
        "Messages":[{
            "From": {
                "Email": process.env.KYC_NOTIFY_EMAIL_FROM_EMAIL,
                "Name": process.env.KYC_NOTIFY_EMAIL_FROM_NAME
            },
            "To": [{
                "Email": process.env.KYC_NOTIFY_EMAIL_RECIPIENT_EMAIL,
                "Name": process.env.KYC_NOTIFY_EMAIL_RECIPIENT_NAME
            }],
            'Subject': 'Test with the NodeJS Mailjet wrapper',
            'Text-part': 'KYC Submited',
            'Attachments': []
        }]
    };

    return new Promise(function(resolve, reject){
        if(process.env.EMAIL_NOTIFICATIONS_SILENT === 'true') {
            console.log('SILENT EMAIL', emailData);
            return resolve('SILENT');
        }
        sendEmail.request(emailData)
            .then((resp) => {
                console.log('email response', resp);
                kycRespoonse = resp;
                resolve(resp);
            })
            .catch((err) => {
                // console.error(err);
                reject(err);
            });
    });
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
            uploadKycFiles(req.files, req.user)
                .then(async (values) => {
                    let data = req.body;
                    data.status = 'SUBMITED';
                    let files = [];
                    values.forEach(val => {
                        files[Object.keys(val)[0]] = val[Object.keys(val)[0]];
                    });
                    console.log('BEFORE notifyEmail() ...');
                    resolve(await KycAccount.save(req.user, data, files));
                })
                .then((kycData) => {
                    notifyEmail()
                        .then((emialResponse) => {
                            resolve(kycData);
                        })
                        .catch((err) => {
                            console.error('ERROR sending email');
                            resolve(kycData);
                        });
                })
                .catch((err) => {
                console.error('ERROR[uploadKycFiles]', err);
                reject(err);
            });
        });
    }
};


module.exports = {
    submitKycData,
    skip
};