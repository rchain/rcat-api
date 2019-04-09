const mongoose = require('mongoose');
const path = require('path');
const crypto = require('crypto');
const Schema = mongoose.Schema;
const { Types } = Schema;
const idvalidator = require('mongoose-id-validator');
const SongState = require('../helpers/song-state');
const Genre = require('./genre');

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: false
    },
    subtitle: {
        type: String
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
    release_date: {
        type: Date
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
            },
            rev_email: {
                type: String,
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
            },
            rev_email: {
                type: String,
            },
            isrc: {
                type: String
            }
        }
    ],
    version: {
        type: Number,
        default: 1
    },
    state: {
        type: String,
        enum: [SongState.NEW, SongState.UPLOADED_FOR_CONVERSION]
    }
}, {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    });

songSchema.virtual('state_title').get(function () {
    return SongState.title(this.state)
});

// Required to include to avoid error: Schema hasn't been registered for model \"SongWriter\".\nUse mongoose.model(name, schema)
// require('./genre');
// songSchema.plugin(idvalidator);

songSchema.statics.createSong = async function (req) {
    const data = req.body;

    const fieldName = Object.keys(req.files)[0];
    const originalFileName = req.files[fieldName][0].originalname;

    const version = 1;
    const songExtension = path.extname(originalFileName);
    const newFileName = `${data.title}${version}${data.main_artist_name}${data.release_date}${songExtension}`;
    const newFileNameEncoded = crypto.createHash('md5').update(newFileName).digest("hex") + songExtension;

    const albumArtImageUrl = 'https://cdn.pixabay.com/photo/2017/07/29/13/17/green-2551467_960_720.jpg';

    let song = new Song({
        title: data.title,
        subtitle: data.song_subtitle,
        genres: data.genres,
        main_artist_name: data.main_artist_name,
        release_date: data.release_date,
        artists: data.artists,
        album_art_image_url: albumArtImageUrl,
        song_writers: data.song_writers,
        sound_owners: data.sound_owners,
        collaborators: data.collaborators,
        fileName: newFileNameEncoded,
        originalFileName: originalFileName,
        version: version,
        state: 'NEW'
    });
    // return await this.create(song);
    song = await this.create(song);
    return await Song.findById(song.id).populate('genres', '-__v -created_at -updated_at');
};
songSchema.methods.transformSongWriters = function () {
    let result = [];
    for(var i = 0; i < this.song_writers.length; i++) {
        result.push({
            type: 'song_writer',
            _id: this.song_writers[i]._id,
            name: this.song_writers[i].name,
            publisher: this.song_writers[i].publisher,
            percentages: [
                {
                    "type": "total_song",
                    "value": this.song_writers[i].percentage_100_total_song
                },
                {
                    "type": "publisher",
                    "value": this.song_writers[i].percentage_100_publisher
                }
            ]
        });
    }
    return result;
};

songSchema.methods.transformSoundOwners = function () {
    let result = [];
    for(var i = 0; i < this.sound_owners.length; i++) {
        result.push({
            type: 'sound_owner',
            _id: this.sound_owners[i]._id,
            name: this.sound_owners[i].name,
            role: this.sound_owners[i].role,
            percentages: [
                {
                    "type": "total",
                    "value": this.sound_owners[i].percentage_100
                },
            ],
            rev_wallet_address: this.sound_owners[i].rev_wallet_address,
            rev_email: this.sound_owners[i].rev_email
        });
    }
    return result;
};

songSchema.methods.transformCollaborators = function () {
    let result = [];
    for(var i = 0; i < this.collaborators.length; i++) {
        result.push({
            type: 'collaborator',
            _id: this.collaborators[i]._id,
            name: this.collaborators[i].name,
            role: this.collaborators[i].role,
            percentages: [
                {
                    "type": "total",
                    "value": this.collaborators[i].percentage_100
                },
            ],
            rev_wallet_address: this.collaborators[i].rev_wallet_address,
            rev_email: this.collaborators[i].rev_email
        });
    }
    return result;
};

songSchema.methods.transformAck = function () {

    const songWriters = this.transformSongWriters();
    const soundOwners = this.transformSoundOwners();
    const collaborators = this.transformCollaborators();

    const data = {
        _id: this._id,
        title: this.title,
        main_artist_name: this.main_artist_name,
        release_date: this.release_date,
        genres: this.genres,
        artists: this.artists,
        staff: [...songWriters, ...soundOwners, ...collaborators],
        state: this.state,
        fileName: this.fileName,
        originalFileName: this.originalFileName,
        song_dropbox_data: this.song_dropbox_data,
        created_at: this.created_at,
        updated_at: this.updated_at
    };

    return data;
};

const Song = mongoose.model('Song', songSchema);
module.exports = Song;