const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GMAIL_CLIENT_ID);
const jwt = require('jsonwebtoken');
const GmailAccount = require('../models/gmail-account');
var FacebookTokenStrategy = require('passport-facebook-token');
var http = require('http');
// var Cookies = require('cookies');

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
        // new Cookies(req,res).set('access_token',token,{
        //     httpOnly: true,
        //     secure: process.env.HTTPS === 'true'      // for your production environment
        // });

        return {
            token,
            require_kyc: !user.kyc_account,
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

// call Facebook's API to check if passed token is valid
const verifyFacebookToken = async (req) => {
    const headers = req.headers;
    const authResponse = req.authResponse;
    const userID = authResponse.userID;


    passport.use(new FacebookTokenStrategy({
        clientID: '',
        clientSecret: ''
    },
    function (accessToken, refreshToken, profile, done) {
        User.upsertFbUser(accessToken, refreshToken, profile, function(err, user) {
            return done(err, user);
        });
    }));

    passport.use(new FacebookTokenStrategy({
            clientID: FACEBOOK_APP_ID,
            clientSecret: FACEBOOK_APP_SECRET,
            fbGraphVersion: 'v3.0'
        }, function(accessToken, refreshToken, profile, done) {
                // User.findOrCreate({facebookId: profile.id}, function (error, user) {
                //     return done(error, user);
                // });
                console.log('accessToken >>>>>>>>>>>', accessToken);
                console.log('refreshToken >>>>>>>>>>', refreshToken);
                console.log('profile >>>>>>>>>>>>>>>', profile);

                const user = {
                    "facebook_account" : 'N/A',
                };

                return done(error, user);
            }
    ));


    app.post('/auth/facebook/token',
        passport.authenticate('facebook-token'),
        function (req, res) {
            // do something with req.user
            console.log('(facebook-token) req.user: ', req.user);
            res.send(req.user? 200 : 401);
        }
    );

    return 123;
};

const loginFacebook = async (req, res) => {
    // check if passed gmail token_id is valid
    let facebookUserId = await verifyFacebookToken(req).catch(console.error);
    console.log('facebookUserId', facebookUserId);

    console.log('verifyFacebookToken NOT IMPLEMENTED!');
    console.log('headers:::', headers);
    console.log('authResponse:::', authResponse);
    console.log('authResponse.userID:::', userID);

    const jwtPayload = {
        id:  userID,
        email: 'dummy@email.com'
    };

    const jwtOptions = require('../config/jwt-options');
    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, jwtOptions);

    const user = {
        "facebook_account" : 'N/A',
    };

    return {
        token,
        require_kyc: !user.kyc_account,
        user
    };

};

module.exports = {
    loginGmail,
    loginFacebook
};