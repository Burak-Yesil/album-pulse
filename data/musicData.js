import {users, rankings} from '../config/mongoCollections.js';
import * as spotify from './spotifyAPI.js';
import { validUser, validPassword } from '../helpers.js';

export const getRankings = async (album_id) => {
    // checks if album has been ranked yet. If yes, returns rankings and information for that album. 
    // If not, finds album from spotifyAPI and returns that there are no rankings
    album_id = album_id.trim();
    const rankingsCollection = await rankings();
    const album = await rankingsCollection.findOne({ albumId: album_id });
    let album_name = spotify.getAlbumObject(album_id)['name'];
    
    if (!album) {
        // const addAlbum = await albums.insertOne(album);
        if (!album_name) { throw 'Album could not be found.'; }
        return { albumName: album_name, album_rankings: ['No rankings yet - add one!'] };
    }
    // If album exists, return its rankings and 
    const rankings_arr = []
    const albums_rankings = await rankingsCollection.find({albumId: album_id}).toArray();
    //console.log(albums_rankings);
    // for (let i in rankingsCollection) {
    //     let curr = i;
    //     if (curr.albumId == album_id) {
    //         rankings_arr.push(curr);
    //     }
    // }
    // const rankings = album.rankings;
    // I don't think each album is going to hold all of its rankings
    return { albumName: album_name, rankings: albums_rankings };
}

export const addRanking = async (albumid, username, rating, review, review_bool) => {
    // lets user add ranking and then adds ranking to the rankings database
    // also adds ranking to the array of rankings in the album object; edits albums database

    validUser(username);
    username = username.trim();
    if (!rating) throw 'Rating must be provided.';
    if (rating < 1 || rating > 5) {
        throw 'Rating must be an integer between 1 and 5.';
    }
    if (review && typeof review !== 'string') throw 'Review must be a string, if provided.';
    // TODO: word limit for reviews?

    let newRanking = {
        albumId: albumid,
        userName: username,
        rating: rating,
        review: review,
        review_provided: review_bool
    }

    // add ranking to collection of all album rankings 
    const rankingcol = await rankings();
    const addRanking = await rankingcol.insertOne(newRanking);

    // find all rankings for this album
    const obj = await getRankings(albumid);
    const album_name = obj.albumName;  // the album object in the collection
    const rankings_obj = obj.rankings; // array of rankings for specific album

    return {successful: true};
    // Unecessary for this part: can use this code when calculating trending albums tho
    // let total = 0;
    // for (i = 0; i < rankings.length; i++) {
    //     total += rankings[i].rating;
    // }
    // const avg = total / rankings.length;

    // let album = {
        
    // }
    // album.avgranking = avg;
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
 * @returns the top 10 albums with best average rankings from albums collection.
 * If there are 0 albums, then it returns a message saying there are no albums.
 * If there are <10 albums, then it returns all of them.
 */
export const topRanked = async () => {
    /*const rankings = await col.rankings;
    if (albums.length == 0) {
        return ['There are currently no albums in the database. You should add some!'];
    }
    else if (albums.length < 10) {
        return albums;
    }*/

    if (rankings.length == 0) {
        return ['There are currently no albums in the database. You should add some!'];
    }
    const albumRankings = {}; // albums and all of their rankings

    for (let r in rankings) {
        if (!albumRankings[rankings[r].albumId]) {
            albumRankings[rankings[r].albumId] = 1;
        } else {
            albumRankings[rankings[r].albumId] = albumRankings[rankings[r].albumId] + 1;
        }
    }

    for (let a in albumRankings) {
        let avg = a / a.length;
        albumRankings[a.albumId] = avg;
    }
    // TODO: format the data to be ready to be printed on the webpage
    const sorted = Object.keys(albumRankings).sort(function (a, b) { return albumRankings[a] - albumRankings[b] });
    return sorted.slice(0, 10);
}

/**
 * @returns the top 10 albums with the most rankings, ignoring their value, from the albums collection.
 * If there are 0 albums, then it returns a message saying there are no albums.
 * If there are <10 albums, then it returns all of them.
 */
export const mostFrequent = async () => {
    if (albums.length == 0) {
        return ['There are currently no albums in the database. You should add some!'];
    }
    else if (albums.length < 10) {
        return albums;
    }

    const albumRankings = {}; // key:album, value:number of rankings

    for (let a in albums) {
        let curr = albums[a];
        let currRankings = [];
        for (let r in rankings) {
            if (rankings[r].albumName === curr.albumName) {
                currRankings.push(rankings[r]);
            }
        }
        albumRankings[curr.albumName] = currRankings.length;
    }
    // TODO: format the data to appear nicely on the page (maybe {author, album}?)
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

export const showRankings = async () => {
    const usersCollection = await col.users();
    const rankingsCollection = await col.rankings();
    
}
