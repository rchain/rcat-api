const mongoose = require('mongoose');
const User = require('./user');

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
    const gmailAccountFound = await this.findOne({ email: gmailAccount.email });

    let userFound;
    // if there is a gmail record, find corresponding user
    if (gmailAccountFound) {
        userFound = await User.findOne({ gmail_account: gmailAccountFound.id } , '-__v').populate('kyc_account gmail_account', '-_id -__v');
    }

    // if there is a user - return it, otherwise - create new gmail and user
    if (gmailAccountFound && userFound) {
        return userFound;
    } else {
        gmailAccount = await this.create(gmailAccount).catch(console.error);
        let userAccount = await User.create({ gmail_account: gmailAccount.id });
        return await User.findOne({ gmailAccount: userAccount.gmailAccount }, '-__v').populate('gmail_account', '-_id -__v');
    }
};

const GmailAccount = mongoose.model('GmailAccount', gmailAccountSchema);
module.exports = GmailAccount;