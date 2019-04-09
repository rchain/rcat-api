// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');


const notifyKYC = (kycData, files) => {
    const fullName = kycData.full_name;

    if(process.env.EMAIL_NOTIFICATIONS_SILENT === 'true') {
        console.log('SILENT EMAIL', '...');
        return 'SILENT EMAIL';
    }

    const images = [files.identification_front_image[0], files.identification_back_image[0], files.identification_selfie_image[0]];

    const attachments = images.map((img) => {
        return {
            content: img.buffer.toString('base64'),
            filename: img.originalname,
            type: img.mimetype,
            disposition: 'attachment',
            content_id: img.fieldname
        };
    });

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: process.env.KYC_NOTIFY_EMAIL_RECIPIENTS,
        from: process.env.KYC_NOTIFY_EMAIL_FROM_EMAIL,
        subject: `${fullName} submited KYC`,
        text: kycData.getDataInfo('\n'),
        html: kycData.getDataInfo(),
        attachments: attachments,
    };

    return sgMail.send(msg);

};


module.exports = {
    notifyKYC
};