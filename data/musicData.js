import {users, rankings, albums} from '../config/mongoCollections.js';
import * as spotify from './spotifyAPI.js';
import {ObjectId} from 'mongodb';
import { validUser, validPassword, validAlbumId , validRating, validComments, validComment, validReview } from '../helpers.js';

/**
 * Checks if album has been ranked yet. If yes, returns rankings and information for that album. 
 * If not, finds album from spotifyAPI and returns that there are no rankings
 */
export const getRankings = async (album_id) => {
    validAlbumId(album_id)
    album_id = album_id.trim();
    const rankingsCollection = await rankings();
    const album = await rankingsCollection.findOne({ albumId: album_id });
    const albumObject = await spotify.getAlbumObject(album_id);
    const currAlbumName= albumObject.albumName;

    if (!album) {
        try{
            if (!currAlbumName) { 
                throw new Error('Album could not be found.'); 
            }
            return { albumName: currAlbumName, album_rankings: ['No rankings yet - add one!'] };
        }
        catch (error) {
            throw error
        }
        // const addAlbum = await albums.insertOne(album);
        
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
    return { albumName: currAlbumName, rankings: albums_rankings };
}

/**
 * lets user add ranking and then adds ranking to the rankings database
 * also adds ranking to the array of rankings in the album object; edits albums database
*/
export const addRanking = async (albumid, username, rating, review, review_bool, comments =[]) => {
    // lets user add ranking and then adds ranking to the rankings database
    // also adds ranking to the array of rankings in the album object; edits albums database

    validUser(username);
    validRating(rating);
    validComments(comments);
    validReview(review);

    albumid=albumid.trim();
    username=username.trim();
    rating=rating.trim();
    review=review.trim();

    if(comments.length!==0){
        for(let i=0; i<comments.length; i++){
            comments[i]=comments[i].trim();
        }
    }

    //Checking to see if user already left a Ranking if so we just return
    const rankingcol = await rankings();
    const rankingAlreadyExists = await rankingcol.findOne({"albumId":albumid, "userName":username})
    if (rankingAlreadyExists) return {successful: true, rankingAlreadyExists: true, info:"ranking for this album already exists"};

    if (!rating) throw 'Rating must be provided.';
    if (rating < 1 || rating > 5) {
        throw 'Rating must be an integer between 1 and 5.';
    }

    if (review && typeof review !== 'string') throw 'Review must be a string, if provided.';
    // TODO: word limit for reviews?

    let albumObject = await spotify.getAlbumObject(albumid);
    const currAlbumName = albumObject.albumName;

    let newRanking = {
        albumId: albumid,
        albumName: currAlbumName,
        userName: username,
        rating: rating,
        review: review,
        review_provided: review_bool,
        comments: comments
    }

    const addRanking = await rankingcol.insertOne(newRanking);

    const albumcol = await albums();
    const alb = await albumcol.findOne({albumId: albumid});
    if (!alb) {
        let newalb = {
            albumId: albumid,
            albumName: currAlbumName,
            avgRanking: parseInt(rating)
        }
        const addAlb = await albumcol.insertOne(newalb);
    }
    else {
        let rankingsCol = await rankings();
        let rnksCursor = await rankingsCol.find({ albumId: albumid });
        let rnks = await rnksCursor.toArray();

        let ratings = [];

        for (let r of rnks) {
            if (r.albumId === albumid) {
                ratings.push(r.rating);
            }
        }

        let tot = 0;
        for (let rat of ratings) {
            tot += parseInt(rat);
        }

        let newrank = 0;
        if (ratings.length > 0) {
            newrank = tot / ratings.length;
        }

        await albumcol.updateOne({ albumId: albumid }, { $set: { avgRanking: newrank } });
    }

    // find all rankings for this album
    const obj = await getRankings(albumid);
    const album_name = obj.albumName;  // the album object in the collection
    const rankings_obj = obj.rankings; // array of rankings for specific album

    return {successful: true, rankingAlreadyExists: true};
}

/**
 * @returns the user from the database.
 */
export const findUser = async (username) => {
    validUser(username);
    username = username.trim();
    const usersCollection = await users();
    const user = await usersCollection.findOne({ 'userName': username });
    if (!user) throw "User not found.";
    return user; // TODO: do we want to return anything specific?
}

/**
 * @returns the top 5 albums with best average rankings from albums collection.
 * If there are 0 albums, then it returns a message saying there are no albums.
 * If there are <5 albums, then it returns all of them.
 */
export const topRanked = async () => {
    let rankingsCollection = await rankings();
    rankingsCollection = await rankingsCollection.find({}).toArray()

    if (rankingsCollection.countDocuments == 0) {
        return ['There are currently no albums in the database. You should add some!'];
    }
    const albumRankings = {}; // albums and all of their rankings

    for (let r in rankingsCollection) {
        if (!albumRankings[rankingsCollection[r].albumId]) {
            albumRankings[rankingsCollection[r].albumId] = 1;
        } else {
            albumRankings[rankingsCollection[r].albumId] = albumRankings[rankingsCollection[r].albumId] + 1;
        }
    }

    for (let a in albumRankings) {
        let avg = a / a.length;
        albumRankings[a.albumId] = avg;
    }
    // TODO: format the data to be ready to be printed on the webpage
    let sorted = Object.keys(albumRankings).sort(function (a, b) { return albumRankings[b] - albumRankings[a] });
    sorted = sorted.slice(0, 5);
    const albumObjects = [];
    for (let i = 0; i < sorted.length; i++) {
        const albumObject = await spotify.getAlbumObject(sorted[i]);
        albumObjects.push({
            albumId: sorted[i],
            albumName: albumObject.albumName
        });
    }
    return albumObjects;
}

/**
 * @returns the top 5 albums with the most rankings, ignoring their value, from the albums collection.
 * If there are 0 albums, then it returns a message saying there are no albums.
 * If there are <5 albums, then it returns all of them.
 */
export const mostFrequent = async () => {
    let rankingsCollection = await rankings();
    rankingsCollection = await rankingsCollection.find({}).toArray()

    if (rankingsCollection.countDocuments == 0) {
        return ['There are currently no albums in the database. You should add some!'];
    }
    const albumRankings = {}; // key:album, value:number of rankings

    for (let r in rankingsCollection) {
        if (!albumRankings[rankingsCollection[r].albumId]) {
            albumRankings[rankingsCollection[r].albumId] = 1;
        } else {
            albumRankings[rankingsCollection[r].albumId] = albumRankings[rankingsCollection[r].albumId] + 1;
        }
    }
    // TODO: format the data to appear nicely on the page (maybe {author, album}?)
    let sorted = Object.keys(albumRankings).sort(function (a, b) { return albumRankings[b] - albumRankings[a] });
    sorted = sorted.slice(0, 5);
    const albumObjects = [];
    for (let i = 0; i < sorted.length; i++) {
        const albumObject = await spotify.getAlbumObject(sorted[i]);
        albumObjects.push({
            albumId: sorted[i],
            albumName: albumObject.albumName
        });
    }
    return albumObjects;
}


/**
 * @returns a random recommendation from the top 10 albums with best average rankings
 */
export const getRecommendations = async () => {
    const top = await topRanked();
    const random = Math.floor(Math.random() * 10);
    return top[random];
}

export const showRankings = async (username) => {
    validUser(username);
    username=username.trim();
    const usersCollection = await users();
    const rankingsCollection = await rankings();
    const user = await usersCollection.findOne({ 'userName': username });
    const userRankings = await rankingsCollection.find({userName: username}).toArray();
    if (userRankings.length===0){
        return {username: username, rankings: ['No rankings yet.']};
    }
    
    const formattedRankings = userRankings.map(ranking => ({
        id: ranking._id,
        userName: ranking.userName,
        albumId: ranking.albumId,
        albumName: ranking.albumName, 
        rating: ranking.rating,
        review: ranking.review,
        review_provided: ranking.review_provided
    }));
    return {username: username, rankings: formattedRankings};

}

export const allAlbumRankings = async (albumId)=>{
    validAlbumId(albumId);
    const rankingsCollection = await rankings();
    const albumRankings = await rankingsCollection.find({albumId: albumId}).toArray();

    const obj = await getRankings(albumId);
    const albumname = obj.albumName;  // the album object in the collection

    if (albumRankings.length === 0){
        return {albumName: albumname, rankings: ['No rankings for this album yet, add one!!']};
    }
    const formattedRankings = albumRankings.map(ranking=>({
        id: ranking._id.toString(),
        userName:ranking.userName,
        rating:ranking.rating,
        review: ranking.review,
        review_provided: ranking.review_provided
    }));

    return {albumName: albumname, rankings: formattedRankings};
}

export const editRanking = async (rankingId, rating, review)=>{
    validRating(rating);
    validReview(review);

    rankingId=rankingId.trim();
    rating=rating.trim();
    review=review.trim();

    const rankingCollection= await rankings();
    const existingRanking = await rankingCollection.findOne({_id: new ObjectId(rankingId)});
    if (!existingRanking) throw 'Error: ranking not found';
    const updatedRanking={
        $set:{
            rating:rating,
            review: review,
            review_provided: Boolean(review)
        }
    };
    const result = await rankingCollection.findOneAndUpdate(
        {_id: new ObjectId(rankingId)},
        updatedRanking,
        {returnDocument: 'after'}
    );
    if(!result.value){
        throw 'Error: failed to update';
    }
    return{
        rankingId: result.value._id.toString(),
        userName: result.value.userName,
        albumId: result.value.albumId,
        albumName: result.value.albumName,
        rating: result.value.rating,
        review: result.value.review,
        review_provided: result.value.review_provided,
        comments: result.value.comments
    };
}

export const addComment= async (rankingId, commentMessage) =>{
    validComment(commentMessage);

    rankingId=rankingId.trim();
    commentMessage=commentMessage.trim()

    const rankingCollection = await rankings();
    const existingRanking = await rankingCollection.findOne({_id: new ObjectId(rankingId)});
    if(!existingRanking) throw 'Error: ranking not found';
    const updatedRanking = {
        $push: {comments: commentMessage}
    };

    const result= await rankingCollection.findOneAndUpdate(
        {_id: new ObjectId(rankingId)},
        updatedRanking,
        {returnDocument: 'after'}
    );
    if(!result.value) throw 'Error: update failed';

    return {
        rankingId: result.value._id.toString(),
        userName: result.value.userName,
        albumId: result.value.albumId,
        albumName: result.value.albumName,
        rating: result.value.rating,
        review: result.value.review,
        review_provided: result.value.review_provided,
        comments: result.value.comments
    };
};

export const getRankingById = async (id)=>{

    id=id.trim();

    const rankingcol = await rankings();
    const ranking = await rankingcol.findOne({_id: new ObjectId(id)});

    return ranking;
}

export const trending = async() => {
    let albcol = await albums();
    let alblist = await albcol.find({}).toArray();

    let sorted = alblist.sort((a, b) => b.avgRanking - a.avgRanking);

    let topFive = sorted.slice(0, 5);

    return topFive;
}

export const getavg = async(albumid) => {
    validAlbumId(albumid);
    albumid=albumid.trim();
    let albumcol = await albums();
    let album = await albumcol.findOne({ albumId: albumid });
    if(!album){
        return 'No Ratings Yet';
    }
    let avg = album.avgRanking;
    return avg.toString();
}