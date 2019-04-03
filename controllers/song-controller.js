const Song = require('../models/song');
const mailjet = require('../services/mailjet');

const { uploadSongS3 } = require('../services/file-upload');
const {
    uploadSongByPath,
    uploadSongByContent
} = require('../services/dropbox');

const listAllSongs = async (req, res) => {
    return Song.find({});
};

const createSong = async (req, res) => {
    // const emailData = {
    //     //     FromEmail: process.env.KYC_NOTIFY_EMAIL_FROM_EMAIL,
    //     //     FromName: process.env.KYC_NOTIFY_EMAIL_FROM_NAME,
    //     //     Subject: 'KYC request submited',
    //     //     "Html-part": JSON.stringify(song),
    //     //     Recipients: process.env.KYC_NOTIFY_EMAIL_RECIPIENTS,
    //     // };
    //     //
    //     // const emailData = {
    //     //     "Messages":[{
    //     //         "From": {
    //     //             "Email": process.env.KYC_NOTIFY_EMAIL_FROM_EMAIL,
    //     //             "Name": process.env.KYC_NOTIFY_EMAIL_FROM_NAME
    //     //         },
    //     //         "To": [{
    //     //             "Email": process.env.KYC_NOTIFY_EMAIL_RECIPIENT_EMAIL,
    //     //             "Name": process.env.KYC_NOTIFY_EMAIL_RECIPIENT_NAME
    //     //         }],
    //     //         'Subject': 'Test with the NodeJS Mailjet wrapper',
    //     //         'Text-part': 'Hello NodeJs !',
    //     //         'Attachments': [{
    //     //             "Content-Type": "text-plain",
    //     //             "Filename": "test.txt",
    //     //             "Content": "VGhpcyBpcyB5b3VyIGF0dGFjaGVkIGZpbGUhISEK", // Base64 for "This is your attached file!!!"
    //     //         }]
    //     //     }]
    // };

    // mailjet.sendEmail(emailToBeSent, function (error, response, body) {
    //     // If the statusCode is 201 or 200, it is a good thing
    //     console.log (response.statusCode, error || body);
    //     // We now go back to the homepage, by telling express to redirect to
    //     // http://my_web_site/
    //
    //     // We send the response to the client !
    //     res.send(JSON.stringify({error: err, response: response, body: body}));
    // });
    return new Promise((resolve, reject) => {

        const fieldName = Object.keys(req.files)[0];
        const fileContent = req.files[fieldName][0];
        const fileName = req.files[fieldName][0].originalname;

        uploadSongS3(req.files, req.user).then(async (values) => {
            let data = req.body;
            let song = values[Object.keys(values)[0]];
            // resolve(await Song.createSong(req.user, data, song));
            return uploadSongByContent(fileContent, fileName)
                .then(async (response) => {
                    console.log('DROPBOX RESPONSE', response);
                    const newSong = await Song.createSong(req.user, data, song);
                    resolve(newSong);
                })
                .catch((err) => {
                    reject(err);
                });
        }).catch((err) => {
            reject(err);
        });
    });
};

// const updateSong = (req, res) => {
//     const { id } = req.params;
// };

exports.listAllSongs = listAllSongs;
exports.createSong = createSong;
// exports.updateSong = updateSong;