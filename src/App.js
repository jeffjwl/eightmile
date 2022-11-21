import React, { useState, useEffect } from "react";
import "./App.css";
import Login from "./Login";
import axios from "axios";
import ActivityCard from "./ActivityCard";

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [athleteId, setAthleteId] = useState("");
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (accessToken) {
      axios
        .get(`https://www.strava.com/api/v3/athletes/${athleteId}/activities`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "*/*",
          },
        })
        .then((resp) => {
          console.log(resp);
          setActivities(resp.data);
        });
    }
  }, [accessToken, athleteId]);

  useEffect(() => {
    const spotifyAccess = localStorage.getItem("accessToken");
    if (spotifyAccess) {
      axios
        .get(`https://api.spotify.com/v1/me/top/artists?limit=5`, {
          headers: {
            Authorization: `Bearer ${spotifyAccess}`,
            "Content-Type": "application/json",
          },
        })
        .then((resp) => {
          const artistIds = resp.data.items.map((artist) => artist.id);
          axios
            .get(
              `https://api.spotify.com/v1/recommendations?limit=1&seed_artists=${artistIds.join(
                "%2C"
              )}`,
              {
                headers: {
                  Authorization: `Bearer ${spotifyAccess}`,
                  "Content-Type": "application/json",
                },
              }
            )
            .then((resp) => {});
        });
    }
  }, [accessToken, athleteId]);


  const getSongRecs = async (spotifyAccess, artistIds, bpm) => {
    const songRecs = await axios.get(
      `https://api.spotify.com/v1/recommendations?seed_artists=${artistIds.join(
        "%2C"
      )}&target_tempo=${bpm}`,
      {
        headers: {
          Authorization: `Bearer ${spotifyAccess}`,
          "Content-Type": "application/json",
        },
      }
    );

    return songRecs.data
  }
  const makePlaylist = async (bpm, time) => {
    const spotifyAccess = localStorage.getItem("accessToken");
    if (spotifyAccess) {
      console.log(spotifyAccess);
      const topArtists = await axios.get(
        `https://api.spotify.com/v1/me/top/artists?limit=5`,
        {
          headers: {
            Authorization: `Bearer ${spotifyAccess}`,
            "Content-Type": "application/json",
          },
        }
      );

      const artistIds = topArtists.data.items.map((artist) => artist.id);
      const songRecs = await getSongRecs(spotifyAccess, artistIds, bpm)
      
      
      let runningTime = 0;
      let songArray = [];
      for (const song of songRecs.tracks) {
        if (runningTime >= time * 1000) break;
        songArray.push({ songName: song.name, songURI: song.uri });
        runningTime += song["duration_ms"];
      }

      if(runningTime < time * 1000) {
        const songRecs1 = await getSongRecs(spotifyAccess, artistIds, bpm)
        for (const song of songRecs1.tracks) {
          if (runningTime >= time * 1000) break;
          songArray.push({ songName: song.name, songURI: song.uri });
          runningTime += song["duration_ms"];
        }
      }
      
      const userId = await axios.get(`https://api.spotify.com/v1/me`, {
        headers: {
          Authorization: `Bearer ${spotifyAccess}`,
          "Content-Type": "application/json",
        },
      });

      const createPlaylist = await axios.post(
        `https://api.spotify.com/v1/users/${userId.data.id}/playlists`,
        {
          name: `8 Mile ${bpm}bpm playlist`,
          public: false,
        },
        {
          headers: {
            Authorization: `Bearer ${spotifyAccess}`,
            "Content-Type": "application/json",
          }
        }
      );

      console.log(createPlaylist);

      const addSongs = await axios.post(
        `https://api.spotify.com/v1/playlists/${createPlaylist.data.id}/tracks`,
        {
          uris: songArray.map((song) => song.songURI)
        },
        {
          headers: {
            Authorization: `Bearer ${spotifyAccess}`,
            "Content-Type": "application/json",
          }
        }
      );


      console.log(addSongs);
    }
  };

  return (
    <div className="App">
      <Login setAccessToken={setAccessToken} setAthleteId={setAthleteId} />
      {activities.length > 0 &&
        activities.map((activity) => <ActivityCard activity={activity} />)}
      <button onClick={() => makePlaylist(120, 5400)}>make playlist</button>
    </div>
  );
}

export default App;
