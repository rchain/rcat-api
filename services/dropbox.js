if(!process.env.DROPBOX_ACCESS_TOKEN) {
    throw new Error('Missing DROPBOX_ACCESS_TOKEN environment var');
}
if(!process.env.DROPBOX_UPLOAD_PATH) {
    throw new Error('Missing DROPBOX_UPLOAD_PATH environment var');
}

const fs = require('fs');
const path = require('path');
const fetch = require('isomorphic-fetch'); // or another library of choice.
const Dropbox = require('dropbox').Dropbox;
const config = { accessToken: process.env.DROPBOX_ACCESS_TOKEN, fetch: fetch };
const dbx = new Dropbox(config);

const uploadSongByContent = (fileContent, fileName) => {
    const destination = path.join(process.env.DROPBOX_UPLOAD_PATH || '/', fileName);
    console.log(`Trying to upload file to dropbox ${destination}`);
    return  dbx.filesUpload({ path: destination, contents: fileContent});
};

module.exports = uploadSongByContent;
