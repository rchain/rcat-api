const router = require('express').Router();
const Joi = require('joi');
const validate = require('express-validation');
const { isAuthenticated } = require('../middlewares/auth-middleware');
const kycController = require('../controllers/kyc-controller');
const { validateFiles } = require('../services/file-upload');
const KycAccount = require('../models/kyc-account');
const User = require('../models/user');

router.use(isAuthenticated);

router.get('/all', async (req, res, next) => {
    console.log('req.user.id', req.user.id);
    const user = await User.findById(req.user.id).populate('kyc_account -v');
    if(!user.admin || user.admin !== true) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    }
    const kycs = await KycAccount.find();
    res.send(kycs);
});

router.get('/', function (req, res, next) {
    kycController.getKyc(req, res)
        .then((result) => {
            res.send(result || { "state": "NOT_SUBMITED" });
        })
        .catch((err) => {
            console.log(req.user);
            res.status(400).send(err.toString());
        });
});

router.post('/skip', function (req, res, next) {
    console.log('GET /kyc/skip - entering ...');
    try {
        kycController.skip(req, res).then((result) => {
            res.send({
                kyc_skip_count: result.kyc_skip_count
            });
        });
    } catch (err) {
        console.error(err);
        res.send({
            kyc_skip_count: -1
        });
    }
});

// let kycUpload = upload.fields([{ name: 'identification_front_image', maxCount: 1 }, { name: 'identification_back_image', maxCount: 1 }, { name: 'identification_selfie_image', maxCount: 1 }]);
const fileTypesValidationInfo = {
    'identification_front_image': { ext: /png|jpeg|jpg/, mime: /png|jpeg|jpg/ },
    'identification_back_image':  { ext: /png|jpeg|jpg/, mime: /png|jpeg|jpg/ },
    'identification_selfie_image':  { ext: /png|jpeg|jpg/, mime: /png|jpeg|jpg/ }
};

let fileHandler = validateFiles(fileTypesValidationInfo).fields([
    { name: 'identification_front_image', maxCount: 1 },
    { name: 'identification_back_image', maxCount: 1 },
    { name: 'identification_selfie_image', maxCount: 1 }
]);

const requestSchema = {
    body: {
        country_of_residence: Joi.string().required(),
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        date_of_birth: Joi.date().required(),
        gender: Joi.string().valid('male', 'female', 'gender_neutral').required(),
        identification_type: Joi.string().valid('passport', 'drivers_licence', 'id_card').required(),
        identification_id_number: Joi.string().required(),
        identification_expiration_date: Joi.date().required(),
    }
};

const requiredKycFiles = {
    passport: ['identification_front_image', 'identification_selfie_image'],
    drivers_licence: ['identification_front_image', 'identification_back_image', 'identification_selfie_image'],
    id_card: ['identification_front_image', 'identification_back_image', 'identification_selfie_image']
};

router.post('/', [fileHandler, validate(requestSchema)], async (req, res, next) => {

    try {
        console.log('identification_type: ', req.body.identification_type);
        // const requiredFiles = ['identification_front_image', 'identification_back_image', 'identification_selfie_image'];
        const requiredFiles = requiredKycFiles[req.body.identification_type];
        const hasAllFiles = validateRequiredFiles(requiredFiles, req.files);
        if (!hasAllFiles) {
            res.status(400).send(`Required files are: ${requiredFiles.join(', ')}`);
        }

        console.log('(route kyc) BEFORE kycController.submitKycData ...');
        await kycController.submitKycData(req, res).then(result => {
            console.log('KYC SUBMITTED!!!', result);
            res.send(result);
        });
    } catch (err) {
        if(err.response.data) {
            console.error(err.response.data);
            return res.status(500).send(err.response.data);
        }
        res.status(500).send(err);
    }
});

const validateRequiredFiles = (requiredFiles, files) => {
    for (let i = 0; i < requiredFiles.length; i++) {
        if (!files[requiredFiles[i]]) {
            return false;
        }
    }
    return true;
};

module.exports = router;
