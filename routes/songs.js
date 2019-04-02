const router = require('express').Router();
const { isAuthenticated } = require('../middlewares/auth-middleware');
const songsController = require('../controllers/song-controller');
const Joi = require('joi');
const validate = require('express-validation');

router.use(isAuthenticated);

const requestSchema = {
    body: {
        title: Joi.string().required(),
        audio_url: Joi.string().required(),
        genres: Joi.array().required().min(1).items(Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'Should be ObjectId')),
        main_artist_name: Joi.string().required(),
        artists: Joi.array().required(),
        album_art_image_url: Joi.string().required(),
        song_writers: Joi.array().required().min(1).items(Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'Should be ObjectId')),
    }
};

router.get('/', async (req, res, next) => {
    try {
        const songs = await songsController.listAllSongs(req, res);
        res.send(songs);
    } catch (err) {
        res.send(400, err);
    }
});

router.post('/', validate(requestSchema), async (req, res, next) => {
    try {
        const data = await songsController.storeSong(req, res);
        res.send(data);
    } catch (err) {
        res.send(400, err);
    }
});

module.exports = router;
