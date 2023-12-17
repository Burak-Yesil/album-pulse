// TODO: Implement user related routes -> Export
import { Router } from 'express';

import {userData} from '../data/index.js'
import helpers from '../helpers.js';
import { showRankings, getRankingById} from '../data/musicData.js';

// TODO: Import data functions
const router = Router();

// Login
router
    .route("/")
    .get(async(req, res)=>{
        try{ 
            return res.render("about",
            {
                title: "About" 
            })
        }catch(e){
            return res.status(404).redirect('error', { error: e.message, status: '404' });  
        }
    })


router
    .route('/login')
    .get(async (req, res) => {
        try {
            return res.render("login", {
                title: "Login",
            })
        } catch (e) {
            return res.status(404).redirect('error', { error: e.message, status: '404' });
        }
    })
    .post(
        async (req, res) =>{
            //TODO Input Validation
            try{
                // Input Validation
                let username = req.body.user;
                let password = req.body.pass;
                if(!username || !password){
                    throw new Error('Error: Must provide username and password')
                }
                if(!helpers.isValidString(username) || !helpers.isValidString(password)){
                    throw new Error('Error: Username and password must be valid strings')
                }
                if(username.length < 5){
                    throw new Error('Error: Username must be at least 5 characters long.')
                }
                if (password.trim().length < 8) {
                    throw new Error('Error: Password must be at least 8 characters')
                }
                else if (password.split(" ").length > 1) {
                    throw new Error('Error: Password must not have spaces')
                }
                else if (!password.match(/[A-Z]/)) {
                    throw new Error("Password must contain at least one uppercase character.")
                }
                else if (!password.match(/[0-9]/)) {
                    throw new Error("Password must contain at least one number.")
                }
                else if (!password.match(/[!@#$%^&*]/)) {
                    throw new Error("Password must contain at least one special character.")
                }

                // Log in User
                username = username.trim().toLowerCase();
                password = password.trim();
                const person = await userData.loginUser(username, password);
                req.session.user = person;
                let url = '/user/' + username;
                return res.redirect(url);
            }catch(e){
                return res.status(400).render('login', {title: "Login", error: e.message});
            }
        }
    )

router
    .route('/logout')
    .get(async (req, res) => {
        try{
            req.session.destroy();
            return res.render('logout', { title: "Logout" });
        } catch (e) {
            return res.status(404).render('error', {error: e.message, status: '400'});
        }
    });

// Registration
router
    .route('/register')
    .get(async (req, res) =>{
        try {
            return res.render("register", {
                title: "Register",
            })
        } catch (e) {
            return res.status(404).redirect('error', { error: e.message, status: 404 });
        }
    })
    .post(
        async (req, res) =>{
            //TODO Input Validation
            try{
                // Input Validation
                let username = req.body.user;
                username = username.trim();
                username = username.toLowerCase();
                let password = req.body.pass;
                password = password.trim();
                let confirmPassword = req['body']['confirm-pass'];
                confirmPassword = confirmPassword.trim();
                if(!username || !password || !confirmPassword){
                    throw new Error('Error: Must provide username, password, and confirm your password.');
                }
                if(!helpers.isValidString(username) || !helpers.isValidString(password) || !helpers.isValidString(confirmPassword)){
                    throw new Error('Error: Username, password, and confirm password must all be valid strings');
                }
                if(username.length < 5){
                    throw new Error('Error: Username must be at least 5 characters long.');
                }
                if (password.trim().length < 8) {
                    throw new Error("Password must be at least 8 characters long.");
                }
                else if (password.split(" ").length > 1) {
                    throw new Error("Password cannot have spaces.");
                }
                else if (!password.match(/[A-Z]/)) {
                    throw new Error("Password must contain at least one uppercase character.");
                }
                else if (!password.match(/[0-9]/)) {
                    throw new Error("Password must contain at least one number.");
                }
                else if (!password.match(/[!@#$%^&*]/)) {
                    throw new Error("Password must contain at least one special character.");
                }
                if(password != confirmPassword){
                    throw new Error("Confirm password must match password");
                }
                // Register User
                const user = await userData.registerUser(username, password, confirmPassword);
                return res.redirect('/login');
            }catch(e){
                return res.status(400).redirect('error', {error: e.message, status: '400'})
            }

        }
    )


// Registration
router
    .route('/about')
    .get(async (req, res) =>{
        try {
            return res.render("about", {
                title: "About",
            })
        } catch (e) {
            return res.status(404).json({ error: e.message });
        }
    });

// Create ranking / Delete user
router
    .route('/user/:username') 
    .get(async (req, res) =>{
        try{
            // TODO: 
            const user = req.session.user
            return res.render('user', {title: user.userName, username: user.userName})
        }catch(e){
            // TODO: Revise later
            return res.status(404).json({ error: e.message });
        }
    })
    .post(async (req, res) =>{
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
    .put(async (req, res) =>{
        try{
            // TODO: "Delete" user account -> actually just update name to "Deleted User (some number)" and terminated to = true
        }catch(e){
            // TODO: Revise later
            console.log(e)
            return res.status(404).json({ error: e.message });
        }
    })

router
    .route('/user/:username/rankings')
    .get(async (req,res) => {
        try{
            const username = req.params.username;
            const userRankings= await showRankings(username);
            return res.render('personal_rankings', {userRankings: userRankings});
        } catch (e){
            return res.status(404).json({error: e.message});
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

router
    .route('/user/rankings/:rankingid')
    .get(async (req,res) => {
        try{
            const rankingid = req.params.rankingid;
            const userRankings= await getRankingById(rankingid);
            return res.render('rankinginfo', {userRankings: userRankings});
        } catch (e){
            return res.status(404).json({error: e.message});
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
