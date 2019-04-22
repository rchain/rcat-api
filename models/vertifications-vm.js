const _ = require('lodash');

module.exports = class Verification {

    constructor(data = {}) {
        this.requireEmail = !!data.requireEmail;
        this.requireEmailCodeExpired = !!data.requireEmailCodeExpired;
        this.requireEmailVerification = !!data.requireEmailVerification;
        this.requireMobile = !!data.requireMobile;
        this.requireMobileCodeExpired = !!data.requireMobileCodeExpired;
        this.requireMobileVerification = !!data.requireMobileVerification;
        this.requireKyc = !!data.requireKyc;
    }

    toJson() {
        return {
            require_email: !!this.requireEmail,
            require_email_code_expired: !!this.requireEmailCodeExpired,
            require_email_verification: !!this.requireEmailVerification,
            require_mobile: !!this.requireMobile,
            require_mobile_code_expired: !!this.requireMobileCodeExpired,
            require_mobile_verification: !!this.requireMobileVerification,
            require_kyc: !!this.requireKyc
        };
    }

    static newRequireEmail() {
        return new Verification({
            verified: false,
            requireEmail: true,
            requireEmailVerification: true,
            requireMobile: true,
            requireMobileVerification: true,
            requireKyc: true
        });
    }

    static newRequireEmailVerification() {
        return new Verification({
            verified: false,
            requireEmail: false,
            requireEmailVerification: true,
            requireMobile: true,
            requireMobileVerification: true,
            requireKyc: true
        });
    }

    static newRequireMobile() {
        return new Verification({
            verified: false,
            requireEmail: false,
            requireEmailVerification: false,
            requireMobile: true,
            requireMobileVerification: true,
            requireKyc: true
        });
    }

    static newRequireMobileVerification() {
        return new Verification({
            verified: false,
            requireEmail: false,
            requireEmailVerification: false,
            requireMobile: false,
            requireMobileVerification: true,
            requireKyc: true
        });
    }

    static newRequireKyc() {
        return new Verification({
            verified: false,
            requireEmail: false,
            requireEmailVerification: false,
            requireMobile: false,
            requireMobileVerification: false,
            requireKyc: true
        });
    }

    static newVerified() {
        return new Verification({
            verified: true,
            requireEmail: false,
            requireEmailVerification: false,
            requireMobile: false,
            requireMobileVerification: false,
            requireKyc: false
        });
    }
};