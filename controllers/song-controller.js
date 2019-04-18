const Song = require('../models/song');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const { uploadSongToDropBox, uploadAlbumArtImage } = require('../services/file-upload');

const listAllSongs = async (conditions, req, res) => {
    console.log('TODO<low> call via redis');
    console.log('TODO<high> Call acquistion API to get data');
    const filter = _.assign({}, conditions);
    const songsFound = await Song.find(filter);
    const songsFiltered = songsFound.map((s) => {
            return {
                id: s._id,
                title: s.title,
                status: s.state
            };
        });
    return songsFound;
};

const getSongFile = (req) => {
    const songFieldName = Object.keys(req.files)[0];
    return req.files[songFieldName][0];
};

const getArtImageFile = (req) => {
    const imageFieldName = Object.keys(req.files)[1];
    if(!imageFieldName) {
        const buffer = fs.readFileSync(path.join(__dirname, '../assets/RSONG-default-image.jpg'));
        return {
            fieldname: 'album_art_image_file',
            originalname: 'RSONG-default-image.jpg',
            buffer: buffer,
        };
    }
    return req.files[imageFieldName][0];
};

const createSong = async (req, res) => {
    return new Promise(async (resolve, reject) => {

        ///////////////////////////////////////
        // CREATE
        ///////////////////////////////////////
        let song;
        try {
            fileSong = getSongFile(req);
            fileImage = getArtImageFile(req);
            console.log('fileSong ###########', fileSong);
            console.log('fileImage ##########', fileImage);
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
        console.log('GOOGLE CLOUD RESPONSE', gcsResponse);
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
