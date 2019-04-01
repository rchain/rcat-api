const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Types } = Schema;

const songSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    audio_url: {
        type: String,
        required: true
    },
    genres: [
        {
            type: Types.ObjectId,
            ref: 'Genre'
        }
    ],
    main_artist_name: {
        type: String,
    },
    artists: [
        {
            name: String
        }
    ],
    album_art: {
        image_url: String
    },
    song_writers: [
        {
            type: Types.ObjectId,
            ref: 'SongWriter'
        }
    ],
    status: String
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});

songSchema.statics.store = async (data) => {
    const searchQuery = {name: data.name};
    const songData = {
        name: data.name,
        image: {
            url: data.image_url
        },
        status: 'Processing'
    };

    return await Song.findOneAndUpdate(searchQuery, songData, {new: true, upsert: true, runValidators: true});
};

const Song = mongoose.model('Song', songSchema);
module.exports = Song;