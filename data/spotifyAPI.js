const spotifyAPI = (function() {
    
    //our specific client id and secret!!
    const clientId = '0e5c2d2170cc49219d0d64b2e38ae77b';
    const clientSecret = '40891fae309f4b5892e1812e9f5d547c';


    //generates token for us, the token changes every hour so it needs to go through the spotify api everytime
    const _getToken = async () => {

        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded', 
                'Authorization' : 'Basic ' + btoa( clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });

        const data = await result.json();
        return data.access_token;
    }
    

    //this is how we will get all the album info. the specs for this can be found here: https://developer.spotify.com/documentation/web-api/reference/get-an-album
    const _getAlbum = async (token, albumName) => {
      const result = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(albumName)}&type=album`, {
          method: 'GET',
          headers: { 'Authorization': 'Bearer ' + token }
      });
  
      const data = await result.json();
      // Assuming you want the first album from the search results
      const firstAlbum = data.albums.items[0];
      return firstAlbum;
  }
  
//the specs, important ones to keep note of : name, images

/*
{
  "album_type": "compilation",
  "total_tracks": 9,
  "available_markets": ["CA", "BR", "IT"],
  "external_urls": {
    "spotify": "string"
  },
  "href": "string",
  "id": "2up3OPMp9Tb4dAKM2erWXQ",
  "images": [
    {
      "url": "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228",
      "height": 300,
      "width": 300
    }
  ],
  "name": "string",
  "release_date": "1981-12",
  "release_date_precision": "year",
  "restrictions": {
    "reason": "market"
  },
  "type": "album",
  "uri": "spotify:album:2up3OPMp9Tb4dAKM2erWXQ",
  "artists": [
    {
      "external_urls": {
        "spotify": "string"
      },
      "href": "string",
      "id": "string",
      "name": "string",
      "type": "artist",
      "uri": "string"
    }
  ],
  "tracks": {
    "href": "https://api.spotify.com/v1/me/shows?offset=0&limit=20",
    "limit": 20,
    "next": "https://api.spotify.com/v1/me/shows?offset=1&limit=1",
    "offset": 0,
    "previous": "https://api.spotify.com/v1/me/shows?offset=1&limit=1",
    "total": 4,
    "items": [
      {
        "artists": [
          {
            "external_urls": {
              "spotify": "string"
            },
            "href": "string",
            "id": "string",
            "name": "string",
            "type": "artist",
            "uri": "string"
          }
        ],
        "available_markets": ["string"],
        "disc_number": 0,
        "duration_ms": 0,
        "explicit": false,
        "external_urls": {
          "spotify": "string"
        },
        "href": "string",
        "id": "string",
        "is_playable": false,
        "linked_from": {
          "external_urls": {
            "spotify": "string"
          },
          "href": "string",
          "id": "string",
          "type": "string",
          "uri": "string"
        },
        "restrictions": {
          "reason": "string"
        },
        "name": "string",
        "preview_url": "string",
        "track_number": 0,
        "type": "string",
        "uri": "string",
        "is_local": false
      }
    ]
  },
  "copyrights": [
    {
      "text": "string",
      "type": "string"
    }
  ],
  "external_ids": {
    "isrc": "string",
    "ean": "string",
    "upc": "string"
  },
  "genres": ["Egg punk", "Noise rock"],
  "label": "string",
  "popularity": 0
}
*/


    return {
        getToken() {
            return _getToken();
        },
        getAlbum(token, albumName){
            return _getAlbum(token, albumName);
        }
    }
})();


const token = await spotifyAPI.getToken();
const albumName = 'Blue Slide Park'; // Replace with the desired album name
const albumInfo = await spotifyAPI.getAlbum(token, albumName);
console.log(albumInfo.name);
