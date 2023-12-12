/** Client-side validation for login and registration forms. */
console.log('entered client side validation.');

import { users } from '../config/mongoCollections.js';
import bcrypt from 'bcrypt';
(function () {
    let user = document.getElementById('user');
    let pass = document.getElementById('pass');
    let confirmPass = document.getElementById('confirm-pass');
    let errorP = document.getElementById('error');
    let loginForm = document.getElementById('login-form');
    let registerForm = document.getElementById('registration-form');
    let searchForm = document.getElementById('search-form');

    if (registerForm) {
        registerForm.addEventListener('submit', (event) => {
            console.log('entered registration clientside validation.');
            event.preventDefault();
            checkUser(user.value);
            checkPass(pass.value, confirmPass.value);
            if (errorP.innerText === '') {
                document.getElementById('registration-form').submit();
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            console.log('entered login clientside validation.');
            event.preventDefault();
            checkExists(user.value, pass.value);
            if (errorP.innerText === '') {
                document.getElementById('login-form').submit();
            }
        });
    }

    /**
     * Checks if the user exists in the database during login.
     */
    const checkExists = (userInput, passInput) => {
        const usersCollection = await users();
        const user = await usersCollection.findOne({ 'userName': userInput });
        if (!user) {
            errorP.hidden = false;
            errorP.innerText = "Either the email address or password is invalid.";
        }
        let validPassword = await bcrypt.compare(passInput, user.password);

        if (!validPassword) {
            errorP.hidden = false;
            errorP.innerText = "Either the email address or password is invalid.";
        }
    }

    /**
     * Checks if the username is valid during registration.
     */
    const checkUser = (user) => {
        if (user.value.length < 5) {
            errorP.hidden = false;
            errorP.innerText = 'Username must be at least 5 characters long';
        } else {
            errorP.innerText = '';
        }
    }

    /**
     * Checks if the password is valid during registration.
     */
    const checkPass = (password) => {
        if (password.trim().length < 8) {
            errorP.hidden = false;
            errorP.innerText = "Password must be at least 8 characters long";
        }
        else if (password.split(" ").length > 1) {
            errorP.hidden = false;
            errorP.innerText = "Password cannot have spaces";
        }
        else if (!password.match(/[A-Z]/)) {
            errorP.hidden = false;
            errorP.innerText = "Password must contain at least one uppercase character";
        }
        else if (!password.match(/[0-9]/)) {
            errorP.hidden = false;
            errorP.innerText = "Password must contain at least one number";
        }
        else if (!password.match(/[!@#$%^&*]/)) {
            errorP.hidden = false;
            errorP.innerText = "Password must contain at least one special character";
        }
        else if (confirmPass && password != confirmPassword) {
            errorP.hidden = false;
            errorP.innerText = "Passwords must match.";

        } else {
            errorP.innerText = ''
        }
    };
})();