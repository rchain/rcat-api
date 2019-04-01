const boom = require('boom');
const Genre = require('../models/genre');

const listAllGenres = async(req, res) => {

    let genre1 = await Genre.save({
        name: 'Genre 1',
    }, req.user);

    let genre2 = await Genre.save({
        name: 'Genre 2',
    }, req.user);

    let genre3 = await Genre.save({
        name: 'Genre 3',
    }, req.user);

    return [genre1, genre2, genre3]
};

exports.listAllGenres = listAllGenres;
