const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const genreSchema = new mongoose.Schema({
        name: String
    }, {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
});

genreSchema.statics.store = async (data) => {
    const searchQuery = {name: data.name};
    const genreData = {
        name: data.name
    };

    return await Genre.findOneAndUpdate(searchQuery, genreData, {new: true, upsert: true, runValidators: true});
};

const Genre = mongoose.model('Genre', genreSchema);
module.exports = Genre;