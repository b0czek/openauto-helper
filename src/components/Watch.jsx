import ContentTile from "./ContentTiles";
import React from "react";

class Watch extends React.Component {
    state = {
        time: "00:00",
        date: "00 / 00 / 0000",
    };
    updateTimeout = null;

    updateWatch = () => {
        let currTime = getTimeString();
        let currDate = getDateString();
        if (currTime !== this.state.time || currDate !== this.state.date) {
            this.setState({
                time: currTime,
                date: currDate,
            });
        }
        this.updateTimeout = setTimeout(this.updateWatch, 1000);
    };

    componentDidMount() {
        this.updateWatch();
    }
    componentWillUnmount() {
        clearTimeout(this.updateTimeout);
    }
    render() {
        return (
            <ContentTile>
                <ContentTile.Content>{this.state.time}</ContentTile.Content>
                <ContentTile.Text>{this.state.date}</ContentTile.Text>
            </ContentTile>
        );
    }
}

const getTimeString = () => {
    let now = new Date();
    return `${leftPad(now.getHours(), 2)}:${leftPad(now.getMinutes(), 2)}`;
};

const getDateString = () => {
    let now = new Date();
    return `${leftPad(now.getDate(), 2)}.${leftPad(
        now.getMonth() + 1,
        2
    )}, ${now.toLocaleString("pl-PL", { weekday: "short" })}`;
};

const leftPad = (number, length) => number.toString().padStart(length, "0");

export default Watch;
