import React, { useState, useEffect } from 'react'
import './App.css';
import Login from './Login'
import axios from 'axios'

function App() {
  
  const [accessToken, setAccessToken] = useState('')
  const [athleteId, setAthleteId] = useState('')

  useEffect(() => {
    axios.get('https://www.strava.com/api/v3/athlete/activities')
    .then((response) => {
      console.log(response)
    })
  }, [])
  return (
    <div className="App">
      <Login setAccessToken={setAccessToken} setAthleteId={setAthleteId}/>

    </div>
  );
}

export default App;
