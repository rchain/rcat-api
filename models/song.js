const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Types } = Schema;
const idvalidator = require('mongoose-id-validator');

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    song_file_url: {
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
        type: String
    }
}, {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    });
// Required to include to avoid error: Schema hasn't been registered for model \"SongWriter\".\nUse mongoose.model(name, schema)
require('./genre');
songSchema.plugin(idvalidator);

songSchema.statics.createSong = async function (userData, data, file) {

    // let kycAccount = new KycAccount({
    //     country_of_residence: data.country_of_residence,
    //     first_name: data.first_name,
    //     last_name: data.last_name,
    //     date_of_birth: data.date_of_birth,
    //     gender: data.gender,
    //     identification_type: data.identification_type,
    //     identification_id_number: data.identification_id_number,
    //     identification_expiration_date: data.identification_expiration_date,
    //     identification_front_image_url: files.identification_front_image.Location,
    //     identification_back_image_url: files.identification_back_image.Location,
    //     identification_selfie_image_url: files.identification_selfie_image.Location
    // });

    // let user = await User.findById(userData.id, '-__v').populate('kyc_account gmail_account', '-_id -__v');

    // // if there is a user - return it, otherwise - create new gmail and user
    // kycAccount = await this.create(kycAccount).catch(console.error);
    // await user.updateOne({
    //     kyc_account: kycAccount.id
    // });
    // return await User.findById(userData.id, '-__v').populate('kyc_account gmail_account', '-_id -__v');
    let song = new Song({
        title: data.title,
        song_file_url: file.Location,
        genres: data.genres,
        main_artist_name: data.main_artist_name,
        artists: data.artists,
        album_art_image_url: data.album_art_image_url,
        song_writers: data.song_writers,
        sound_owners: data.sound_owners,
        collaborators: data.collaborators

    });

    return await this.create(song).catch(console.error);

    // return await this.create(searchQuery, data, { new: true, upsert: true });
};


// Pre hook for `findOneAndUpdate`
songSchema.pre('findOneAndUpdate', function (next) {
    this.options.runValidators = true;
    next();
});

const Song = mongoose.model('Song', songSchema);
module.exports = Song;