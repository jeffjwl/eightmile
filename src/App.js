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
  return (
    <div className="App">
      <Login setAccessToken={setAccessToken} setAthleteId={setAthleteId} />
      {activities.length > 0 &&
        activities.map((activity) => <ActivityCard activity={activity} />)}
    </div>
  );
}

export default App;
