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
    let name = new Genre({
        title: data.name,
    });

    // TODO ... impl storing genres

    return song;
};

const Genre = mongoose.model('Genre', genreSchema);
module.exports = Genre;