const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Types } = Schema;

const songSchema = new mongoose.Schema({
    name: String,
    audio: {
        url: String
    },
    genres: [
        {
            type: Types.ObjectId,
            ref: 'Genre'
        }
    ],
    main_artist_name: String,
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

songSchema.statics.save = async (data, userData) => {
    let song = new Song({
        name: data.name,
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