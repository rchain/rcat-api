const router = require('express').Router();
const boom = require('boom');
const { isAuthenticated } = require('../middlewares/auth-middleware');
const genreController = require('../controllers/genre-controller');

router.use(isAuthenticated);

router.get('/', async (req, res, next) => {
    try {
        const genres = await genreController.listAllGenres(req, res);
        res.send(genres);
    } catch (err) {
        throw boom.boomify(err);
    }
});

module.exports = router;
