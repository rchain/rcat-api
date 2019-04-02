const router = require('express').Router();
const { isAuthenticated } = require('../middlewares/auth-middleware');
const songsController = require('../controllers/song-controller');
const Song = require('../models/song');
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
        song_writers: Joi.array().required().min(1).items(Joi.object({
            name: Joi.string().required(),
            percentage_100_total_song: Joi.number().min(0).max(100),
            percentage_100_publisher: Joi.number().min(0).max(100),
            publisher: Joi.string().required(),
            rev_wallet_address: Joi.string().token(), // TODO VConditional in func of (rev email)
            rev_email: Joi.string().email(), // TODO VConditional in func of (rev wallet),
            publisher_rights_organization: Joi.string(),
            iswc: Joi.string()
        })),
    }
};

router.get('/', async (req, res, next) => {
    try {
        const songs = await songsController.listAllSongs(req, res);
        res.send(songs);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const song = await Song.findById(id);
        if(!song) {
            return res.status(404).send({message: 'Not found.'});
        }
        res.send(song);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/', validate(requestSchema), async (req, res, next) => {
    try {
        const data = await songsController.createSong(req, res);
        return res.send(data);
    } catch (err) {
        return res.status(400).send(err);
    }
});

module.exports = router;
