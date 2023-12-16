// Helper functions to validate types:
let isValidNumber = (number) => {
    return ((typeof number === 'number') && !isNaN(number) && isFinite(number));
}

let isValidString = (strVal, varName) => {
        if (!strVal) throw `Error: You must supply a ${varName}!`;
        if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
        strVal = strVal.trim();
        if (strVal.length === 0)
          throw `Error: ${varName} cannot be an empty string or string with just spaces`;
        if (!isNaN(strVal))
          throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
        return strVal;
    }

let isValidArray = (arr) => {
    return (Array.isArray(arr));
}

let isValidObjects = (obj) => {
    return ((typeof obj === 'object') && (!Array.isArray(obj)) && (obj !== null));
}




//source: https://stackoverflow.com/questions/5778020/check-whether-an-input-string-contains-a-number-in-javascript 
const includesNumber= (input) => {
    return /\d/.test(input);
}

export const validUser = (user) => {
if(typeof user !== 'string') return false;
    user=user.trim();
    if(user.length<5) return false;
    return true;
}

//https://stackoverflow.com/questions/12090077/javascript-regular-expression-password-validation-having-special-characters
export const validPassword = (password) => {
    if(typeof password !== 'string') return false;
    password=password.trim();
    if(password.length<8) return false;
    if(!/[A-Z]/.test(password)) return false;
    if(!/\d/.test(password)) return false;
    if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password)) return false;
    return true;
    
};

export default {includesNumber, validUser, validPassword, isValidArray, isValidNumber, isValidObject, isValidString};