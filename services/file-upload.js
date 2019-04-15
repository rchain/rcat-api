const fs = require('fs');
const multer = require('multer');
const aws = require('aws-sdk');
const path = require('path');
const fetch = require('isomorphic-fetch'); // or another library of choice.
const Dropbox = require('dropbox').Dropbox;
const envJson = require('../env');

// const Promise = require('bluebird');
const {Storage} = require('@google-cloud/storage');
// const GoogleCloudStorage = Promise.promisifyAll(require('@google-cloud/storage'));
// const GoogleCloudStorage = require('@google-cloud/storage');
// const {google} = require('googleapis');


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

const uploadSongToDropBox = async (file, song) => {
    // console.log('file >>>>>>>', file);
    // console.log('fileName >>>>>>>', song.asset_sound.fileNameFull);
    // console.log('process.env.DROPBOX_UPLOAD_PATH >>>>>>>', process.env.DROPBOX_UPLOAD_PATH);
    // const destination = path.join(process.env.DROPBOX_UPLOAD_PATH || '/', song.asset_sound.fileNameFull);
    const destination = process.env.DROPBOX_UPLOAD_PATH;
    // console.log('Trying to upload file to dropbox .... destination:::: ', destination);
    return  await dbx.filesUpload({ path: destination, contents: file.buffer, mode: 'overwrite'});
};


// https://console.cloud.google.com/cloudshell/editor
const uploadAlbumArtImage = async(file, song) => {

    const gcsConf = envJson.gcs;
    // console.log('%%%%%%%%%%%%%%%%%%%%%%%%%', gcsConf);

    const storageOptions = {
        projectId: 'rsong-dev',
        credentials: {
            client_email: gcsConf.client_email,
            private_key: gcsConf.private_key
        }
    };
    const storage = new Storage(storageOptions);
    const BUCKET_NAME = process.env.GCS_BUCKET_NAME;
    const fileName = song.asset_img_art.fileNameFull;
    const originalFileName = song.asset_img_art.originalFileName;
    return new Promise(async (resolve, reject) => {
        storage.bucket(BUCKET_NAME)
            .file(fileName)
            .save(file.buffer)
            .then(() => {
                console.log(`${fileName} uploaded to ${BUCKET_NAME}.`);
                resolve({
                    projectId: storageOptions.projectId,
                    bucket: BUCKET_NAME,
                    fileName: fileName,
                    originalFileName: originalFileName
                });
            })
            .catch((dbxError) => {
                console.error('GCS UPLOAD ERROR!', dbxError);
                reject(dbxError);
            });
    });
};

module.exports = {
    validateFiles,
    uploadKycFilesToS3,
    uploadAlbumArtImage,
    uploadSongToDropBox
};