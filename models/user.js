const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Types } = Schema;
const _ = require('lodash');
const { randomIntInc } = require('../helpers/random');

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    mobile: String,
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
    verification_data: {
        code_email: {
            type: String
        },
        code_email_verify_count: {
            type: Number,
            default: 0
        },
        code_email_verified: {
            type: Boolean
        },
        code_mobile: {
            type: String
        },
        code_mobile_verify_count: {
            type: Number,
            default: 0
        },
        code_mobile_verified: {
            type: Boolean
        }
    },
    admin: {
        type: Types.Boolean,
        default: false
    }
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
});

// userSchema.virtual('require_kyc').get(function () {
//     return !this.kyc_account || this.kyc_account.require_kyc;
// });

userSchema.virtual('full_name').get(function () {
    return `${this.first_name} ${this.last_name}`;
});

userSchema.methods.isEmailVerified = function() {
    return this.verification_data && !!this.verification_data.code_email_verified;
};

userSchema.methods.isMobileVerified = function() {
    return this.verification_data && !!this.verification_data.code_mobile_verified;
};

userSchema.methods.getVerification = function() {
    const requireEmail = !this.email || this.email.trim().length === 0;
    const requireEmailCodeExpired = this.verification_data.code_email_verify_count > 0;
    const requireEmailVerification = !this.verification_data.code_email_verified;
    const requireMobile = !this.mobile || this.mobile.trim().length === 0;
    const requireMobileCodeExpired = this.verification_data.code_mobile_verify_count > 0;
    const requireMobileVerification = !this.verification_data.code_mobile_verified;
    const requireKyc = !this.kyc_account || this.kyc_account.require_kyc;
    console.log('requireEmailCodeExpired', requireEmailCodeExpired);
    console.log('requireMobileCodeExpired', requireMobileCodeExpired);
    return {
        verified: !requireEmail && !requireEmailVerification && !requireMobile && !requireMobileVerification && !requireKyc,
        requireEmail: requireEmail,
        // requireEmailCodeExpired: requireEmailCodeExpired,
        requireEmailVerification: requireEmailVerification,
        requireMobile: requireMobile,
        // requireMobileCodeExpired: requireMobileCodeExpired,
        requireMobileVerification: requireMobileVerification,
        requireKyc: requireKyc
    }
};

userSchema.methods.verifyEmailCode = function(code) {
    this.verification_data.code_email_verify_count++;
    return this.verification_data.code_email == code;
};

userSchema.statics.getKycAccountById = async function (userId) {
    const user = await User.findById(userId, '-__v').populate('kyc_account', '-__v');
    if(user == null) {
        throw new Error('User not found');
    }
    return user.kyc_account;
};

const getUserData = () => {
    const codeEmail = randomIntInc(100000, 999999);
    const codeMobile = randomIntInc(100000, 999999);
    return {
            verification_data: {
                code_email: codeEmail,
                code_email_verify_count: 0,
                code_email_verified: false,
                code_mobile: codeMobile,
                code_mobile_verify_count: 0,
                code_mobile_verified: false
            }
        };
};

userSchema.statics.createUserWithGmailAccount = async function(gmailAccount) {
    const userData = _.assign(getUserData(),
        {gmail_account: gmailAccount}
    );
    const userAccount = await User.create(userData);
    return await User.findById(userAccount._id).populate('kyc_account gmail_account', '-__v -verification_data');
};

userSchema.statics.createUserWithFacebookAccount = async function(facebookAccount) {
    const userData = _.assign(getUserData(), {facebook_account: facebookAccount});
    const userAccount = await User.create(userData);
    return await User.findById(userAccount._id).populate('kyc_account gmail_account', '-__v -verification_data');
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