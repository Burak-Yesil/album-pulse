import * as col from '../config/mongoCollections.js';
import * as spotify from './spotifyAPI.js';


export const getRankings = async (name) => {
// checks if album has been ranked yet. If yes, returns rankings and information for that album. 
// If not, finds album from spotifyAPI and returns that there are no rankings
if(!name){ throw 'Must Enter Album Name'; }
const album = await col.albums.findOne({name});
const albums = await col.albums();
const { ranks } = await col.rankings();
if(!album){
    // can't find album in collection, so look with API
    album = spotify.getAlbumObject(name);
    const addAlbum = await albums.insertOne(album);
    if(!album){ throw 'Album could not be found.';}
    return {album: album, ranking: {}};
}
// If album exists, return its rankings and 
const rankings = {}
for(let i in ranks){
    let curr = ranks[i];
    if(curr.hasOwnProperty("albumName") && curr["albumName"] === album.albumName){
        rankings.push(curr);
    }
}
// const rankings = album.rankings;
// I don't think each album is going to hold all of its rankings
return {album, rankings};

}

export const addRanking = async (name, rating, review) => {
// lets user add ranking and then adds ranking to the rankings database
// also adds ranking to the array of rankings in the album object; edits albums database 

// validation 
// check if name is string and checking if album exists at all is done in getRankings
// rating must be int between 1-5
// review CAN be empty !! must be string and add a word limit 

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
for(i=0; i<numberOfRankings; i++){
    total += rankings[i].rating;
}
const avg = total / numberOfRankings; 
album.avgranking = avg;


}