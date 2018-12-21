const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    genreId: {type: Number, required: true, unique: true},
    name: {type: String, required: true},
    parentIds: {type: [Number], required: true}
}, { strict: 'throw' });

module.exports = mongoose.model('Genre', schema);