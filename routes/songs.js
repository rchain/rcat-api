const router = require('express').Router();
const { isAuthenticated } = require('../middlewares/auth-middleware');
const songController = require('../controllers/song-controller');
const Song = require('../models/song');
const Joi = require('joi');
const validate = require('express-validation');
const { validateFiles } = require('../services/file-upload');

router.use(isAuthenticated);

const requestSchema = {
    body: {
        title: Joi.string().required(),
        genres: Joi.array().required().min(1).items(Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'Should be ObjectId')),
        main_artist_name: Joi.string().required(),
        artists: Joi.array(),
        album_art_image_url: Joi.string().required(),
        song_writers: Joi.array().required().min(1).items(Joi.object({
            name: Joi.string().required(),
            percentage_100_total_song: Joi.number().required().min(0).max(100),
            percentage_100_publisher: Joi.number().required().min(0).max(100),
            publisher: Joi.string().required(),
            rev_wallet_address: Joi.string().token(), // TODO VConditional in func of (rev email)
            rev_email: Joi.string().email(), // TODO VConditional in func of (rev wallet),
            publisher_rights_organization: Joi.string(),
            iswc: Joi.string()
        })),
        sound_owners: Joi.array().required().min(1).items(Joi.object({
            name: Joi.string().required(),
            role: Joi.string().required(),
            percentage_100: Joi.number().required().min(0).max(100),
            rev_wallet_address: Joi.string().token(),
            rev_email: Joi.string().email(),
            isrc: Joi.string(),
        })),
        collaborators: Joi.array().required().min(1).items(Joi.object({
            name: Joi.string().required(),
            role: Joi.string().required(),
            percentage_100: Joi.number().required().min(0).max(100),
            rev_wallet_address: Joi.string().token(),
            rev_email: Joi.string().email(),
            isrc: Joi.string(),
        })),
    }
};

router.get('/', async (req, res, next) => {
    try {
        const songs = await songController.listAllSongs(req, res);
        res.send(songs);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const song = await Song.findById(id);
        if (!song) {
            return res.status(404).send({ message: 'Not found.' });
        }
        res.send(song);
    } catch (err) {
        res.status(400).send(err);
    }
});

// let fileHandler = validateSong.fields([
//     { name: 'song_file', maxCount: 1 },
// ]);

let fileHandler = validateFiles(/mp3|wma|/).fields([
    { name: 'song_file', maxCount: 1 },
]);

router.post('/', [fileHandler, validate(requestSchema)], async (req, res, next) => {
    try {
        if (req.files.song_file) {
            songController.createSong(req, res).then(result => {
                res.send(result);
            }).catch(err => {
                const statusCode = err.status_code || 400;
                res.status(statusCode).send({ message: err.message });
            });
        } else {
            res.status(400).send(`Required files are: ${requiredFiles.join(', ')}`);
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
