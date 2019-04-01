const router = require('express').Router();
const boom = require('boom');
const { isAuthenticated } = require('../middlewares/auth-middleware');
const kycController = require('../controllers/kyc-controller');
const multer  = require('multer');
// const upload = multer({ dest: 'uploads/'});
// const upload = multer({ storage: multer.memoryStorage() });
const upload = require('../services/file-upload');
// const singleUpload = upload.single('image');

router.use(isAuthenticated);

router.get('/', function(req, res, next) {
    res.send({});
});

// let kycUpload = upload.fields([{ name: 'identification_front_image', maxCount: 1 }, { name: 'identification_back_image', maxCount: 1 }, { name: 'identification_selfie_image', maxCount: 1 }]);
let kycUpload = upload.fields([{ name: 'identification_front_image', maxCount: 1 }, { name: 'identification_back_image', maxCount: 1 }, { name: 'identification_selfie_image', maxCount: 1 }]);
router.post('/', kycUpload, async (req, res, next) => {
    try {
        console.log('Successfully uploaded ' + req.files.length + ' files!???', req.files);
        // const kycResponse = await kycController.saveKycData(req, res);
        // res.send(kycResponse);
        res.send(req.files);
    } catch (err) {
        throw boom.boomify(err);
    }
});

module.exports = router;
