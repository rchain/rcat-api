const Song = require('../models/song');

const listAllSongs = async(req, res) => {
    return Song.find({});
};

const storeSong = async (req, res) => {
    return await Song.store(req.body);
};

exports.listAllSongs = listAllSongs;
exports.storeSong = storeSong;