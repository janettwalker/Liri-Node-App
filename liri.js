//Instructions
//--------------------------------------------------------------
// node liri.js my-tweets
    // This will show your last 20 tweets and when they were created at in your terminal/bash window.
// node liri.js spotify-this-song '<song name here>'
    // This will show the following information about the song in your terminal/bash window
    // Artist(s)
    // The song's name
    // A preview link of the song from Spotify
    // The album that the song is from
    // if no song is provided then your program will default to
    // "The Sign" by Ace of Base
// node liri.js movie-this '<movie name here>'
    // This will output the following information to your terminal/bash window:
    //    * Title of the movie.
    //    * Year the movie came out.
    //    * IMDB Rating of the movie.
    //    * Country where the movie was produced.
    //    * Language of the movie.
    //    * Plot of the movie.
    //    * Actors in the movie.
    //    * Rotten Tomatoes Rating.
    //    * Rotten Tomatoes URL.
    // If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
    // If you haven't watched "Mr. Nobody," then you should: http://www.imdb.com/title/tt0485947/
    // It's on Netflix!
// node liri.js do-what-it-says
    // Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
    // It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
    // Feel free to change the text in that document to test out the feature for other commands.
//--------------------------------------------------------------

// NPM Packages
var fs = require('fs');
var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');

// Keys for twitter info
var keys = require('./keys.js');

var nodeApp = {
  //twitter
  //-----------------------------------------------------
  "my-tweets": function() {
    var client = new Twitter(keys.twitterKeys);

    client.get('statuses/user_timeline', function(error, tweetData, response) {
      if (!error) {

        //log tweets in console
        console.log('--------------------------------------------------');
        tweetData.forEach(function(obj) {
          console.log('Date and Time: ' + obj.created_at);
          console.log('Tweet: ' + obj.text);
          console.log(' ');
        });
        console.log('--------------------------------------------------');

      } else {
        console.log(error);

      }

    });

  },

  //spotify
  //-----------------------------------------------------
  "spotify-this-song": function(keyword) {
    spotify.search({ type: 'track', query: keyword || 'The Sign Ace of Base' }, function(err, data) {
      if ( err ) {
          console.log('Error occurred: ' + err);
          return;
      }

      if(data.tracks.items.length > 0) {
        var record = data.tracks.items[0];

        //log song data in console
        console.log('--------------------------------------------------');
        console.log('Artist: ' + record.artists[0].name);
        console.log('Name: ' + record.name);
        console.log('Link: ' + record.preview_url);
        console.log('Album Name: ' + record.album.name);
        console.log('--------------------------------------------------');

      } else {
        console.log('No song data found.');
      }

    });

  },

  //IMDB
  //-----------------------------------------------------
  "movie-this": function(query) {
    request('http://www.omdbapi.com/?t=' + (query || 'Mr.Nobody') +'&tomatoes=true', function (error, response, info) {
      if (!error && response.statusCode == 200) {

        var movieData = JSON.parse(info);

        //log movie data in console
        console.log('--------------------------------------------------');
        console.log('Title: ' + movieData.Title);
        console.log('Year: ' + movieData.Year);
        console.log('IMDB Rating: ' + movieData.imdbRating);
        console.log('Country: ' + movieData.Country);
        console.log('Language: ' + movieData.Language);
        console.log('Plot: ' + movieData.Plot);
        console.log('Actors: ' + movieData.Actors);
        console.log('Rotten Tomatoes Rating: ' + movieData.tomatoRating);
        console.log('Rotten Tomatoes URL: ' + movieData.tomatoURL);
        console.log('--------------------------------------------------');
        
      }

    });

  },

  "do-what-it-says": function() {
    fs.readFile('random.txt', 'utf8', function(err, data) {
      if(err) throw err;
      console.log(data.toString());

      var cmds = data.toString().split(',');

      nodeApp[cmds[0].trim()](cmds[1].trim());

    });

  },

};


nodeApp[process.argv[2]](process.argv[3]);

