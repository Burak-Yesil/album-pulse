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
                title: 'Error',
                error: e.message,
                status: 404,
                username: req.session.user.userName
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
                title: 'Error',
                error: e.message,
                status: 400,
                username: req.session.user.userName
              });        
        }
    });

router
    .route('/recommendations')
    .get(async (req, res) =>{
        try{
            const user = req.session.user.userName;
            console.log(user);
            return res.render('recommendations', { title: 'Recommendations', userName: user });
        } catch (e){
            return res.status(404).render('error', {title: 'Error', error: e.message, status: 404, username: req.session.user.userName});
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
            if(!gen_recommendations){
                return res.render('recommendations', {title: 'Search Results', error: 'No matching results found.', userName: req.session.user.userName});
            }
            return res.render('recommendations', {title: 'Recommendations', recommendations: gen_recommendations, userName: req.session.user.userName});
            // Generate recommendations
        } catch (e) {
            return res.status(400).render('error', {title: 'Error', error: e.message, status: 400, username: req.session.user.userName});
        }
    })

// Most Frequently Ranked Albums List
router
    .route('/frequent')
    .get(async (req, res) => {
        try {
            let mostFrequentAlbums = await mostFrequent();
            if(mostFrequentAlbums.length === 0){
                return res.render('frequent', {title: 'Most Frequently Ranked Albums', error: 'No rankings added to Album Pulse yet, be the first!', username: req.session.user.userName})
            }
            else{
                return res.render('frequent', { title: 'Most Frequently Ranked Albums', mostFrequent: mostFrequentAlbums, username: req.session.user.userName });
            }
        } catch (e) {
            return res.status(400).render('error', {
                title: 'Error',
                error: e.message,
                status: 400,
                username: req.session.user.userName
              });
        }
    });

// Top ranked albums page
router
    .route('/trending')
    .get(async (req, res) => {
        try {
            let topRankedAlbums = await trending();
            if(topRankedAlbums.length === 0){
                return res.render('trending', {title: 'Trending Albums', error: 'No rankings added to Album Pulse yet, be the first!', userName: req.session.user.userName})
            }
            else{
                const user = req.session.user;
                return res.render('trending', { title: 'Trending Albums', topRanked: topRankedAlbums, userName: user.userName});
            }
        } catch (e) {
            return res.status(400).render('error', {
                title: 'Error',
                errorMessage: e.message,
                status: 400,
                username: req.session.user.userName
              });
        }
    });

    router.route('/trending/best')
    .get(async (req, res) => {
        try {
            let topRankedAlbums = await trending();
            if(topRankedAlbums.length === 0){
                throw "No rankings"
            }
            return res.status(200).json(topRankedAlbums[0]);
        } catch (e) {
            return res.status(400).render('error', {
                title: 'Error',
                errorMessage: e.message,
                status: 400,
                username: req.session.user.userName
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
            return res.status(404).render('error', { title: 'Error', error: e.message, status: 404, username: req.session.user.userName});
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
            return res.status(404).render('error', { title: 'Error', error: e.message, status: 404, username: req.session.user.userName});
        }
    });


    //Album specific rankings
    router.route('/album/:id/rankings')
    .get(async (req, res) => {
        try {

            const albumId = req.params.id;
            let rankings = await allAlbumRankings(albumId);
            let user = req.session.user;
            if(rankings.rankings[0] === 'No rankings for this album yet, add one!!'){
                return res.render('albumRankings', { title: 'Rankings', albumName: rankings.albumName, albumId: albumId, userName: user.userName});
            }
            else{
                return res.render('albumRankings', { title: 'Rankings', albumName: rankings.albumName, albumId: albumId, rankings: rankings.rankings, userName: user.userName});
            }
        } catch (e) {
            console.log(e);
            return res.status(404).render('error', { title: 'Title', error: e.message, status: 404, username: req.session.user.userName });
        }
    });

export default router;