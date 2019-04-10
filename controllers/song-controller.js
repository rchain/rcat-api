const Song = require('../models/song');
const { uploadSongToDropBox } = require('../services/file-upload');

const listAllSongs = async (req, res) => {
    return Song.find({ owner: { user_id: req.user.id } });
};

const createSong = async (req, res) => {
    return new Promise(async (resolve, reject) => {

        try {
            const song = await Song.createSong(req);
            const fieldName = Object.keys(req.files)[0];
            const fileContent = req.files[fieldName][0];
            uploadSongToDropBox(fileContent, song.fileName)
                .then(async (dbxResponse) => {
                    console.log('DROPBOX RESPONSE', dbxResponse);
                    const songUpdated = await Song.findByIdAndUpdate(
                        song._id,
                        {
                            $set: {
                                song_dropbox_data: dbxResponse
                            }
                        },
                        {new: true}
                    ).populate('genres', '-__v -created_at -updated_at');

                    resolve(songUpdated);
                })
                .catch((err) => {
                    console.log('DROPBOX ERROR', err);
                    reject(err);
                });

        } catch (err) {
            console.log('Song creation error!', err);
            reject(err);
        }

    });
};

exports.listAllSongs = listAllSongs;
exports.createSong = createSong;
