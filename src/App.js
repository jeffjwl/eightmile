import React, { useState, useEffect } from "react";
import "./App.css";
import Login from "./Login";
import axios from "axios";

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [athleteId, setAthleteId] = useState("");

  useEffect(() => {
    if (accessToken) {
      axios.get(`https://www.strava.com/api/v3/athletes/${athleteId}/activities`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "*/*",
        },
      });
    }
  }, [accessToken, athleteId]);
  return (
    <div className="App">
      <Login setAccessToken={setAccessToken} setAthleteId={setAthleteId} />
    </div>
  );
}

export default App;
