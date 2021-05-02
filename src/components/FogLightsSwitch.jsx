import fogLightsIcon from "../imgs/foglights.png";
import "./FogLightsSwitch.scss";
import React from "react";
import ApiFetchComponent from "./ApiFetchComponent";
class FogLightsSwitch extends ApiFetchComponent {
    render() {
        return (
            <div
                className={`fogLightsOutline ${
                    this.state.apiState ? "fogLightsSwitched" : ""
                }`}>
                <img
                    src={fogLightsIcon}
                    alt="Fog Lights Icon"
                    className={`unselectable fogLightsSwitch`}
                    onClick={() => this.handleApiRequest("toggle")}
                />
            </div>
        );
    }
}

export default FogLightsSwitch;
