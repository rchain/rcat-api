const axios = require('axios');

const ingest = (payload) => {
    try {
        const acquisitionApiUrl = 'http://35.237.90.48:9000/v1/ingest';
        console.log(`Sending POST request to ${acquisitionApiUrl}`);
        return new Promise((resolve, reject) => {
            axios.post(acquisitionApiUrl, payload)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    } catch (err) {
        // console.log('ERROR ACQUISITION #2', err);
        throw err;
    }
};

module.exports = {
    ingest
};