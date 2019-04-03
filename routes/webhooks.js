const router = require('express').Router();

router.get('/dropbox', async (req, res, next) => {
    try {
        const challenge = req.query.challenge;
        console.log('dropbox webhook GET params', req.query);
        res.send(challenge);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;