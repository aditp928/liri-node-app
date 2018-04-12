require("dotenv").config();
var keys = require("./keys.js")
var inputArgs = process.argv;
var request = require("request");

var fs = require('fs');
if(inputArgs.length === 2){
  return console.log("Please enter a command for liri");
}

var command = inputArgs[2];


var queryString = inputArgs.slice(3).join(" ").trim();
Action(command, queryString);

function Action(command, queryString){
  switch(command){
    case 'my-tweets':
    getTweets();
    break;
    case 'spotify-this-song':
    spotify(queryString);
    break;
    case 'movie-this':
    movieInfo(queryString);
    break;
    case 'do-what-it-says':
    doWhatItSays();
    break;
  }
}

//Attempted to create function to display Tweets but was not working. 

// function getTweets(){
//   var Twitter = require('twitter');
// var client = new Twitter(keys.twitter);
//   var params = {screen_name: 'c0d3m4n_Patel',count:20};
//   client.get('statuses/user_timeline', params, function(error, tweets, response) {
//     if (!error) {
//       console.log(tweets);
//       console.log(response);
//     }
//   });
//    };
function spotify(song){

  var spotify = require('node-spotify-api');

  var spotifyClient = new spotify(keys.spotify)
    

  var queryStr = (song === undefined || song === "") ? 
  'artist:Akon+album:Freedom+track:beautiful' : 'track:'+ song.split(" ").join("+");

  spotifyClient.search({ type: 'track', query: queryStr}, function(err, data) {
    if (!err) {
      var querySong = (song === undefined || song === "") ? "Beautiful by Akon" : song;
      var commandString = "command: [spotify-this-song : "+ querySong +"]";

      var output = [];

      var tracks = data.tracks.items;
      if(tracks.length === 0){
        output.push("Song not found");
        output.push("--------------------------------------------------")
      }
      else{
        tracks.forEach(function(track){
          var artistsArray = [];
          track.artists.forEach(function(artist){
            artistsArray.push(artist.name);
          });

          output.push("Artists: " + artistsArray.join(", "));
          output.push("Song Name: " + track.name);
          output.push("Preview Link: " + track.preview_url);
          output.push("Album: " + track.album.name);
          output.push("--------------------------------------------------")
        });
      }
      var outputStr = output.join("\n");
      console.log(outputStr);
      log(commandString, outputStr);
    }
  });  
}

function movieInfo(movie){
  var request = require("request");
  var movieName = (movie === undefined || movie === "")? "Mr. Nobody." : movie;

  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&apikey=trilogy&type=movie";

  request(queryUrl, function(error, response, body) { 
    if (!error && response.statusCode === 200) {
      var commandString = "command: [movie-this : "+ movieName +"]";
      var output = [];

      var movieObj = JSON.parse(body);
      if(movieObj.Response === "True"){

        output.push("Title: " + movieObj.Title);
        output.push("Release Year: " + movieObj.Year);
        output.push("IMDB Rating: " + movieObj.imdbRating);

         for(let rating of movieObj.Ratings){
          if(rating.Source.match(/Rotten Tomatoes/i)){
            output.push("Rotten Tomatoes Rating: " + rating.Value);
            break;
          }
        }

        output.push("Country: " + movieObj.Country);
        output.push("Language: " + movieObj.Language);
        output.push("Plot: " + movieObj.Plot);
        output.push("Actors: " + movieObj.Actors);
      }
      else{
        output.push(movieObj.Error);
      }
      output.push("--------------------------------------------------")
      var outputStr = output.join("\n");
      console.log(outputStr);
      log(commandString, outputStr);
    }
  });
}

function doWhatItSays(){
  var fs = require("fs");
  var readline = require('readline');

  var rl = readline.createInterface({
    input: fs.createReadStream('random.txt')
  });

  rl.on('line', function (line) {
    var dataArr = line.split(",");
    doAction(dataArr[0], dataArr[1]);
  });
}

function log(commandString, output){
  var fs = require("fs");

  var contentArray = [];
  contentArray.push("**************************************************");
  contentArray.push(commandString);
  contentArray.push("**************************************************");
  contentArray.push(output);
  contentArray.push("\n");

  var content = contentArray.join("\n");

  fs.appendFile("log.txt", content, function(err) {
    if (err) {
      console.log(err);
    }
    else {
      console.log("Log appended!");
    }
  });
}
