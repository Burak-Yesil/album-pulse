// TODO: Implement album related routes -> Export

import { Router } from 'express';
const router = Router();
import helpers from '../helpers.js';
import { spotifyAPI, getAlbumObject } from '../data/spotifyAPI.js'
import { topRanked, mostFrequent, getRankings, addRanking, allAlbumRankings, getRankingById, trending} from '../data/musicData.js';

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
            let searchFor = req.body.searchInput;
            const searchedAlbums = await spotifyAPI.getAlbum(searchFor);
            return res.render('search', {title: 'Search Results', albumresults: searchedAlbums});
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
            album_name = helpers.titleCase(album_name);
            artist = helpers.titleCase(artist);
            let gen_recommendations = await spotifyAPI.getReccomendations(album_name, artist, 5);
            return res.render('recommendations', {recommendations: gen_recommendations});
            // Generate recommendations
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
            console.log(mostFrequentAlbums);
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
            let albumNames = [];
            for (let i = 0; i < topRankedAlbums.length; i++) {
                albumNames.push(topRankedAlbums[i].albumName);
            }
            console.log('albumNames: ', albumNames);
            const user = req.session.user;
            return res.render('trending', { title: 'Trending Albums', topRanked: albumNames, userName: user.userName});
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
            return res.render('albumDetails', { title: name, cover: cover, total: total, artists: artists, genres: genres, album_id: req.params.id});
        } catch (e) {
            console.log(e);
            return res.status(404).json({ error: e.message });
        }
    })
    .post(async (req, res) =>{
        try{
            let name = req.session.user.userName;
            let ranking = req.body.out_of_five;
            let review = req.body.review;
            let review_bool = false;
            if(review){
                review_bool = true;
            }
            // Note for Sanya: hey :)
            // Also, the line below just needs the album id which i think can get from req.params.id
            // and then the rankings data functions gotta be slightly changed for that (im getting an error that col.albums.findOne
            // is not a function just as a heads up)
            let returned = await addRanking(req.params.id, name, ranking, review, review_bool);
            let url = `/user/${name}/rankings`;
            return res.redirect(url);
        }
        catch (e) {
            console.log(e);
            return res.status(404).json({ error: e.message });
        }
    });


    //Album specific rankings
    router.route('/album/:id/rankings')
    .get(async (req, res) => {
        try {
            const albumId = req.params.id;
            let rankings = await allAlbumRankings(albumId);
            console.log(rankings);
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