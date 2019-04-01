const boom = require('boom');
const Genre = require('../models/genre');

const listAllGenres = async(req, res) => {
    return Genre.find({});
};

const storeGenre = async (req, res) => {
    return await Genre.store(req.body);
};

exports.listAllGenres = listAllGenres;
exports.storeGenre = storeGenre;
