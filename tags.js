const db = require('./database');
const calcVotes = require('./calc');

async function getDeniablePercentage(documents) {
    const percentages = await documents.reduce(async (acc, document) => {
        const arr = await acc;
        const genreTags = await Promise.all(document.genreTags.map(async genreTag => {
            const genre = await db.findGenreById(genreTag.genreId);
            return Object.assign({}, genreTag.toObject(), genre.toObject());
        }));
        const map = genreTags.reduce((acc, current) => {
            const parentConflict = current.parentIds.some(genreId => acc.some(genreTag => genreTag.genreId === genreId));
            const childConflict = acc.some(genreTag => genreTag.parentIds.some(genreId => current.genreId === genreId));
            acc.push(Object.assign({}, current, {
                parentConflict: parentConflict,
                childConflict: childConflict
            }));
            return acc;
        }, []);
        const conflict = map.find(genreTag => genreTag.parentConflict || genreTag.childConflict);
        if (conflict) arr.push(calcVotes(conflict) / calcVotes(document.genreTags[0]))
        else arr.push(0);
        return arr;
    }, Promise.resolve([]));
    percentages.sort((a, b) => {
        return b - a;
    });
    return percentages[0];
}

async function getTagDenyRules() {
    const albums = await db.getAlbums();
    for (album of albums) album.genreTags.sort((a, b) => {
        return calcVotes(b) - calcVotes(a);
    });
    const albumDeniablePercentage = {
        collection: 'albums',
        deniablePercentage: await getDeniablePercentage(albums)
    }

    const tracks = await db.getTracks();
    for (track of tracks) track.genreTags.sort((a, b) => {
        return calcVotes(b) - calcVotes(a);
    });
    const trackDeniablePercentage = {
        collection: 'tracks',
        deniablePercentage: await getDeniablePercentage(tracks)
    }

    const denies = [albumDeniablePercentage, trackDeniablePercentage];
    if (denies.every(denyRule => denyRule.deniablePercentage === 1)) {
    } else if (denies.some(denyRule => denyRule.deniablePercentage === 1)) {
    } else {
        const prevalentRule = [albumDeniablePercentage, trackDeniablePercentage].sort((a, b) => {
            return b.deniablePercentage - a.deniablePercentage;
        })[0];
        return {
            albums: prevalentRule.deniablePercentage,
            tracks: prevalentRule.deniablePercentage
        };
    }
}

async function getAcceptedGenres(collection, document, deniablePercentages) {
    const acceptedGenreTags = document.genreTags.filter((genreTag, i, genreTags) => {
        const percentage = calcVotes(genreTag) / calcVotes(genreTags[0]);
        return percentage > deniablePercentages[collection];
    });
    const acceptedGenres = await Promise.all(acceptedGenreTags.map(async genreTag => {
        const genre = await db.findGenreById(genreTag.genreId);
        return genre.name;
    }));
    acceptedGenres.sort();
    return acceptedGenres;
}

module.exports = { getTagDenyRules, getAcceptedGenres };