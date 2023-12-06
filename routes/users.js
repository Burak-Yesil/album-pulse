// TODO: Implement user related routes -> Export

import { Router } from 'express';
const router = Router();
import helpers from '../helpers.js';

// TODO: Import data functions

// Login
router
    .route('/login')
    .get(async (req, res) => {
        try {
            // TODO: Input validation
            // TODO: Take user/password -> Find in database -> redirect to user profile html route
        } catch (e) {
            // TODO: Revise later
            console.log(e)
            return res.status(404).json({ error: e.message });
        }
    });

// Registration
router
    .route('/register')
    .post(async (req, res) =>{
        try{
            //TODO: Input Validation
            //TODO: Check if user exists -> register user/update db -> redirect to login
        }catch(e){
            // TODO: Revise later
            console.log(e)
            return res.status(404).json({ error: e.message });
        }
    });

// Create ranking / Delete user
router
    .route('/:userid') 
    .get(async (req, res) =>{
        try{
            // TODO: Fetch the album that user searched up once Submit button is pressed
            // Cont. Once name is fetched, query spotify api
            // Cont. Once album is found, then allow ranking -> get ranking
        }catch(e){
            // TODO: Revise later
            console.log(e)
            return res.status(404).json({ error: e.message });
        }
    })
    .post(async (req, res) =>{
        try{
            // TODO: Post album that was queried to database along with ranking to user/album collection
        }catch(e){
            // TODO: Revise later
            console.log(e)
            return res.status(404).json({ error: e.message });
        }
    })
    .put(async (req, res) =>{
        try{
            // TODO: "Delete" user account -> actually just update name to "Deleted User (some number)" and terminated to = true
        }catch(e){
            // TODO: Revise later
            console.log(e)
            return res.status(404).json({ error: e.message });
        }
    })

// Edit/Delete ranking
router
    .route('/:userid/:rankingid')
    .put(async (req, res) =>{
        try{
            // TODO: Edit ranking
        }catch(e){
            // TODO: Revise later
            console.log(e)
            return res.status(404).json({ error: e.message });
        }
    })
    .delete(async (req, res) =>{ //Deletes an individual review 
        try{
            // TODO: 
        }catch(e){
            // TODO: Revise later
            console.log(e)
            return res.status(404).json({ error: e.message });
        }
    })

// Comments
router
    .route('/:rankingid')
    .post(async (req, res) =>{
        try{
            // TODO: Input validation -> Post comment to ranking
        }catch(e){
            // TODO: Revise later
            console.log(e)
            return res.status(404).json({ error: e.message });
        }
    })

// Comments Cont.
router
    .route('/:commentid')
    .delete(async (req, res) =>{
        try{
            // TODO: Input validation -> Delete comment to ranking
        }catch(e){
            // TODO: Revise later
            console.log(e)
            return res.status(404).json({ error: e.message });
        }
    })

export default router;