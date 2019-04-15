if(!process.env.TWILLIO_ACCOUNT_SID) {
    throw new Error('Missing TWILLIO_ACCOUNT_SID environment var');
}

if(!process.env.TWILLIO_AUTH_TOKEN) {
    throw new Error('Missing TWILLIO_AUTH_TOKEN environment var');
}

const accountSid = process.env.TWILLIO_ACCOUNT_SID;
const authToken = process.env.TWILLIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const sendSms = ({message, to}) => {
    return new Promise((resolve, reject) => {
        client.messages
            .create({
                body: message,
                from: process.env.TWILLIO_PHONE_NUMBER,
                to: to
            })
            .then(response => resolve(response))
            .catch((err) => reject(err));
    });
};

module.exports = {
    sendSms
};