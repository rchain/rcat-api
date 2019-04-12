const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
    user: {
        name: String,
        email: String
    },
    provider: String,
    response_payload: String
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});

const Genre = mongoose.model('Login', loginSchema);
module.exports = Genre;