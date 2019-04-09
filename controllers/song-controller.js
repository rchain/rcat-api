const path = require('path');
const crypto=require('crypto');
const Song = require('../models/song');
const { uploadSongToDropBox } = require('../services/file-upload');

const listAllSongs = async (req, res) => {
    return Song.find({});
};

const createSong = async (req, res) => {
    return new Promise(async (resolve, reject) => {
        const fieldName = Object.keys(req.files)[0];
        const fileContent = req.files[fieldName][0];
        const originalFileName = req.files[fieldName][0].originalname;

        try {
            const song = await Song.createSong(req.user, req.body);
            const songExtension = path.extname(originalFileName);
            const newFileName = `${song.title}${song.subtitle}${song.main_artist_name}${song.release_date}${songExtension}`;
            const newFileNameEncoded = crypto.createHash('md5').update(newFileName).digest("hex") + songExtension;
            uploadSongToDropBox(fileContent, newFileNameEncoded)
                .then(async (dbxResponse) => {
                    console.log('DROPBOX RESPONSE', dbxResponse);
                    const songUpdated = await Song.findByIdAndUpdate(
                        song._id,
                        {
                            $set: {
                                fileName: newFileNameEncoded,
                                originalFileName: originalFileName,
                                song_dropbox_data: dbxResponse
                            }
                        }
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
