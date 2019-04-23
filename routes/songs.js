const router = require('express').Router();
const { isAuthenticated } = require('../middlewares/auth-middleware');
const songController = require('../controllers/song-controller');
const Song = require('../models/song');
const { ingest } = require('../services/acquisition');
const Joi = require('joi');
const validate = require('express-validation');
const axios = require('axios');
const { validateFiles } = require('../services/file-upload');
const { validateAcqusitionPostSchema } = require('../services/json-schema-org');

router.use(isAuthenticated);


const requestSchema = {
    body: {
        title: Joi.string().required(),
        song_subtitle: Joi.string().allow(''),
        genres: Joi.array().required().min(1).items(Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'Should be ObjectId')),
        main_artist_name: Joi.string().required(),
        artists: Joi.array(),
        song_writers: Joi.array().items(
            Joi.object({
                name: Joi.string().required(),
                percentage_100_total_song: Joi.number().required().min(0).max(100),
                percentage_100_publisher: Joi.number().required().min(0).max(100),
                publisher: Joi.string().allow(''),
                rev_wallet_address: Joi.string().token().allow(''), // TODO VConditional in func of (rev email)
                rev_email: Joi.string().email().allow(''), // TODO VConditional in func of (rev wallet),
                publisher_rights_organization: Joi.string().allow(''),
                iswc: Joi.string().allow('')
            })
        ),
        sound_owners: Joi.array().items(Joi.object({
            name: Joi.string().required(),
            role: Joi.string().allow(''),
            percentage_100: Joi.number().required().min(0).max(100),
            rev_wallet_address: Joi.string().token().allow(''),
            rev_email: Joi.string().email().allow(''),
            isrc: Joi.string().allow(''),
        })),
        collaborators: Joi.array().items(Joi.object({
            name: Joi.string().required(),
            role: Joi.string().allow(''),
            percentage_100: Joi.number().required().min(0).max(100),
            rev_wallet_address: Joi.string().token().allow(''),
            rev_email: Joi.string().email().allow(''),
            isrc: Joi.string().allow(''),
        })),
    }
};

router.get('/', async (req, res, next) => {
    try {
        const songs = await songController.listAllSongs({ owner: { user_id: req.user.id } }, req, res);
        return res.send(songs);
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

router.get('/:id/ack', async (req, res, next) => {
    try {
        const { id } = req.params;
        const song = await Song.findById(id).populate('genres', '-__v -created_at -updated_at');
        if (!song) {
            return res.status(404).send({ message: 'Not found.' });
        }

        res.send(song.transformForAcquisition(req.user));
    } catch (err) {
        res.status(400).send(err);
    }
});


const fileTypesValidationInfo = {
    'song_file': {
        ext: /mp3|wav|flac/,
        mime: /audio\/mpeg|mp3|wav|x-wav|flac/
    },
    'album_art_image_file': {
        ext: /png|jpeg|jpg/,
        mime: /png|jpeg|jpg/
    }
};

let fileHandler = validateFiles(fileTypesValidationInfo).fields([
    { name: 'song_file', maxCount: 1 },
    { name: 'album_art_image_file', maxCount: 1 }
]);

router.post('/', [fileHandler, validate(requestSchema)], async (req, res, next) => {

    try {
        // const requiredFiles = ['song_file', 'album_art_image_file'];
        const requiredFiles = ['song_file'];
        const hasAllFiles = validateRequiredFiles(requiredFiles, req.files);
        if (!hasAllFiles) {
            return res.status(400).send(`Required files are: ${requiredFiles.join(', ')}`);
        }

        req.body.song_writers.forEach((songWriter) => {
            if((!songWriter.rev_wallet_address || songWriter.rev_wallet_address.trim() == '') && (!songWriter.rev_email || songWriter.rev_email.trim() == '')) {
                return res.status(400).send('Song writer requires wallet address or email');
            }
        });

        req.body.sound_owners.forEach((songWriter) => {
            if((!songWriter.rev_wallet_address || songWriter.rev_wallet_address.trim() == '') && (!songWriter.rev_email || songWriter.rev_email.trim() == '')) {
                return res.status(400).send('Sound owner requires wallet address or email');
            }
        });

        req.body.collaborators.forEach((songWriter) => {
            if((!songWriter.rev_wallet_address || songWriter.rev_wallet_address.trim() == '') && (!songWriter.rev_email || songWriter.rev_email.trim() == '')) {
                return res.status(400).send('Collaborator requires wallet address or email');
            }
        });
        const song = await songController.createSong(req, res);
        // return res.send(song);

        const songForAcq = song.transformForAcquisition(req.user);
        // return res.send(songForAcq);

        const postUrl = `${process.env.ACQUISITION_API_ENDPOINT_BASE_URL}/v1/ingest`;
        console.log({postUrl: postUrl});

        console.log('Validating song payload schema before sending it to acquistion service ...');
        const isSchemaValid = validateAcqusitionPostSchema(songForAcq);
        if(!isSchemaValid) {
            const errors = {
                'acqusition-schema-errors': validateAcqusitionPostSchema.errors
            };
            console.log('ACQUSITION SCHEMA NOT VALID :(', errors);
            Sentry.captureMessage(errors);
            return res.status(400).send(errors);
        } else {
            console.log('ACQUSITION SCHEMA VALID :)');
        }

        console.log(`POSTING to ${postUrl} ...`);
        return axios.post(postUrl, songForAcq)
            .then(function (response) {
                console.log('POST /songs response >>>', response.data);
                return res.send(response.data);
            })
            .catch(function (error) {
                Sentry.captureException(error);
                return res.status(400).send(error.Error);
            });
    } catch (err) {
        Sentry.captureException(err);
        res.status(400).send(err);
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
