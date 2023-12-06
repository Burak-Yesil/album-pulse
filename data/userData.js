import {users} from '../config/mongoCollections.js';
import bcrypt from 'bcrypt'

export const registerUser = async (
    userName,
    password,
    confirmPassword
  ) => {

    //Do Input Validation:
    //Check if user exists, passwords match, etc.
    console.log("entered register")
    const usersCollection = await users();
    password = await bcrypt.hash(password, 10)
  
    const doc = {
      userName,
      password,
    }
    
    const result = await usersCollection.insertOne(doc);
    return {insertedUser: true}
  };
  


export const loginUser = async (userName, password) => {
   
    const usersCollection = await users();
    const user = await usersCollection.findOne({'userName': userName}) //TODO: Make sure the schema is good
    if (!user) throw new Error("Either the email address or password is invalid")
    let validPassword = await bcrypt.compare(password, user.password)
    
    if (validPassword){
      return {
        userName: user.userName
      }
    }
    throw new Error("Either the email address or password is invalid")
  };
  