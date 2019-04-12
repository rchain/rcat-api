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

        try {
            // console.log('=================================');
            // console.log('req.files >>>>> ', req.files);
            // console.log('Object.keys(req.files) >>>>>>>>>>', Object.keys(req.files));
            // console.log('=================================');

            // console.log('Object.keys(req.files) >>>>>>>>', Object.keys(req.files));
            const songFieldName = Object.keys(req.files)[0];
            const imageFieldName = Object.keys(req.files)[1];
            const fileSong = req.files[songFieldName][0];
            const fileImage = req.files[imageFieldName][0];
            // console.log('fileSong >>>>>>>>', fileSong);
            // console.log('fileImage >>>>>>>>', fileImage);
            const song = await Song.createSong(req, fileSong, fileImage);
            // console.log('song CRATED!!!!', song);
            const dbxResponse = uploadSongToDropBox(fileSong, song.fileName);
            console.log('DROPBOX DROPBOX DROPBOX DROPBOX DROPBOX DROPBOX DROPBOX DROPBOX DROPBOX DROPBOX ');
            console.log('DROPBOX RESPONSE', dbxResponse);
            await Song.findByIdAndUpdate(
                song._id,
                {
                    $set: {
                        song_dropbox_data: dbxResponse
                    }
                },
                {new: true}
            ).populate('genres', '-__v -created_at -updated_at');

            const gcsResponse = uploadAlbumArtImage(fileImage, 'TODO-impl-me.jpg');
            console.log('GOOGLE CLOUD STORAGE GOOGLE CLOUD STORAGE GOOGLE CLOUD STORAGE GOOGLE CLOUD STORAGE ');
            console.log('GoogleCloudStorage RESPONSE', gcsResponse);

            const songUpdated = await Song.findByIdAndUpdate(
                song._id,
                {
                    $set: {
                        img_art_gcs_data: gcsResponse
                    }
                },
                {new: true}
            ).populate('genres', '-__v -created_at -updated_at');

            resolve(songUpdated);
        } catch (err) {
            console.log('Song creation error!', err);
            reject(err);
        }

    });
};

exports.listAllSongs = listAllSongs;
exports.createSong = createSong;
