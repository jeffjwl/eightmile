import React from 'react'

const ActivityCard = ({activity}) => {
    return (
        <div>
            <h1>{activity.name}</h1>
            <h3>{activity.distance}</h3>
            <h3>{activity["moving_times"]}</h3>
        </div>
    )
}

export default ActivityCard;