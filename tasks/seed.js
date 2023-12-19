/**
 * As it stands right now, here are the outputs that the seed file will produce:
 * most frequent albums: Nadie Sabe, Camp, Pink Friday 2
 * top ranked albums: Pink Friday 2, Off-Season, Blue Slide Park
 */

import { dbConnection, closeConnection } from '../config/mongoConnection.js';
import { registerUser } from "../data/userData.js";
import { addRanking, addComment, findUser, findRanking } from "../data/musicData.js";

const db = await dbConnection();
await db.dropDatabase();

/****** users ******/
await registerUser('patrickhill', 'Patrick1!', 'Patrick1!');
await registerUser('melissaozcan', 'Melissa1!', 'Melissa1!');
await registerUser('nusibazaman', 'Nusiba1!!', 'Nusiba1!!');
await registerUser('kenaw', 'KenaKena1!', 'KenaKena1!');

/****** album ids ******/
const pinkFriday2 = '2bYCNZfxZrTUv1CHXkz2d2';       // avg ranking: 5       occurence: 2
const blueSlidePark = '17mAoDs7T8EA9zzlj6QPBv';     // avg ranking: 3       occurence: 3
const camp = '2nkHPk6e7TgemWh07yFHxh';              // avg ranking: 2.25    occurence: 4
const nadieSabe = '4FftCsAcXXD1nFO9RFUNFO';         // avg ranking: 3.5     occurence: 2
const offSeason = '4JAvwK4APPArjIsOdGoJXX';         // avg ranking: 4.5     occurence: 2
const evolutionOfXur = '2pYicgzOwWt4XE4yyZswmO';    // avg ranking: 5       occurence: 1
const kids = '6TFm9KGW7Lbxrl2Zsg4X9R';              // avg ranking: 1       occurence: 3

/****** rankings ******/
await addRanking(pinkFriday2, 'patrickhill', 5, 'love queens!', true);
await addRanking(blueSlidePark, 'patrickhill', 4, '', false);
await addRanking(camp, 'patrickhill', 2, 'it was aight', true);
await addRanking(kids, 'patrickhill', 1, '', false);

await addRanking(pinkFriday2, 'melissaozcan', 5, 'cool', true);
await addRanking(blueSlidePark, 'melissaozcan', 2, 'did not like', true);
await addRanking(camp, 'melissaozcan', 3, '', false);
await addRanking(nadieSabe, 'melissaozcan', 4, 'good', true);
await addRanking(kids, 'melissaozcan', 1, '', false);

await addRanking(camp, 'nusibazaman', 1, 'could have been better tbh', true);
await addRanking(nadieSabe, 'nusibazaman', 3, 'not my vibe', true);
await addRanking(offSeason, 'nusibazaman', 5, 'J Cole is the GOAT', true);
await addRanking(kids, 'nusibazaman', 1, '', false);
await addRanking(blueSlidePark, 'nusibazaman', 3, '', false);

await addRanking(evolutionOfXur, 'kenaw', 5, 'I love this guy', true);
await addRanking(offSeason, 'kenaw', 4, '', false);
await addRanking(camp, 'kenaw', 3, 'eh', true);

/****** comments ******/
let phill = await findUser('patrickhill');
let mo1 = await findRanking('melissaozcan', pinkFriday2);
await addComment(phill.userName.toString(), mo1._id.toString(), 'this is sick');

let mozcan = await findUser('melissaozcan');
let nz1 = await findRanking('nusibazaman', blueSlidePark);
await addComment(mozcan.userName.toString(), nz1._id.toString(), 'i disagree');

let nzaman = await findUser('nusibazaman');
await addComment(nzaman.userName.toString(), mo1._id.toString(), 'i agree');

let nz2 = await findRanking('nusibazaman', offSeason);
await addComment(mozcan.userName.toString(), nz2._id.toString(), 'hot take');

let kw1 = await findRanking('kenaw', camp);
await addComment(nzaman.userName.toString(), kw1._id.toString(), 'i appreciate your thoughts');

console.log('Done seeding database');
await closeConnection();
