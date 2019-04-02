const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Types } = Schema;
const idvalidator = require('mongoose-id-validator');

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
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
        required: true
    },
    artists: {
        type: [String],
        required: true,
        trim: true,
    },
    album_art_image_url: {
        type: String
    },
    song_writers: [
        {
            type: Types.ObjectId,
            ref: 'SongWriter'
        }
    ],
    status: {
        type: String
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});
// Required to include to avoid error: Schema hasn't been registered for model \"SongWriter\".\nUse mongoose.model(name, schema)
require('./song-writer');
require('./genre');
songSchema.plugin(idvalidator);

songSchema.statics.store = async (data) => {
    const searchQuery = {title: data.title};
    let songs = await Song.find(searchQuery);
    if(songs.length > 0) {
        await Song.updateOne(searchQuery, data, {new: true, upsert: true, runValidators: true});
        return await Song.findOne(searchQuery);
    } else {
        return await Song.create(data);
    }
};

// Pre hook for `findOneAndUpdate`
songSchema.pre('findOneAndUpdate', function(next) {
    this.options.runValidators = true;
    next();
});

const Song = mongoose.model('Song', songSchema);
module.exports = Song;