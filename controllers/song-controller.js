const Song = require('../models/song');
const _ = require('lodash');
const { uploadSongToDropBox, uploadAlbumArtImage } = require('../services/file-upload');

const listAllSongs = async (conditions, req, res) => {
    console.log('TODO<low> call via redis');
    console.log('TODO<high> Call acquistion API to get data');
    return await Song
        .find(_.assign({}, conditions))
        .map((s) => {
            return {
                id: s._id,
                title: s.title,
                status: 'status'
            };
        });
};

const createSong = async (req, res) => {
    return new Promise(async (resolve, reject) => {

        ///////////////////////////////////////
        // CREATE
        ///////////////////////////////////////
        let song;
        try {
            const songFieldName = Object.keys(req.files)[0];
            const imageFieldName = Object.keys(req.files)[1];
            fileSong = req.files[songFieldName][0];
            fileImage = req.files[imageFieldName][0];

            song = await Song.createSong(req, fileSong, fileImage);
            // console.log('song CRATED!!!!', song);
        } catch (createError) {
            console.error('ERROR CREATIN SONG!!!', createError);
            return reject(createError);
        }

        ///////////////////////////////////////
        // DROPBOX $ UPDATE #1
        ///////////////////////////////////////
        let dbxResponse;
        try {
            dbxResponse = await uploadSongToDropBox(fileSong, song);
            console.log('DROPBOX RESPONSE', dbxResponse);
        } catch (dbxError) {
            console.error('ERROR UPLOADING TO DROPBOX!!!', dbxError);
            return reject(dbxError);
        }

        try {
            await Song.findByIdAndUpdate(
                song._id,
                {
                    $set: {
                        "asset_sound.dropbox_data": dbxResponse
                    }
                }
            );
        } catch (updateError) {
            console.error('ERROR UPDATING#1 SONG!!!', updateError);
            reject(updateError);
        }

        ///////////////////////////////////////
        // GOOGLE CLOUD STORAGE & UPDATE #2
        ///////////////////////////////////////
        const gcsResponse = await uploadAlbumArtImage(fileImage, song, req.user);
        try {
            await Song.findByIdAndUpdate(
                song._id,
                {
                    $set: {
                        // "asset_img_art.gcs_data": gcsResponse
                        "asset_img_art.gcs_data": gcsResponse
                    }
                }
            );
        } catch (updateError) {
            console.error('ERROR UPDATING#2 SONG!!!', updateError);
            reject(updateError);
        }

        resolve(await Song.findById(song._id).populate('genres'));
    });
};

exports.listAllSongs = listAllSongs;
exports.createSong = createSong;
