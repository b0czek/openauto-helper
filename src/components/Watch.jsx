import { ContentTile } from "./ContentTiles";
import React, { useEffect, useState } from "react";
const Watch = () => {
    const [time, setTime] = useState();

    useEffect(() => {
        // set the time when component is rendered
        setTime(getTimeString());
        // and update it every one second
        setInterval(() => {
            setTime(getTimeString());
        }, 1000);
    }, []);
    return (
        <ContentTile>
            <div className="time unselectable">{time}</div>
        </ContentTile>
    );
};

const getTimeString = () => {
    let now = new Date();
    return `${now
        .getHours()
        .toString()
        .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
};

export default Watch;
