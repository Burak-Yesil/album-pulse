// Helper functions to validate types:
let isValidNumber = (number) => {
    return ((typeof number === 'number') && !isNaN(number) && isFinite(number));
}

let isValidString = (str) => {
    return ((typeof str === 'string') && (str != null));
}

let isValidArray = (arr) => {
    return (Array.isArray(arr));
}

let isValidObject = (obj) => {
    return ((typeof obj === 'object') && (!Array.isArray(obj)) && (obj !== null));
}

//source: https://stackoverflow.com/questions/5778020/check-whether-an-input-string-contains-a-number-in-javascript 
const includesNumber= (input) => {
    return /\d/.test(input);
}

//source: https://www.scaler.com/topics/email-validation-in-javascript/
const validEmail = (email) => {
    var emailFormat =  /\S+@\S+\.\S+/;
    if (email.match(emailFormat)) return true;
    else return false;
};

//https://stackoverflow.com/questions/12090077/javascript-regular-expression-password-validation-having-special-characters
const validPassword = (password) => {
    if(typeof password !== 'string') return false;
    password=password.trim();
    if(password.length<8) return false;
    if(!/[A-Z]/.test(password)) return false;
    if(!/\d/.test(password)) return false;
    if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password)) return false;
    return true;
    
};

export default {includesNumber, validEmail, validPassword, isValidArray, isValidNumber, isValidObject, isValidString};