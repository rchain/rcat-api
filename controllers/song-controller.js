const Song = require('../models/song');

const listAllSongs = async(req, res) => {
    return Song.find({});
};

const createSong = async (req, res) => {
    return await Song.create(req.body);
};

// const updateSong = (req, res) => {
//     const { id } = req.params;
// };

exports.listAllSongs = listAllSongs;
exports.createSong = createSong;
// exports.updateSong = updateSong;