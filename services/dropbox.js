require('dotenv').config();

if(!process.env.DROPBOX_ACCESS_TOKEN) {
    throw new Error('Missing DROPBOX_ACCESS_TOKEN environment var');
}
if(!process.env.DROPBOX_CONVERSION_IN_PATH) {
    throw new Error('Missing DROPBOX_CONVERSION_IN_PATH environment var');
}

const fs = require('fs');
const path = require('path');
const fetch = require('isomorphic-fetch'); // or another library of choice.
const Dropbox = require('dropbox').Dropbox;
const config = { accessToken: process.env.DROPBOX_ACCESS_TOKEN, fetch: fetch };
const dbx = new Dropbox(config);

const uploadByContent = (fileContent, destination) => {
    console.log(`Trying to upload file to dropbox ${destination}`);
    const fileCommitInfo = { path: destination, contents: fileContent};
    return  dbx.filesUpload(fileCommitInfo);
        // .then((response) => {
        //     console.log('response', response);
        // })
        // .catch((err) => {
        //     console.log('error', err);
        // });
};

const uploadByPath = (source, destination) => {
    if (!fs.existsSync(source)) {
        throw `File ${source} not found :(`;
    }
    const fileContent = fs.readFileSync(source);
    return uploadByContent(fileContent, destination);
};


const uploadSongByPath = (source) => {
    const { root, dir, base, ext, name } = path.parse(source);
    const destination = path.join(process.env.DROPBOX_CONVERSION_IN_PATH || '/', base);
    return uploadByPath(source, destination);
};

const uploadSongByContent = (fileContent, fileName) => {
    const destination = path.join(process.env.DROPBOX_CONVERSION_IN_PATH || '/', fileName);
    return uploadByContent(fileContent, destination);
};

module.exports = {
    uploadSongByPath,
    uploadSongByContent
};
