import { dbConnection, closeConnection } from '../config/mongoConnection.js';
import { registerUser } from "../data/userData.js";
import { addRanking } from "../data/musicData.js";

const db = await dbConnection();
await db.dropDatabase();

// users
const patrick = await registerUser('patrickhill', 'Patrick1!', 'Patrick1!');
const melissa = await registerUser('melissaozcan', 'Melissa1!', 'Melissa1!');

// album ids
const pinkFriday2 = '2bYCNZfxZrTUv1CHXkz2d2';
const blueSlidePark = '17mAoDs7T8EA9zzlj6QPBv';
const camp = '2nkHPk6e7TgemWh07yFHxh';

// rankings
const ranking1 =
    await addRanking(pinkFriday2, 'MelissaOzcan', 5, 'cool', true);

const ranking2 =
    await addRanking(blueSlidePark, 'MelissaOzcan', 2, 'did not like', true);

const ranking3 =
    await addRanking(camp, 'MelissaOzcan', 3, '', false);

console.log('Done seeding database');
await closeConnection();
