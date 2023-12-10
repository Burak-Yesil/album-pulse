import * as col from '../config/mongoCollections.js';
import * as spotify from './spotifyAPI.js';
import { validUser, validPassword } from './helpers.js';

export const getRankings = async (name) => {
    // checks if album has been ranked yet. If yes, returns rankings and information for that album. 
    // If not, finds album from spotifyAPI and returns that there are no rankings
    validUser(name);
    name = name.trim();
    const album = await col.albums.findOne({ name });
    const albums = await col.albums();
    const { ranks } = await col.rankings();
    if (!album) {
        // can't find album in collection, so look with API
        album = spotify.getAlbumObject(name);
        const addAlbum = await albums.insertOne(album);
        if (!album) { throw 'Album could not be found.'; }
        return { album: album, ranking: {} };
    }
    // If album exists, return its rankings and 
    const rankings = {}
    for (let i in ranks) {
        let curr = ranks[i];
        if (curr.hasOwnProperty("albumName") && curr["albumName"] === album.albumName) {
            rankings.push(curr);
        }
    }
    // const rankings = album.rankings;
    // I don't think each album is going to hold all of its rankings
    return { album, rankings };
}

export const addRanking = async (name, rating, review) => {
    // lets user add ranking and then adds ranking to the rankings database
    // also adds ranking to the array of rankings in the album object; edits albums database

    validUser(name);
    name = name.trim();
    if (!rating) throw 'Rating must be provided.';
    if (rating < 1 || rating > 5) {
        throw 'Rating must be an integer between 1 and 5.';
    }
    if (review && typeof review !== 'string') throw 'Review must be a string, if provided.';
    // TODO: word limit for reviews?

    let newRanking = {
        albumName: name,
        rating: rating,
        review: review
    }

    // add ranking to collection of all album rankings 
    const rankingcol = await col.rankings();
    const addRanking = await rankingcol.insertOne(newRanking);

    // find all rankings for this album
    const obj = await getRankings(name);
    const album = obj.album;  // the album object in the collection
    const rankings = obj.rankings; // array of rankings for specific album

    const numberOfRankings = rankings.length();
    let total = 0;
    for (i = 0; i < numberOfRankings; i++) {
        total += rankings[i].rating;
    }
    const avg = total / numberOfRankings;
    album.avgranking = avg;
}

/**
 * @returns the user from the database.
 */
export const findUser = async (username) => {
    validUser(username);
    username = username.trim();
    const usersCollection = await users();
    const user = await usersCollection.findOne({ 'userName': userName });
    if (!user) throw "User not found.";
    return user; // TODO: do we want to return anything specific?
}

/**
 * @returns the top 10 albums with best average rankings from albums collection
 */
export const topRanked = async () => {
    const albums = await col.albums;
    const rankings = await col.rankings;

    const albumRankings = {}; // albums and all of their rankings

    for (let a in albums) {
        let curr = albums[a];
        let currRankings = [];
        for (let r in rankings) {
            if (rankings[r].albumName === curr.albumName) {
                currRankings.push(rankings[r]);
            }
        }
        let total = 0;
        for (let k in currRankings) {
            total += currRankings[k].rating;
        }
        let avg = total / currRankings.length;
        albumRankings[curr.albumName] = avg;
    }

    const sorted = Object.keys(albumRankings).sort(function (a, b) { return albumRankings[a] - albumRankings[b] });
    return sorted.slice(0, 10);
}

/**
 * @returns a random recommendation from the top 10 albums with best average rankings
 */
export const getRecommendations = async () => {
    const top = await topRanked();
    const random = Math.floor(Math.random() * 10);
    return top[random];
}
