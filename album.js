const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    albumId: {type: Number, required: true, unique: true},
    title: {type: String, required: true},
    year: {type: Number, required: true},
    imgUrl: {type: String, required: true},
    artist: {type: String, required: true},
    genreId: {type: Number, required: false},
    ratingCount: {type: Number, required: true},
    score: {type: Number, required: true},
    trackIds: {type: [Number], required: true}
}, { strict: 'throw' });

module.exports = mongoose.model('Album', schema);