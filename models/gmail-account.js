const mongoose = require('mongoose');
const User = require('./user');
const { randomIntInc } = require('../helpers/random');

const gmailAccountSchema = new mongoose.Schema({
    gmail_id: String,
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

gmailAccountSchema.statics.login = async function (data) {
    let gmailAccount = new GmailAccount({
        gmail_id: data.Eea,
        first_name: data.ofa,
        last_name: data.wea,
        full_name: data.ig,
        email: data.U3,
        profile_picture_url: data.Paa
    });

    // check if there is a record of this gmail account in database
    const gmailAccountFound = await this.findOne({ gmail_id: data.Eea });

    let userFound;
    // if there is a gmail record, find corresponding user
    if (gmailAccountFound && !gmailAccountFound.isNew) {
        userFound = await User.findOne({ gmail_account: gmailAccountFound.id } , '-__v').populate('kyc_account gmail_account', '-__v');
    }

    // if there is a user - return it, otherwise - create new gmail and user
    if (gmailAccountFound && userFound) {
        return userFound;
    } else {
        gmailAccount = await this.create(gmailAccount).catch(console.error);
        const user = await User.createUserWithGmailAccount(gmailAccount);
        return user;
    }
};

const GmailAccount = mongoose.model('GmailAccount', gmailAccountSchema);
module.exports = GmailAccount;