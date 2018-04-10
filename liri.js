require("dotenv").config();
var fs = require("fs")
var keys = require("./keys.js");
var spotify = require('spotify');
var spotifyKeys = new Spotify(keys.spotify);
var clientKey = new Twitter(keys.twitter);




//request("http://www.omdbapi.com/?t=remember+the+titans&y=&plot=short&apikey=trilogy", function(error, response, body) {