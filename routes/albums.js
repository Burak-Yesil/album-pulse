// TODO: Implement album related routes -> Export

import { Router } from 'express';
const router = Router();
import helpers from '../helpers.js';
import { spotifyAPI, getAlbumObject } from '../data/spotifyAPI.js'
import { topRanked, mostFrequent, getRankings } from '../data/musicData.js';

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
            res.render('search', {title: 'Search Results', albumresults: searchedAlbums });
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

router.route('/album/:obj')
    .get(async (req, res) => {
        try {
            const albumId = req.params.id;
            const albumDetails = await getAlbumObject(albumId);

            res.render('albumDetails', { title: 'Album Details', albumDetails: albumDetails });
        } catch (e) {
            console.log(e);
            return res.status(404).json({ error: e.message });
        }
    });


export default router;