// const Mailjet = require ('node-mailjet')
//     .connect(process.env.MAILJET_PUBLIC_KEY, process.env.MAILJET_SECRET_KEY);
//
// /*
// we register a resource to perform multiple tasks
// To learn more about the resources you can use, there is a well maintained
// API reference: dev.mailjet.com
//  */
// let send = Mailjet.post('send');
// let me = Mailjet.get('user');
//
// me.request(function(error, response, body) {
//     console.log (response.statusCode, error || body);
// });
//
// /*
// the email is an object that must contain some properties:
// FromEmail: sender email address
// FromName: sender name
// Subject: the email Subject
// Html-part: the html content or Text-part if this is text only
// Recipients: an Array of recipients
//
// The callback is executed once the email is sent
// */
// exports.sendEmail = function (email, callback) {
//     console.log('Inside sendEmail() ...........');
//     // We add some parts to our content.
//     email['Html-part'] += '\n\n' + '<p>Sent with the Mailjet API</p>';
//     // we trigger the request with our data, and our callback function
//     console.log('process.env.EMAIL_NOTIFICATIONS_SILENT', process.env.EMAIL_NOTIFICATIONS_SILENT);
//     if(process.env.EMAIL_NOTIFICATIONS_SILENT && process.env.EMAIL_NOTIFICATIONS_SILENT.trim().toLowerCase() === 'true') {
//         console.log('Email notifications in SILENT mode. Logging email ...', email);
//     } else {
//         console.log('Sending email via mailjet ...', email);
//         send.request(email, callback);
//     }
// };

const mailjet = require ('node-mailjet')
    .connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);

const sendEmail = mailjet.post('send', {'version': 'v3.1'});

module.exports = {
    mailjet,
    sendEmail
};