import { dbConnection, closeConnection } from '../config/mongoConnection.js';
import { registerUser, loginUser } from "../data/userData.js";
import { addRanking } from "../data/musicData.js";

const db = await dbConnection();
await db.dropDatabase();

const patrick = await registerUser('PatrickHill', 'Patrick1!', 'Patrick1!');
const melissa = await registerUser('MelissaOzcan', 'Melissa1!', 'Melissa1!');

// TODO: add in some reviews for the users.

console.log('Done seeding database');
await closeConnection();
