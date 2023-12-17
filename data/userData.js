import {users} from '../config/mongoCollections.js';
import bcrypt from 'bcrypt';
import helpers from '../helpers.js';

export const registerUser = async (username, password, confirmPassword) => {
    //Do Input Validation:
    //Check if user exists, passwords match, etc.
    username = username.trim();
    username = username.toLowerCase();
    password = password.trim();
    confirmPassword = confirmPassword.trim();
    if(!username || !password || !confirmPassword){
        throw new Error('Must provide username, password, and confirm your password.');
    }
    if(!helpers.isValidString(username) || !helpers.isValidString(password) || !helpers.isValidString(confirmPassword)){
        throw new Error('Username, password, and confirm password must all be valid strings');
    }
    if(username.length < 5){
        throw new Error('Username must be at least 5 characters long.');
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
    
    const usersCollection = await users();
    const exists = await usersCollection.findOne({userName: username});
    if(exists){
        throw new Error("Either username or password is invalid");
    }

    password = await bcrypt.hash(password, 10)

    const doc = {
        userName: username,
        password,
    }

    const result = await usersCollection.insertOne(doc);
    return { insertedUser: true }
};

export const loginUser = async (username, password) => {
    if(!username || !password){
        throw new Error('Username and Password must be provided')
    }
    if(!helpers.isValidString(username) || !helpers.isValidString(password)){
        throw new Error('Username and password must be valid strings')
    }
    if(username.length < 5){
        throw new Error('Username must be at least 5 characters long.')
    }
    if (password.trim().length < 8) {
        throw new Error('Password must be at least 8 characters')
    }
    else if (password.split(" ").length > 1) {
        throw new Error('Password must not have spaces')
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

    const usersCollection = await users();
    const user = await usersCollection.findOne({ 'userName': username }) //TODO: Make sure the schema is good
    if (!user) throw new Error("Either username or password is invalid")
    let validPassword = await bcrypt.compare(password, user.password)
    if (validPassword) {
        return {
            userName: user.userName
        }
    }
    throw new Error("Either the email address or password is invalid")
};
  