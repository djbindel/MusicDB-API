const express = require('express');
const router = express.Router();

const db = require('./database.js');

// Create
router.post('/albums', db.addAlbum);
router.post('/tracks', db.addTrack);
router.post('/genres', db.addGenre);

// Read
router.get('/albums/:albumId', async (req, res) => {
    const album = await db.findAlbumById(req.params.albumId);
    const genre = await db.findGenreById(album.genreId);

    const tracklist = await album.trackIds.reduce(async (acc, trackId, i) => {
        const obj = await acc;
        const track = await db.findTrackById(trackId);
        const genre = await db.findGenreById(track.genreId);
        obj[i + 1] = { track: track, genre: genre };
        return obj;
    }, Promise.resolve({}));

    res.render('album', { album: album, genre: genre, tracklist: tracklist, sideLength: '300px' });
});

module.exports = router;