const Seeder = require('mongoose-data-seed').Seeder;

const Genre = require('../models/genre');

const data = [
  {
      'name': 'Avant Garde',
  },
  {
      'name': 'Blues',
  },
  {
      'name': 'Brazilian',
  },
  {
      'name': 'Classical',
  },
  {
      'name': 'Country',
  },
  {
      'name': 'Easy Listening',
  },
  {
      'name': 'Electronic',
  },
  {
      'name': 'Folk',
  },
  {
      'name': 'Hip-Hop/Rap',
  },
  {
      'name': 'Holiday',
  },
  {
      'name': 'Jazz',
  },
  {
      'name': 'Kids/Family',
  },
  {
      'name': 'Latin',
  },
  {
      'name': 'Metal/Punk',
  },
  {
      'name': 'Moods',
  },
  {
      'name': 'New Age',
  },
  {
      'name': 'Pop',
  },
  {
      'name': 'Reggae',
  },
  {
      'name': 'Rock',
  },
  {
      'name': 'Spiritual',
  },
  {
      'name': 'Spoken Word',
  },
  {
      'name': 'Urban/R&B',
  },
  {
      'name': 'World',
  },
];

const GenresSeeder = Seeder.extend({
  shouldRun: function () {
    return Genre.countDocuments().exec().then(count => count === 0);
  },
  run: function () {
    return Genre.create(data);
  },
});

module.exports = GenresSeeder;
