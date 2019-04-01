const mongoose = require('mongoose');

const User = require('./user');

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
        enum: ['Male', 'Female'],
        required: true
    },
    identification_type: {
        type: String,
        enum: ['Passport', 'Driver\'s license', 'ID card'],
        required: true
    },
    identification_id_number: String,
    identification_expiration_date: Date,
    identification_front_image_url: String,
    identification_back_image_url: String,
    identification_selfie_image_url: String
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});

kycAccountSchema.statics.save = async function (data, userData) {
    let kycAccount = new KycAccount({
        country_of_residence: data.country_of_residence,
        first_name: data.first_name,
        last_name: data.last_name,
        date_of_birth: data.date_of_birth,
        gender: data.gender,
        identification_type: data.identification_type,
        identification_id_number: data.identification_id_number,
        identification_expiration_date: data.identification_expiration_date,
        identification_front_image_url: data.identification_front_image_url,
        identification_back_image_url: data.identification_back_image_url,
        identification_selfie_image_url: data.identification_selfie_image_url
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