if(!process.env.TWILLIO_ACCOUNT_SID) {
    throw new Error('Missing TWILLIO_ACCOUNT_SID environment var');
}

if(!process.env.TWILLIO_AUTH_TOKEN) {
    throw new Error('Missing TWILLIO_AUTH_TOKEN environment var');
}

const accountSid = process.env.TWILLIO_ACCOUNT_SID;
const authToken = process.env.TWILLIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const sendSms = (from, to, message) => {

    const messageObject = {
        from: process.env.TWILLIO_PHONE_NUMBER,
        to: to,
        body: message
    };

    if(!!process.env.SMS_NOTIFICATIONS_SILENT) {
        return new Promise((resolve, reject) => {
            console.log('SILENT sms to', messageObject);
            resolve(messageObject);
        });
    }

    return new Promise((resolve, reject) => {
        client.messages
            .create(messageObject)
            .then(response => resolve(response))
            .catch((err) => reject(err));
    });
};

const sendSmsEmailVerificationCode = (to, code) => {
    const messageObject = {
        from: 'NO_REPLY@@localhost.com',
        to: to,
        subject: `Email Verification code is ${code}`,
        body: `Email Verification code is ${code}`
    };

    return new Promise((resolve, reject) => {
        console.log('TODO Impl sendSmsEmailVerificationCode ...',messageObject);
        resolve(messageObject);
    });
};

const sendSmsMobileVerificationCode = (to, code) => {
    const messageObject = {
        from: process.env.TWILLIO_PHONE_NUMBER,
        to: to,
        body: `Mobile Verification code is ${code}`
    };

    return new Promise((resolve, reject) => {
        console.log('TODO Impl sendSmsMobileVerificationCode ...',messageObject);
        resolve(messageObject);
    });
};

module.exports = {
    sendSms,
    sendSmsEmailVerificationCode,
    sendSmsMobileVerificationCode
};