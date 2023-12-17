/** Client-side validation for login and registration forms. */
let errorP = document.getElementById('error');
let user = document.getElementById('user');
let pass = document.getElementById('pass');
let confirmPass = document.getElementById('confirm-pass');
let searchInput = document.getElementById('searchInput');
let namerec = document.getElementById('album-name-rec');
let artistrec = document.getElementById('artist-rec');

let registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        errorP.innerText = '';
        checkUser(user.value.trim());
        checkPass(pass.value.trim());
        checkPass(confirmPass.value.trim());
        if (pass.value.trim() != confirmPass.value.trim()) {
            errorP.hidden = false;
            errorP.innerText = "Passwords must match.";
        } 
        if (errorP.innerText === '') {
            document.getElementById('register-form').submit();
        }
    });
}

let loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
        // CANNOT check if the user exists during clientside. must check in the route.
        event.preventDefault();
        errorP.innerText = '';
        checkUser(user.value.trim());
        checkPass(pass.value.trim());
        if (errorP.innerText === '') {
            document.getElementById('login-form').submit();
        } else{
            errorP.innerText = 'invalid user or password';
        }
    });
}

let searchForm = document.getElementById('search-form');
if (searchForm) {
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        errorP.innerText = '';
        checkSearch(searchInput.value.trim());
        if (errorP.innerText === '') {
            document.getElementById('search-form').submit();
        }
    });
}

let recForm = document.getElementById('recommendations-form');
if(recForm) {
    recForm.addEventListener('submit', (event) => {
        event.preventDefault();
        errorP.innerText = '';
        checkSearch(namerec.value.trim());
        checkSearch(artistrec.value.trim());
        if(errorP.innerText === ''){
            document.getElementById('recommendations-form').submit();
        }
    });
}

let rankingForm = document.getElementById('ranking');
let rankNum = document.getElementById('out_of_five');
let review = document.getElementById('review');
if(rankingForm){
    rankingForm.addEventListener('submit', (event) => {
        console.log("hi");
        event.preventDefault();
        errorP.innerText = '';
        checkNum(rankNum.value);
        checkReview(review.value);
        if(errorP.innerText === ''){
            document.getElementById('ranking').submit();
        }

    });
}



const checkSearch = (search) => {
    if(search.trim().length > 100){
        errorP.hidden = false;
        errorP.innerText = 'exceeded character limit';
    }
    if(search.trim().length === 0){
        errorP.hidden = false; 
        errorP.innerText = 'search fields cannot be empty';
    }
}


const checkNum = (rank) => {
    if(typeof(parseInt(rank)) !== 'number'){
        errorP.hidden = false;
        errorP.innerText = 'rank must be an int between 1 and 5';
    }
    if(parseInt(rank) < 1){
        errorP.hidden = false;
        errorP.innerText = 'rank must be an int between 1 and 5';
    }
    if(parseInt(rank) > 5){
        errorP.hidden = false;
        errorP.innerText = 'rank must be an int between 1 and 5';
    }
}

const checkReview = (rev) => {
    if(rev.length > 250){
        errorP.hidden = false;
        errorP.innerText = 'review must be under 250 characters long';
    }
}
/**
* Checks if the username is valid during login & registration.
*/
const checkUser = (user) => {
    if (user.trim().length < 5) {
        errorP.hidden = false;
        errorP.innerText = "Username must be at least 5 characters long";
    } else if (user.split(" ").length > 1) {
        errorP.hidden = false;
        errorP.innerText = "Username cannot have spaces.";
    } 
}

/**
* Checks if the password is valid during login & registration.
*/
const checkPass = (password) => {
    if (password.trim().length < 8) {
        errorP.hidden = false;
        errorP.innerText = "Password must be at least 8 characters long.";
    }
    else if (password.split(" ").length > 1) {
        errorP.hidden = false;
        errorP.innerText = "Password cannot have spaces.";
    }
    else if (!password.match(/[A-Z]/)) {
        errorP.hidden = false;
        errorP.innerText = "Password must contain at least one uppercase character.";
    }
    else if (!password.match(/[0-9]/)) {
        errorP.hidden = false;
        errorP.innerText = "Password must contain at least one number.";
    }
    else if (!password.match(/[!@#$%^&*]/)) {
        errorP.hidden = false;
        errorP.innerText = "Password must contain at least one special character.";
    } 
}
