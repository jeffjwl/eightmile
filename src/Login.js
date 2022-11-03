
import React, { useEffect } from "react";
import axios from 'axios'
import { CLIENT_SECRET_STRAVA } from './config.js'

const CLIENT_ID = ""; // insert your client id here from spotify
const CLIENT_ID_STRAVA = "96484"; // insert your client id here from spotify
const SCOPES_STRAVA = [
    "read",
    "read_all",
    "profile:read_all",
    "activity:read",
    "activity:read_all"
];

const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const STRAVA_AUTHORIZE_ENDPOINT = "https://www.strava.com/oauth/authorize";
const REDIRECT_URL_AFTER_LOGIN = "http://localhost:3000/";
const SPACE_DELIMITER = "%20";
const SCOPES = [
  "user-read-currently-playing",
  "user-read-playback-state",
  "playlist-read-private",
];
const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);

const SCOPES_URL_PARAM_STRAVA = SCOPES_STRAVA.join(SPACE_DELIMITER);

/* 
http://localhost:3000/webapp#access_token=ABCqxL4Y&token_type=Bearer&expires_in=3600
*/
const getReturnedParamsFromSpotifyAuth = (hash) => {
  const stringAfterHashtag = hash.substring(1);
  const paramsInUrl = stringAfterHashtag.split("&");
  const paramsSplitUp = paramsInUrl.reduce((accumulater, currentValue) => {
    console.log(currentValue);
    const [key, value] = currentValue.split("=");
    accumulater[key] = value;
    return accumulater;
  }, {});

  return paramsSplitUp;
};

const Login = () => {
  useEffect(() => {
    if (window.location.hash) {
      const { access_token, expires_in, token_type } =
        getReturnedParamsFromSpotifyAuth(window.location.hash);

      localStorage.clear();

      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("tokenType", token_type);
      localStorage.setItem("expiresIn", expires_in);
    }
    const params = new URLSearchParams(window.location.search)
    if(params.get('code')) {
        const stravaCode = params.get('code')
        axios.post(`https://www.strava.com/oath/token?client_id=${CLIENT_ID_STRAVA}&client_secret=${CLIENT_SECRET_STRAVA}&code=${stravaCode}&grant_type=authorization_code`)
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
    }
  });

  const handleLogin = () => {
    window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
  };
  const handleLoginStrava = () => {
    window.location = `${STRAVA_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID_STRAVA}&response_type=code&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=${"read"}&approval_prompt=auto`;

  }

  return (
    <div className="container">
      <h1>hi</h1>
      <button onClick={handleLoginStrava}>login to strava</button>
    </div>
  );
};

export default Login;