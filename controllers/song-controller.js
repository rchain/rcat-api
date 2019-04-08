const path = require('path');
const crypto=require('crypto');
const Song = require('../models/song');
const mailjet = require('../services/mailjet');
const uploadSongToDropBox = require('../services/dropbox');

const listAllSongs = async (req, res) => {
    return Song.find({});
};

const createSong = async (req, res) => {
    return new Promise(async (resolve, reject) => {
        const fieldName = Object.keys(req.files)[0];
        const fileContent = req.files[fieldName][0];
        const originalFileName = req.files[fieldName][0].originalname;

        // uploadSongS3(req.files, req.user).then(async (values) => {
        //     let data = req.body;
        //     let song = values[Object.keys(values)[0]];
        //     resolve(await Song.createSong(req.user, data, song));
        // }).catch((err) => {
        //     reject(err);
        // });

        // uploadSongToDropBox(fileContent, fileName)
        //     .then(async (dbxResponse) => {
        //         console.log('DROPBOX RESPONSE', dbxResponse);
        //         const newSong = await Song.createSong(req.user, req.body, dbxResponse);
        //         resolve(newSong);
        //     })
        //     .catch((err) => {
        //         console.log('DROPBOX ERROR', err);
        //         reject(err);
        //     });

        try {
            const song = await Song.createSong(req.user, req.body);
            console.log('req.files[fieldName][0]', req.files[fieldName][0]);
            console.log('song created!!!', song);
            console.log('Pending rename and dropbox upload');
            const songExtension = path.extname(originalFileName);
            const newFileName = `${song.title}${song.main_artist_name}${song.id}${songExtension}`;
            const newFileNameEncoded = crypto.createHash('md5').update(newFileName).digest("hex") + songExtension;
            console.log('originalname', originalFileName);
            console.log('newFileName', newFileName);
            console.log('newFileNameEncoded', newFileNameEncoded);

            // uploadSongToDropBox(fileContent, fileName)
            //     .then(async (dbxResponse) => {
            //         console.log('DROPBOX RESPONSE', dbxResponse);
            //         const newSong = await Song.createSong(req.user, req.body, dbxResponse);
            //         resolve(newSong);
            //     })
            //     .catch((err) => {
            //         console.log('DROPBOX ERROR', err);
            //         reject(err);
            //     });

            const songUpdated = await Song.findByIdAndUpdate(
                song._id,
                {
                    $set: {
                        fileName: newFileNameEncoded,
                        originalFileName: originalFileName,
                    }
                }
            );

            resolve(songUpdated);
        } catch (err) {
            console.log('Song creation error!', err);
            reject(err);
        }

    });
};

// const updateSong = (req, res) => {
//     const { id } = req.params;
// };

exports.listAllSongs = listAllSongs;
exports.createSong = createSong;
// exports.updateSong = updateSong;