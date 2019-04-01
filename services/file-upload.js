const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const path = require('path');

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

// aws.config.update({
//     // Your SECRET ACCESS KEY from AWS should go here,
//     // Never share it!
//     // Setup Env Variable, e.g: process.env.SECRET_ACCESS_KEY
//     secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
//     // Not working key, Your ACCESS KEY ID from AWS should go here,
//     // Never share it!
//     // Setup Env Variable, e.g: process.env.ACCESS_KEY_ID
//     accessKeyId: process.env.AWS_S3_ACCESS_KEY,
//     region: process.env.AWS_S3_REGION // region of your bucket
// });

const validateKycDocuments = multer({
    fileFilter: (req, file, cb) => {
        const fileTypes = /png|jpeg|jpg/;
        const isMimeTypeValid = fileTypes.test(file.mimetype);
        const isExtensionValid = fileTypes.test(path.extname(file.originalname).toLowerCase());

        if (isMimeTypeValid && isExtensionValid) {
            return cb(null, true);
        }

        cb("Error: File upload only supports the following file types: " + fileTypes);
    },
    // storage: multerS3({
    //     s3: s3,
    //     bucket: process.env.AWS_S3_BUCKET_NAME,
    //     acl: 'public-read',
    //     cacheControl: 'max-age=31536000',
    //     metadata: function (req, file, cb) {
    //         cb(null, { fieldName: file.fieldname });
    //     },
    //     key: function (req, file, cb) {
    //         cb(null, Date.now().toString())
    //     }
    // })
});

const uploadKycFiles = async (files, user) => {
    let promises = [];
    let fieldNames = Object.keys(files);
    fieldNames.forEach((field, index) => {
        promises[index] =
            new Promise((resolve, reject) => {
                s3.upload({
                    Bucket: process.env.AWS_S3_BUCKET_NAME,
                    Key: `${user.id}/${field}`,
                    Body: Buffer.from(files[field][0].buffer),
                    acl: 'public-read',
                    cacheControl: 'max-age=31536000'
                }, (s3Err, data) => {
                    resolve({
                        [field]: data
                    });
                    if (s3Err) throw s3Err
                    resolve(s3Err);
                });
            });
    });

    return Promise.all(promises);
};

module.exports = {
    uploadKycFiles,
    validateKycDocuments
}