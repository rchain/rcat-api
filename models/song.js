const mongoose = require('mongoose');
const path = require('path');
const crypto = require('crypto');
const Schema = mongoose.Schema;
const { Types } = Schema;
// const idvalidator = require('mongoose-id-validator');
const SongState = require('../helpers/song-state');
// const Genre = require('./genre');

const songSchema = new mongoose.Schema({
    title: {
        type: String
    },
    subtitle: {
        type: String
    },
    fileName: String,
    originalFileName: String,
    mimetype: String,
    genres: [
        {
            type: Types.ObjectId,
            ref: 'Genre'
        }
    ],
    main_artist_name: {
        type: String,
    },
    release_date: {
        type: Date
    },
    artists: [
        {
            name: String,
        }
    ],
    album_art_image_url: String,
    song_writers: [
        {
            name: {
                type: String,
            },
            percentage_100_total_song: {
                type: Number,
            },
            percentage_100_publisher: {
                type: Number,
            },
            publisher: {
                type: String,
            },
            rev_wallet_address: {
                type: String,
            },
            rev_email: {
                type: String,
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
            },
            role: {
                type: String,
            },
            percentage_100: {
                type: Number,
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
            },
            role: {
                type: String,
            },
            percentage_100: {
                type: Number,
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
    asset_sound: {
        fileNameFull: String,
        fileNameOnly: String,
        fileNameExtension: String,
        originalFileName: String,
        mimetype: String,
        size: Number,
        version: String,
        dropbox_data: {
            id: String,
            name: String,
            path_lower: String,
            path_display: String,
            client_modified: String,
            server_modified: String,
            rev: String,
            size: String
        }
    },
    asset_img_art: {
        fileNameFull: String,
        fileNameOnly: String,
        fileNameExtension: String,
        originalFileName: String,
        mimetype: String,
        size: Number,
        version: String,
        gcs_data: {
            projectId: String,
            bucket: String,
            fileName: String,
            originalFileName: String
        }
    },
    version: {
        type: Number,
        default: 1
    },
    state: {
        type: String,
        enum: [SongState.NEW, SongState.UPLOADED_FOR_CONVERSION]
    },
    owner: {
        user_id: {
            type: String,
        }
    },
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
});

songSchema.virtual('state_title').get(function () {
    return SongState.title(this.state)
});

// Required to include to avoid error: Schema hasn't been registered for model \"SongWriter\".\nUse mongoose.model(name, schema)
// require('./genre');
// songSchema.plugin(idvalidator);

songSchema.statics.createSong = async function (req, fileSong, fileImage) {
    const data = req.body;

    const songVersion = 1;
    const songExtension = path.extname(fileSong.originalname);
    const newSongFileName = `${data.title}${songVersion}${data.main_artist_name}${data.release_date}${songExtension}`;
    const newSongFileNameWithoutExtEncoded = crypto.createHash('md5').update(newSongFileName).digest("hex");

    console.log('data.artists >>>>>>>>>>>>>>>>>', data.artists);

    let song = new Song({
        title: data.title,
        subtitle: data.song_subtitle,
        genres: data.genres,
        main_artist_name: data.main_artist_name,
        release_date: data.release_date,
        artists: data.artists,
        song_writers: data.song_writers,
        sound_owners: data.sound_owners,
        collaborators: data.collaborators,
        asset_sound: {
            fileNameFull: newSongFileNameWithoutExtEncoded + songExtension,
            fileNameOnly: newSongFileNameWithoutExtEncoded,
            fileNameExtension: songExtension,
            originalFileName: fileSong.originalname,
            mimetype: fileSong.mimetype,
            size: 0,
            version: songVersion,
            dropbox_data: {}
        },
        asset_img_art: {
            fileNameFull: newSongFileNameWithoutExtEncoded + path.extname(fileImage.originalname),
            fileNameOnly: newSongFileNameWithoutExtEncoded,
            fileNameExtension: path.extname(fileImage.originalname),
            originalFileName: fileImage.originalname,
            mimetype: fileImage.mimetype,
            size: 0,
            version: 1,
            gcs_data: {}
        },
        state: 'NEW',
        owner: {
            user_id: req.user.id
        }
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
            id: this.song_writers[i]._id,
            name: this.song_writers[i].name,
            publisher: this.song_writers[i].publisher,
            main: false,
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
            id: this.sound_owners[i]._id,
            name: this.sound_owners[i].name,
            role: this.sound_owners[i].role,
            main: false,
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
            id: this.collaborators[i]._id,
            name: this.collaborators[i].name,
            role: this.collaborators[i].role,
            main: false,
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

songSchema.methods.transformForAcquisition = function (user) {

    const appVersionTag = '0.4.1';

    const timestamp = + new Date();

    const songWriters = this.transformSongWriters();
    const soundOwners = this.transformSoundOwners();
    const collaborators = this.transformCollaborators();

    const header = {
        application: 'artist.rsong.io',
        version: appVersionTag,
        api_key: '',
        timestamp: timestamp
    };

    const userInfo = {
        id: user.id,
        oauth_info: {
            source: user.auth_provider,
            bag: [
                {key: 'email', value: user.email},
                {key: 'name', value: user.name}
            ]
        },
        rsong_io_generated_id: this.id
    };

    const artists = this.artists.map((art) => {
        return {
            type: 'artist',
            name: art.name,
            main: false
        };
    });

    const staff = [
        {
            type: 'artist',
            name: this.main_artist_name,
            main: true
        },
        ...artists,
        ...songWriters,
        ...soundOwners,
        ...collaborators
    ];

    const data = {
        header: header,
        title: this.title,
        sub_title: this.subtitle,
        user: userInfo,
        release_date: this.release_date.toString(),
        genres: this.genres.map((g) => {
            return {_id: g._id.toString(), name: g.name};
        }),
        staff: staff,
        assets: [
            {
                provider: 'dropbox',
                file_type: 'audio',
                name: this.originalFileName || 'N/A',
                hashed_name: this.fileName || 'N/A',
                uri: this.asset_sound.dropbox_data.path_display,
                timestamp: this.asset_sound.dropbox_data.server_modified.toString()
            },
            {
                provider: 'gcs',
                file_type: 'img',
                name: this.asset_img_art.originalFileName || 'N/A',
                hashed_name: this.asset_img_art.fileNameFull || 'N/A',
                bucket: this.asset_img_art.gcs_data.bucket,
                projectId: this.asset_img_art.gcs_data.projectId,
                uri: this.asset_img_art.gcs_data.fileName,
                timestamp: timestamp.toString()
            }
        ]
    };

    return data;
};

const Song = mongoose.model('Song', songSchema);
module.exports = Song;