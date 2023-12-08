import * as col from '../config/mongoCollections.js';
import * as spotify from './spotifyAPI.js';


export const newAlbum = async (name) => {
// adds album to database with info from spotify API and average ranking



}

export const getRankings = async (name) => {
// checks if album has been ranked yet. If yes, returns rankings and information for that album. 
// If not, finds album from spotifyAPI and returns that there are no rankings
if(!name){ throw 'Must Enter Album Name'; }
const album = await col.albums.findOne({name});
const { ranks } = await col.rankings();
if(!album){
    // can't find album in collection, so look with API
    album = spotify.albumInfo(name);
    if(!album){ throw 'Album could not be found.';}
    return {album: album, ranking: 'No Rankings Yet'};
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

let newRanking = {
    album_Name: name,
    
}

}