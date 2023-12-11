// TODO: Implement album related routes -> Export

import { Router } from 'express';
const router = Router();
import helpers from '../helpers.js';
import { topRanked, mostFrequent } from '../data/musicData.js';
// TODO: Import data functions

// Specific Album Page
router
    .route('/albumsearch')
    .get(async (req, res) => {
        try {
            // TODO: Input validation
            // TODO: Take user input (album name) upon hitting submit button -> Query API
            // TODO: Show all rankings
        } catch (e) {
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

export default router;