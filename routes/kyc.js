const router = require('express').Router();
const { isAuthenticated } = require('../middlewares/auth-middleware');
const kycController = require('../controllers/kyc-controller');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

router.use(isAuthenticated);

router.get('/', function(req, res, next) {
    res.send({});
});

let kycUpload = upload.fields([{ name: 'identification_front_image', maxCount: 1 }, { name: 'identification_back_image', maxCount: 1 }, { name: 'identification_selfie_image', maxCount: 1 }]);
router.post('/', kycUpload, async (req, res, next) => {
    try {
        const kycResponse = await kycController.saveKycData(req, res);
        res.send(kycResponse);
    } catch (err) {
        throw boom.boomify(err);
    }
});

module.exports = router;
