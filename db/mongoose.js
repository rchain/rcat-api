const mongoose = require('mongoose');

const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    autoReconnect: false
};

const connect = () => {
    if (process.env.TEST === 'true') {
        return console.log('In test mode not running mongo db ...');
    }

    const db = mongoose.connection;


    db.on('connecting', function() {
        console.log('connecting to MongoDB...');
    });

    db.on('error', function(error) {
        // console.error('Error in MongoDb connection: ',  error);
        console.error('Error in MongoDb connection: ');
        mongoose.disconnect();
    });
    db.on('connected', function() {
        console.log('MongoDB connected!');
    });
    db.once('open', function() {
        console.log('MongoDB connection opened!');
    });
    db.on('reconnected', function () {
        console.log('MongoDB reconnected!');
    });
    db.on('disconnected', function() {
        console.log('MongoDB disconnected!');
        // mongoose.connect(process.env.MONGODB_URI, {server:{auto_reconnect:true}});
        setTimeout(() => {
            mongoose.connect(process.env.MONGODB_URI, options);
        }, 10000);
    });

    console.log('Trying to connect to mongo db ...');
    mongoose.connect(process.env.MONGODB_URI, options);

};

module.exports.connect = connect;