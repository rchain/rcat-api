const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Types } = Schema;
const idvalidator = require('mongoose-id-validator');

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: false
    },
    fileName: String,
    originalFileName: String,
    song_dropbox_data: {
        type: Object
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
    album_art_image_url: String,
    song_writers: [
        {
            name: {
                type: String,
                required: true
            },
            percentage_100_total_song: {
                type: Number,
                required: true
            },
            percentage_100_publisher: {
                type: Number,
                required: true
            },
            publisher: {
                type: String,
                required: true
            },
            rev_wallet_address: {
                type: String,
                // required: true
            },
            rev_email: {
                type: String,
                // required: true
            },
            publisher_rights_organization: {
                type: String
            },
            iswc: {
                type: String
            }
        }
    ],
    sound_owners: [
        {
            name: {
                type: String,
                required: true
            },
            role: {
                type: String,
                required: true
            },
            percentage_100: {
                type: Number,
                required: true
            },
            rev_wallet_address: {
                type: String,
                required: true
            },
            rev_email: {
                type: String,
                required: true
            },
            isrc: {
                type: String
            }
        }
    ],
    collaborators: [
        {
            name: {
                type: String,
                required: true
            },
            role: {
                type: String,
                required: true
            },
            percentage_100: {
                type: Number,
                required: true
            },
            rev_wallet_address: {
                type: String,
                required: true
            },
            rev_email: {
                type: String,
                required: true
            },
            isrc: {
                type: String
            }
        }
    ],
    status: {
        type: String,
        enum: ['NEW', 'UPLOADED_FOR_CONVERSION']
    }
}, {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    });

songSchema.virtual('status_title').get(function () {
    switch (this.status) {
        case 'NEW':
            return 'new';
        default:
            return 'unknown';
    }
});

// Required to include to avoid error: Schema hasn't been registered for model \"SongWriter\".\nUse mongoose.model(name, schema)
require('./genre');
songSchema.plugin(idvalidator);

songSchema.statics.createSong = async function (userData, data) {
    let song = new Song({
        title: data.title,
        // song_dropbox_data: dbxResponse,
        genres: data.genres,
        main_artist_name: data.main_artist_name,
        artists: data.artists,
        album_art_image_url: data.album_art_image_url,
        song_writers: data.song_writers,
        sound_owners: data.sound_owners,
        collaborators: data.collaborators,
        status: 'NEW'
    });
    // return await this.create(song);
    song = await this.create(song);
    return await Song.findById(song.id).populate('genres', '-__v -created_at -updated_at');
};

const Song = mongoose.model('Song', songSchema);
module.exports = Song;