const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GMAIL_CLIENT_ID);
const jwt = require('jsonwebtoken');
const GmailAccount = require('../models/gmail-account');

// call Google's API to check if passed token is valid
const verifyGmailToken = async (token) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GMAIL_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    return userid;
};

const loginGmail = async (req, res) => {

    if(!process.env.GMAIL_CLIENT_ID) {
        throw new Error('Missing GMAIL_CLIENT_ID environment var');
    }

    // check if passed gmail token_id is valid
    let gmailUserId = await verifyGmailToken(req.headers.gusrid).catch(console.error);
    // if it is valid - proceed, otherwise - return error
    if (!!gmailUserId) {
        const user =  await GmailAccount.login(req.body);
        if(gmailUserId !== user.gmail_account.gmail_id) {
            return {
                statusCode: 400,
                error: "Bad Request",
                message: "Token mismatch"
            }
        }
        const jwtPayload = {
            id:  user._id,
            email: user.gmail_account.email
        };

        const jwtOptions = require('../config/jwt-options');
        const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, jwtOptions);
        return {
            token,
            require_kyc: user.require_kyc,
            user
        };
    } else {
        return {
            statusCode: 400,
            error: "Bad Request",
            message: "Invalid token"
        }
    }
};



module.exports = {
    loginGmail
};