const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Types } = Schema;

const userSchema = new mongoose.Schema({
    kyc_skip_count: {
        type: Number,
        default: 0
    },
    kyc_account: {
        type: Types.ObjectId,
        ref: 'KycAccount',
    },
    gmail_account: {
        type: Types.ObjectId,
        ref: 'GmailAccount',
    },
    facebook_account: {
        type: Types.ObjectId,
        ref: 'FacebookAccount',
    },
});

userSchema.statics.getKycAccountId = async function (userData) {
    const user = await User.findById(userData.id, '-__v');
    if(user == null) {
        throw new Error('User not found');
    }
    return user.kyc_account;
};

userSchema.statics.upsertFbUser = function(accessToken, refreshToken, profile, cb) {
    var that = this;
    return this.findOne({
        'facebookProvider.id': profile.id
    }, function(err, user) {
        // no user was found, lets create a new one
        if (!user) {
            var newUser = new that({
                email: profile.emails[0].value,
                facebookProvider: {
                    id: profile.id,
                    token: accessToken
                }
            });

            newUser.save(function(error, savedUser) {
                if (error) {
                    console.log(error);
                }
                return cb(error, savedUser);
            });
        } else {
            return cb(err, user);
        }
    });
};

const User = mongoose.model('User', userSchema);
module.exports = User;