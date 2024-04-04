require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
async function getAccessToken() {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body["access_token"]);
  } catch (error) {
    console.log("Something went wrong when retrieving an access token", error);
  }
}

getAccessToken(); // Call the function to retrieve the access token

// Our routes go here:
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", async (req, res) => {
  try {
    const { artistName } = req.query;
    const data = await spotifyApi.searchArtists(artistName);
    console.log("The received data from the API: ", data.body.artists.items[0]);
    const artists = data.body.artists.items;
    res.render("artist-search-results", { artists });
  } catch (err) {
    console.log("The error while searching artists occurred: ", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/albums/:artistId", async (req, res) => {
  try {
    const artistId = req.params.artistId;
    const data = await spotifyApi.getArtistAlbums(artistId);
    console.log("Artist albums", data.body);
    const albums = data.body.items;
    res.render("albums", { albums });
  } catch (err) {
    console.log("Error while getting artist albums: ", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/tracks/:albumId", async (req, res) => {
  try {
    const albumId = req.params.albumId;
    const data = await spotifyApi.getAlbumTracks(albumId);
    console.log("Album tracks", data.body);
    const tracks = data.body.items;
    res.render("tracks", { tracks });
  } catch (err) {
    console.log("Error while getting album tracks: ", err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
