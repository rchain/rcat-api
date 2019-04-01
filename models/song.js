const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Types } = Schema;

const songSchema = new mongoose.Schema({
        title: String,
        image: {
            url: String
        },
        status: String
    }, {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
});

songSchema.statics.save = async (data, userData) => {
    let song = new Song({
        title: data.title,
        image: {
            url: data.image_url
        },
        status: 'Processing'
    });

    // TODO ... impl storing songs

    return song;
};

const Song = mongoose.model('Song', songSchema);
module.exports = Song;