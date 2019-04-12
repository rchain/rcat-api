const fs = require('fs');
const multer = require('multer');
const aws = require('aws-sdk');
const path = require('path');
const fetch = require('isomorphic-fetch'); // or another library of choice.
const Dropbox = require('dropbox').Dropbox;

// const Promise = require('bluebird');
// const {Storage} = require('@google-cloud/storage');
// const GoogleCloudStorage = Promise.promisifyAll(require('@google-cloud/storage'));
// const GoogleCloudStorage = require('@google-cloud/storage');
const {google} = require('googleapis');


const config = { accessToken: process.env.DROPBOX_ACCESS_TOKEN, fetch: fetch };
const dbx = new Dropbox(config);

if(!process.env.DROPBOX_ACCESS_TOKEN) {
    throw new Error('Missing DROPBOX_ACCESS_TOKEN environment var');
}
if(!process.env.DROPBOX_UPLOAD_PATH) {
    throw new Error('Missing DROPBOX_UPLOAD_PATH environment var');
}

const s3 = new aws.S3({
    // Your SECRET ACCESS KEY from AWS should go here,
    // Never share it!
    // Setup Env Variable, e.g: process.env.SECRET_ACCESS_KEY
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    // Not working key, Your ACCESS KEY ID from AWS should go here,
    // Never share it!
    // Setup Env Variable, e.g: process.env.ACCESS_KEY_ID
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    region: process.env.AWS_S3_REGION // region of your bucket
});

const validateFiles = (fileTypesValidationInfo) => {
    return multer({
        fileFilter: (req, file, cb) => {
            const fileTypesRegex = fileTypesValidationInfo[file.fieldname].ext;
            const mimeTypesRegex = fileTypesValidationInfo[file.fieldname].mime;
            const extension = path.extname(file.originalname).toLowerCase().replace('.', '');
            // console.log('=========================');
            // console.log('mimeTypesRegex', mimeTypesRegex);
            // console.log('fileTypesRegex', fileTypesRegex);
            // console.log('mimetype', file.mimetype);
            // console.log('extension', extension);
            // console.log('=========================');
            const isMimeTypeValid = mimeTypesRegex.test(file.mimetype);
            const isExtensionValid = fileTypesRegex.test(extension);
            if (isMimeTypeValid && isExtensionValid) {
                return cb(null, true);
            }
            cb(`Error: File ${file.fieldname} upload only supports the following file types: ${fileTypesRegex}`);
        }
    });
};

const uploadKycFilesToS3 = async (files, user) => {
    let promises = [];
    let fieldNames = Object.keys(files);
    const cacheControl = `max-age=${60*60*24}`;
    fieldNames.forEach((field, index) => {
        promises[index] =
            new Promise((resolve, reject) => {
                s3.upload({
                    Bucket: process.env.AWS_S3_BUCKET_NAME,
                    Key: `${user.id}/kyc/${field}`,
                    Body: Buffer.from(files[field][0].buffer),
                    acl: 'public-read',
                    cacheControl: cacheControl
                }, (s3Err, data) => {
                    resolve({
                        [field]: data
                    });
                    if (s3Err) throw s3Err;
                    resolve(s3Err);
                });
            });
    });

    return Promise.all(promises);
};

// const uploadSongToS3 = async (files, user) => {
//     return new Promise((resolve, reject) => {
//         const fieldName = Object.keys(files)[0];
//         const file = files[fieldName][0];
//         s3.upload({
//             Bucket: process.env.AWS_S3_BUCKET_NAME,
//             Key: `${user.id}/songs/${file.originalname}`,
//             Body: Buffer.from(file.buffer),
//             acl: 'public-read',
//             cacheControl: 'max-age=31536000'
//         }, (s3Err, data) => {
//             console.log('RESOLVINGGGG', data);
//             resolve({
//                 [fieldName]: data
//             });
//             if (s3Err) throw s3Err; {
//                 resolve(s3Err);
//             }
//         });
//     });
// };

const uploadSongToDropBox = async (file, fileName) => {
    console.log('file >>>>>>>', file);
    console.log('fileName >>>>>>>', fileName);
    console.log('process.env.DROPBOX_UPLOAD_PATH >>>>>>>', process.env.DROPBOX_UPLOAD_PATH);
    const destination = path.join(process.env.DROPBOX_UPLOAD_PATH || '/', fileName);
    console.log('Trying to upload file to dropbox .... destination:::: ', destination);
    return  await dbx.filesUpload({ path: destination, contents: file.buffer});
};


// https://console.cloud.google.com/cloudshell/editor
const uploadAlbumArtImage = async(file, fileName) => {
    // const storage = new Storage();
    // const bucketName = 'rsongassetmanagamentdev';

    const BUCKET_NAME = process.env.GCS_BUCKET_NAME;

    const oauth2Client = new google.auth.OAuth2(
        process.env.GCS_CLIENT_ID,
        process.env.GCS_CLIENT_SECRET,
        process.env.GCS_OAUTH2_CALLBACK
    );

    console.log('oauth2Client >>>>>>', oauth2Client);

    return new Promise(async (resolve, reject) => {
        try {
            // const gcsResponse = await storage.bucket(BUCKET_NAME)
            //     .file(fileName)
            //     .save(fileContent);

            // Each API may support multiple version. With this sample, we're getting
            // v3 of the blogger API, and using an API key to authenticate.
            const drive = google.drive({
                version: 'v3',
                auth: oauth2Client
            });

            console.log('file >>>>>', file);
            const gcsResponse = await drive.files.create({
                requestBody: {
                    name: fileName,
                    mimeType: file.mimetype
                },
                media: {
                    mimeType: file.mimetype,
                    body: file.buffer.toString()
                }
            });

            console.log('gcsResponse >>>>', gcsResponse);
            // console.log(`${filename} uploaded to ${bucketName}.`);
            resolve(gcsResponse);
        } catch (err) {
            console.error('GoogleCloudStorage ERROR', err);
            reject(err);
        }
    });
};

module.exports = {
    validateFiles,
    uploadKycFilesToS3,
    uploadAlbumArtImage,
    uploadSongToDropBox
};