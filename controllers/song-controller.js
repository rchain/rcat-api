const boom = require('boom');
const Song = require('../models/song');

const listAllSongs = async(req, res) => {

    let song1 = await Song.save({
        name: 'Song 1',
        audio_url: 'https://images.unsplash.com/photo-1553762057-9823e8b915a6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=518&q=80'
    }, req.user);

    let song2 = await Song.save({
        name: 'Song 2',
        audio_url: 'https://images.unsplash.com/photo-1553791644-51865a81b150?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=434&q=80'
    }, req.user);

    let song3 = await Song.save({
        name: 'Song 3',
        audio_url: 'https://images.unsplash.com/photo-1553792012-5c75e251255e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=650&q=80'
    }, req.user);


    return [song1, song2, song3]
};

const storeSong = async (req, res) => {
    const song =  await Song.store(req.body);
    console.log('song >>>', song);
    return song;
};

exports.listAllSongs = listAllSongs;
exports.storeSong = storeSong;