const express = require('express');
const router = express.Router();

const db = require('./database.js');
const tags = require('./tags');
const calcVotes = require('./calc');

// Create
router.post('/albums', db.addAlbum);
router.post('/tracks', db.addTrack);
router.post('/genres', db.addGenre);

// Read
router.get('/albums/:albumId', async (req, res) => {
    const deniablePercentages = await tags.getTagDenyRules();
    const album = await db.findAlbumById(req.params.albumId);
    album.genreTags.sort((a, b) => {
        return calcVotes(b) - calcVotes(a);
    });
    const acceptedGenres = await tags.getAcceptedGenres('albums', album, deniablePercentages);

    const tracklist = await album.trackIds.reduce(async (acc, trackId, i) => {
        const obj = await acc;
        const track = await db.findTrackById(trackId);
        track.genreTags.sort((a, b) => {
            return calcVotes(b) - calcVotes(a);
        });
        const acceptedGenres = await tags.getAcceptedGenres('tracks', track, deniablePercentages);
        obj[i + 1] = {
            track: track,
            genres: acceptedGenres
        };
        return obj;
    }, Promise.resolve({}));

    res.render('album', { album: album, genres: acceptedGenres, tracklist: tracklist, sideLength: '737px' });
});

module.exports = router;