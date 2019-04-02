const router = require('express').Router();
const Joi = require('joi');
const validate = require('express-validation');

const { isAuthenticated } = require('../middlewares/auth-middleware');
const kycController = require('../controllers/kyc-controller');
const multer = require('multer');
// const upload = multer({ dest: 'uploads/'});
// const upload = multer({ storage: multer.memoryStorage() });
const { validateKycDocuments } = require('../services/file-upload');
// const singleUpload = upload.single('image');

router.use(isAuthenticated);

router.get('/', function (req, res, next) {
    res.send({});
});

const requestSchema = {
    body: {
        country_of_residence: Joi.string().required(),
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        date_of_birth: Joi.date().required(),
        gender: Joi.string().valid('Male', 'Female', 'Gender neutral').required(),
        identification_type: Joi.string().valid('Passport', 'Driver\'s license', 'ID card').required(),
        identification_id_number: Joi.string().required(),
        identification_expiration_date: Joi.date().required(),
    }
};

// let kycUpload = upload.fields([{ name: 'identification_front_image', maxCount: 1 }, { name: 'identification_back_image', maxCount: 1 }, { name: 'identification_selfie_image', maxCount: 1 }]);
let fileHandler = validateKycDocuments.fields([
    { name: 'identification_front_image', maxCount: 1 },
    { name: 'identification_back_image', maxCount: 1 },
    { name: 'identification_selfie_image', maxCount: 1 }
]);

router.post('/', [fileHandler, validate(requestSchema)], async (req, res, next) => {
    try {
        const requiredFiles = ['identification_front_image', 'identification_back_image', 'identification_selfie_image'];
        const hasAllFiles = validateRequiredFiles(requiredFiles, req.files);
        if (hasAllFiles) {
            kycController.saveKycData(req, res).then(result => {
                res.send(result);
            }).catch(err => {
                const statusCode = err.status_code || 400;
                res.status(statusCode).send({message: err.message});
            });
        } else {
            res.status(400).send(`Required files are: ${requiredFiles.join(', ')}`);
        }
    } catch (err) {
        res.code(500).send(err);
    }
});



const validateRequiredFiles = (requiredFiles, files) => {
    isValid = true;

    for (let i = 0; i < requiredFiles.length; i++) {
        if (!files[requiredFiles[i]]) {
            console.log('hohohoho');
            console.log(files);
            console.log(requiredFiles[i]);
            isValid = false;
            break;
        }
    }

    return isValid;
};

module.exports = router;
