import React from 'react'

const ActivityCard = ({activity}) => {
    return (
        <div>
            <h1>{activity.name}</h1>
            <h3>{activity.distance} m</h3>
            <h3>{activity["average_speed"]} m/s</h3>

        </div>
    )
}

export default ActivityCard;