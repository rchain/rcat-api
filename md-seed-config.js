require('dotenv/config'); // Setting up .env
const mongooseLib = require('mongoose');

const GenresSeeder = require('./seeders/genres.seeder');

mongooseLib.Promise = global.Promise || Promise;

module.exports = {
  mongoose: mongooseLib,
  mongoURL: process.env.MONGODB_URI,
  seedersList: {
    Genres: GenresSeeder,
  }
};
