const mongoose = require('mongoose');

const kycSchema = new mongoose.Schema({
    country_of_residence: String,
    first_name: String,
    last_name: String,
    date_of_birth: Date,
    email: String,
    profile_picture_url: String,
    gender: {
        type: String,
        enum: ['Male', 'Female'],
    },
    identification: {
        type: String,
        enum: ['Passport', 'Driver\'s license', 'ID card'],
    },
    id_number: String,
    expiration: Date,
    identity_card_front_url: String,
    identity_card_back_url: String,
    identity_card_selfie_url: String
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});

const KycAccount = mongoose.model('KycAccount', kycSchema);
module.exports = KycAccount;