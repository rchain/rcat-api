const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Types } = Schema;

const genreSchema = new mongoose.Schema({
        name: String
    }, {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
});

genreSchema.statics.save = async (data, userData) => {
    let genre = new Genre({
        name: data.name,
    });

    // TODO ... impl storing genres

    return genre;
};

const Genre = mongoose.model('Genre', genreSchema);
module.exports = Genre;