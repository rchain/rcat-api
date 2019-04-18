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
        userFound = await User.findOne({ facebook_account: facebookAccountFound.id } , '-__v').populate('kyc_account facebook_account', '-__v');
    }

    // if there is a user - return it, otherwise - create new gmail and user
    if (facebookAccountFound && userFound) {
        console.log('Returning FOUND user ...');
        return userFound;
    } else {
        facebookAccount = await this.create(facebookAccount).catch(console.error);
        let userAccount = await User.create({
            facebook_account: facebookAccount.id ,
            verification: {
                verified: false,
                code: randomIntInc(100000, 999999),
                counter: 0
            }
        });

        const newUser = await User.findOne({ facebookAccount: userAccount.facebookAccount }, '-__v').populate('facebook_account', '-__v');
        console.log('Returning NEW user ...');
        return newUser
    }
};

const FacebookAccount = mongoose.model('FacebookAccount', facebookAccountSchema);
module.exports = FacebookAccount;