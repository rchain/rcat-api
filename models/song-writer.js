const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Types } = Schema;

const songWriterSchema = new mongoose.Schema({
    name: String,
    wallet_address: String,
    publish_right_organization: String,
    percentage_total_song: Number,
    percentage_ownership: Number,
    email: String,
    iswc: String
});

const SongWriter = mongoose.model('SongWriter', songWriterSchema);
module.exports = SongWriter;