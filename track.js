const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    trackId: {type: Number, required: true, unique: true},
    title: {type: String, required: true},
    genreId: {type: Number, required: false},
    score: {type: Number, required: true}
}, { strict: 'throw' });

module.exports = mongoose.model('Track', schema);