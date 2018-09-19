const mongoose = require('mongoose');

const Album = require('./album');
const Track = require('./track');
const Genre = require('./genre');

const url = 'mongodb://localhost:27017/musicdb';

module.exports = {
    connect: () => {
        mongoose.connect(url);
        mongoose.connection.once('open', () => console.log('Connected to MongoDB'));
    },
    addAlbum: (req, res) => {
        const album = new Album(req.body);
        album.save().then(() => res.send(`Album ${album.albumId} saved to database`)).catch((err) => res.send(err.errors));
    },
    addTrack: (req, res) => {
        const track = new Track(req.body);
        track.save().then(() => res.send(`Track ${track.trackId} saved to database`)).catch((err) => res.send(err.errors));
    },
    addGenre: (req, res) => {
        const genre = new Genre(req.body);
        genre.save().then(() => res.send(`Genre ${genre.genreId} saved to database`)).catch((err) => res.send(err.errors));
    },
    findAlbumById: albumId => Album.findOne({ albumId: albumId }),
    findTrackById: trackId => Track.findOne({ trackId: trackId }),
    findGenreById: genreId => Genre.findOne({ genreId: genreId }),
    getAlbums: () => Album.find(),
    getTracks: () => Track.find()
    // getGenres: (genreTags) => {
    //     console.log(genreTags);
    //     const sortedGenreTags = genreTags.sort((a, b) => {
    //         return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
    //     });
    //     const genreIds = genreTags.filter((value) => {
    //         return value === (sortedGenreTags[0].upvotes - sortedGenreTags[0].downvotes);
    //     });
    //     const genres = genreIds.reduce(async (acc, genreId) => {
    //         const arr = await acc;
    //         const genre = await findGenreById(genreId);
    //         arr.push(genre)
    //         return arr;
    //     }, Promise.resolve([]));
    //     return genres;
    // }
}