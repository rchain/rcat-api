const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Types } = Schema;

const genreSchema = new mongoose.Schema({
        title: String
    }, {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
});

genreSchema.statics.save = async (data, userData) => {
    let title = new Song({
        title: data.title,
    });

    // TODO ... impl storing genres

    return song;
};

const Song = mongoose.model('Genre', genreSchema);
module.exports = Song;