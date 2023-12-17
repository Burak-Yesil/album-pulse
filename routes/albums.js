// TODO: Implement album related routes -> Export

import { Router } from 'express';
const router = Router();
import helpers from '../helpers.js';
import { spotifyAPI, getAlbumObject } from '../data/spotifyAPI.js'
import { topRanked, mostFrequent, getRankings, addRanking, allAlbumRankings, getRankingById, trending, getavg} from '../data/musicData.js';

// Search for Album Page
router
    .route('/albumsearch')
    .get(async (req, res) => {
        try {
            return res.render('search', {title: 'Search'});
        } catch (e) {
            return res.status(404).render('error', {
                error: e.message,
                status: 404
              });        
            }
    })
    .post(async (req, res) =>{
        try{
            //let searchFor = helpers.isValidString(req.body.searchInput, "searchInput");
            //Input Validation 
            // 1-100 characters, check if its a string
            let searchFor = req.body.searchInput;
            searchFor = searchFor.trim();
            if(searchFor.length < 1 || searchFor.length > 100){
                throw new Error('Search input must be between 1 and 100 characters');
            }

            // Generate search results
            const searchedAlbums = await spotifyAPI.getAlbum(searchFor);
            if(searchedAlbums.length === 0){
                return res.render('search', {title: 'Search Results', error: 'No album found for this search term.'});
            }
            else{
                return res.render('search', {title: 'Search Results', albumresults: searchedAlbums});
            }
        }catch(e){
            return res.status(400).render('error', {
                error: e.message,
                status: 400
              });        
        }
    });

router
    .route('/recommendations')
    .get(async (req, res) =>{
        try{
            return res.render('recommendations');
        } catch (e){
            return res.status(404).render('error', {error: e.message});
        }
    })
    .post(async (req, res) =>{
        try{
            // Input validation
            let album_name = req['body']['album-name-rec'];
            let artist = req['body']['artist-rec'];
            album_name = album_name.trim();
            artist = artist.trim();
            if(album_name.length < 1 || artist.length < 1 || album_name.length > 100 || album_name.length > 100){
                throw new Error('Album name and artist name must be betweem 1 and 100 characters');
            }

            // Generate Recommendations
            let gen_recommendations = await spotifyAPI.getReccomendations(album_name, artist, 5);
            return res.render('recommendations', {recommendations: gen_recommendations});
        } catch (e) {
            return res.status(400).render('error', {error: e.message, status: 400});
        }
    })

// Most Frequently Ranked Albums List
router
    .route('/frequent')
    .get(async (req, res) => {
        try {
            let mostFrequentAlbums = await mostFrequent();
            // let albumNames = [];
            // for (let i = 0; i < mostFrequentAlbums.length; i++) {
            //     albumNames.push(mostFrequentAlbums[i].albumName);
            // }
            // console.log('albumNames: ', albumNames);
            return res.render('frequent', { title: 'Most Frequently Ranked Albums', mostFrequent: mostFrequentAlbums });
        } catch (e) {
            return res.status(400).render('error', {
                error: e.message,
                status: 400
              });
        }
    });

// Top ranked albums page
router
    .route('/trending')
    .get(async (req, res) => {
        try {
            let topRankedAlbums = await trending();
        
            const user = req.session.user;
            return res.render('trending', { title: 'Trending Albums', topRanked: topRankedAlbums, userName: user.userName});
        } catch (e) {
            return res.status(400).render('error', {
                errorMessage: e.message
              });
        }
    });

router.route('/album/:id')
    .get(async (req, res) => {
        try {
            const albumId = req.params.id;
            //ToDo: Add validation for album id 
            
            let albumDetails = await getAlbumObject(albumId);
            let avg = await getavg(albumId);
            let name = albumDetails.albumName; // string
            if(!name){
                name = 'N/A'
            }
            let artists = albumDetails.artistNames; // array or string
            if(!artists){
                artists = 'N/A'
            }
            let genres = albumDetails.genres; // array
            if(!genres){
                genres = '[]'
            }
            genres = JSON.stringify(genres); // array -> string format to put in HTML :D
            let total = albumDetails.totalTracks; // int
            if(!total){
                total = 'N/A'
            }
            let cover = albumDetails.albumCover[1].url; // string
            if(!cover){
                cover = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png';
            }
            const user = req.session.user;
            return res.render('albumDetails', { title: name, cover: cover, total: total, artists: artists, genres: genres, album_id: req.params.id, avg:avg, userName: user.userName});
        } catch (e) {
            console.log(e);
            return res.status(404).json({ error: e.message });
        }
    })
    .post(async (req, res) =>{
        try{
            // Input Validation
            let name = req.session.user.userName;
            let ranking = req.body.out_of_five;
            ranking = ranking.trim();
            if(!ranking || ranking.length === 0){
                throw new Error('Ranking is a necessary field and cannot be empty/only spaces');
            }
            let ranking_arr = ranking.split(" ");
            if(ranking_arr.length > 1){
                throw new Error('Ranking cannot have spaces between multiple numbers');
            }
            let ranking_number = Number(ranking);
            if(ranking_number === NaN){
                throw new Error('Ranking must be a number');
            }
            if(!Number.isInteger(ranking_number)){
                throw new Error('Ranking must be a valid integer');
            }
            if(ranking_number < 1 || ranking_number > 5){
                throw new Error('Ranking must be between 1-5')
            }

            let review = req.body.review;
            review = review.trim();
            let review_bool = false;
            if(review){
                review_bool = true;
            }

            //The addRanking function checks to see if a user already submitted a ranking
            let returned = await addRanking(req.params.id, name, ranking, review, review_bool);
            let url = `/user/${name}/rankings`;
            req.session.data = { rankingAlreadyExists: returned.rankingAlreadyExists };
            return res.redirect(url);
        }
        catch (e) {
            console.log(e);
            return res.status(404).render('error', { error: e.message });
        }
    });


    //Album specific rankings
    router.route('/album/:id/rankings')
    .get(async (req, res) => {
        try {
            const albumId = req.params.id;
            let rankings = await allAlbumRankings(albumId);
            return res.render('albumRankings', { title: 'Rankings', albumName: rankings.albumName, rankings: rankings.rankings});
        } catch (e) {
            console.log(e);
            return res.status(404).json({ error: e.message });
        }
    });

    // I made a function for this already in users.js - Kena
    // router.route('/user/:userId/ranking/:rankingId')
    // .get(async (req, res) => {
    //     try {
    //         const albumId = req.params.userId;
    //         const rankingId = req.params.rankingId;
    //         const ranking = getRankingById(rankingId)
    //         return res.render('allAlbumRanking', { title: "Rankings", ranking});
    //     } catch (e) {
    //         console.log(e);
    //         return res.status(404).json({ error: e.message });
    //     }
    // });



export default router;