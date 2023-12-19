# Album Pulse
CS 546 - Final Group Project

Built using HTML, CSS, Handlebars, Express, Node.js, and MongoDB.

## How to Setup
1. Run `npm install` to install the required dependencies for our project.  
2. Run `npm run seed` to run the task of seeding the database.
3. Run `npm start` to start the server, then navigate to localhost:3000 in your web browser. We recommend Google Chrome!

From this point, you can register as a new user, or use these existing credentials:

Username: patrickhill

Password: Patrick1!

## How the Application Works
- Upon loading the website, the first page will be the landing page. Users can either log in or register here. With an account you can vote for albums and impact their ranking.
- Only a logged in, or authenticated, user will be able to use any of the following functionalities:
  - Top Ranked Albums Page: List of albums that are the highest ranked among users.
  - Most Frequently Ranked Albums Page: List of albums that have the most rankings amongst users, regardless of value.
  - Add Album Ranking Page: 
	- Where you specify the album you would like to rank, and the ranking out of 5. Optionally, provide a written review of your thoughts on the album.
	- Comment on other peoples reviews
	- Edit reviews and rankings after they are posted
	- Remove a review/ranking after it has been posted
  - Search Album Page: Allows you to search for a specific album, and see all the reviews of that album.
  	- Specific Album Page: Allows you to see all the reviews of a specific album.  	
  - Music Recommendations: Recommends new music based off of what other users with similar music tastes are ranking highly.

## API key
This website integrates the Spotify API using a provided API key. Nothing needs to be done on the user end to set it up.
