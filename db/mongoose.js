const mongoose = require('mongoose');

const options = {
    useNewUrlParser: true,
    useCreateIndex: true
};

const connect = () => {
    if (process.env.TEST !== 'true') {
        console.log('Trying to connect to mongo db ...');
        mongoose.connect(process.env.MONGODB_URI, options).catch(console.error);
        mongoose.connection
            .once('open', () => console.log('Connected to mongodb successfully!'))
            .on('error', (err) => console.error('Connection error:', err));
    } else {
        console.log('In test mode not running mongo db ...');
    }

};

module.exports.connect = connect;