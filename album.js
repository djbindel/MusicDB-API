const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    albumId: {type: Number, required: true},
    title: {type: String, required: true},
    year: {type: Number, required: true},
    imgUrl: {type: String, required: true},
    artist: {type: String, required: true},
    genreTags: [{
        genreId: {type: Number, required: true},
        upvotes: {type: Number, required: true},
        downvotes: {type: Number, required: true}
    }],
    ratingCount: {type: Number, required: true},
    score: {type: Number, required: true},
    trackIds: {type: [Number], required: true}
}, { strict: 'throw' });

module.exports = mongoose.model('Album', schema);