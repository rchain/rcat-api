require('dotenv').config();
const fs = require('fs');
const fetch = require('isomorphic-fetch'); // or another library of choice.
const Dropbox = require('dropbox').Dropbox;
const config = { accessToken: process.env.DROPBOX_ACCESS_TOKEN, fetch: fetch };
const dbx = new Dropbox(config);

const fileContent = fs.readFileSync('/Users/draganmijatovic/Downloads/aaaaa/as.pdf');

dbx.filesUpload(fileContent)
    .then((response) => {
        console.log('response', response);
    })
    .catch((err) => {
        console.log('error', err);
    });