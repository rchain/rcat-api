const mongoose = require('mongoose');
const User = require('./user');
const Kyc = require('./kyc-account');

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
    console.log('Gmaill account login enter ...');
    let gmailAccount = new GmailAccount({
        gmail_id: data.Eea,
        first_name: data.ofa,
        last_name: data.wea,
        full_name: data.ig,
        email: data.U3,
        profile_picture_url: data.Paa
    });

    console.log('Trying to find gmail account in database ...');
    // check if there is a record of this gmail account in database
    const foundByGmailId = await this.findOne({ email: gmailAccount.email });
    console.log('foundByGmailId >>>', foundByGmailId);

    let foundUserByGmail;
    // if there is a gmail record, find corresponding user
    if (foundByGmailId) {
        foundUserByGmail = await User.findOne({ gmail_account: foundByGmailId.id } , '-__v').populate('kyc_account gmail_account', '-_id -__v');
    }

    // if there is a user - return it, otherwise - create new gmail and user
    if (foundByGmailId && foundUserByGmail) {
        return foundUserByGmail;
    } else {
        console.log('Trying to create GMAIL USER ...');
        gmailAccount = await this.create(gmailAccount).catch(console.error);
        console.log('Created gmail account', gmailAccount);
        let userAccount = await User.create({ gmail_account: gmailAccount.id });
        return await User.findOne({ gmailAccount: userAccount.gmailAccount }, '-__v').populate('gmail_account', '-_id -__v');
    }
};

const GmailAccount = mongoose.model('GmailAccount', gmailAccountSchema);
module.exports = GmailAccount;