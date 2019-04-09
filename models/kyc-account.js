const mongoose = require('mongoose');
const User = require('./user');
const KycState = require('../helpers/kys-state');

const kycAccountSchema = new mongoose.Schema({
    country_of_residence: String,
    first_name: {
        type: String,
        required: true
    },
    last_name: String,
    date_of_birth: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    identification_type: {
        type: String,
        enum: ['passport', 'drivers_licence', 'id_card'],
        required: true
    },
    identification_id_number: String,
    identification_expiration_date: Date,
    identification_front_image_url: String,
    identification_back_image_url: String,
    identification_selfie_image_url: String,
    state: {
        type: String,
        enum: [KycState.SUBMITED, KycState.APPROVED, KycState.REJECTED],
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});

kycAccountSchema.statics.save = async function (userData, data, files) {
    let kycAccount = new KycAccount({
        country_of_residence: data.country_of_residence,
        first_name: data.first_name,
        last_name: data.last_name,
        date_of_birth: data.date_of_birth,
        gender: data.gender,
        identification_type: data.identification_type,
        identification_id_number: data.identification_id_number,
        identification_expiration_date: data.identification_expiration_date,
        identification_front_image_url: files.identification_front_image.Location,
        identification_back_image_url: files.identification_back_image.Location,
        identification_selfie_image_url: files.identification_selfie_image.Location
    });

    let user = await User.findById(userData.id, '-__v').populate('kyc_account gmail_account', '-_id -__v');

    // if there is a user - return it, otherwise - create new gmail and user
    kycAccount = await this.create(kycAccount).catch(console.error);
    await user.updateOne({
        kyc_account: kycAccount.id
    });
    return await User.findById(userData.id, '-__v').populate('kyc_account gmail_account', '-_id -__v');
};

const KycAccount = mongoose.model('KycAccount', kycAccountSchema);
module.exports = KycAccount;