const mongoose = require('mongoose');
const User = require('./user');
const { randomIntInc } = require('../helpers/random');

const facebookAccountSchema = new mongoose.Schema({
    facebook_id: String,
    first_name: String,
    last_name: String,
    full_name: String,
    email: String,
    profile_picture_url: String,
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});

facebookAccountSchema.statics.login = async function (data) {
    let facebookAccount = new FacebookAccount({
        facebook_id: data.facebookId,
        full_name: data.displayName,
        email: data.email,
        profile_picture_url: data.profile_picture_url
    });

    // check if there is a record of this gmail account in database
    // const facebookAccountFound = await this.findOne({ email: facebookAccount.email });
    const facebookAccountFound = await this.findOne({ facebook_id: data.facebookId });

    let userFound;
    // if there is a facebook record, find corresponding user
    if (facebookAccountFound && !facebookAccountFound.isNew) {
        console.log('Found Facebook Account', facebookAccountFound);
        userFound = await User.findOne({ facebook_account: facebookAccountFound.id } , '-__v -verification_data').populate('kyc_account facebook_account', '-__v');
    }

    // if there is a user - return it, otherwise - create new gmail and user
    if (facebookAccountFound && userFound) {
        console.log('Returning FOUND user ...');
        return userFound;
    } else {
        facebookAccount = await this.create(facebookAccount).catch(console.error);
        const user = await User.createUserWithFacebookAccount(facebookAccount);
        console.log('Returning NEW Facebook user ...', user);
        return user;
    }
};

const FacebookAccount = mongoose.model('FacebookAccount', facebookAccountSchema);
module.exports = FacebookAccount;