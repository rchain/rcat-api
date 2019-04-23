if(!process.env.TWILLIO_ACCOUNT_SID) {
    throw new Error('Missing TWILLIO_ACCOUNT_SID environment var');
}

if(!process.env.TWILLIO_AUTH_TOKEN) {
    throw new Error('Missing TWILLIO_AUTH_TOKEN environment var');
}

const accountSid = process.env.TWILLIO_ACCOUNT_SID;
const authToken = process.env.TWILLIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const sendSms = (to, message, from=process.env.TWILLIO_PHONE_NUMBER) => {

    const messageObject = {
        from: from,
        to: to,
        body: message
    };

    if(process.env.SMS_NOTIFICATIONS_SILENT === 1) {
        return new Promise((resolve, reject) => {
            console.log('SILENT sms to', messageObject);
            resolve(messageObject);
        });
    }

    return new Promise((resolve, reject) => {
        console.log('Trying to send sms ...', messageObject);
        client.messages
            .create(messageObject)
            .then(response => resolve(response))
            .catch((err) => reject(err));
    });
};

const sendSmsMobileVerificationCode = (to, code) => {
    const message = `Mobile Verification code is ${code}`;
    return sendSms(to, message);
};

module.exports = {
    sendSms,
    sendSmsMobileVerificationCode
};