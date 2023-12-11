// TODO: Implement album related routes -> Export

import { Router } from 'express';
const router = Router();
import helpers from '../helpers.js';
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

// Album Tier List
router
    .route('/tierlist')
    .get(async (req, res) => {
        try {
            // TODO: Call tierlist function
        } catch (e) {
            // TODO: Revise later
            console.log(e)
            return res.status(404).json({ error: e.message });
        }
    });

// Most frequent albums page
router
    .route('/trending')
    .get(async (req, res) => {
        try {
            res.render('trending', { title: 'Trending Albums' });
        } catch (e) {
            // TODO: Revise later
            console.log(e)
            return res.status(404).json({ error: e.message });
        }
    });

export default router;