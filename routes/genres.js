const router = require('express').Router();
const { isAuthenticated } = require('../middlewares/auth-middleware');
const genreController = require('../controllers/genre-controller');
const {Sentry} = require('../services/sentry');

router.use(isAuthenticated);

router.get('/', async (req, res, next) => {
    try {
        const genres = await genreController.listAllGenres(req, res);
        res.send(genres);
    } catch (err) {
        Sentry.captureException(err);
        res.status(500).send(err);
    }
});

// router.post('/', async (req, res, next) => {
//     try {
//         const data = await genreController.storeGenre(req, res);
//         res.send(data);
//     } catch (err) {
//         Sentry.captureException(err);
//         res.status(500).send(err);
//     }
// });

module.exports = router;
