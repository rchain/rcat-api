const User = require('../models/user');
const KycAccount = require('../models/kyc-account');
const mailjet = require('../services/mailjet');

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

    mailjet.post("send", {'version': 'v3.1'})
        .request(emailData)
        .then((resp) => {
            console.log('email response', resp);
        })
        .catch((err) => {
            console.log('emil err', err);
        });

};

// Save Kyc account data
exports.saveKycData = async (req, res) => {
    let kycAccount = await User.getKycAccountId(req.user);

    if (kycAccount) {
        throw {
            status_code: 409,
            message: 'Kyc account already exists.'
        };
    } else {
        return new Promise((resolve, reject) => {
            uploadKycFiles(req.files, req.user).then(async (values) => {
                let data = req.body;
                let files = [];
                values.forEach(val => {
                    files[Object.keys(val)[0]] = val[Object.keys(val)[0]];
                });
                resolve(await KycAccount.save(req.user, data, files));
                notifyEmail();
            }).catch((err) => {
                resolve(err);
            });
        });
    }
};
