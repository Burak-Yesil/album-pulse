// TODO: Implement album related routes -> Export

import { Router } from 'express';
const router = Router();
import helpers from '../helpers.js';
import { spotifyAPI, getAlbumObject } from '../data/spotifyAPI.js'
import { topRanked, mostFrequent, getRankings, addRanking } from '../data/musicData.js';

// Search for Album Page
router
    .route('/albumsearch')
    .get(async (req, res) => {
        try {
            // TODO: Input validation
            // TODO: Take user input (album name) upon hitting submit button -> Query API
            // TODO: Show all rankings
            res.render('search', {title: 'Search'});
        } catch (e) {
            // TODO: Revise later
            console.log(e)
            return res.status(404).json({ error: e.message });
        }
    })
    .post(async (req, res) =>{
        try{
            // TODO: Input validation -> Post comment to ranking
            // let searchFor = req.body.searchInput;
            // return res.redirect('/searchresults');
            let searchFor = req.body.searchInput;
            const searchedAlbums = await spotifyAPI.getAlbum(searchFor);
            res.render('search', {title: 'Search Results', albumresults: searchedAlbums});
        }catch(e){
            // TODO: Revise later
            console.log(e)
            return res.status(404).json({ error: e.message });
        }
    });


// Most Frequently Ranked Albums List
router
    .route('/frequent')
    .get(async (req, res) => {
        try {
            let mostFrequentAlbums = await mostFrequent();
            res.render('frequent', { title: 'Most Frequently Ranked Albums', mostFrequent: mostFrequentAlbums });
        } catch (e) {
            // TODO: Revise later
            console.log(e)
            return res.status(404).json({ error: e.message });
        }
    });

// Top ranked albums page
router
    .route('/trending')
    .get(async (req, res) => {
        try {
            let topRankedAlbums = await topRanked();
            res.render('trending', { title: 'Trending Albums', topRanked: topRankedAlbums });
        } catch (e) {
            // TODO: Revise later
            console.log(e)
            return res.status(404).json({ error: e.message });
        }
    });

router.route('/album/:id')
    .get(async (req, res) => {
        try {
            const albumId = req.params.id;
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
            res.render('albumDetails', { title: name, cover: cover, total: total, artists: artists, genres: genres});
        } catch (e) {
            console.log(e);
            return res.status(404).json({ error: e.message });
        }
    })
    .post(async (req, res) =>{
        try{
            let name = req.session.user.userName;
            console.log(name);
            let ranking = req.body.out_of_five;
            let review = req.body.review;
            // Note for Sanya: hey :)
            // Also, the line below just needs the album id which i think can get from req.params.id
            // and then the rankings data functions gotta be slightly changed for that (im getting an error that col.albums.findOne
            // is not a function just as a heads up)
            // let returned = await addRanking(name, ranking, review);
            return;
        }
        catch (e) {
            console.log(e);
            return res.status(404).json({ error: e.message });
        }
    });


export default router;